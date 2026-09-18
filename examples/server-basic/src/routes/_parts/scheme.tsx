'use client';

import { createContext, use, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

type Scheme = 'light' | 'dark';

const DARK = '(prefers-color-scheme: dark)';

const SchemeContext = createContext<Scheme>('light');

const subscribe = (onChange: () => void): (() => void) => {
  const query = matchMedia(DARK);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
};

const readScheme = (): Scheme => (matchMedia(DARK).matches ? 'dark' : 'light');

// サーバーは訪問者の設定を知らないので light で描く。ダークの訪問者では
// hydrate した直後に値が変わり、その下のページ全体へ伝わる
const serverScheme = (): Scheme => 'light';

export function SchemeProvider({ children }: { children: ReactNode }) {
  const scheme = useSyncExternalStore(subscribe, readScheme, serverScheme);
  return <SchemeContext value={scheme}>{children}</SchemeContext>;
}

export function SchemeName() {
  return <span data-testid="scheme">scheme: {use(SchemeContext)}</span>;
}
