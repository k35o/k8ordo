'use client';

import { useEffect, useId, useState } from 'react';
import type { FC, HTMLAttributes } from 'react';

import { getMessages } from '../../../i18n/current';
import {
  NAV_LIST_CLASS_NAME,
  NAV_TITLE_CLASS_NAME,
  navLinkClassName,
} from '../../_internal/nav-link';

export type TableOfContentsItem = {
  id: string;
  label: string;
  children?: readonly TableOfContentsItem[];
};

const idsOf = (items: readonly TableOfContentsItem[]): string[] =>
  items.flatMap((item) => [item.id, ...idsOf(item.children ?? [])]);

// アンカーへ飛んだブラウザが見出しを止める位置（scroll-margin）を読み取り
// 位置にする。目次から飛んだ見出しが、そのまま今の見出しになる。数 px の
// 丸めの揺れは許す
const TOLERANCE = 2;

// 見出しの block 軸の頭が、画面の頭からどれだけ進んだか。縦書きは
// vertical-rl なら右から、vertical-lr なら左から読み進む
const blockStartOf = (heading: Element, rect: DOMRect): number => {
  const mode = getComputedStyle(heading).writingMode;
  if (mode.startsWith('horizontal')) return rect.top;
  if (mode.endsWith('-lr')) return rect.left;
  return document.documentElement.clientWidth - rect.right;
};

const isScrolledToEnd = (): boolean => {
  const root = document.scrollingElement ?? document.documentElement;
  const canScroll =
    root.scrollHeight > root.clientHeight ||
    root.scrollWidth > root.clientWidth;
  return (
    canScroll &&
    root.scrollHeight - root.clientHeight - Math.abs(root.scrollTop) <= 1 &&
    root.scrollWidth - root.clientWidth - Math.abs(root.scrollLeft) <= 1
  );
};

// 読み取り位置を最後に越えた見出しが、今読んでいる見出し。見出しは
// 文書の順に並んでいて、文書と一緒にスクロールする前提
const resolveActive = (ids: readonly string[]): string | null => {
  let active: string | null = null;
  const present: string[] = [];
  for (const id of ids) {
    const heading = document.querySelector(`#${CSS.escape(id)}`);
    if (heading === null) continue;
    const rect = heading.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    present.push(id);
    // 計算値は '32px' のような長さなので、Number() では読めない
    // oxlint-disable-next-line eslint-plugin-unicorn/prefer-number-coercion
    const margin = Number.parseFloat(
      getComputedStyle(heading).scrollMarginBlockStart,
    );
    if (blockStartOf(heading, rect) <= margin + TOLERANCE) {
      active = id;
    }
  }
  // 最後の節が短いと、その見出しは読み取り位置まで来ないまま文書が
  // 終わる。終わりまで来たら最後の見出しにする
  return isScrolledToEnd() ? (present.at(-1) ?? active) : active;
};

const useActiveHeading = (ids: readonly string[]): string | null => {
  const [active, setActive] = useState<string | null>(null);
  // 配列は描画のたびに作り直されるので、中身で購読し直すかを決める
  const key = ids.join('\n');

  useEffect(() => {
    const targets = key === '' ? [] : key.split('\n');
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(resolveActive(targets));
    };
    const request = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    const resize = new ResizeObserver(request);
    resize.observe(document.body);
    request();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      resize.disconnect();
    };
  }, [key]);

  return active;
};

const Items: FC<{
  items: readonly TableOfContentsItem[];
  activeId: string | null;
  depth: number;
}> = ({ items, activeId, depth }) => (
  <ul className={depth === 0 ? NAV_LIST_CLASS_NAME : 'flex flex-col gap-0.5'}>
    {items.map((item) => (
      <li key={item.id}>
        <a
          aria-current={item.id === activeId ? 'location' : undefined}
          className={navLinkClassName(item.id === activeId, depth)}
          href={`#${encodeURIComponent(item.id)}`}
        >
          {item.label}
        </a>
        {item.children !== undefined && item.children.length > 0 ? (
          <Items activeId={activeId} depth={depth + 1} items={item.children} />
        ) : null}
      </li>
    ))}
  </ul>
);

export const TableOfContents: FC<
  {
    items: readonly TableOfContentsItem[];
    label?: string;
  } & Omit<
    HTMLAttributes<HTMLElement>,
    'className' | 'style' | 'children' | 'aria-labelledby'
  >
> = ({ items, label, ...rest }) => {
  const messages = getMessages();
  const titleId = useId();
  const activeId = useActiveHeading(idsOf(items));

  return (
    <nav {...rest} aria-labelledby={titleId} className="flex flex-col gap-1">
      <span className={NAV_TITLE_CLASS_NAME} id={titleId}>
        {label ?? messages.tableOfContents}
      </span>
      <Items activeId={activeId} depth={0} items={items} />
    </nav>
  );
};
