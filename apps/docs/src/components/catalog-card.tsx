'use client';

import { ChevronIcon } from '@k8ordo/ui';
import type { FC, ReactNode } from 'react';

import type { NavItem } from '../data/nav-types';
import { LocaleAnchor } from './locale-anchor';
import type { Stage } from './preview-area';
import { Rich } from './rich';

// 本文の白いカードの中に置くので、白いカードを重ねず、部品が想定する
// ページの地（bg-surface）の面にする。ダークでは影が見えないので、白い
// カードは本文のカードに溶けていた
const cardClass =
  'group bg-bg-surface focus-within:ring-border-info hover:ring-border-base relative flex flex-col overflow-hidden rounded-xl focus-within:ring-2 hover:ring-1';

export const CatalogCard: FC<{
  item: NavItem;
  preview?: ReactNode;
  stage?: Stage;
}> = ({ item, preview, stage = 'page' }) => (
  <div className={cardClass}>
    {preview === undefined ? null : (
      // The preview is purely decorative: `inert` removes its (focusable)
      // controls from the tab order and the accessibility tree, leaving only
      // the card's stretched link as the interactive target.
      <div
        aria-hidden
        className={`border-border-mute pointer-events-none flex h-36 items-center justify-center overflow-hidden border-b px-5${stage === 'article' ? ' bg-bg-base' : ''}`}
        inert
      >
        {preview}
      </div>
    )}
    <div className="flex flex-col gap-1 px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <LocaleAnchor
          className="text-fg-base font-medium after:absolute after:inset-0 focus-visible:outline-hidden"
          path={item.path}
          unstyled
        >
          {item.name}
        </LocaleAnchor>
        <span
          aria-hidden
          className="text-fg-subtle group-hover:text-primary-fg -translate-x-1 opacity-0 transition duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        >
          <ChevronIcon direction="right" size="sm" />
        </span>
      </div>
      <p className="text-fg-mute line-clamp-2 h-12 text-sm leading-relaxed">
        <Rich>{item.description()}</Rich>
      </p>
    </div>
  </div>
);
