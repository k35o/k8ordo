import { clsx } from 'clsx';
import type { CSSProperties, FC, HTMLAttributes } from 'react';

import { getMessages } from '../../../i18n/current';
import { toPrecision } from './../../../internal/to-precision';

import highContrast from '../../_internal/high-contrast.module.css';
import styles from './progress.module.css';

type Props = {
  /** 省略すると、進み具合が分からない表示（indeterminate）になる。 */
  value?: number;
  max?: number;
  min?: number;
  label?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'>;

export const Progress: FC<Props> = ({
  value,
  max = 100,
  min = 0,
  label,
  ...rest
}) => {
  const messages = getMessages();

  if (value === undefined) {
    return (
      <div
        {...rest}
        className={clsx(
          styles.track,
          styles.indeterminateTrack,
          highContrast.edge,
        )}
      >
        <div
          aria-label={label ?? messages.loading}
          className={styles.indeterminate}
          role="progressbar"
        />
      </div>
    );
  }

  const percentage = toPrecision(((value - min) / (max - min)) * 100);
  return (
    <div
      {...rest}
      className={clsx(styles.track, highContrast.edge)}
      style={
        {
          '--progress-fill': `${percentage.toString()}%`,
        } as CSSProperties
      }
    >
      <div
        aria-label={label ?? `${percentage.toString()}%`}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={value}
        className={styles.fill}
        role="progressbar"
      />
    </div>
  );
};
