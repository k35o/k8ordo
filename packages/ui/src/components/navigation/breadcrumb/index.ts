import { Item, Link, List, Separator } from './breadcrumb';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
export const Breadcrumb = {
  List,
  Item,
  Separator,
  Link,
} as const;
