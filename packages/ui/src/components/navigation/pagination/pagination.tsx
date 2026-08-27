'use client';

import type { FC, HTMLAttributes, Ref } from 'react';

import { useMessages } from '../../../i18n/context';
import { Button } from '../../buttons/button';
import { ChevronIcon } from '../../icons';

type Props = {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  'aria-label'?: string;
  ref?: Ref<HTMLElement>;
} & Omit<
  HTMLAttributes<HTMLElement>,
  'className' | 'style' | 'onChange' | 'children'
>;

export const Pagination: FC<Props> = ({
  totalPages,
  currentPage,
  onChange,
  disabled = false,
  prevLabel,
  nextLabel,
  'aria-label': ariaLabel,
  ref,
  ...rest
}) => {
  const messages = useMessages();
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const isFirst = safeCurrent <= 1;
  const isLast = safeCurrent >= safeTotal;

  return (
    <nav {...rest} aria-label={ariaLabel ?? messages.paginationLabel} ref={ref}>
      <div className="flex items-center justify-center gap-2">
        <Button
          color="base"
          disabled={disabled || isFirst}
          onClick={() => {
            onChange(safeCurrent - 1);
          }}
          size="sm"
          startIcon={
            <span className="vertical:rotate-90 inline-flex">
              <ChevronIcon direction="left" size="sm" />
            </span>
          }
          variant="skeleton"
        >
          {prevLabel ?? messages.paginationPrevious}
        </Button>
        <p
          aria-live="polite"
          className="text-fg-mute px-3 text-sm tabular-nums"
        >
          <span className="text-fg-base">{safeCurrent}</span>
          <span className="mx-1">/</span>
          <span>{safeTotal}</span>
        </p>
        <Button
          color="base"
          disabled={disabled || isLast}
          endIcon={
            <span className="vertical:rotate-90 inline-flex">
              <ChevronIcon direction="right" size="sm" />
            </span>
          }
          onClick={() => {
            onChange(safeCurrent + 1);
          }}
          size="sm"
          variant="skeleton"
        >
          {nextLabel ?? messages.paginationNext}
        </Button>
      </div>
    </nav>
  );
};
