'use client';

import type { FC, PropsWithChildren } from 'react';

import { FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';
import { ChevronIcon } from '../../icons';
import { cn } from './../../../helpers/cn';
import { useItemId, useOpen, useToggleOpen } from './context';

export const AccordionButton: FC<PropsWithChildren> = ({ children }) => {
  const id = useItemId();
  const open = useOpen();
  const toggleOpen = useToggleOpen();

  return (
    <button
      aria-controls={`${id}-panel`}
      aria-expanded={open}
      className={cn(
        'flex w-full cursor-pointer items-center justify-between rounded-md p-4 text-fg-base transition-colors vertical:h-full',
        'hover:bg-primary-bg-subtle hover:text-primary-fg',
        FOCUS_RING_NO_BORDER,
      )}
      id={`${id}-button`}
      onClick={toggleOpen}
      type="button"
    >
      {children}
      <span
        className={cn(
          'transition-transform duration-150',
          !open && 'vertical:rotate-90',
          open && 'rotate-180 vertical:-rotate-90',
        )}
      >
        <ChevronIcon direction="down" />
      </span>
    </button>
  );
};
