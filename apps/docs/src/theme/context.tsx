'use client';

import { useLocalStorage } from '@k8ordo/ui';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'k8ordo-theme';

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
  // 過去に保存されていた `sepia` クラスが残っていれば確実に外す
  root.classList.remove('sepia');
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// localStorage に過去の `sepia` などの未知の値が残っていても安全に扱う
const normalize = (value: string | null): Theme | null => {
  if (value === 'light' || value === 'dark') return value;
  return null;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedRaw, setStoredTheme] = useLocalStorage<string | null>(
    STORAGE_KEY,
    null,
  );
  const systemTheme = useSyncExternalStore(
    subscribeMediaQuery,
    getSystemTheme,
    getServerSystemTheme,
  );
  const storedTheme = normalize(storedRaw);
  const theme: Theme = storedTheme ?? systemTheme;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setStoredTheme(theme === 'light' ? 'dark' : 'light');
  }, [setStoredTheme, theme]);

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
