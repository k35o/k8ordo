import type { FC, HTMLAttributes } from 'react';

import { cn } from './../../../helpers/cn';

type Props = {
  orientation?: 'horizontal' | 'vertical';
  color?: 'base' | 'mute' | 'subtle';
} & Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'role' | 'aria-orientation' | 'className' | 'style'
>;

export const Separator: FC<Props> = ({
  orientation = 'horizontal',
  color = 'base',
  ...rest
}) => {
  const isVertical = orientation === 'vertical';
  return (
    <span
      {...rest}
      aria-orientation={orientation}
      className={cn(
        'block',
        isVertical ? 'block-full inline-px' : 'block-px inline-full',
        color === 'base' && 'bg-border-base',
        color === 'mute' && 'bg-border-mute',
        color === 'subtle' && 'bg-border-subtle',
      )}
      role="separator"
    />
  );
};
