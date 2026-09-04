'use client';

import { createContext, use, useMemo, useState } from 'react';
import type { FC, ReactNode } from 'react';

import type { Match, RouteComponent, Routes } from './define-routes';
import { PathnameProvider } from './location';
import { useInterceptedNavigation } from './navigation';
import type { ParamsOf } from './paths';
import type { RegisteredPattern } from './register';

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

/**
 * Mounts a route table on the Navigation API: every same-origin navigation
 * that the table claims is handled in the client, and the rest is left to the
 * server. Layout components render their children through `<Outlet />`.
 *
 * This is the whole router for an application that renders on the client.
 * Under the framework the tree comes from the server instead, and only
 * `useInterceptedNavigation` is shared.
 */
export function Router({ routes }: { routes: Routes }): ReactNode {
  const [match, setMatch] = useState<Match | null>(() =>
    routes.match(location.pathname),
  );

  useInterceptedNavigation<Match>({
    claim: (url) => routes.match(url.pathname) !== null,
    load: (url) => routes.match(url.pathname) as Match,
    apply: setMatch,
  });

  const value = useMemo(() => ({ routes, match }), [routes, match]);
  return (
    <PathnameProvider pathname={location.pathname}>
      <RouterContext value={value}>
        {match === null ? null : <RenderStack stack={match.stack} index={0} />}
      </RouterContext>
    </PathnameProvider>
  );
}

/** The winning pattern and its params, untyped — `useParams` narrows. */
export function useRoute(): Pick<Match, 'pattern' | 'params'> {
  const current = use(RouterContext)?.match ?? null;
  if (current === null) {
    throw new Error('useRoute must render inside a matched <Router>');
  }
  return { pattern: current.pattern, params: current.params };
}

/**
 * Typed params for the pattern this component believes it renders under —
 * inferred from the pattern literal, verified against `Register`, and read
 * from context at runtime, so no component imports the route table. The
 * belief is checked: rendering under any other pattern throws instead of
 * silently returning params of the wrong shape.
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
