import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeCsp;

const LAYOUT = `import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { nonce } from '@k8ordo/framework/server';
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

const HASH = `import { colorSchemeScriptHash } from '@k8ordo/color-scheme';

const policy = \`script-src 'self' \${await colorSchemeScriptHash()}\`;`;

const DEFAULT_LAYOUT = `<ColorSchemeProvider defaultPreference="dark">
  {children}
</ColorSchemeProvider>`;

const DEFAULT_HASH = `const policy = \`script-src 'self' \${await colorSchemeScriptHash('dark')}\`;`;

export default function ColorSchemeCspPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/csp">
      <DocSection id="blocked" title={t.blockedTitle}>
        <p>
          <Rich>{t.blockedEffect()}</Rich>
        </p>
        <p>
          <Rich>{t.blockedFlash()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.blockedUnsafe()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="nonce" title={t.nonceTitle}>
        <CodeBlock
          callouts={{ 13: t.nonceCallout() }}
          code={LAYOUT}
          lang="tsx"
          marks={{ 13: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <p>
          <Rich>{t.nonceProp()}</Rich>
        </p>
        <p>
          <Rich>{t.nonceServerBefore()}</Rich>
          <LocaleAnchor path="/:locale/framework/csp">
            {t.frameworkLink()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="hash" title={t.hashTitle}>
        <CodeBlock code={HASH} lang="ts" marks={{ 3: 'highlight' }} />
        <p>
          <Rich>{t.hashFunction()}</Rich>
        </p>
        <p>
          <Rich>{t.hashComputed()}</Rich>
        </p>
        <p>
          <Rich>{t.hashStaticBefore()}</Rich>
          <LocaleAnchor path="/:locale/framework/csp">
            {t.frameworkLink()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="default" title={t.defaultTitle}>
        <CodeBlock
          code={DEFAULT_LAYOUT}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <CodeBlock code={DEFAULT_HASH} lang="ts" marks={{ 1: 'highlight' }} />
        <p>
          <Rich>{t.defaultSame()}</Rich>
        </p>
        <p>
          <Rich>{t.defaultNonce()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
