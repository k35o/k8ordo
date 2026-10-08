import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeCsp;

const GUARD = `import { nonce, responseHeaders } from '@k8ordo/framework/server';

export default function guard() {
  const policy = [
    \`script-src 'nonce-\${nonce()}' 'strict-dynamic'\`,
    "object-src 'none'",
    "base-uri 'none'",
  ].join('; ');
  responseHeaders().set('content-security-policy', policy);
}`;

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

const VITE_CONFIG = `import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});`;

const DEFAULT_LAYOUT = `<ColorSchemeProvider defaultPreference="dark">
  {children}
</ColorSchemeProvider>`;

const DEFAULT_CONFIG = `csp: {
  'script-src': ["'self'", await colorSchemeScriptHash('dark')],
},`;

export default function ColorSchemeCspPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/csp">
      <DocSection
        description={t.blockedDescription}
        id="blocked"
        title={t.blockedTitle}
      >
        <p>
          <Rich>{t.blockedFlash()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.blockedUnsafe()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.nonceDescription}
        id="nonce"
        title={t.nonceTitle}
      >
        <CodeBlock
          code={GUARD}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="routes/guard.ts"
        />
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 13: 'highlight' }}
          title="routes/layout.tsx"
        />
        <p>
          <Rich>{t.nonceRender()}</Rich>
        </p>
        <p>
          <Rich>{t.nonceCache()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/framework/csp">
            {t.nonceLink()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={t.hashDescription} id="hash" title={t.hashTitle}>
        <CodeBlock
          code={VITE_CONFIG}
          lang="ts"
          marks={{ 10: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.hashMeta()}</Rich>
        </p>
        <p>
          <Rich>{t.hashStrictDynamic()}</Rich>
        </p>
        <p>
          <Rich>{t.hashComputed()}</Rich>
        </p>
        <p>
          <Rich>{t.hashHeader()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/framework/csp">
            {t.hashLink()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.defaultDescription}
        id="default"
        title={t.defaultTitle}
      >
        <CodeBlock
          code={DEFAULT_LAYOUT}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="routes/layout.tsx"
        />
        <CodeBlock
          code={DEFAULT_CONFIG}
          lang="ts"
          marks={{ 2: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.defaultNonce()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
