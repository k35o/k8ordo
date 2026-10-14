import type { FC, ReactNode } from 'react';

import styles from './base.module.css';

export type BaseIconProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
};

const SIZE = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
  '2xl': styles.xxl,
  '3xl': styles.xxxl,
} as const;

export type IconRenderProps = {
  className: string;
  'aria-hidden': true;
  focusable: 'false';
};

export const BaseIcon: FC<
  BaseIconProps & {
    renderItem: (arg: IconRenderProps) => ReactNode;
  }
> = ({ size, renderItem }) =>
  renderItem({
    className: SIZE[size],
    // アイコンは装飾扱い(意味を持たせる場合は利用側が sr-only テキストで名前を付ける)
    'aria-hidden': true,
    focusable: 'false',
  });
