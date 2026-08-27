'use client';

import { useEffect, useRef } from 'react';
import type { FC, RefObject } from 'react';

import { cn } from './../../../helpers/cn';

/**
 * ページ（または container）のスクロール進捗バー。
 * CSS scroll-driven animations（animation-timeline: scroll()）で描画し、
 * 未対応ブラウザ（Firefox）と container 指定時は同じ見た目を
 * scroll リスナー + ResizeObserver で再現する（named timeline +
 * timeline-scope を任意の外部要素へ配線するより単純で確実なため）。
 */
export const ScrollLinked: FC<{
  container?: RefObject<HTMLElement | null>;
}> = ({ container }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) {
      return undefined;
    }
    if (
      container === undefined &&
      CSS.supports('animation-timeline', 'scroll()')
    ) {
      return undefined;
    }

    let cleanup: (() => void) | undefined;
    let retryId: number | undefined;

    const attach = () => {
      // container の要素が後からマウントされるケースでは、window に
      // フォールバックすると誤ったスクローラーを恒久的に追跡してしまう。
      // ref が解決するまで接続を遅らせる
      if (container?.current === null) {
        retryId = window.setTimeout(attach, 50);
        return;
      }
      const target = container?.current ?? null;
      const scroller: HTMLElement | Window = target ?? window;
      const update = () => {
        const scrollTop = target ? target.scrollTop : window.scrollY;
        const scrollable = target
          ? target.scrollHeight - target.clientHeight
          : document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? scrollTop / scrollable : 0;
        bar.style.scale = `${Math.min(1, Math.max(0, progress)).toString()} 1`;
      };
      update();
      scroller.addEventListener('scroll', update, { passive: true });
      // リサイズやコンテンツ高さの変化でも進捗を再計算する
      // （native の ScrollTimeline はレイアウト変化に自動追従するため合わせる）
      const observer = new ResizeObserver(update);
      observer.observe(target ?? document.documentElement);
      // コンテンツ高(scrollHeight)の変化は target 自身の box には現れないため
      // 直下の子要素を監視する（バー自身が混ざっても無害）。attach 後に
      // 追加された子までは追わず、次の scroll / resize で追従する
      if (target) {
        for (const child of target.children) {
          observer.observe(child);
        }
      }
      window.addEventListener('resize', update);
      cleanup = () => {
        scroller.removeEventListener('scroll', update);
        observer.disconnect();
        window.removeEventListener('resize', update);
      };
    };
    attach();

    return () => {
      if (retryId !== undefined) {
        window.clearTimeout(retryId);
      }
      cleanup?.();
    };
  }, [container]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-primary-bg fixed top-0 h-2 origin-left scale-[0_1] inset-x-0',
        // CSS アニメーションが有効な間は inline の scale より優先される
        container === undefined && 'ao-scroll-progress',
      )}
      ref={barRef}
    />
  );
};
