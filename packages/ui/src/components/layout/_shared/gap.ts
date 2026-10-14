import styles from './gap.module.css';

export type GapSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export const GAP_CLASS = {
  none: styles.none,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
} as const satisfies Record<GapSize, string>;
