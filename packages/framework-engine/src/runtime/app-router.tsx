'use client';

import { useInterceptedNavigation } from '@k8ordo/router';
import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from '@vitejs/plugin-rsc/browser';
import { startTransition, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

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
export function AppRouter({ tree }: { tree: ReactNode }): ReactNode {
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
    claim: (url) => url.origin === location.origin,
    load: async (url, signal) => {
      const response = await fetch(payloadPathFor(url.pathname), { signal });
      if (response.body === null) {
        throw new Error(`no payload for ${url.pathname}`);
      }
      const payload = await createFromReadableStream<Payload>(response.body);
      return payload.tree;
    },
    apply: setCurrent,
  });

  return current;
}
