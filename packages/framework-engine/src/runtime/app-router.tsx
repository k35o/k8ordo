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

import { ShowNotFound } from './fallback-boundary';
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

type Stream = {
  /** Stops the request: nothing will render what is still to come. */
  readonly cancel: () => void;
  /** Unties the request from the signal it was fetched under. */
  readonly keep: () => void;
};

/**
 * The request each fetched payload is still streaming in on. A payload
 * resolves once its top arrives, and a page that awaits its data arrives
 * after — so once its tree is applied, what is still to come is part of a
 * page React is rendering. Cancelled then, the abort would be thrown inside
 * that page, where `Recover` takes it for a page that failed and loads the
 * document. The signal a payload was fetched under cancels it only until its
 * tree is applied (`keep`); after that, the router cancels it once another
 * tree has replaced it.
 */
const streams = new WeakMap<Payload, Stream>();

/**
 * A page's payload, or `null` when what came back is not one — a file the
 * host serves, or a URL nothing answers. Reading it imports the client
 * components it names, so a prefetch has those in hand too.
 */
const fetchPage = async (
  payloadPath: string,
  signal: AbortSignal,
): Promise<Payload | null> => {
  signal.throwIfAborted();
  const request = new AbortController();
  const cancel = (): void => {
    request.abort(signal.reason);
  };
  signal.addEventListener('abort', cancel, { once: true });
  const response = await fetch(payloadPath, { signal: request.signal });
  if (!isPayload(response)) return null;
  const payload = await createFromReadableStream<Payload>(
    response.body as ReadableStream<Uint8Array>,
  );
  streams.set(payload, {
    cancel: () => {
      request.abort();
    },
    keep: () => {
      signal.removeEventListener('abort', cancel);
    },
  });
  return payload;
};

/**
 * A payload's trees still streaming in on its request: the page, and a
 * shell's not-found, which is serialized after it and may be what is on
 * screen once the shell swapped it in.
 */
type Streaming = {
  readonly trees: readonly ReactNode[];
  readonly cancel: () => void;
};

/** Takes over the request of a payload whose tree is being applied. */
const hold = (streaming: Streaming[], payload: Payload): void => {
  const stream = streams.get(payload);
  if (stream === undefined) return;
  stream.keep();
  streaming.push({
    trees:
      payload.notFound === undefined
        ? [payload.tree]
        : [payload.tree, payload.notFound],
    cancel: stream.cancel,
  });
};

/**
 * What is applied: a page's tree, and — a shell's only — the not-found its
 * fallback.tsx shows in place when the value turns out to have nothing.
 */
type Applied = {
  readonly tree: ReactNode;
  readonly notFound: ReactNode | undefined;
};

const appliedOf = (payload: Payload): Applied => ({
  tree: payload.tree,
  notFound: payload.notFound,
});

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
  notFound,
}: {
  pathname: string;
  /** The search the page was rendered with, when it reads the search. */
  search?: string | undefined;
  tree: ReactNode;
  /** A shell's not-found, when the tree is a shell. */
  notFound?: ReactNode | undefined;
}): ReactNode {
  const [latest, setLatest] = useState<Applied>(() => ({ tree, notFound }));
  const current = useDeferredValue(latest);
  const prefetched = useRef<PrefetchCache<Payload | null>>(null);
  // The search the tree last applied was rendered with — `undefined` when its
  // page does not read the search, which is every page that did not declare
  // it. Only for such a page does a navigation that keeps the pathname load.
  const searchApplied = useRef(search);
  // The trees applied whose requests may still be streaming.
  const streaming = useRef<Streaming[]>([]);
  // Navigations whose page has not arrived. The URL commits before the next
  // tree does, so a shell still on screen reads the URL it is being left for
  // and may find nothing there: its not-found is not shown meanwhile.
  // Counted here rather than read from `usePendingPathname`, which clears in
  // a layout effect of this component — after the boundary's
  // `componentDidCatch` in the same commit, which would refuse the swap the
  // applied shell asks for.
  const loading = useRef(0);

  // A tree neither asked for nor on screen will never render again, so what
  // it is still receiving is cancelled.
  useEffect(() => {
    streaming.current = streaming.current.filter((entry) => {
      if (
        entry.trees.includes(latest.tree) ||
        entry.trees.includes(current.tree)
      ) {
        return true;
      }
      entry.cancel();
      return false;
    });
  }, [latest, current]);

  useEffect(() => {
    mounted = {
      apply: (payload) => {
        searchApplied.current = payload.search;
        startTransition(() => {
          setLatest(appliedOf(payload));
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

  // `vite dev` only: a server module changed, so the page on screen was
  // rendered from code that is gone. The RSC plugin says so and leaves
  // fetching it again to the framework; the new tree replaces the old in a
  // transition, so client components keep their state, the way Fast Refresh
  // keeps it for an edit of their own.
  useEffect(() => {
    // Spelled out at every use: Vite hands a module its HMR context only
    // where the source says `import.meta.hot`, so a destructured `hot` is
    // never there.
    if (import.meta.hot === undefined) return undefined;
    let inFlight: AbortController | undefined;
    const onServerUpdate = async (): Promise<void> => {
      inFlight?.abort();
      const controller = new AbortController();
      inFlight = controller;
      // What was fetched ahead was rendered from the old code too.
      cacheIn(prefetched).clear();
      const url = location.href;
      let payload: Payload | null;
      try {
        payload = await fetchPage(
          payloadUrlFor(new URL(url)),
          controller.signal,
        );
      } catch (error) {
        // A later edit took over; its own fetch is on the way.
        if (controller.signal.aborted) return;
        throw error;
      }
      // The visitor navigated meanwhile, and that navigation loaded the page
      // from the new code already.
      if (payload === null || location.href !== url) return;
      if (!canRender(payload)) return reloadInstead();
      markNavigated();
      hold(streaming.current, payload);
      searchApplied.current = payload.search;
      startTransition(() => {
        setLatest(appliedOf(payload));
      });
    };
    const listener = (): void => {
      void onServerUpdate();
    };
    import.meta.hot.on('rsc:update', listener);
    return () => {
      inFlight?.abort();
      import.meta.hot?.off('rsc:update', listener);
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
      loading.current += 1;
      try {
        const payloadPath = payloadUrlFor(url);
        let payload: Payload | null;
        try {
          payload = await (cacheIn(prefetched).take(payloadPath, signal) ??
            fetchPage(payloadPath, signal));
        } catch (error) {
          if (signal.aborted) throw error;
          // The network, or a server that could not answer: the same rule
          // as a URL that is not a page — the document load shows the truth.
          return await reloadInstead<Payload>();
        }
        // A second navigation may have taken over while this was in flight —
        // the body read, the client components it names imported — and
        // reloading then would fetch the URL that already lost.
        signal.throwIfAborted();
        // Not a page of this application. Interception already committed
        // the URL, so reloading asks the server for exactly what the browser
        // would have asked for had this never been claimed — its real status
        // included.
        if (payload === null) return await reloadInstead<Payload>();
        if (!canRender(payload)) return await reloadInstead<Payload>();
        return payload;
      } finally {
        // The router applies what this returned right after it settles, so
        // the applied tree renders with the count back where it was.
        loading.current -= 1;
      }
    },
    apply: (next) => {
      markNavigated();
      hold(streaming.current, next);
      searchApplied.current = next.search;
      setLatest(appliedOf(next));
    },
    // A page that reads the search is rendered for the one it was given, so
    // a navigation that moves it loads the page again; a page that does not
    // renders the same whatever the search holds.
    refresh: (url) =>
      searchApplied.current !== undefined &&
      url.search !== searchApplied.current,
  });

  // A shell's fallback.tsx says notFound() in the browser; what it then shows
  // is the not-found its payload carries, in place of the shell on screen —
  // unless a navigation is under way, whose page replaces both, or a newer
  // tree was applied meanwhile, which is left alone. Not a navigation: the
  // URL and the history stay as they are.
  const shown = current;
  const show = (): boolean => {
    if (loading.current > 0) return false;
    setLatest((previous) =>
      previous === shown
        ? { tree: shown.notFound, notFound: undefined }
        : previous,
    );
    return true;
  };

  // The tree comes from the server, so a client component in it cannot ask a
  // table where it is. The pathname the server rendered for is what seeds
  // `usePathname` until the browser can answer for itself.
  return (
    <PathnameProvider pathname={pathname}>
      <NavigationGeneration value={generation}>
        <Recover>
          <ShowNotFound value={current.notFound === undefined ? null : show}>
            {current.tree}
          </ShowNotFound>
        </Recover>
      </NavigationGeneration>
    </PathnameProvider>
  );
}
