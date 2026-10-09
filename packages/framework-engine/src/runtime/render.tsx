import type { Match, RouteNode, Routes } from '@k8ordo/router';
import type { ComponentType, ReactNode } from 'react';

import { FallbackBoundary } from './fallback-boundary';
import { PageBoundary } from './page-boundary';
import type { RouteRequest } from './request';

export type PageProps = {
  /**
   * The pattern's params: for the page, after the schemas the route files
   * declared have run — a number where a schema said number, a string where
   * none spoke — and for a layout, the strings the pathname carried.
   */
  readonly params: Readonly<Record<string, unknown>>;
  /**
   * The pathname this render is for. Not "the request" — a route's own
   * identity, which the components above the parameter that names something
   * would otherwise have no way to see. A root layout deciding `<html lang>`
   * from the locale segment is the case that asked for it.
   */
  readonly pathname: string;
  /**
   * The request under mode: 'server'; under a build into files, one that
   * refuses to be read.
   */
  readonly request?: RouteRequest;
  /** What of the search a page that exports `search` reads — that page only. */
  readonly search?: unknown;
  readonly children?: ReactNode;
};

/** How a matched stack is rendered, beyond the match itself. */
export type Rendering = {
  readonly pathname: string;
  /** The page's params; the strings the pathname carried when not given. */
  readonly params?: Readonly<Record<string, unknown>>;
  readonly request?: RouteRequest;
  /** Renders in the leaf's place — the page, watched. */
  readonly page?: ComponentType<never>;
  /** The page's search, when it declared what it reads. */
  readonly search?: unknown;
  /**
   * The leaf is a fallback.tsx standing in for its page: rendered with no
   * props, inside the boundary that answers its client-side `notFound()` in
   * place and leaves its URL reads to the browser.
   */
  readonly shell?: boolean;
};

/**
 * Nests the matched stack the way Server Components require: a layout
 * receives what it wraps as `children`, because context cannot cross the
 * server boundary. The client router's `<Outlet />` is the same idea for an
 * application that renders entirely in the browser.
 *
 * `params` are the page's — what the schemas along its stack produced. Only
 * the leaf gets them: a layout does not know which page is below it, and a
 * `not-found.tsx` renders under it whether or not its schemas accepted, so a
 * layout receives the strings the pathname carried, which is what its type
 * says.
 *
 * `page`, when given, renders in the leaf's place — the page, watched — inside
 * the boundary that sends a client navigation's `notFound()` back to the
 * server. `search` goes to the leaf alone, and only when given: a page that
 * did not declare it never sees the search.
 *
 * Under `shell`, `page` is a fallback.tsx: it stands in for every value its
 * page could be asked for, so it is handed nothing, and the layouts above get
 * the params the shell knows (`match.params`) and its own pathname.
 */
export const renderMatch = (
  match: Match,
  {
    pathname,
    params = match.params,
    request,
    page,
    search,
    shell = false,
  }: Rendering,
): ReactNode => {
  let node: ReactNode = null;
  for (let index = match.stack.length - 1; index >= 0; index -= 1) {
    const leaf = index === match.stack.length - 1;
    if (leaf && shell && page !== undefined) {
      const Shell = page as ComponentType;
      node = (
        <FallbackBoundary>
          <Shell />
        </FallbackBoundary>
      );
      continue;
    }
    // The table stores components of every shape; this renderer is the one
    // that states what it passes.
    const Component = (
      leaf && page !== undefined ? page : match.stack[index]
    ) as ComponentType<PageProps>;
    node = (
      <Component
        params={leaf ? params : match.params}
        pathname={pathname}
        request={request}
        {...(leaf && search !== undefined ? { search } : {})}
      >
        {node}
      </Component>
    );
    if (leaf && page !== undefined) node = <PageBoundary>{node}</PageBoundary>;
  }
  return node;
};

const NotFoundBody = (): ReactNode => (
  <>
    <title>Not found</title>
    <h1>404</h1>
    <p>This page is not in the route table.</p>
  </>
);

/** The root layout, when the table has one: it sits on the transparent `/`. */
const rootLayoutOf = (routes: Routes): ComponentType<PageProps> | null => {
  const root: RouteNode | undefined = routes.record['/'];
  if (typeof root !== 'object' || !('children' in root)) return null;
  return (root.layout ?? null) as ComponentType<PageProps> | null;
};

/**
 * What answers when an application declares no `not-found.tsx` at all: a
 * heading and a line, inside the root layout — which is the document, so the
 * visitor keeps the site's frame, its `<html lang>`, its stylesheets, and a
 * way back. With no root layout either, a document of its own.
 */
export const renderNotFound = (
  routes: Routes,
  pathname: string,
  request?: RouteRequest,
): ReactNode => {
  const Layout = rootLayoutOf(routes);
  if (Layout === null) {
    return (
      <html lang="en">
        <body>
          <NotFoundBody />
        </body>
      </html>
    );
  }
  return (
    <Layout params={{}} pathname={pathname} request={request}>
      <NotFoundBody />
    </Layout>
  );
};
