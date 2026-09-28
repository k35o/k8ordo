import { Item, Root, Separator } from './toolbar';

export type { ToolbarItemProps } from './toolbar';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
export const Toolbar = { Root, Item, Separator } as const;
