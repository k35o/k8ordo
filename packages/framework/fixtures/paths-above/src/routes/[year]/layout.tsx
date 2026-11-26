import type { ReactNode } from 'react';

// z.object({ year: z.coerce.number() }) を手で書く。このパッケージは zod に依存しない
export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => {
      const { year } = value as { readonly year: string };
      return /^\d+$/u.test(year)
        ? { value: { year: Number(year) } }
        : { issues: [{ message: `${year} is not a year` }] };
    },
  },
} as const;

export default function YearLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return children;
}
