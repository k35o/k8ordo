// 枠（layout の client コンポーネント）とページ a の client コンポーネントが
// 両方 import する、'use client' でないモジュール
export function sharedMark(count: number): string {
  let mark = 'MARK_SHARED';
  for (let i = 0; i < count; i += 1) mark += '!';
  return mark;
}
