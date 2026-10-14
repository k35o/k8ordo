import { clsx } from 'clsx';
import type { FC, OutputHTMLAttributes } from 'react';

import { getMessages } from '../../../i18n/current';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './spinner.module.css';

const SIZE = { sm: styles.sm, md: styles.md, lg: styles.lg } as const;

type Props = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
} & Omit<
  OutputHTMLAttributes<HTMLOutputElement>,
  'children' | 'aria-label' | 'className' | 'style'
>;

export const Spinner: FC<Props> = ({ label, size = 'md', ...rest }) => {
  const messages = getMessages();
  const resolvedLabel = label ?? messages.loading;

  return (
    <output
      {...rest}
      aria-label={resolvedLabel}
      aria-live="polite"
      className={styles.root}
    >
      <span aria-hidden className={clsx(styles.indicator, SIZE[size])} />
      <span className={srOnly.srOnly}>{resolvedLabel}</span>
    </output>
  );
};
