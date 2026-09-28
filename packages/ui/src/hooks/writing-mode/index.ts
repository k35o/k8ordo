'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type WritingMode = 'horizontal' | 'vertical';

export const readWritingMode = (element: Element): WritingMode => {
  const value = getComputedStyle(element).writingMode;
  return value.startsWith('vertical') || value.startsWith('sideways')
    ? 'vertical'
    : 'horizontal';
};

/**
 * 要素の書字方向を返し、切り替わったら追従する。
 *
 * 描くたびに算出スタイルから読むので、最初の描画から今の向きを返す
 * （ResizeObserver の最初の通知を待つと、それまでの描画は横書きになる）。
 * 描き直すきっかけには、writing-mode の変化を知らせるイベントが無いので、
 * ResizeObserver で要素の論理サイズの変化を使う。これが効くのは inline 軸
 * いっぱいに広がる要素だけで、ボタンのように中身に合わせて縮む要素は縦横が
 * 入れ替わっても論理サイズが変わらず、切り替えを見逃す。そういう要素は
 * 使う瞬間に readWritingMode で読む。
 */
export const useWritingMode = (element: Element | null): WritingMode => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!element) {
        return () => undefined;
      }
      const observer = new ResizeObserver(onChange);
      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    },
    [element],
  );

  return useSyncExternalStore(
    subscribe,
    () => (element ? readWritingMode(element) : 'horizontal'),
    () => 'horizontal',
  );
};
