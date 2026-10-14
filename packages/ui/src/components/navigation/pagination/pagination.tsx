'use client';

import type { FC, HTMLAttributes, Ref } from 'react';

import { getMessages } from '../../../i18n/current';
import { Button } from '../../buttons/button';
import { ChevronIcon } from '../../icons';

import styles from './pagination.module.css';

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
  const messages = getMessages();
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const isFirst = safeCurrent <= 1;
  const isLast = safeCurrent >= safeTotal;

  return (
    <nav {...rest} aria-label={ariaLabel ?? messages.paginationLabel} ref={ref}>
      <div className={styles.row}>
        <Button
          color="base"
          disabled={disabled || isFirst}
          onClick={() => {
            onChange(safeCurrent - 1);
          }}
          size="sm"
          startIcon={
            <span className={styles.chevron}>
              <ChevronIcon direction="left" size="sm" />
            </span>
          }
          variant="skeleton"
        >
          {prevLabel ?? messages.paginationPrevious}
        </Button>
        <p aria-live="polite" className={styles.status}>
          <span className={styles.current}>{safeCurrent}</span>
          <span className={styles.slash}>/</span>
          <span>{safeTotal}</span>
        </p>
        <Button
          color="base"
          disabled={disabled || isLast}
          endIcon={
            <span className={styles.chevron}>
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
