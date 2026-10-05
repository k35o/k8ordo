import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { PeerTable } from '../../../../components/peer-table';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { ToggleDemo } from './_parts/toggle-demo';

const t = m.colorSchemeGetStarted;

const INSTALL = '@k8ordo/color-scheme @k8ordo/state zod';

const LAYOUT = `import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}`;

const CSS = `:root {
  color-scheme: light;
  --page-bg: #ffffff;
  --page-fg: #1f1f1f;
}

:root.dark {
  color-scheme: dark;
  --page-bg: #1f1f1f;
  --page-fg: #f5f5f5;
}

body {
  background: var(--page-bg);
  color: var(--page-fg);
}`;

const TOGGLE = `'use client';

import { useColorScheme } from '@k8ordo/color-scheme';

export function SchemeToggle() {
  const { scheme, setPreference } = useColorScheme();
  const next = scheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      onClick={() => {
        setPreference(next);
      }}
      type="button"
    >
      Switch to {next}
    </button>
  );
}`;

const NEXT = [
  {
    path: '/:locale/color-scheme/styling',
    label: m.colorScheme.navStyling,
    description: t.nextStyling,
  },
  {
    path: '/:locale/color-scheme/switcher',
    label: m.colorScheme.navSwitcher,
    description: t.nextSwitcher,
  },
  {
    path: '/:locale/color-scheme/csp',
    label: m.colorScheme.navCsp,
    description: t.nextCsp,
  },
] as const;

export default function ColorSchemeGetStartedPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/get-started"
    >
      <DocSection
        description={t.installDescription}
        id="install"
        title={t.installTitle}
      >
        <InstallTabs
          npm={<CodeBlock code={`npm install ${INSTALL}`} lang="bash" />}
          pnpm={<CodeBlock code={`pnpm add ${INSTALL}`} lang="bash" />}
          yarn={<CodeBlock code={`yarn add ${INSTALL}`} lang="bash" />}
        />
        <p>
          <Rich>{t.peersDescription()}</Rich>
        </p>
        <PeerTable
          name="@k8ordo/color-scheme"
          neededFor={{
            '@k8ordo/state': t.peerState,
            react: t.peerReact,
            zod: t.peerZod,
            typescript: t.peerTypes,
            '@types/react': t.peerTypes,
          }}
        />
        <Note>
          <p>
            <Rich>{t.installState()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.providerDescription}
        id="provider"
        title={t.providerTitle}
      >
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 10: 'highlight', 12: 'highlight' }}
          title="routes/layout.tsx"
        />
        <p>
          <Rich>{t.providerFirst()}</Rich>
        </p>
        <p>
          <Rich>{t.providerSuppress()}</Rich>
        </p>
        <p>
          <Rich>{t.providerServer()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.colorDescription}
        id="color"
        title={t.colorTitle}
      >
        <CodeBlock
          code={CSS}
          lang="css"
          marks={{ 7: 'highlight', 8: 'highlight' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.colorProperty()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.colorUi()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.switchDescription}
        id="switch"
        title={t.switchTitle}
      >
        <CodeBlock
          code={TOGGLE}
          lang="tsx"
          marks={{ 6: 'highlight', 7: 'highlight', 12: 'highlight' }}
          title="scheme-toggle.tsx"
        />
        <p>
          <Rich>{t.switchExplain()}</Rich>
        </p>
        <p>
          <Rich>{t.switchReload()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.switchGuess()}</Rich>
          </p>
        </Note>
      </DocSection>

      <Playground
        description={t.tryDescription}
        id="try"
        steps={t.trySteps}
        title={t.tryTitle}
      >
        <ToggleDemo />
      </Playground>

      <DocSection id="next" title={t.nextTitle}>
        <ul>
          {NEXT.map((step) => (
            <li key={step.path}>
              <LocaleAnchor path={step.path}>{step.label()}</LocaleAnchor>
              {' — '}
              <Rich>{step.description()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
