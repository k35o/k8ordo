import type { Match } from '@k8ordo/router';
import type { ComponentType, ReactNode } from 'react';

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
  /** The request, under `@k8ordo/server` only; a build into files has none. */
  readonly request?: RouteRequest;
  readonly children?: ReactNode;
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
 */
export const renderMatch = (
  match: Match,
  pathname: string,
  params: Readonly<Record<string, unknown>> = match.params,
  request?: RouteRequest,
): ReactNode => {
  let node: ReactNode = null;
  for (let index = match.stack.length - 1; index >= 0; index -= 1) {
    // The table stores components of every shape; this renderer is the one
    // that states what it passes.
    const Component = match.stack[index] as ComponentType<PageProps>;
    const own = index === match.stack.length - 1 ? params : match.params;
    node = (
      <Component params={own} pathname={pathname} request={request}>
        {node}
      </Component>
    );
  }
  return node;
};

/** Shown only when an application declares no `not-found.tsx` at all. */
export const NotFound = (): ReactNode => (
  <html lang="en">
    <body>
      <h1>404</h1>
      <p>This page is not in the route table.</p>
    </body>
  </html>
);
