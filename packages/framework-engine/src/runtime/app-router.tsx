'use client';

import {
  NavigationGeneration,
  PathnameProvider,
  useInterceptedNavigation,
  withoutBase,
} from '@k8ordo/router';
import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from '@vitejs/plugin-rsc/browser';
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode, RefObject } from 'react';

import { isPayload } from './is-payload';
import { ACTION_ID_HEADER } from './payload';
import type { Payload } from './payload';
import { payloadPathFor } from './payload-path';
import { createPrefetchCache, prefetchTargetOf } from './prefetch';
import type { PrefetchCache } from './prefetch';
import { markNavigated, Recover, reloadInstead } from './recover';

/**
 * Where a Server Action's answer lands. The callback has to be registered
 * before any client component can call one, which is earlier than a component
 * can offer its own setter — so the wiring is here and the mounted router
 * lends it a way to apply what comes back, and to drop the pages it fetched
 * ahead, which the action may have changed.
 */
let mounted: {
  readonly apply: (payload: Payload) => void;
  readonly forgetPrefetched: () => void;
} | null = null;

/**
 * The client this document runs, as named by the payload its HTML was
 * rendered from — the same render that told the HTML which script to load.
 * A fact about the document, not about a component, which is why it is not
 * a prop.
 */
let documentClient: string | undefined;

export const setDocumentClient = (client: string): void => {
  documentClient = client;
};

/**
 * A payload rendered for another client comes from a deploy this document
 * predates, and may name client components its script has no entry for.
 * That fails only once the tree renders, where the page's `error.tsx` catches
 * it before `Recover` can — so it is decided before anything renders, and a
 * document load brings the script that can.
 */
const canRender = (payload: Payload): boolean =>
  payload.client === documentClient;

setServerCallback(async (id: string, args: unknown[]) => {
  const temporaryReferences = createTemporaryReferenceSet();
  const payload = await createFromFetch<Payload>(
    fetch(location.href, {
      method: 'POST',
      headers: { [ACTION_ID_HEADER]: id },
      body: await encodeReply(args, { temporaryReferences }),
    }),
    { temporaryReferences },
  );
  mounted?.forgetPrefetched();
  // An action that redirected has no page to apply: the visitor is going
  // somewhere else, and the router takes them there.
  if (payload.redirect !== undefined) {
    await navigation.navigate(payload.redirect).finished;
    return undefined;
  }
  if (!canRender(payload)) return reloadInstead();
  // The action's answer arrives with the page it re-rendered, so the screen
  // is up to date by the time the caller has its value.
  mounted?.apply(payload);
  return payload.returnValue;
});

/**
 * A page's payload, or `null` when what came back is not one — a file the
 * host serves, or a URL nothing answers. Reading it imports the client
 * components it names, so a prefetch has those in hand too.
 */
const fetchPage = async (
  payloadPath: string,
  signal: AbortSignal,
): Promise<Payload | null> => {
  const response = await fetch(payloadPath, { signal });
  if (!isPayload(response)) return null;
  return createFromReadableStream<Payload>(
    response.body as ReadableStream<Uint8Array>,
  );
};

/**
 * The router's prefetch cache, made the first time it is asked for. It is
 * only ever asked for in an event or an effect; made as `useRef`'s initial
 * value it would be built, and thrown away, on every render.
 */
const cacheIn = (
  ref: RefObject<PrefetchCache<Payload | null> | null>,
): PrefetchCache<Payload | null> =>
  (ref.current ??= createPrefetchCache((payloadPath, signal: AbortSignal) =>
    fetchPage(payloadPath, signal),
  ));

/**
 * Where a page's payload is asked for: its path, with the URL's search. A page
 * that reads the search is rendered for it; for any other page the server
 * ignores it — and a static host, which has no such page, ignores it anyway.
 */
const payloadUrlFor = (url: URL): string =>
  `${payloadPathFor(url.pathname)}${url.search}`;

/** What starts a prefetch: a pointer onto a link, focus on one, a press. */
const INTENTS = ['pointerover', 'focusin', 'pointerdown'] as const;

/**
 * The client half under the framework: the tree comes from the server, so
 * there is no route table in the browser at all — only navigation. The
 * router supplies that (interception, a deferred render, and resolving the
 * platform's `finished` once the new tree is on screen); this component
 * supplies what to load, which is the next page's RSC payload.
 *
 * A pathname the application does not have is still the server's answer: it
 * renders `not-found.tsx` and this renders whatever came back.
 */
export function AppRouter({
  pathname,
  search,
  tree,
}: {
  pathname: string;
  /** The search the page was rendered with, when it reads the search. */
  search?: string | undefined;
  tree: ReactNode;
}): ReactNode {
  const [latest, setLatest] = useState(tree);
  const current = useDeferredValue(latest);
  const prefetched = useRef<PrefetchCache<Payload | null>>(null);
  // The search the tree last applied was rendered with — `undefined` when its
  // page does not read the search, which is every page that did not declare
  // it. Only for such a page does a navigation that keeps the pathname load.
  const searchApplied = useRef(search);

  useEffect(() => {
    mounted = {
      apply: (payload) => {
        searchApplied.current = payload.search;
        startTransition(() => {
          setLatest(payload.tree);
        });
      },
      forgetPrefetched: () => {
        cacheIn(prefetched).clear();
      },
    };
    return () => {
      mounted = null;
    };
  }, []);

  useEffect(() => {
    const onIntent = (event: Event): void => {
      const url = prefetchTargetOf(event.target);
      if (url !== null) cacheIn(prefetched).prefetch(payloadUrlFor(url));
    };
    // 捕捉段で聞く。途中の要素が伝播を止めても、押し始めは見逃さない
    for (const type of INTENTS) {
      document.addEventListener(type, onIntent, {
        capture: true,
        passive: true,
      });
    }
    return () => {
      for (const type of INTENTS) {
        document.removeEventListener(type, onIntent, { capture: true });
      }
    };
  }, []);

  const { generation } = useInterceptedNavigation<Payload>({
    // The browser holds no route table, so this cannot answer "is it mine?"
    // the way the client router does. It claims every same-origin URL under
    // Vite's `base` and finds out from the answer — which is why `load` has
    // somewhere to put the ones that turn out not to be.
    claim: (url) =>
      url.origin === location.origin && withoutBase(url.pathname) !== null,
    load: async (url, signal) => {
      const payloadPath = payloadUrlFor(url);
      let payload: Payload | null;
      try {
        payload = await (cacheIn(prefetched).take(payloadPath, signal) ??
          fetchPage(payloadPath, signal));
      } catch (error) {
        if (signal.aborted) throw error;
        // The network, or a server that could not answer: the same rule as
        // a URL that is not a page — the document load shows the truth.
        return reloadInstead<Payload>();
      }
      // A second navigation may have taken over while this was in flight —
      // the body read, the client components it names imported — and
      // reloading then would fetch the URL that already lost.
      signal.throwIfAborted();
      // Not a page of this application. Interception already committed the
      // URL, so reloading asks the server for exactly what the browser would
      // have asked for had this never been claimed — its real status
      // included.
      if (payload === null) return reloadInstead<Payload>();
      if (!canRender(payload)) return reloadInstead<Payload>();
      return payload;
    },
    apply: (next) => {
      markNavigated();
      searchApplied.current = next.search;
      setLatest(next.tree);
    },
    // A page that reads the search is rendered for the one it was given, so
    // a navigation that moves it loads the page again; a page that does not
    // renders the same whatever the search holds.
    refresh: (url) =>
      searchApplied.current !== undefined &&
      url.search !== searchApplied.current,
  });

  // The tree comes from the server, so a client component in it cannot ask a
  // table where it is. The pathname the server rendered for is what seeds
  // `usePathname` until the browser can answer for itself.
  return (
    <PathnameProvider pathname={pathname}>
      <NavigationGeneration value={generation}>
        <Recover>{current}</Recover>
      </NavigationGeneration>
    </PathnameProvider>
  );
}
