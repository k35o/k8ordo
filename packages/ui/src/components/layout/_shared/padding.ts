export type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export const PADDING_CLASS = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const satisfies Record<PaddingSize, string>;
