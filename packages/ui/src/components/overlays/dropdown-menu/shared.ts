import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';

export const panelClass =
  'bg-bg-raised border-border-subtle vertical:min-w-0 vertical:min-h-40 flex min-w-40 flex-col rounded-lg border py-2 shadow-md';

export const itemClass = cn(
  'w-full px-2 py-1 text-left transition-colors',
  'hover:bg-bg-subtle',
  'focus-visible:bg-bg-subtle focus-visible:outline-hidden',
);

// Content が roving tabindex 用の index を子項目へ注入するためのヘルパー。
export const cloneWithIndex = (children: ReactNode): ReactNode =>
  Children.toArray(children).map((child, index) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<{ index?: number }>, {
          index,
        })
      : child,
  );
