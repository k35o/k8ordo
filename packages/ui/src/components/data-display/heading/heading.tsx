import { clsx } from 'clsx';
import type { FC, HTMLAttributes } from 'react';

import styles from './heading.module.css';

type Props = {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
} & Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'style'>;

const LINE_CLAMP_CLASS = {
  1: styles.clamp1,
  2: styles.clamp2,
  3: styles.clamp3,
  4: styles.clamp4,
  5: styles.clamp5,
  6: styles.clamp6,
} as const;

export const Heading: FC<Props> = ({ children, level, lineClamp, ...rest }) => {
  const lineClampClass =
    lineClamp === undefined
      ? undefined
      : [styles.clamp, LINE_CLAMP_CLASS[lineClamp]];
  if (level === 'h1') {
    return (
      <h1 {...rest} className={clsx(styles.root, styles.h1, lineClampClass)}>
        {children}
      </h1>
    );
  }
  if (level === 'h2') {
    return (
      <h2 {...rest} className={clsx(styles.root, styles.h2, lineClampClass)}>
        {children}
      </h2>
    );
  }
  if (level === 'h3') {
    return (
      <h3 {...rest} className={clsx(styles.root, styles.h3, lineClampClass)}>
        {children}
      </h3>
    );
  }
  if (level === 'h4') {
    return (
      <h4 {...rest} className={clsx(styles.root, styles.h4, lineClampClass)}>
        {children}
      </h4>
    );
  }
  if (level === 'h5') {
    return (
      <h5 {...rest} className={clsx(styles.root, styles.h5, lineClampClass)}>
        {children}
      </h5>
    );
  }
  return (
    <h6 {...rest} className={clsx(styles.root, styles.h6, lineClampClass)}>
      {children}
    </h6>
  );
};
