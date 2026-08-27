'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS: Record<Breakpoint, string> = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem',
};

export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const query = `(min-width: ${BREAKPOINTS[breakpoint]})`;

  const subscribe = useCallback(
    (cb: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', cb);
      return () => {
        mediaQueryList.removeEventListener('change', cb);
      };
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
