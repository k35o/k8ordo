'use client';

import {
  createContext,
  startTransition,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ComponentType, FC, ReactNode } from 'react';

import type { Match, Routes } from './define-routes';
import { normalizePathname } from './paths';
import type { ParamsOf } from './paths';
import type { RegisteredPattern } from './register';

type RouterValue = {
  routes: Routes;
  match: Match | null;
};

const RouterContext = createContext<RouterValue | null>(null);

type StackValue = {
  stack: readonly ComponentType[];
  index: number;
};

const StackContext = createContext<StackValue | null>(null);

const RenderStack: FC<StackValue> = ({ stack, index }) => {
  const value = useMemo(() => ({ stack, index: index + 1 }), [stack, index]);
  const Component = stack[index];
  if (Component === undefined) return null;
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
 * Mounts the route table on the Navigation API. Every same-origin
 * navigation — a plain `<a>`, `navigateTo`, a state update, back/forward —
 * arrives as a `navigate` event; matching ones are intercepted and applied
 * inside a React transition. The intercept handler resolves in an effect
 * after the new tree commits, which is what makes `finished` mean
 * "the page is on screen".
 */
export function Router({ routes }: { routes: Routes }): ReactNode {
  const [match, setMatch] = useState<Match | null>(() =>
    routes.match(location.pathname),
  );
  const commitSignal = useRef<(() => void) | null>(null);

  useEffect(() => {
    const onNavigate = (event: NavigateEvent): void => {
      if (
        !event.canIntercept ||
        event.hashChange ||
        event.downloadRequest !== null
      ) {
        return;
      }
      const url = new URL(event.destination.url);
      if (
        normalizePathname(url.pathname) === normalizePathname(location.pathname)
      ) {
        // Same pathname — only search or entry state moved. The route tree
        // stays; no remount, no scroll reset, no focus reset, and finished
        // settles immediately.
        event.intercept({ scroll: 'manual', focusReset: 'manual' });
        return;
      }
      const next = routes.match(url.pathname);
      if (next === null) {
        // Not in the table: leave the navigation alone. A real document
        // load — and a real 404 — is the server's answer, not a client one.
        return;
      }
      event.intercept({
        handler: () =>
          new Promise<void>((resolve, reject) => {
            commitSignal.current = resolve;
            event.signal.addEventListener(
              'abort',
              () => {
                reject(event.signal.reason as Error);
              },
              { once: true },
            );
            startTransition(() => {
              setMatch(next);
            });
          }),
      });
    };
    navigation.addEventListener('navigate', onNavigate);
    return () => {
      navigation.removeEventListener('navigate', onNavigate);
    };
  }, [routes]);

  useEffect(() => {
    // The definition of "committed": this effect runs after React put the
    // new match on screen, and only then does the intercept handler resolve.
    commitSignal.current?.();
    commitSignal.current = null;
  }, [match]);

  const value = useMemo(() => ({ routes, match }), [routes, match]);
  return (
    <RouterContext value={value}>
      {match === null ? null : <RenderStack stack={match.stack} index={0} />}
    </RouterContext>
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
