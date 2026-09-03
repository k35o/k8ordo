import type { ReactNode } from 'react';

// route group: URL には出ないが、この区画だけのレイアウトを持てる
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <section data-testid="docs-shell">
      <p>docs</p>
      {children}
    </section>
  );
}
