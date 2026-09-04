import type { Match } from '@k8ordo/router';
import type { ComponentType, ReactNode } from 'react';

export type PageProps = {
  readonly params: Readonly<Record<string, string>>;
  /**
   * The pathname this render is for. Not "the request" — a route's own
   * identity, which the components above the parameter that names something
   * would otherwise have no way to see. A root layout deciding `<html lang>`
   * from the locale segment is the case that asked for it.
   */
  readonly pathname: string;
  readonly children?: ReactNode;
};

/**
 * Nests the matched stack the way Server Components require: a layout
 * receives what it wraps as `children`, because context cannot cross the
 * server boundary. The client router's `<Outlet />` is the same idea for an
 * application that renders entirely in the browser.
 */
export const renderMatch = (match: Match, pathname: string): ReactNode => {
  let node: ReactNode = null;
  for (let index = match.stack.length - 1; index >= 0; index -= 1) {
    // The table stores components of every shape; this renderer is the one
    // that states what it passes.
    const Component = match.stack[index] as ComponentType<PageProps>;
    node = (
      <Component params={match.params} pathname={pathname}>
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
