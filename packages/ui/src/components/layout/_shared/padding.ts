import styles from './padding.module.css';

export type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export const PADDING_CLASS = {
  none: styles.none,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
} as const satisfies Record<PaddingSize, string>;
