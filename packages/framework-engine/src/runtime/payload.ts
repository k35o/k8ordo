import type { ReactNode } from 'react';

/**
 * What a page is, on the wire. Always an object rather than the tree itself,
 * because a Server Action's answer travels back with the page it re-rendered
 * — one round trip, and the client never has to ask what it is looking at.
 */
export type Payload = {
  tree: ReactNode;
  /**
   * Where this payload was rendered for. A client component's first render
   * has no Navigation API to ask, so `usePathname` reads it from here.
   */
  pathname: string;
  /** What the action returned, when this response answers one. */
  returnValue?: unknown;
  /**
   * `useActionState`'s state, for a form posted without JavaScript. Typed
   * loosely because React does not export the shape from a public entry; the
   * SSR entry hands it straight back to `renderToReadableStream`.
   */
  formState?: unknown;
};

/** The header a client-invoked Server Action is addressed with. */
export const ACTION_ID_HEADER = 'x-k8ordo-action';
