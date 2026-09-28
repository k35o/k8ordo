import { Dropzone, ItemList, Root, Trigger } from './file-field';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
export const FileField = { Root, Trigger, Dropzone, ItemList } as const;
