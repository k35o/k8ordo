'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';
import { cookies } from '@k8ordo/server/runtime';

import { addEntry, readEntries } from '../_data/entries.server';
import { guestbookSchema } from './guestbook-schema';

// `'use server'` と `.server` は別のことを言っている。ここは「クライアントから
// 呼べる、サーバーで動く関数」で、`.server` は「クライアントから届いてはいけない
// モジュール」。だからこのファイルは `.server` を名乗らず、秘密やデータは
// `.server` のモジュールに置いて import する。

// Server Action は async であることが React 側の要求で、中身が同期でも関数を
// 同期にはできない。
// oxlint-disable eslint/require-await, typescript/require-await
export async function sign(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  // 検証はスキーマ 1 つ。失敗したら per-field のエラーと入力値をそのまま
  // フォームに返す (JavaScript なしの再送でも入力が残る)
  const parsed = parseForm(guestbookSchema, formData);
  if (!parsed.success) return parsed.state;
  addEntry(parsed.data.name);
  // 署名した人を覚えておく。members/guard.ts はこの cookie を見て通す
  cookies().set('visitor', parsed.data.name);
  return {};
}

export async function listEntries(): Promise<readonly string[]> {
  return readEntries();
}
