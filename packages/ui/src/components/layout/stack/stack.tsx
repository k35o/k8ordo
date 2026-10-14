import { clsx } from 'clsx';
import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

import { GAP_CLASS } from '../_shared/gap';
import type { GapSize } from '../_shared/gap';
import { PADDING_CLASS } from '../_shared/padding';
import type { PaddingSize } from '../_shared/padding';

import styles from './stack.module.css';

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
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
} as const;

const JUSTIFY_CLASS = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
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
    className={clsx(
      styles.root,
      direction === 'row' ? styles.row : styles.column,
      GAP_CLASS[gap],
      padding && PADDING_CLASS[padding],
      align && ALIGN_CLASS[align],
      justify && JUSTIFY_CLASS[justify],
    )}
  >
    {children}
  </div>
);
