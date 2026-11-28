'use client';

import { Suspense, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

const subscribe = (): (() => void) => () => undefined;

// ブラウザで読む色のスキームの真似。サーバーと hydrate では light で描き、
// hydrate の直後に dark で描き直る。その中で Suspense を作る
export function Scheme({ children }: { children: ReactNode }) {
  const scheme = useSyncExternalStore(
    subscribe,
    () => 'dark',
    () => 'light',
  );
  return (
    <div data-scheme={scheme}>
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
