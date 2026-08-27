'use client';

import { ChevronIcon } from '@k8ordo/ui';
import type { FC, ReactNode } from 'react';

import type { NavItem } from '../data/nav-types';
import { LocaleAnchor } from './locale-anchor';
import { T } from './t';

const cardClass =
  'group bg-bg-base focus-within:ring-border-info relative flex flex-col overflow-hidden rounded-xl shadow-sm motion-safe:transition-shadow motion-safe:duration-150 motion-safe:ease-out hover:shadow-md focus-within:ring-2';

export const CatalogCard: FC<{ item: NavItem; preview?: ReactNode }> = ({
  item,
  preview,
}) => (
  <div className={cardClass}>
    {preview === undefined ? null : (
      // The preview is purely decorative: `inert` removes its (focusable)
      // controls from the tab order and the accessibility tree, leaving only
      // the card's stretched link as the interactive target.
      <div
        aria-hidden
        className="bg-bg-subtle pointer-events-none flex h-36 items-center justify-center overflow-hidden px-5"
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
        <T k={item.descKey} />
      </p>
    </div>
  </div>
);
