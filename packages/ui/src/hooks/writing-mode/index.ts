'use client';

import { useEffect, useState } from 'react';

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
 * writing-mode の変化を知らせるイベントは無いので、ResizeObserver で要素の
 * 論理サイズの変化を手がかりにする。これが効くのは inline 軸いっぱいに広がる
 * 要素だけで、ボタンのように中身に合わせて縮む要素は縦横が入れ替わっても
 * 論理サイズが変わらず、切り替えを見逃す。そういう要素は使う瞬間に
 * readWritingMode で読む。
 */
export const useWritingMode = (element: Element | null): WritingMode => {
  const [writingMode, setWritingMode] = useState<WritingMode>('horizontal');

  useEffect(() => {
    if (!element) {
      return undefined;
    }
    const observer = new ResizeObserver(() => {
      setWritingMode(readWritingMode(element));
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return writingMode;
};
