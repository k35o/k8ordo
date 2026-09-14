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
    // bg-preview-bg matches the Shiki code block so the preview and code read
    // as one panel (see --preview-bg in styles/globals.css).
    <div className="border-border-subtle bg-preview-bg relative border-b">
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
