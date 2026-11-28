import type { ReactNode } from 'react';

export default function PathLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { path: readonly string[] };
}) {
  return <section data-layout={params.path.join('|')}>{children}</section>;
}
