'use client';

import type { FC, ReactNode } from 'react';

import { getLocale } from '../i18n';
import { useWritingMode } from '../theme/writing-mode-context';
import { WritingModeSwitcher } from './writing-mode-switcher';

type Props = {
  children: ReactNode;
};

export const PreviewArea: FC<Props> = ({ children }) => {
  const { writingMode } = useWritingMode();
  const locale = getLocale();
  const isVertical = locale === 'ja' && writingMode === 'vertical';
  return (
    <div className="border-border-mute bg-bg-base relative rounded-lg border">
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
