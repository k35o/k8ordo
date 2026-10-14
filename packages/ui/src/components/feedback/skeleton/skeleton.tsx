import { clsx } from 'clsx';
import type { FC, HTMLAttributes } from 'react';

import styles from './skeleton.module.css';

const SHAPE = { rect: styles.rect, circle: styles.circle } as const;

const SIZE = {
  rect: { sm: styles.rectSm, md: styles.rectMd, lg: styles.rectLg },
  circle: { sm: styles.circleSm, md: styles.circleMd, lg: styles.circleLg },
} as const;

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
    className={clsx(
      styles.root,
      animate && styles.animate,
      SHAPE[shape],
      SIZE[shape][size],
    )}
  />
);
