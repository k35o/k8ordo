'use client';

import {
  HorizontalWritingIcon,
  IconButton,
  VerticalWritingIcon,
} from '@k8ordo/ui';

import { useTranslation } from '../i18n';
import { useWritingMode } from '../theme/writing-mode-context';

export function WritingModeSwitcher() {
  const { writingMode, toggleWritingMode } = useWritingMode();
  const { t } = useTranslation();
  const isVertical = writingMode === 'vertical';

  return (
    <IconButton
      aria-pressed={isVertical}
      label={
        isVertical
          ? t('common.switchToHorizontalWriting')
          : t('common.switchToVerticalWriting')
      }
      onClick={toggleWritingMode}
    >
      {isVertical ? <HorizontalWritingIcon /> : <VerticalWritingIcon />}
    </IconButton>
  );
}
