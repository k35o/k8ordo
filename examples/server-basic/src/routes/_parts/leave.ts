'use server';

import { href } from '@k8ordo/router';
import { redirect } from '@k8ordo/server/runtime';

// 戻り値の代わりに redirect() で終わる action。JS なしの POST は 303 で、
// クライアント経由の呼び出しはペイロードの指示で、それぞれ products へ向かう。
// 行き先は URL なので href() で作る。Vite の base があればそれも付く
export async function leave(): Promise<void> {
  await Promise.resolve();
  redirect(href('/products'));
}
