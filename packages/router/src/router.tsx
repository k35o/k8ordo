'use client';

import { createContext, use, useDeferredValue, useMemo, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { withoutBase } from './base';
import { setBoundaryOutlet } from './define-routes';
import type { Match, RouteComponent, Routes } from './define-routes';
import { appPathname, PathnameProvider } from './location';
import { NavigationGeneration, useInterceptedNavigation } from './navigation';
import { normalizePathname } from './paths';
import type { ParamsOf } from './paths';
import type { RegisteredPattern } from './register';
import { TreePathname } from './tree-pathname';

type RouterValue = {
  routes: Routes;
  match: Match | null;
};

const RouterContext = createContext<RouterValue | null>(null);

type StackValue = {
  stack: readonly RouteComponent[];
  index: number;
};

const StackContext = createContext<StackValue | null>(null);

const RenderStack: FC<StackValue> = ({ stack, index }) => {
  const value = useMemo(() => ({ stack, index: index + 1 }), [stack, index]);
  const next = stack[index];
  if (next === undefined) return null;
  // This renderer passes nothing: a client app reads params from context and
  // renders the rest of the stack through `<Outlet />`.
  const Component = next as FC;
  return (
    <StackContext value={value}>
      <Component />
    </StackContext>
  );
};

/** Renders the next element of the matched stack — a layout's hole. */
export const Outlet: FC = () => {
  const ctx = use(StackContext);
  if (ctx === null) {
    throw new Error('Outlet must render inside <Router>');
  }
  return <RenderStack stack={ctx.stack} index={ctx.index} />;
};

// A table's `error` boundary nests the same way a layout does here: by
// context. Registered at module load, before any table is walked.
setBoundaryOutlet(() => <Outlet />);

/** The table's match for a URL's pathname; a URL outside the base has none. */
const matchUrl = (routes: Routes, pathname: string): Match | null => {
  const own = withoutBase(pathname);
  return own === null ? null : routes.match(own);
};

/** What `<Router>` applies: the match, with the pathname it is the tree of. */
type Applied = { readonly match: Match | null; readonly pathname: string };

const appliedFor = (routes: Routes, pathname: string): Applied => ({
  match: matchUrl(routes, pathname),
  pathname: normalizePathname(pathname),
});

/**
 * Mounts a route table on the Navigation API: every same-origin navigation
 * that the table claims is handled in the client, and the rest is left to the
 * server. Layout components render their children through `<Outlet />`.
 *
 * This is the whole router for an application that renders on the client.
 * Under the framework the tree comes from the server instead, and what is
 * shared is `useInterceptedNavigation` and the `<PathnameProvider>` this
 * mounts.
 */
export function Router({ routes }: { routes: Routes }): ReactNode {
  const [latest, setLatest] = useState<Applied>(() =>
    appliedFor(routes, location.pathname),
  );

  const { generation } = useInterceptedNavigation<Applied>({
    claim: (url) => matchUrl(routes, url.pathname) !== null,
    load: (url) => appliedFor(routes, url.pathname),
    apply: setLatest,
  });

  // The pathname moves with the tree: a page state below reads the URL's
  // values only once its own tree is the one on screen.
  const current = useDeferredValue(latest);
  const { match } = current;
  const value = useMemo(() => ({ routes, match }), [routes, match]);
  // The same element while the deferred match stands still, so the urgent
  // render a navigation starts with does not render the old page again.
  const stack = useMemo(
    () =>
      match === null ? null : <RenderStack stack={match.stack} index={0} />,
    [match],
  );
  return (
    <PathnameProvider pathname={appPathname()}>
      <NavigationGeneration value={generation}>
        <TreePathname value={current.pathname}>
          <RouterContext value={value}>{stack}</RouterContext>
        </TreePathname>
      </NavigationGeneration>
    </PathnameProvider>
  );
}

/**
 * The winning pattern and its params, untyped — `useParams` narrows. It reads
 * the match `<Router>` provides, so under `@k8ordo/framework`, which mounts
 * no `<Router>`, a page receives `params` as a prop and a component below it
 * reads them with `useMatch`.
 */
export function useRoute(): Pick<Match, 'pattern' | 'params'> {
  const current = use(RouterContext)?.match ?? null;
  if (current === null) {
    throw new Error(
      'useRoute must render inside a matched <Router> — under @k8ordo/framework a page receives params as a prop, and useMatch reads them below it',
    );
  }
  return { pattern: current.pattern, params: current.params };
}

/**
 * Typed params for the pattern this component believes it renders under —
 * inferred from the pattern literal, verified against `Register`, and read
 * from context at runtime, so no component imports the route table. The
 * belief is checked: rendering under any other pattern throws instead of
 * silently returning params of the wrong shape. Like `useRoute`, it needs a
 * `<Router>` above it: under `@k8ordo/framework` a page receives `params` as
 * a prop, and a component below it reads them with `useMatch`.
 */
export function useParams<P extends RegisteredPattern>(
  pattern: P,
): ParamsOf<P> {
  const { pattern: current, params } = useRoute();
  if (current !== pattern) {
    throw new Error(`useParams("${pattern}") rendered under "${current}"`);
  }
  return params as ParamsOf<P>;
}
