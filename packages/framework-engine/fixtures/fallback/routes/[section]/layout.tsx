import type { ReactNode } from 'react';

// 手書きの Standard Schema。closed という区分だけを拒む
export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => {
      const { section } = value as { section: string };
      return section === 'closed'
        ? { issues: [{ message: 'this section is closed' }] }
        : { value: { section } };
    },
  },
} as const;

export default function SectionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Readonly<Record<string, string>>;
}) {
  return (
    <section
      data-keys={Object.keys(params).join(',')}
      data-section={params['section']}
    >
      {children}
    </section>
  );
}
