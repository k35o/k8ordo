import { Content, PublicContent, PublicRoot, Root, Trigger } from './popover';

export type { PopoverTriggerProps } from './hooks';
export { useOpenContext } from './popover';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
export const Popover = {
  Root: PublicRoot,
  Content: PublicContent,
  Trigger,
} as const;

// role・renderItem・animation を選べる元の部品。Tooltip、DropdownMenu、
// ContextMenu、ListBox が使い、パッケージの外には出さない。
export const PopoverBase = { Root, Content, Trigger } as const;
