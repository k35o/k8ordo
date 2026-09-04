'use client';

import { createContext, use, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { normalizePathname } from './paths';

const ServerPathname = createContext<string | null>(null);

/**
 * The pathname the render started from. A client component's first render can
 * happen where there is no Navigation API — on the server, and again during
 * hydration — so the value has to arrive from the renderer that did know it.
 *
 * `<Router>` supplies this on its own. Under the framework the mode's runtime
 * supplies it; an application never writes this itself.
 */
export const PathnameProvider = ({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}): ReactNode => {
  const value = useMemo(() => normalizePathname(pathname), [pathname]);
  return <ServerPathname value={value}>{children}</ServerPathname>;
};

const subscribe = (onChange: () => void): (() => void) => {
  navigation.addEventListener('currententrychange', onChange);
  return () => {
    navigation.removeEventListener('currententrychange', onChange);
  };
};

const readPathname = (): string => normalizePathname(location.pathname);

/**
 * Where the browser currently is, as a pathname — the one axis this package
 * owns. It reads the platform rather than a table, so it works the same in a
 * client application and under the framework, where there is no route table
 * in the browser at all.
 *
 * It is not `useRoute`: this answers "what is the URL", which a navigation
 * link needs, while `useRoute` answers "which route won", which only a table
 * can say.
 *
 * The search string is deliberately absent. A component that re-rendered on
 * every search change would defeat `@k8ordo/state`'s keyed subscriptions, and
 * the split at the `?` is the whole boundary between the two packages.
 */
export function usePathname(): string {
  const fromServer = use(ServerPathname);
  return useSyncExternalStore(subscribe, readPathname, () => {
    if (fromServer === null) {
      throw new Error(
        'usePathname needs <Router> above it, or a page rendered by @k8ordo/static or @k8ordo/server',
      );
    }
    return fromServer;
  });
}
