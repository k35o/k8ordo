'use client';

import type { FC, ReactNode } from 'react';

import { getLocale } from '../i18n';
import { useWritingMode } from '../theme/writing-mode-context';
import { WritingModeSwitcher } from './writing-mode-switcher';

import styles from './preview-area.module.css';

export type Stage = 'page' | 'article';

const STAGE = { page: styles.page, article: styles.article } as const;

type Props = {
  children: ReactNode;
  /**
   * What the component is drawn on. ui's components are made for the page
   * color (bg-surface), where cards float; CodeBlock is made to sit inside an
   * article (bg-base), and vanishes on the page color.
   */
  stage?: Stage;
};

export const PreviewArea: FC<Props> = ({ children, stage = 'page' }) => {
  const { writingMode } = useWritingMode();
  const locale = getLocale();
  const isVertical = locale === 'ja' && writingMode === 'vertical';
  return (
    <div className={STAGE[stage]}>
      {locale === 'ja' && (
        <div className={styles.switcher}>
          <WritingModeSwitcher />
        </div>
      )}
      <div
        className={
          isVertical
            ? `writing-v ${styles.stage} ${styles.vertical}`
            : styles.stage
        }
      >
        {children}
      </div>
    </div>
  );
};
