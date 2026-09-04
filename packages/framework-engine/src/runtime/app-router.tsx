'use client';

import { PathnameProvider, useInterceptedNavigation } from '@k8ordo/router';
import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from '@vitejs/plugin-rsc/browser';
import { Component, startTransition, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { isPayload } from './is-payload';
import { ACTION_ID_HEADER } from './payload';
import type { Payload } from './payload';
import { payloadPathFor } from './payload-path';

/**
 * Where a Server Action's answer lands. The callback has to be registered
 * before any client component can call one, which is earlier than a component
 * can offer its own setter — so the wiring is here and the mounted router
 * lends it a way to apply what comes back.
 */
let applyPayload: ((payload: Payload) => void) | null = null;

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
  // The action's answer arrives with the page it re-rendered, so the screen
  // is up to date by the time the caller has its value.
  applyPayload?.(payload);
  return payload.returnValue;
});

/**
 * Whether a client navigation has put a tree on screen yet. Until one has,
 * the tree being rendered is the one the server sent as HTML.
 */
let navigated = false;

/**
 * Where a page that fails to render goes. A document load of the same URL
 * shows the server's own answer — its 500, its error page — so a failed
 * client navigation falls back to exactly that, the way a URL that turns out
 * not to be a page already does. Left alone, React would unmount the root and
 * leave a blank document under the new URL, with nothing settling `finished`.
 *
 * Hydration is left to fail: a page whose HTML the server already rendered
 * cannot be made better by asking for it again, and reloading it would loop.
 */
class Recover extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(error: unknown): void {
    if (!navigated) throw error;
    location.reload();
  }

  override render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The document is being replaced; a value returned now would render into a
 * page that is on its way out.
 */
const reloadInstead = <T,>(): Promise<T> => {
  location.reload();
  return new Promise<T>(() => {
    /* never settles */
  });
};

/**
 * The client half under the framework: the tree comes from the server, so
 * there is no route table in the browser at all — only navigation. The
 * router supplies that (interception, transition, and resolving the
 * platform's `finished` once the new tree is on screen); this component
 * supplies what to load, which is the next page's RSC payload.
 *
 * A pathname the application does not have is still the server's answer: it
 * renders `not-found.tsx` and this renders whatever came back.
 */
export function AppRouter({
  pathname,
  tree,
}: {
  pathname: string;
  tree: ReactNode;
}): ReactNode {
  const [current, setCurrent] = useState(tree);

  useEffect(() => {
    applyPayload = (payload) => {
      startTransition(() => {
        setCurrent(payload.tree);
      });
    };
    return () => {
      applyPayload = null;
    };
  }, []);

  useInterceptedNavigation<ReactNode>({
    // The browser holds no route table, so this cannot answer "is it mine?"
    // the way the client router does. It claims every same-origin URL and
    // finds out from the answer — which is why `load` has somewhere to put
    // the ones that turn out not to be.
    claim: (url) => url.origin === location.origin,
    load: async (url, signal) => {
      let payload: Payload;
      try {
        const response = await fetch(payloadPathFor(url.pathname), { signal });
        // A second navigation may have taken over while this was in flight;
        // reloading then would fetch the URL that already lost.
        if (signal.aborted) throw signal.reason as Error;
        if (!isPayload(response)) {
          // Not a page of this application: a file the host serves, or a URL
          // nothing answers. Interception already committed the URL, so
          // reloading asks the server for exactly what the browser would
          // have asked for had this never been claimed — its real status
          // included.
          return await reloadInstead<ReactNode>();
        }
        payload = await createFromReadableStream<Payload>(
          response.body as ReadableStream<Uint8Array>,
        );
      } catch (error) {
        if (signal.aborted) throw error;
        // The network, or a server that could not answer: the same rule as
        // a URL that is not a page — the document load shows the truth.
        return reloadInstead<ReactNode>();
      }
      return payload.tree;
    },
    apply: (next) => {
      navigated = true;
      setCurrent(next);
    },
  });

  // The tree comes from the server, so a client component in it cannot ask a
  // table where it is. The pathname the server rendered for is what seeds
  // `usePathname` until the browser can answer for itself.
  return (
    <PathnameProvider pathname={pathname}>
      <Recover>{current}</Recover>
    </PathnameProvider>
  );
}
