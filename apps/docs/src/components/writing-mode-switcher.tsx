'use client';

import {
  HorizontalWritingIcon,
  IconButton,
  VerticalWritingIcon,
} from '@k8ordo/ui';

import * as m from '../messages';
import { useWritingMode } from '../theme/writing-mode-context';

export function WritingModeSwitcher() {
  const { writingMode, toggleWritingMode } = useWritingMode();
  const isVertical = writingMode === 'vertical';

  return (
    <IconButton
      aria-pressed={isVertical}
      label={
        isVertical
          ? m.common.switchToHorizontalWriting()
          : m.common.switchToVerticalWriting()
      }
      onClick={toggleWritingMode}
    >
      {isVertical ? <HorizontalWritingIcon /> : <VerticalWritingIcon />}
    </IconButton>
  );
}
