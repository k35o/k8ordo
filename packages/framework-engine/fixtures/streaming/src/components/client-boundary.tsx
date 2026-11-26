'use client';

import { Suspense } from 'react';
import type { ReactNode } from 'react';

// ペイロードには <Suspense> と書かれず、この部品の要素として届く境界
export function ClientBoundary({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
