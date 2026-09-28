'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

// 初期フォーカス対象となるフォーカス可能要素。
// roving tabindex の項目（tabindex="-1"）は除外する。
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/**
 * 非モーダルなポップアップのフォーカス管理。
 *
 * - 開いたとき、ポップアップ内へ初期フォーカスを移す
 *   （内部に roving tabindex のリストがある場合は、そのリストナビゲーション側の
 *   フォーカスが後で上書きするため、ここではコンテナ/先頭要素に当てるだけでよい）
 * - 閉じたとき、フォーカスがまだポップアップ内（または喪失）していればトリガーへ戻す。
 *   外側を意図的にクリック/フォーカスした場合は奪い返さない。
 *
 * ハードな Tab トラップや close-on-focus-out は行わない。非モーダルなので Tab で
 * ポップアップの外へ抜けられるのが期待される振る舞いで、抜けたときに閉じるかは
 * 呼び出し側が決める。外側クリック / Escape による dismiss も呼び出し側が担う。
 */
export const useFocusTrap = (
  contentRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<Element | null>,
  enabled: boolean,
): void => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const content = contentRef.current;
    if (!content) {
      return undefined;
    }
    // 復帰先（トリガー）は開いている間は不変なので setup 時に捕捉し、
    // cleanup で ref.current を直接読まない（ref は変化している可能性がある）。
    const trigger = triggerRef.current;

    if (!content.contains(document.activeElement)) {
      // 中身が最初に受け取る要素を名指しできるようにする（Calendar は選択日）。
      // React は autoFocus を属性として描かず、ポップアップが表示される前の
      // commit でフォーカスしようとして空振りするため、データ属性で受け渡す。
      const first =
        content.querySelector<HTMLElement>('[data-autofocus]') ??
        content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (first) {
        first.focus();
      } else {
        content.tabIndex = -1;
        content.focus();
      }
    }

    return () => {
      const active = document.activeElement;
      const focusWasInside =
        active === null || active === document.body || content.contains(active);
      if (focusWasInside && trigger instanceof HTMLElement) {
        trigger.focus();
      }
    };
  }, [contentRef, triggerRef, enabled]);
};
