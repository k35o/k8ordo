'use server';

// `'use server'` と `.server` は別のことを言っている。ここは「クライアントから
// 呼べる、サーバーで動く関数」で、`.server` は「クライアントから届いてはいけない
// モジュール」。だからこのファイルは `.server` を名乗らない。
const entries: string[] = [];

// Server Action は async であることが React 側の要求で、中身が同期でも関数を
// 同期にはできない。
// oxlint-disable eslint/require-await, typescript/require-await
export async function sign(
  _previous: string | null,
  formData: FormData,
): Promise<string | null> {
  const value = formData.get('name');
  const name = typeof value === 'string' ? value.trim() : '';
  if (name === '') return 'name is required';
  entries.push(name);
  return null;
}

export async function listEntries(): Promise<readonly string[]> {
  return entries;
}
