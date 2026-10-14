import { clsx } from 'clsx';
import type { FC, HTMLAttributes } from 'react';

import highContrast from '../../_internal/high-contrast.module.css';
import styles from './card.module.css';

type CardProps = {
  width?: 'full' | 'fit';
  variant?: 'shadow' | 'outline';
  interactive?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const VARIANT = {
  shadow: [styles.shadow, highContrast.edge],
  outline: styles.outline,
} as const;

const WIDTH = { full: styles.full, fit: styles.fit } as const;

export const Card: FC<CardProps> = ({
  children,
  width = 'full',
  variant = 'shadow',
  interactive = false,
  ...rest
}) => (
  <div
    {...rest}
    className={clsx(
      styles.root,
      VARIANT[variant],
      WIDTH[width],
      interactive && styles.interactive,
    )}
  >
    {children}
  </div>
);
