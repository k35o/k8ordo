import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { ToggleDemo } from '../../../../demos/color-scheme/get-started/toggle-demo';
import * as m from '../../../../messages';

const t = m.colorSchemeGetStarted;

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

export default function ColorSchemeGetStartedPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/get-started"
    >
      <DocSection id="install" title={t.installTitle}>
        <PackageInstall name="@k8ordo/color-scheme" />
        <Note>
          <p>
            <Rich>{t.installStateBefore()}</Rich>
            <LocaleAnchor path="/:locale/color-scheme/storage">
              {m.colorScheme.navStorage()}
            </LocaleAnchor>
            <Rich>{t.installStateAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="provider" title={t.providerTitle}>
        <CodeBlock
          callouts={{
            10: t.providerSuppressCallout(),
            12: t.providerWrapCallout(),
          }}
          code={LAYOUT}
          lang="tsx"
          marks={{ 10: 'highlight', 12: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <p>
          <Rich>{t.providerPlace()}</Rich>
        </p>
        <p>
          <Rich>{t.providerScript()}</Rich>
        </p>
        <p>
          <Rich>{t.providerSuppress()}</Rich>
        </p>
      </DocSection>

      <DocSection id="color" title={t.colorTitle}>
        <CodeBlock
          callouts={{ 7: t.colorDarkCallout() }}
          code={CSS}
          lang="css"
          marks={{ 7: 'highlight', 8: 'highlight' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.colorClass()}</Rich>
        </p>
        <p>
          <Rich>{t.colorProperty()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.colorUiBefore()}</Rich>
            <LocaleAnchor path="/:locale/color-scheme/styling">
              {m.colorScheme.navStyling()}
            </LocaleAnchor>
            <Rich>{t.colorUiAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="switch" title={t.switchTitle}>
        <CodeBlock
          callouts={{ 6: t.switchSchemeCallout(), 12: t.switchSetCallout() }}
          code={TOGGLE}
          lang="tsx"
          marks={{ 6: 'highlight', 7: 'highlight', 12: 'highlight' }}
          title="scheme-toggle.tsx"
        />
        <p>
          <Rich>{t.switchHook()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.switchGuessBefore()}</Rich>
            <LocaleAnchor path="/:locale/color-scheme/switcher">
              {m.colorScheme.navSwitcher()}
            </LocaleAnchor>
            <Rich>{t.switchGuessAfter()}</Rich>
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
    </DocPage>
  );
}
