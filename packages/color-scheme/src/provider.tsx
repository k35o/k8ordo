'use client';

import { useAppState } from '@k8ordo/state';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';

import {
  colorSchemeState,
  DARK_CLASS,
  DARK_QUERY,
  resolve,
  scriptFor,
} from './scheme';
import type { ColorScheme, ColorSchemePreference } from './scheme';

export type UseColorScheme = {
  /**
   * What is on screen: the preference, the provider's default, or the
   * system's answer.
   */
  readonly scheme: ColorScheme;
  /** What the visitor asked for; `'system'` when nothing is stored. */
  readonly preference: ColorSchemePreference;
  /**
   * Stores a preference, or `'system'` to store none, so the provider's
   * `defaultPreference` applies again.
   */
  readonly setPreference: (preference: ColorSchemePreference) => void;
};

const ColorSchemeContext = createContext<UseColorScheme | null>(null);

const subscribeSystem = (onChange: () => void): (() => void) => {
  const query = matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
};
const readSystemDark = (): boolean => matchMedia(DARK_QUERY).matches;
// A server has no system to ask; the inline script is what keeps the first
// paint right, and this render is corrected the moment it hydrates.
const serverSystemDark = (): boolean => false;

// Whether this render reads the real store. The hydration render reads the
// server's guesses instead — nothing stored, a light system — and must not
// write them onto a document the inline script already put right; React
// re-renders from the store straight after, and that render writes.
const subscribeNever = (): (() => void) => () => {
  // nothing changes what this reports
};
const useReadsStore = (): boolean =>
  useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

export type ColorSchemeProviderProps = {
  /**
   * What applies while the visitor has chosen nothing. `'system'` follows
   * `prefers-color-scheme`; a scheme starts every visitor there until they
   * choose.
   */
  readonly defaultPreference?: ColorSchemePreference;
  readonly children: ReactNode;
};

/**
 * The one place the scheme is decided and written. Goes in the root
 * layout, inside `<body>`, around everything: it renders the inline script
 * that puts the class on `<html>` before the first paint, keeps the class
 * in step afterwards, and hands `useColorScheme` what it reads.
 */
export function ColorSchemeProvider({
  defaultPreference = 'system',
  children,
}: ColorSchemeProviderProps): ReactNode {
  const [{ preference }, update] = useAppState(colorSchemeState);
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    readSystemDark,
    serverSystemDark,
  );
  const scheme = resolve(preference, defaultPreference, systemDark);
  const readsStore = useReadsStore();

  useEffect(() => {
    if (!readsStore) return;
    document.documentElement.classList.toggle(DARK_CLASS, scheme === 'dark');
  }, [readsStore, scheme]);

  const setPreference = useCallback(
    (next: ColorSchemePreference) => {
      update({ preference: next === 'system' ? undefined : next });
    },
    [update],
  );
  const value = useMemo<UseColorScheme>(
    () => ({ scheme, preference: preference ?? 'system', setPreference }),
    [scheme, preference, setPreference],
  );

  return (
    <>
      {/* Before the children, so the parser runs it before it reaches what
          they render — the first paint is already right, and hydration
          finds the node in place and does not run it again. */}
      <script>{scriptFor(defaultPreference)}</script>
      <ColorSchemeContext value={value}>{children}</ColorSchemeContext>
    </>
  );
}

/** The visitor's colour scheme and a way to change it, from the provider above. */
export function useColorScheme(): UseColorScheme {
  const value = use(ColorSchemeContext);
  if (value === null) {
    throw new Error(
      'useColorScheme needs <ColorSchemeProvider> above it — put one in the root layout, inside <body>',
    );
  }
  return value;
}
