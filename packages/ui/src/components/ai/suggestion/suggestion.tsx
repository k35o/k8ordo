'use client';

import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './suggestion.module.css';

type ListProps = {
  label?: string;
  children: ReactNode;
};

export const List: FC<ListProps> = ({ label, children }) => {
  const messages = getMessages();

  return (
    <div
      aria-label={label ?? messages.suggestions}
      className={styles.list}
      role="group"
    >
      {children}
    </div>
  );
};

type ItemProps = {
  value: string;
  onSelect?: (value: string) => void;
  children?: ReactNode;
};

export const Item: FC<ItemProps> = ({ value, onSelect, children }) => (
  <button
    className={clsx(styles.item, focusRing.ring)}
    onClick={() => {
      onSelect?.(value);
    }}
    type="button"
  >
    {children ?? value}
  </button>
);
