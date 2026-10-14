'use client';

import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';

import { ChevronIcon } from '../../icons';
import { useItemId, useOpen, useToggleOpen } from './context';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './accordion-button.module.css';

export const AccordionButton: FC<PropsWithChildren> = ({ children }) => {
  const id = useItemId();
  const open = useOpen();
  const toggleOpen = useToggleOpen();

  return (
    <button
      aria-controls={`${id}-panel`}
      aria-expanded={open}
      className={clsx(styles.root, focusRing.ringNoBorder)}
      id={`${id}-button`}
      onClick={toggleOpen}
      type="button"
    >
      {children}
      <span className={clsx(styles.chevron, open && styles.open)}>
        <ChevronIcon direction="down" />
      </span>
    </button>
  );
};
