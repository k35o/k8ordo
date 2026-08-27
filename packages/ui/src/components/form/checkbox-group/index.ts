import { Checkbox } from '../checkbox';
import { CheckboxGroupRoot } from './checkbox-group';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// スプレッドでプロパティをコピーできないため、直接参照で合成する。
export const CheckboxGroup = {
  Root: CheckboxGroupRoot,
  Item: Checkbox,
} as const;
