import type { FC, ReactNode } from 'react';

import { cn } from './../../helpers/cn';

export type BaseIconProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
};

const sizeClass: Record<BaseIconProps['size'], string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-10',
  '2xl': 'size-12',
  '3xl': 'size-14',
};

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
    className: cn(sizeClass[size]),
    // アイコンは装飾扱い(意味を持たせる場合は利用側が sr-only テキストで名前を付ける)
    'aria-hidden': true,
    focusable: 'false',
  });
