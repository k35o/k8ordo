import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

import { GAP_CLASS } from '../_shared/gap';
import type { GapSize } from '../_shared/gap';
import { PADDING_CLASS } from '../_shared/padding';
import type { PaddingSize } from '../_shared/padding';
import { cn } from './../../../helpers/cn';

export type StackProps = PropsWithChildren<
  {
    direction?: 'row' | 'column';
    gap?: GapSize;
    /** Inner padding on all sides. Stack has no padding by default. */
    padding?: PaddingSize;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between';
  } & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>
>;

const ALIGN_CLASS = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

const JUSTIFY_CLASS = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const;

export const Stack: FC<StackProps> = ({
  direction = 'column',
  gap = 'md',
  padding,
  align,
  justify,
  children,
  ...rest
}) => (
  <div
    {...rest}
    className={cn(
      'flex',
      direction === 'row' ? 'flex-row' : 'flex-col',
      GAP_CLASS[gap],
      padding && PADDING_CLASS[padding],
      align && ALIGN_CLASS[align],
      justify && JUSTIFY_CLASS[justify],
    )}
  >
    {children}
  </div>
);
