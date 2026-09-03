'use client';

import { defineLocalState, useAppState } from '@k8ordo/state';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import * as z from 'zod/mini';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// mode が未設定のあいだはシステム設定に追従する。過去の `sepia` のような
// 未知の値はスキーマのサルベージが未設定に落とすので、手動の正規化は無い。
// 保存先は localStorage の `k8ordo-state:theme`（root.tsx の初期化スクリプト
// と対）。
const themeState = defineLocalState(
  'theme',
  z.object({ mode: z.optional(z.enum(['light', 'dark'])) }),
);

const subscribeMediaQuery = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => {
    mq.removeEventListener('change', cb);
  };
};

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getServerSystemTheme = (): Theme => 'light';

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [{ mode }, update] = useAppState(themeState);
  const systemTheme = useSyncExternalStore(
    subscribeMediaQuery,
    getSystemTheme,
    getServerSystemTheme,
  );
  const theme: Theme = mode ?? systemTheme;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    update({ mode: theme === 'light' ? 'dark' : 'light' });
  }, [update, theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
