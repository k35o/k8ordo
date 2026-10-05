import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { signedSection } from '../../../../components/framework-guide/csp';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.serverCsp;

const GUARD = `import { nonce, responseHeaders } from '@k8ordo/server/runtime';

export default function guard() {
  const policy = [
    \`script-src 'nonce-\${nonce()}' 'strict-dynamic'\`,
    "object-src 'none'",
    "base-uri 'none'",
  ].join('; ');
  responseHeaders().set('content-security-policy', policy);
}`;

const LAYOUT = `import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { nonce } from '@k8ordo/server/runtime';
import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorSchemeProvider nonce={nonce()}>
          {children}
        </ColorSchemeProvider>
      </body>
    </html>
  );
}`;

export default function ServerCspPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/csp">
      {signedSection()}

      <DocSection
        description={t.guardDescription}
        id="guard"
        title={t.guardTitle}
      >
        <CodeBlock
          code={GUARD}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="src/routes/guard.ts"
        />
        <p>
          <Rich>{t.guardRoot()}</Rich>
        </p>
        <p>
          <Rich>{t.guardDynamic()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.signDescription} id="sign" title={t.signTitle}>
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 13: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <p>
          <Rich>{t.signRender()}</Rich>
        </p>
        <p>
          <Rich>{t.signOutside()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.cacheDescription}
        id="cache"
        title={t.cacheTitle}
      />
    </DocPage>
  );
}
