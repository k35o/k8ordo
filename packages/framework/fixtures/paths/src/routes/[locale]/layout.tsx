import type { ReactNode } from 'react';

export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => ({
      value: value as { readonly locale: string },
    }),
  },
} as const;

export default function LocaleLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return children;
}
