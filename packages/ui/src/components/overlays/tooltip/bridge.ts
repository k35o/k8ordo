import { clsx } from 'clsx';

import type { Placement } from '../../../types/variables';

import styles from './bridge.module.css';

const BRIDGE_BY_SIDE = {
  top: styles.top,
  bottom: styles.bottom,
  left: styles.left,
  right: styles.right,
} as const;

// 要求 placement 基準の辺に付ける。flip した場合は closeDelay 側が渡りを補う。
export const bridgeClass = (placement: Placement): string => {
  const side = (placement.split('-')[0] ?? 'bottom') as
    | 'top'
    | 'bottom'
    | 'left'
    | 'right';
  return clsx(styles.bridge, BRIDGE_BY_SIDE[side]);
};
