'use client';

import { ChevronIcon } from '@k8ordo/ui';
import type { FC, ReactNode } from 'react';

import type { NavItem } from '../data/nav-types';
import { LocaleAnchor } from './locale-anchor';
import type { Stage } from './preview-area';
import { Rich } from './rich';

import styles from './catalog-card.module.css';

export const CatalogCard: FC<{
  item: NavItem;
  preview?: ReactNode;
  stage?: Stage;
}> = ({ item, preview, stage = 'page' }) => (
  <div className={styles.card}>
    {preview === undefined ? null : (
      // The preview is purely decorative: `inert` removes its (focusable)
      // controls from the tab order and the accessibility tree, leaving only
      // the card's stretched link as the interactive target.
      <div
        aria-hidden
        className={
          stage === 'article'
            ? `${styles.preview} ${styles.previewOnArticle}`
            : styles.preview
        }
        inert
      >
        {preview}
      </div>
    )}
    <div className={styles.body}>
      <div className={styles.titleRow}>
        <LocaleAnchor className={styles.link} path={item.path} unstyled>
          {item.name}
        </LocaleAnchor>
        <span aria-hidden className={styles.chevron}>
          <ChevronIcon direction="right" size="sm" />
        </span>
      </div>
      <p className={styles.description}>
        <Rich>{item.description()}</Rich>
      </p>
    </div>
  </div>
);
