'use server';

import { step } from './tally';

// Server Component が import する Server Action。RSC プラグインの
// server-references も同じモジュールを動的に import する
export async function touch(): Promise<void> {
  // 何もしない
}

// Server Action は async であることが React 側の要求で、中身が同期でも関数を
// 同期にはできない。
// oxlint-disable-next-line eslint/require-await, typescript/require-await
export async function bump(): Promise<number> {
  return step();
}
