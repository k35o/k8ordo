import type { RouteComponent } from '@k8ordo/router';
import type { ComponentType } from 'react';

const CLIENT_REFERENCE = Symbol.for('react.client.reference');

type Callable = (props: unknown) => unknown;

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { then?: unknown }).then === 'function';

/**
 * Whether a page is a function the RSC render calls itself: not a client
 * reference (a `'use client'` page is rendered in the browser, and calling
 * it on the server throws), and not a class.
 */
const isServerFunction = (
  page: RouteComponent,
): page is RouteComponent & Callable =>
  typeof page === 'function' &&
  (page as { $$typeof?: unknown }).$$typeof !== CLIENT_REFERENCE &&
  (page as { prototype?: { isReactComponent?: unknown } }).prototype
    ?.isReactComponent === undefined;

export type WatchedPage = {
  /** What to render in the page's place: the page, watched. */
  readonly Page: ComponentType<never>;
  /**
   * Settles once the page's own component has returned — its data fetched,
   * its element produced — with `undefined`, or once what it returned has
   * rejected, with the reason. The render hears of a rejection only later,
   * once it gets round to the page again, so the reason is handed over here.
   */
  readonly settled: Promise<unknown>;
};

/**
 * A page, called the way the RSC render calls it, with its answer watched.
 * The render calls the component and awaits what it returns; so does this,
 * from inside the render's own call, so `use`, `cache` and a suspension
 * behave exactly as for the page itself — the render sees only a function
 * that returned what the page returned.
 *
 * A synchronous throw settles nothing here: a suspension is thrown too, and
 * the render calls again once it resolves. A real one reaches the render's
 * `onError` at once, which is where it is read.
 */
export const watchPage = (page: RouteComponent): WatchedPage => {
  if (!isServerFunction(page)) {
    return { Page: page, settled: Promise.resolve(undefined) };
  }
  const { promise, resolve } = Promise.withResolvers<unknown>();
  const Watched = (props: unknown): unknown => {
    const result = page(props);
    if (isThenable(result)) {
      result
        .then(
          () => undefined,
          (error: unknown) => error,
        )
        .then(resolve, resolve);
    } else {
      resolve(undefined);
    }
    return result;
  };
  Object.defineProperty(Watched, 'name', { value: page.name });
  return { Page: Watched as ComponentType<never>, settled: promise };
};
