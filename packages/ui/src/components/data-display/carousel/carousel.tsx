'use client';

import { createContext, use, useEffect, useId, useRef, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

import { cn } from '../../../helpers/cn';
import { readWritingMode } from '../../../hooks/writing-mode';
import { getMessages } from '../../../i18n/current';
import { FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';
import { IconButton } from '../../buttons/icon-button';
import { ChevronIcon } from '../../icons';

type SlideSize = 'full' | 'lg' | 'md' | 'sm';

const SlideSizeContext = createContext<SlideSize>('full');

type Position = {
  current: number;
  count: number;
  isAtStart: boolean;
  isAtEnd: boolean;
};

// いちばん広く見えている最初のスライドを「今のスライド」とし、端の
// スライドがほぼ全部見えていれば、その向きにはもう送れないとみなす
const FULLY_VISIBLE = 0.95;

const INITIAL_POSITION: Position = {
  current: 0,
  count: 0,
  isAtStart: true,
  isAtEnd: true,
};

// 見えている割合は inline 軸の重なりだけで決まるので、どちら向きに
// 流れているか（右から左、縦書き）を気にせずに済む
const measure = (track: HTMLElement): Position => {
  const isVertical = readWritingMode(track) === 'vertical';
  const box = track.getBoundingClientRect();
  const visibility = Array.from(track.children, (slide) => {
    const rect = slide.getBoundingClientRect();
    const [start, end, boxStart, boxEnd] = isVertical
      ? [rect.top, rect.bottom, box.top, box.bottom]
      : [rect.left, rect.right, box.left, box.right];
    const size = end - start;
    const overlap = Math.min(end, boxEnd) - Math.max(start, boxStart);
    return size === 0 ? 0 : Math.max(0, overlap) / size;
  });
  return {
    current: Math.max(0, visibility.indexOf(Math.max(...visibility))),
    count: visibility.length,
    isAtStart: (visibility[0] ?? 0) >= FULLY_VISIBLE,
    isAtEnd: (visibility.at(-1) ?? 0) >= FULLY_VISIBLE,
  };
};

const useCarousel = (
  track: HTMLElement | null,
): { position: Position; step: (delta: 1 | -1) => void } => {
  const [position, setPosition] = useState(INITIAL_POSITION);
  // 送っている途中のスライド。交差の通知は非同期なので、続けて押された
  // 2 回目が今のスライドを測り直すと、1 回目と同じスライドへ送ってしまう
  const targetRef = useRef<number | null>(null);

  useEffect(() => {
    if (track === null) return undefined;
    // 交差の通知は測り直すきっかけにだけ使う。値は measure が DOM から読む
    const intersection = new IntersectionObserver(
      () => {
        setPosition(measure(track));
      },
      { root: track, threshold: [0, 0.5, FULLY_VISIBLE] },
    );
    const observeSlides = () => {
      targetRef.current = null;
      intersection.disconnect();
      for (const slide of track.children) {
        intersection.observe(slide);
      }
    };
    const settle = () => {
      targetRef.current = null;
    };
    // スライドの増減は React の外（DOM）で数える。子を数えるために
    // Children を使うと、Fragment や配列の入れ子で数がずれる
    const mutation = new MutationObserver(observeSlides);
    mutation.observe(track, { childList: true });
    observeSlides();
    track.addEventListener('scrollend', settle);
    return () => {
      track.removeEventListener('scrollend', settle);
      mutation.disconnect();
      intersection.disconnect();
    };
  }, [track]);

  const step = (delta: 1 | -1) => {
    if (track === null) return;
    const from = targetRef.current ?? measure(track).current;
    const target = Math.min(
      Math.max(from + delta, 0),
      track.children.length - 1,
    );
    targetRef.current = target;
    // inline: 'start' は書字方向に従うので、縦書きでも右から左の文書でも
    // スライドの頭がトラックの頭に揃う
    track.children[target]?.scrollIntoView({
      block: 'nearest',
      inline: 'start',
    });
  };

  return { position, step };
};

export const Root: FC<
  PropsWithChildren<{
    label: string;
    slideSize?: SlideSize;
  }>
> = ({ label, slideSize = 'full', children }) => {
  const messages = getMessages();
  const trackId = useId();
  const [track, setTrack] = useState<HTMLDivElement | null>(null);
  const {
    position: { current, count, isAtStart, isAtEnd },
    step,
  } = useCarousel(track);
  // 1 枚ずつ見せるときだけ「何枚目か」が 1 つに決まる。複数枚見せるときは
  // 先頭の番号を出しても、末尾まで送ったときに総数と合わない
  const showsPosition =
    (slideSize === 'full' || slideSize === 'lg') && count > 0;

  return (
    <section
      aria-label={label}
      aria-roledescription={messages.carousel}
      className="flex flex-col gap-3"
    >
      <SlideSizeContext value={slideSize}>
        <div
          className={cn(
            'flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-lg p-1 [scroll-snap-type:inline_mandatory] scrollbar-none scroll-ps-1 motion-safe:scroll-smooth',
            'vertical:overflow-x-hidden vertical:overflow-y-auto vertical:overscroll-y-contain',
            FOCUS_RING_NO_BORDER,
          )}
          id={trackId}
          ref={setTrack}
          // スクロール領域そのものにフォーカスを置けるようにし、矢印キーでも送れるようにする
          // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          {children}
        </div>
      </SlideSizeContext>
      <div className="flex items-center justify-center gap-3">
        <IconButton
          aria-controls={trackId}
          disabled={isAtStart}
          label={messages.carouselPrevious}
          onClick={() => {
            step(-1);
          }}
          size="sm"
        >
          <span className="vertical:rotate-90 inline-flex">
            <ChevronIcon direction="left" size="sm" />
          </span>
        </IconButton>
        {showsPosition ? (
          <p aria-live="polite" className="text-fg-mute text-sm tabular-nums">
            <span className="text-fg-base">{current + 1}</span>
            <span className="mx-1">/</span>
            <span>{count}</span>
          </p>
        ) : null}
        <IconButton
          aria-controls={trackId}
          disabled={isAtEnd}
          label={messages.carouselNext}
          onClick={() => {
            step(1);
          }}
          size="sm"
        >
          <span className="vertical:rotate-90 inline-flex">
            <ChevronIcon direction="right" size="sm" />
          </span>
        </IconButton>
      </div>
    </section>
  );
};

export const Slide: FC<PropsWithChildren<{ label?: string }>> = ({
  label,
  children,
}) => {
  const messages = getMessages();
  const slideSize = use(SlideSizeContext);

  return (
    <div
      aria-label={label}
      aria-roledescription={messages.carouselSlide}
      className={cn(
        'shrink-0 snap-start',
        slideSize === 'full' && 'basis-full',
        slideSize === 'lg' && 'basis-4/5',
        slideSize === 'md' && 'basis-[calc((100%-1rem)/2)]',
        slideSize === 'sm' && 'basis-[calc((100%-2rem)/3)]',
      )}
      role="group"
    >
      {children}
    </div>
  );
};
