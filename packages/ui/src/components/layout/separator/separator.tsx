import { clsx } from 'clsx';
import type { FC, HTMLAttributes } from 'react';

import styles from './separator.module.css';

type Props = {
  orientation?: 'horizontal' | 'vertical';
  color?: 'base' | 'mute' | 'subtle';
} & Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'role' | 'aria-orientation' | 'className' | 'style'
>;

const COLOR = {
  base: styles.base,
  mute: styles.mute,
  subtle: styles.subtle,
} as const;

export const Separator: FC<Props> = ({
  orientation = 'horizontal',
  color = 'base',
  ...rest
}) => (
  <span
    {...rest}
    aria-orientation={orientation}
    className={clsx(
      styles.root,
      orientation === 'vertical' ? styles.vertical : styles.horizontal,
      COLOR[color],
    )}
    role="separator"
  />
);
