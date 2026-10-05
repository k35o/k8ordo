'use client';

import type { FC, ReactNode } from 'react';

import { getLocale } from '../i18n';
import { useWritingMode } from '../theme/writing-mode-context';
import { WritingModeSwitcher } from './writing-mode-switcher';

export type Stage = 'page' | 'article';

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
    <div
      className={
        stage === 'page' ? 'bg-bg-surface relative' : 'bg-bg-base relative'
      }
    >
      {locale === 'ja' && (
        <div className="absolute top-2 right-2 z-10">
          <WritingModeSwitcher />
        </div>
      )}
      <div
        className={
          isVertical
            ? 'writing-v flex flex-wrap items-center gap-4 p-6 pt-14 min-inline-96'
            : 'flex flex-wrap items-center gap-4 p-6 pt-14'
        }
      >
        {children}
      </div>
    </div>
  );
};
