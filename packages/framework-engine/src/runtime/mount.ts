import { normalizePathname, withoutBase } from '@k8ordo/router';
import type { ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

export type HydrateOptions = NonNullable<Parameters<typeof hydrateRoot>[2]>;

/**
 * Brings the server's HTML to life where the browser is. Hydration holds the
 * first render to the HTML it finds, and that HTML was rendered for one
 * pathname: a component reading the URL as it renders (`@k8ordo/i18n`'s
 * messages read the locale segment) agrees with it only at that pathname. A
 * prerendered 404 is rendered once, for a pathname no visitor is at, so it is
 * rendered afresh instead — what the server wrote stays on screen until the
 * client's replaces it, rather than failing hydration and being regenerated
 * anyway, with the server's `<title>` left behind.
 */
export const mount = (
  container: Document | Element,
  app: ReactNode,
  renderedFor: string,
  options?: HydrateOptions,
): Root => {
  const here = withoutBase(location.pathname);
  if (
    here !== null &&
    normalizePathname(renderedFor) === normalizePathname(here)
  ) {
    return hydrateRoot(container, app, options);
  }
  const root = createRoot(container);
  root.render(app);
  return root;
};
