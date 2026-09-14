'use client';

import { ErrorFallback } from '../../components/error-fallback';

/**
 * ロケール配下のページが throw したとき、layout の枠の内側に描かれる。
 * error.tsx は params を受け取らないが、文言は自分で URL からロケールを
 * 読むので、ここで渡すものは無い。
 */
export default function LocaleError({
  error: _error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return <ErrorFallback resetErrorBoundary={reset} />;
}
