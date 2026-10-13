import { Content, IconTrigger, Item, Root, Trigger } from './dropdown-menu';
import { SubMenu } from './sub-menu';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
export const DropdownMenu = {
  Root,
  Content,
  Item,
  SubMenu,
  Trigger,
  IconTrigger,
} as const;
