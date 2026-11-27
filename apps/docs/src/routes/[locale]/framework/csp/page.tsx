import { Note, Pitfall } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkCsp;

const PREPAINT_TEXT = `import { densityState } from '../state';

export const densityScript = \`(() => {
  const s = \${densityState.inlineRead()};
  if (s && s.density === 'compact') {
    document.documentElement.dataset.density = 'compact';
  }
})();\`;`;

const PREPAINT_COMPONENT = `'use client';

import { densityScript } from '../lib/density-script';

export function DensityScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce}>{densityScript}</script>;
}`;

const PREPAINT_HASH = `import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { densityScript } from './src/lib/density-script';

const hashOf = async (text: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return \`'sha256-\${btoa(String.fromCodePoint(...new Uint8Array(digest)))}'\`;
};

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      site: 'https://example.com',
      csp: {
        'script-src': [
          "'self'",
          await colorSchemeScriptHash(),
          await hashOf(densityScript),
        ],
      },
    }),
  ],
});`;

const OPTION_CONFIG = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      site: 'https://example.com',
      csp: {
        'script-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});`;

const OWN_CONFIG = `import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      site: 'https://example.com',
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});`;

const GUARD = `import { nonce, responseHeaders } from '@k8ordo/framework/server';

export default function guard() {
  const scripts = [\`'nonce-\${nonce()}'\`, "'strict-dynamic'"];
  if (import.meta.env.DEV) scripts.push("'unsafe-eval'");
  const policy = [
    \`script-src \${scripts.join(' ')}\`,
    "object-src 'none'",
    "base-uri 'none'",
  ].join('; ');
  responseHeaders().set('content-security-policy', policy);
}`;

const LAYOUT = `import {
  ColorSchemeProvider,
  ColorSchemeScript,
} from '@k8ordo/color-scheme';
import { nonce } from '@k8ordo/framework/server';
import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript nonce={nonce()} />
      </head>
      <body>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}`;

export default function FrameworkCspPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/csp">
      <DocSection id="signed" title={t.signedTitle}>
        <p>
          <Rich>{t.signedScripts()}</Rich>
        </p>
        <p>
          <Rich>{t.signedStyle()}</Rich>
        </p>
      </DocSection>

      <DocSection id="static" title={t.staticTitle}>
        <p>
          <Rich>{t.staticLead()}</Rich>
        </p>
        <DocSubsection id="option" title={t.optionTitle}>
          <CodeBlock
            code={OPTION_CONFIG}
            lang="ts"
            marks={{
              9: 'highlight',
              10: 'highlight',
              11: 'highlight',
              12: 'highlight',
              13: 'highlight',
            }}
            title="vite.config.ts"
          />
          <p>
            <Rich>{t.optionShape()}</Rich>
          </p>
          <p>
            <Rich>{t.optionHash()}</Rich>
          </p>
          <p>
            <Rich>{t.optionNone()}</Rich>
          </p>
          <p>
            <Rich>{t.optionStyle()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="own" title={t.ownTitle}>
          <CodeBlock
            code={OWN_CONFIG}
            lang="ts"
            marks={{ 1: 'highlight', 11: 'highlight' }}
            title="vite.config.ts"
          />
          <p>
            <Rich>{t.ownHash()}</Rich>
          </p>
          <p>
            <Rich>{t.ownPreference()}</Rich>
          </p>
          <p>
            <Rich>{t.ownRefused()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="refused" title={t.refusedTitle}>
          <p>
            <Rich>{t.refusedDynamic()}</Rich>
          </p>
          <p>
            <Rich>{t.refusedMeta()}</Rich>
          </p>
          <p>
            <Rich>{t.refusedReportTo()}</Rich>
          </p>
          <p>
            <Rich>{t.refusedHeaderScripts()}</Rich>
          </p>
          <p>
            <Rich>{t.refusedHeaderStyle()}</Rich>
          </p>
          <Pitfall>
            <p>
              <Rich>{t.refusedWhen()}</Rich>
            </p>
          </Pitfall>
        </DocSubsection>
      </DocSection>

      <DocSection id="server" title={t.serverTitle}>
        <p>
          <Rich>{t.serverLead()}</Rich>
        </p>
        <DocSubsection id="guard" title={t.guardTitle}>
          <CodeBlock
            code={GUARD}
            lang="ts"
            marks={{ 4: 'highlight', 5: 'highlight', 11: 'highlight' }}
            title="src/routes/guard.ts"
          />
          <p>
            <Rich>{t.guardNonce()}</Rich>
          </p>
          <Note>
            <p>
              <Rich>{t.guardDev()}</Rich>
            </p>
          </Note>
          <p>
            <Rich>{t.guardRoot()}</Rich>
          </p>
          <p>
            <Rich>{t.guardDynamic()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="sign" title={t.signTitle}>
          <CodeBlock
            code={LAYOUT}
            lang="tsx"
            marks={{ 16: 'highlight' }}
            title="src/routes/layout.tsx"
          />
          <p>
            <Rich>{t.signProvider()}</Rich>
          </p>
          <p>
            <Rich>{t.signStyle()}</Rich>
          </p>
          <p>
            <Rich>{t.signStylePrecedence()}</Rich>
          </p>
          <p>
            <Rich>{t.signRender()}</Rich>
          </p>
          <p>
            <Rich>{t.signOutside()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="cache" title={t.cacheTitle}>
          <p>
            <Rich>{t.cacheShared()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection id="prepaint" title={t.prepaintTitle}>
        <CodeBlock
          code={PREPAINT_TEXT}
          lang="ts"
          marks={{ 4: 'highlight' }}
          title="src/lib/density-script.ts"
        />
        <p>
          <Rich>{t.prepaintWhere()}</Rich>
        </p>
        <CodeBlock
          code={PREPAINT_COMPONENT}
          lang="tsx"
          marks={{ 1: 'highlight', 5: 'highlight', 6: 'highlight' }}
          title="src/components/density-script.tsx"
        />
        <p>
          <Rich>{t.prepaintClient()}</Rich>
        </p>
        <p>
          <Rich>{t.prepaintNonce()}</Rich>
        </p>
        <CodeBlock
          code={PREPAINT_HASH}
          lang="ts"
          marks={{ 5: 'highlight', 24: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.prepaintHash()}</Rich>
        </p>
        <p>
          <Rich>{t.prepaintSuppress()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
