'use server';

import { greeted } from '../messages/greeting';

// Server Action は async であることが React 側の要求で、中身が同期でも関数を
// 同期にはできない。
// oxlint-disable eslint/require-await, typescript/require-await
export async function greet(
  _previous: string | null,
  formData: FormData,
): Promise<string> {
  // locales.run で囲まなくても、送った先のページ（/ja/greeting）のロケールで走る
  const name = formData.get('name');
  return greeted(typeof name === 'string' ? name : '');
}
