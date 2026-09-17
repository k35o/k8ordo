'use client';

import { useEffect, useRef } from 'react';
import type { FC } from 'react';

import { cn } from './../../../helpers/cn';

/**
 * ページ（または container）のスクロール進捗バー。
 * CSS scroll-driven animations（animation-timeline: scroll()）で描画し、
 * 未対応ブラウザ（Firefox）と container 指定時は同じ見た目を
 * scroll リスナー + ResizeObserver で再現する（named timeline +
 * timeline-scope を任意の外部要素へ配線するより単純で確実なため）。
 */
export const ScrollLinked: FC<{
  container?: Element | null;
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

    // container を渡されたのに要素がまだ無い間は、window で代用しない。代用すると
    // 誤ったスクローラーを追い続けるので、要素が来て effect が再実行されるのを待つ。
    if (container === null) {
      return undefined;
    }

    const target = container ?? null;
    const scroller: Element | Window = target ?? window;
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
    // 直下の子要素を監視する（バー自身が混ざっても無害）。後から
    // 追加された子までは追わず、次の scroll / resize で追従する
    if (target) {
      for (const child of target.children) {
        observer.observe(child);
      }
    }
    window.addEventListener('resize', update);

    return () => {
      scroller.removeEventListener('scroll', update);
      observer.disconnect();
      window.removeEventListener('resize', update);
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
