'use client';

import { usePathname } from '@k8ordo/router';

/**
 * クライアントコンポーネントから見た現在地。フレームワークの下ではブラウザに
 * ルート表が無いので、表を引かずにプラットフォームを読む usePathname が
 * 「今どこか」の答えになる。
 */
export function Where() {
  return <p data-testid="where">at {usePathname()}</p>;
}
