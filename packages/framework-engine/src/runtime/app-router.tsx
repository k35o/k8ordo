'use client';

import { createFromReadableStream } from '@vitejs/plugin-rsc/browser';
import { useInterceptedNavigation } from '@k8ordo/router';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { payloadPathFor } from './payload-path';

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

  useInterceptedNavigation<ReactNode>({
    claim: (url) => url.origin === location.origin,
    load: async (url, signal) => {
      const response = await fetch(payloadPathFor(url.pathname), { signal });
      if (response.body === null) {
        throw new Error(`no payload for ${url.pathname}`);
      }
      return createFromReadableStream<ReactNode>(response.body);
    },
    apply: setCurrent,
  });

  return current;
}
