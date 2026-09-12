'use client';

import { usePathname } from '@k8ordo/router';

import { ErrorFallback } from '../../components/error-fallback';
import { locales } from '../../i18n';

/**
 * ロケール配下のページが throw したとき、layout の枠の内側に描かれる。
 * error.tsx は params を受け取らないので、ロケールは URL から取る（404 の
 * 1 枚と同じ理由で、レイアウトも同じ読み方をしている）。
 */
export default function LocaleError({
  error: _error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = locales.delocalize(pathname).locale ?? locales.default;
  return <ErrorFallback locale={locale} resetErrorBoundary={reset} />;
}
