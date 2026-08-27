import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

import { GAP_CLASS } from '../_shared/gap';
import type { GapSize } from '../_shared/gap';
import { cn } from './../../../helpers/cn';

export type GridProps = PropsWithChildren<
  {
    /**
     * 列数。`1`〜`6` の固定列、`'auto-fill'` / `'auto-fit'` の自動列を選べる。
     * 自動列の場合は `minItemSize` で各セルの最小幅（Tailwind spacing 単位）を指定する。
     */
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto-fill' | 'auto-fit';
    /** `cols` が `auto-fill` / `auto-fit` のときの各セルの最小サイズ（Tailwind spacing）。 */
    minItemSize?: 24 | 32 | 40 | 48 | 64 | 80;
    gap?: GapSize;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>
>;

const COLS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
} as const;

const AUTO_FILL_CLASS = {
  24: 'grid-cols-auto-fill-24',
  32: 'grid-cols-auto-fill-32',
  40: 'grid-cols-auto-fill-40',
  48: 'grid-cols-auto-fill-48',
  64: 'grid-cols-auto-fill-64',
  80: 'grid-cols-auto-fill-80',
} as const;

const AUTO_FIT_CLASS = {
  24: 'grid-cols-auto-fit-24',
  32: 'grid-cols-auto-fit-32',
  40: 'grid-cols-auto-fit-40',
  48: 'grid-cols-auto-fit-48',
  64: 'grid-cols-auto-fit-64',
  80: 'grid-cols-auto-fit-80',
} as const;

export const Grid: FC<GridProps> = ({
  cols = 'auto-fill',
  minItemSize = 48,
  gap = 'md',
  children,
  ...rest
}) => (
  <div
    {...rest}
    className={cn(
      'grid',
      GAP_CLASS[gap],
      typeof cols === 'number'
        ? COLS_CLASS[cols]
        : cols === 'auto-fill'
          ? AUTO_FILL_CLASS[minItemSize]
          : AUTO_FIT_CLASS[minItemSize],
    )}
  >
    {children}
  </div>
);
