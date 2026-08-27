'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { PointerEvent, RefObject } from 'react';

/**
 * ポインタ位置とサブメニューの手前側 2 角を結ぶ「safe triangle」を
 * トリガーの ::after に clip-path で描くための CSS 変数を更新する。
 *
 * 三角形の内側はトリガーの当たり判定として扱われるため、サブメニューへ
 * 斜めに移動しても途中の兄弟項目で mouseleave が発火しない。
 * ポインタが動くたびに頂点を追従させ、離れる方向に動けば三角形は狭まる。
 *
 * getBoundingClientRect（強制同期レイアウト）を pointermove の生の頻度で
 * 呼ばないよう、更新は requestAnimationFrame で 1 フレーム 1 回に間引く。
 *
 * 参考: https://ics.media/entry/260803/
 */
export const useSafeTriangle = (
  panelRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): ((event: PointerEvent<HTMLElement>) => void) => {
  const pointerRef = useRef<{
    x: number;
    y: number;
    trigger: HTMLElement;
  } | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  return useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enabled) {
        return;
      }
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        trigger: event.currentTarget,
      };
      if (frameRef.current !== null) {
        return;
      }
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const pointer = pointerRef.current;
        const panel = panelRef.current;
        if (!pointer || !panel) {
          return;
        }
        const panelRect = panel.getBoundingClientRect();
        if (panelRect.width === 0 && panelRect.height === 0) {
          return;
        }
        const { trigger } = pointer;
        const triggerRect = trigger.getBoundingClientRect();
        const { style } = trigger;

        // position-try-fallbacks による左右反転にも追従できるよう、
        // 要求 placement ではなく実際の矩形から開く向きを判定する。
        const opensRight =
          panelRect.left + panelRect.width / 2 >=
          triggerRect.left + triggerRect.width / 2;
        const width = opensRight
          ? panelRect.left - pointer.x
          : pointer.x - panelRect.right;
        if (width <= 0) {
          style.setProperty('--safe-width', '0px');
          return;
        }

        style.setProperty('--safe-top', `${panelRect.top - triggerRect.top}px`);
        style.setProperty('--safe-height', `${panelRect.height}px`);
        style.setProperty('--safe-width', `${width}px`);
        style.setProperty(
          '--safe-left',
          `${(opensRight ? pointer.x : panelRect.right) - triggerRect.left}px`,
        );
        // 頂点=ポインタ位置（要素内 y 座標）、底辺=サブメニューの手前側の辺。
        style.setProperty('--safe-y', `${pointer.y - panelRect.top}px`);
        style.setProperty(
          '--safe-clip',
          opensRight
            ? 'polygon(0 var(--safe-y), 100% 0, 100% 100%)'
            : 'polygon(100% var(--safe-y), 0 0, 0 100%)',
        );
      });
    },
    [panelRef, enabled],
  );
};
