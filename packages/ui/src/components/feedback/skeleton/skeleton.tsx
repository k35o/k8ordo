import type { FC, HTMLAttributes } from 'react';

import { cn } from '../../../helpers/cn';

type Props = {
  animate?: boolean;
  shape?: 'rect' | 'circle';
  size?: 'sm' | 'md' | 'lg';
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'>;

export const Skeleton: FC<Props> = ({
  animate = true,
  shape = 'rect',
  size = 'md',
  ...rest
}) => (
  <div
    {...rest}
    aria-hidden
    className={cn(
      'bg-bg-mute',
      animate && 'animate-pulse',
      shape === 'rect' && 'rounded-lg',
      shape === 'rect' && size === 'sm' && 'h-3 w-24',
      shape === 'rect' && size === 'md' && 'h-4 w-40',
      shape === 'rect' && size === 'lg' && 'h-5 w-56',
      shape === 'circle' && 'rounded-full',
      shape === 'circle' && size === 'sm' && 'size-8',
      shape === 'circle' && size === 'md' && 'size-12',
      shape === 'circle' && size === 'lg' && 'size-16',
    )}
  />
);
