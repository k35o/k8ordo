'use client';

import { PathnameProvider, useInterceptedNavigation } from '@k8ordo/router';
import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from '@vitejs/plugin-rsc/browser';
import { startTransition, useEffect, useState } from 'react';
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
      const response = await fetch(payloadPathFor(url.pathname), { signal });
      if (!isPayload(response)) {
        // Not a page of this application: a file the host serves, or a URL
        // nothing answers. Interception already committed the URL, so
        // reloading asks the server for exactly what the browser would have
        // asked for had this never been claimed — including its real status.
        location.reload();
        // The document is being replaced; resolving would render into a page
        // that is on its way out.
        return new Promise<ReactNode>(() => {
          /* never settles */
        });
      }
      const payload = await createFromReadableStream<Payload>(
        response.body as ReadableStream<Uint8Array>,
      );
      return payload.tree;
    },
    apply: setCurrent,
  });

  // The tree comes from the server, so a client component in it cannot ask a
  // table where it is. The pathname the server rendered for is what seeds
  // `usePathname` until the browser can answer for itself.
  return <PathnameProvider pathname={pathname}>{current}</PathnameProvider>;
}
