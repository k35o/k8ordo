'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';

export type WritingMode = 'horizontal' | 'vertical';

const getServerSnapshot = (): WritingMode => 'horizontal';

const resolve = (value: string): WritingMode =>
  value.startsWith('vertical') || value.startsWith('sideways')
    ? 'vertical'
    : 'horizontal';

export const useWritingMode = (ref: RefObject<Element | null>): WritingMode => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const el = ref.current;
      if (!el) return () => {};
      // writing-mode が flip するとインライン/ブロック軸が入れ替わって必ずサイズ変動が起こるため
      // ResizeObserver で十分検知できる。
      const observer = new ResizeObserver(onChange);
      observer.observe(el);
      return () => {
        observer.disconnect();
      };
    },
    [ref],
  );

  const getSnapshot = useCallback((): WritingMode => {
    const el = ref.current;
    if (!el) return 'horizontal';
    return resolve(getComputedStyle(el).writingMode);
  }, [ref]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
