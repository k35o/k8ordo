'use client';

import type { CSSProperties, FC, HTMLAttributes } from 'react';

import { useMessages } from '../../../i18n/context';
import { toPrecision } from './../../../internal/to-precision';

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
  const messages = useMessages();

  if (value === undefined) {
    return (
      <div
        {...rest}
        className="bg-bg-emphasize vertical:inline-48 relative overflow-hidden rounded-full block-4 inline-full"
      >
        <div
          aria-label={label ?? messages.loading}
          className="ao-progress-indeterminate bg-primary-bg rounded-full"
          role="progressbar"
        />
      </div>
    );
  }

  const percentage = toPrecision(((value - min) / (max - min)) * 100);
  return (
    <div
      {...rest}
      className="bg-bg-emphasize vertical:inline-48 rounded-full block-4 inline-full"
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
        className="bg-primary-bg rounded-full transition-[inline-size] block-full inline-(--progress-fill)"
        role="progressbar"
      />
    </div>
  );
};
