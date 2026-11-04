import { normalizePathname, withoutBase } from '@k8ordo/router';
import { hydrateRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

import { AppRouter } from './app-router';
import { DocumentRoot } from './document-root';
import { hydrateAs } from './hydrating-pathname';
import type { Payload } from './payload';

export type HydrateOptions = NonNullable<Parameters<typeof hydrateRoot>[2]>;

/**
 * Whether HTML rendered for `pathname` was rendered where the browser is:
 * `location` below Vite's `base`, normalized as `usePathname` normalizes.
 */
export const renderedHere = (pathname: string): boolean => {
  const here = withoutBase(location.pathname);
  return (
    here !== null && normalizePathname(pathname) === normalizePathname(here)
  );
};

/**
 * Brings the server's HTML to life, keeping every node it wrote. Hydration
 * holds the first render to the HTML it finds, and that HTML was rendered
 * for one pathname: a component reading the URL as it renders
 * (`@k8ordo/i18n`'s messages read the locale segment) agrees with it only at
 * that pathname. A prerendered 404 is rendered once, for a pathname no
 * visitor is at, and so is a fallback.tsx's shell (`/ja/posts/!fallback`,
 * served at `/ja/posts/3`). Such HTML comes with `reread`, its payload read
 * once more: it is hydrated as if the browser were at the payload's pathname,
 * and `AppRouter` renders the copy where the browser is once it is.
 */
export const mount = (
  container: Document | Element,
  payload: Payload,
  reread: Promise<Payload> | undefined,
  options?: HydrateOptions,
): Root => {
  if (reread !== undefined) hydrateAs(payload.pathname);
  return hydrateRoot(
    container,
    <DocumentRoot>
      <AppRouter
        notFound={payload.notFound}
        pathname={payload.pathname}
        reread={reread}
        search={payload.search}
        tree={payload.tree}
      />
    </DocumentRoot>,
    options,
  );
};
