export type GapSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export const GAP_CLASS = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const satisfies Record<GapSize, string>;
