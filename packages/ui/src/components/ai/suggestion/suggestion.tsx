'use client';

import type { FC, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { useMessages } from '../../../i18n/context';
import { FOCUS_RING } from '../../_internal/focus-ring';

type ListProps = {
  label?: string;
  children: ReactNode;
};

const List: FC<ListProps> = ({ label, children }) => {
  const messages = useMessages();

  return (
    <div
      aria-label={label ?? messages.suggestions}
      className="flex flex-wrap gap-2"
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

const Item: FC<ItemProps> = ({ value, onSelect, children }) => (
  <button
    className={cn(
      'rounded-full border border-border-base bg-bg-subtle px-3 py-1.5 text-sm text-fg-base transition-colors duration-150 ease-out hover:bg-bg-mute',
      FOCUS_RING,
    )}
    onClick={() => {
      onSelect?.(value);
    }}
    type="button"
  >
    {children ?? value}
  </button>
);

export const Suggestion = { List, Item } as const;
