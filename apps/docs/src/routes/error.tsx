'use client';

import { ErrorFallback } from '../components/error-fallback';

/**
 * ロケールのレイアウト自身（ヘッダーやプロバイダ）が throw したときの最後の
 * 受け皿。ルートレイアウトの <body> の中に、枠なしの全画面で描かれる。
 * ページの失敗はもう一段内側の routes/[locale]/error.tsx が先に受ける。
 */
export default function RootError({
  error: _error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return <ErrorFallback fullScreen resetErrorBoundary={reset} />;
}
