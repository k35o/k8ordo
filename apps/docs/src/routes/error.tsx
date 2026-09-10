'use client';

import { usePathname } from '@k8ordo/router';

import { ErrorFallback } from '../components/error-fallback';
import { locales } from '../i18n';

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
  const pathname = usePathname();
  const locale = locales.delocalize(pathname).locale ?? locales.default;
  return (
    <ErrorFallback fullScreen locale={locale} resetErrorBoundary={reset} />
  );
}
