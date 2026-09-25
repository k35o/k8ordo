import type { FC, HTMLAttributes } from 'react';

import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
import { cn } from './../../../helpers/cn';

type CardProps = {
  width?: 'full' | 'fit';
  variant?: 'shadow' | 'outline';
  interactive?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export const Card: FC<CardProps> = ({
  children,
  width = 'full',
  variant = 'shadow',
  interactive = false,
  ...rest
}) => (
  <div
    {...rest}
    className={cn(
      'rounded-xl',
      variant === 'shadow' && ['shadow-sm', HIGH_CONTRAST_EDGE],
      variant === 'outline' && 'border border-border-mute',
      width === 'full' && 'w-full',
      width === 'fit' && 'w-fit',
      interactive &&
        'motion-safe:transition-transform hover:motion-safe:scale-[1.02] active:motion-safe:scale-[0.98]',
      'bg-bg-base',
    )}
  >
    {children}
  </div>
);
