'use client';

import { usePathname, usePendingPathname } from '@k8ordo/router';

/**
 * クライアントコンポーネントから見た現在地。フレームワークの下ではブラウザに
 * ルート表が無いので、表を引かずにプラットフォームを読む usePathname が
 * 「今どこか」の答えになる。遷移中は usePendingPathname が行き先を名指す
 */
export function Where() {
  const pending = usePendingPathname();
  return (
    <p data-testid="where">
      at {usePathname()}
      {pending === null ? null : (
        <span data-testid="pending"> (loading {pending})</span>
      )}
    </p>
  );
}
