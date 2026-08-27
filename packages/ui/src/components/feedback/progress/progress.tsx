import type { CSSProperties, FC, HTMLAttributes } from 'react';

import { toPrecision } from './../../../internal/to-precision';

type Props = {
  value: number;
  max: number;
  min?: number;
  label?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'>;

export const Progress: FC<Props> = ({
  value,
  max,
  min = 0,
  label,
  ...rest
}) => {
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
