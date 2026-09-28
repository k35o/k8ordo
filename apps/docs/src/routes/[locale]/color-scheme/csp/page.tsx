import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeCsp;

const GUARD = `// src/routes/guard.ts (@k8ordo/server)
import { nonce, responseHeaders } from '@k8ordo/server/runtime';

export default function guard() {
  responseHeaders().set(
    'content-security-policy',
    \`script-src 'nonce-\${nonce()}' 'strict-dynamic'; object-src 'none'; base-uri 'none'\`,
  );
}`;

const LAYOUT = `// src/routes/layout.tsx (@k8ordo/server)
import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { nonce } from '@k8ordo/server/runtime';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorSchemeProvider nonce={nonce()}>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}`;

const VITE_CONFIG = `// vite.config.ts (@k8ordo/static)
import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});`;

const DEFAULT_DARK = `// src/routes/layout.tsx
<ColorSchemeProvider defaultPreference="dark">{children}</ColorSchemeProvider>

// vite.config.ts
'script-src': ["'self'", await colorSchemeScriptHash('dark')],`;

export default function ColorSchemeCspPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/csp">
      <DocSection description={t.blocked.description} title={t.blocked.title}>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.blocked.unsafeInline()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.nonce.description} title={t.nonce.title}>
        <CodeBlock code={GUARD} lang="ts" />
        <CodeBlock code={LAYOUT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.nonce.render()}</Rich>
        </p>
        <p className="text-sm">
          <LocaleAnchor path="/:locale/server/guards">
            <Rich>{t.nonce.link()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={t.hash.description} title={t.hash.title}>
        <CodeBlock code={VITE_CONFIG} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.hash.computed()}</Rich>
        </p>
        <p className="text-sm">
          <LocaleAnchor path="/:locale/static/deploy">
            <Rich>{t.hash.link()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={t.defaults.description} title={t.defaults.title}>
        <CodeBlock code={DEFAULT_DARK} lang="tsx" />
      </DocSection>
    </DocPage>
  );
}
