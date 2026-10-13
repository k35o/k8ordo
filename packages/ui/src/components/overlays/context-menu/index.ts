import { Content, Item } from '../dropdown-menu/dropdown-menu';
import { SubMenu } from '../dropdown-menu/sub-menu';
import { Root, Trigger } from './context-menu';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
// 中身（項目・サブメニュー・キー操作）は DropdownMenu と同じものを使い、
// 違うのは開き方と出す位置だけ。
export const ContextMenu = {
  Root,
  Trigger,
  Content,
  Item,
  SubMenu,
} as const;
