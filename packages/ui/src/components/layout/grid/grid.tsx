import { clsx } from 'clsx';
import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

import { GAP_CLASS } from '../_shared/gap';
import type { GapSize } from '../_shared/gap';

import styles from './grid.module.css';

export type GridProps = PropsWithChildren<
  {
    /**
     * 列数。`1`〜`6` の固定列、`'auto-fill'` / `'auto-fit'` の自動列を選べる。
     * 自動列の場合は `minItemSize` で各セルの最小幅（`--spacing` の段数）を指定する。
     */
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto-fill' | 'auto-fit';
    /** `cols` が `auto-fill` / `auto-fit` のときの各セルの最小サイズ（`--spacing` の段数。`24` は 6rem）。 */
    minItemSize?: 24 | 32 | 40 | 48 | 64 | 80;
    gap?: GapSize;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>
>;

const COLS_CLASS = {
  1: styles.cols1,
  2: styles.cols2,
  3: styles.cols3,
  4: styles.cols4,
  5: styles.cols5,
  6: styles.cols6,
} as const;

const AUTO_FILL_CLASS = {
  24: styles.autoFill24,
  32: styles.autoFill32,
  40: styles.autoFill40,
  48: styles.autoFill48,
  64: styles.autoFill64,
  80: styles.autoFill80,
} as const;

const AUTO_FIT_CLASS = {
  24: styles.autoFit24,
  32: styles.autoFit32,
  40: styles.autoFit40,
  48: styles.autoFit48,
  64: styles.autoFit64,
  80: styles.autoFit80,
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
    className={clsx(
      styles.root,
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
