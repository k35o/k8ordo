'use client';

import { IconButton } from '@k8ordo/ui';
import { TextHorizontalIcon, TextVerticalIcon } from '@k8ordo/ui/icons';

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
      {isVertical ? <TextHorizontalIcon /> : <TextVerticalIcon />}
    </IconButton>
  );
}
