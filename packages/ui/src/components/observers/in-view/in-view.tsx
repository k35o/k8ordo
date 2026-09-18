'use client';

import { Fragment, useEffect, useEffectEvent, useRef, useState } from 'react';
import type { FC, FragmentInstance, ReactNode } from 'react';

export const InView: FC<{
  children: ReactNode;
  onChange: (isInView: boolean) => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}> = ({
  children,
  onChange,
  root = null,
  rootMargin = '0px',
  threshold = 0,
  once = false,
}) => {
  const [instance, setInstance] = useState<FragmentInstance | null>(null);
  const handleChange = useEffectEvent(onChange);
  // root などが変わると observer を張り直すが、そのたびに初回扱いすると同じ値を
  // 重ねて報告してしまう。最後に報告した値は張り直しをまたいで持つ。
  const reportedRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!instance || (once && reportedRef.current === true)) {
      return undefined;
    }

    // entries には「変化した対象」しか来ないので、どれかが交差しているかを
    // 判定するには、いま交差している要素を覚えておく必要がある。
    const intersecting = new Set<Element>();
    let stopped = false;

    const report = () => {
      const next = intersecting.size > 0;
      if (stopped || next === reportedRef.current) {
        return;
      }
      reportedRef.current = next;
      handleChange(next);

      if (once && next) {
        stopped = true;
        instance.unobserveUsing(observer);
        observer.disconnect();
      }
    };

    // React は外れた子の unobserve をペイント後まで遅らせ、その子が交差しなく
    // なったという最後の通知を待つ。ただ、それより先に交差の計算が走る保証は無く、
    // 通知が落ちると外れた子が intersecting に残って true のままになる。子が外れた
    // ことは、React が呼ぶ unobserve から直接知る。
    class ChildrenObserver extends IntersectionObserver {
      override unobserve(target: Element): void {
        super.unobserve(target);
        if (intersecting.delete(target)) {
          report();
        }
      }
    }

    const observer = new ChildrenObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        }
        report();
      },
      { root, rootMargin, threshold },
    );

    instance.observeUsing(observer);

    return () => {
      if (!stopped) {
        // unobserveUsing も子ごとに unobserve を呼ぶが、後始末で外した子は報告しない
        stopped = true;
        instance.unobserveUsing(observer);
      }
      observer.disconnect();
    };
  }, [instance, root, rootMargin, threshold, once]);

  // ref を持つ Fragment は子を観測するための境界で、無駄な Fragment ではない。
  // このルールは Fragment の ref をまだ知らない。
  // oxlint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment ref={setInstance}>{children}</Fragment>;
};
