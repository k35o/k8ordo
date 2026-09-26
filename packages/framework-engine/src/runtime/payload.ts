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
  /**
   * The search this payload was rendered with (`?q=shoes`, or `''`) — only
   * when its page declared what of the search it reads. A client navigation
   * that moves the search loads such a page again; any other page renders
   * the same whatever the search holds, and has none.
   */
  search?: string;
  /**
   * The client this payload was rendered for: the URL of the script its
   * page's HTML loads. A document running another script cannot be trusted
   * to render it.
   *
   * A URL rather than an id minted per build, because the bundler hashes
   * into that name everything the script can load: a deploy that changed
   * nothing in the browser leaves open tabs navigating as before, and servers
   * built apart from the same source agree.
   */
  client: string;
  /** What the action returned, when this response answers one. */
  returnValue?: unknown;
  /** Where an action sent the visitor instead of returning. */
  redirect?: string;
  /**
   * `useActionState`'s state, for a form posted without JavaScript. Typed
   * loosely because React does not export the shape from a public entry; the
   * SSR entry hands it straight back to `renderToReadableStream`.
   */
  formState?: unknown;
};

/** The header a client-invoked Server Action is addressed with. */
export const ACTION_ID_HEADER = 'x-k8ordo-action';

/**
 * What `notFound()` becomes once the RSC render has sent it to the browser:
 * the error's digest. The value it was thrown as does not cross the wire.
 */
export const NOT_FOUND_DIGEST = 'K8ORDO_NOT_FOUND';

/**
 * Said by the handler under `@k8ordo/static` alone, on the not-found a page
 * answered with `notFound()`: the build tells it apart from a param a schema
 * refused, which is a 404 as well.
 */
export const NOT_FOUND_HEADER = 'x-k8ordo-not-found';
