import { Code, Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeGetStarted;

const PEERS = [
  { name: '@k8ordo/state', version: '^0.2.0', purpose: t.install.purposeState },
  { name: 'react', version: '>=19.3.0', purpose: t.install.purposeReact },
  { name: 'zod', version: '^4.4.3', purpose: t.install.purposeZod },
  {
    name: 'typescript',
    version: '>=7.0.2',
    purpose: t.install.purposeTypescript,
  },
  {
    name: '@types/react',
    version: '>=19.3.0',
    purpose: t.install.purposeTypesReact,
  },
];

const MEMBERS = [
  {
    name: 'scheme',
    type: "'light' | 'dark'",
    meaning: t.switcher.scheme,
  },
  {
    name: 'preference',
    type: "'light' | 'dark' | 'system'",
    meaning: t.switcher.preference,
  },
  {
    name: 'setPreference',
    type: '(preference: ColorSchemePreference) => void',
    meaning: t.switcher.setPreference,
  },
];

const LAYOUT = `// src/routes/layout.tsx
import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}`;

const SWITCHER = `// src/components/scheme-switcher.tsx
'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import type { ColorSchemePreference } from '@k8ordo/color-scheme';

const CHOICES: readonly ColorSchemePreference[] = ['system', 'light', 'dark'];

export function SchemeSwitcher() {
  const { scheme, preference, setPreference } = useColorScheme();

  return (
    <fieldset>
      <legend>Colour scheme: {scheme}</legend>
      {CHOICES.map((choice) => (
        <label key={choice}>
          <input
            checked={preference === choice}
            name="color-scheme"
            onChange={() => {
              setPreference(choice);
            }}
            type="radio"
          />
          {choice}
        </label>
      ))}
    </fieldset>
  );
}`;

const TOGGLE = `// src/components/scheme-toggle.tsx
'use client';

import { useColorScheme } from '@k8ordo/color-scheme';

export function SchemeToggle() {
  const { scheme, setPreference } = useColorScheme();

  return (
    <button
      onClick={() => {
        setPreference(scheme === 'dark' ? 'light' : 'dark');
      }}
      type="button"
    >
      {scheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </button>
  );
}`;

const OUTSIDE_ERROR =
  'useColorScheme needs <ColorSchemeProvider> above it — put one in the root layout, inside <body>';

const DEFAULT_DARK = `// src/routes/layout.tsx
import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorSchemeProvider defaultPreference="dark">
          {children}
        </ColorSchemeProvider>
      </body>
    </html>
  );
}`;

const WITH_NONCE = `// src/routes/layout.tsx (@k8ordo/server)
import { nonce } from '@k8ordo/server/runtime';

<ColorSchemeProvider nonce={nonce()}>{children}</ColorSchemeProvider>`;

const WITH_HASH = `// vite.config.ts (@k8ordo/static)
import { colorSchemeScriptHash } from '@k8ordo/color-scheme';

framework({
  csp: { 'script-src': ["'self'", await colorSchemeScriptHash()] },
});`;

const UI_CSS = `/* src/styles/globals.css */
@import '@k8ordo/ui/tailwind.css';`;

const UI_MARKUP = `// src/components/logo.tsx
export function Logo() {
  return (
    <div className="bg-bg-base text-fg-base rounded-md p-4">
      <img alt="k8ordo" className="dark:invert" src="/logo.svg" />
    </div>
  );
}`;

const TAILWIND_CSS = `/* src/styles/globals.css */
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));`;

const PLAIN_CSS = `/* src/styles/globals.css */
:root {
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

const thClass = 'py-3 pr-6 font-medium whitespace-nowrap';
const tdClass = 'py-3 pr-6 align-top';

export default function ColorSchemeGetStartedPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/get-started"
    >
      <DocSection description={t.owns.description} title={t.owns.title}>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{t.owns.choice()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{t.owns.system()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{t.owns.screen()}</Rich>
          </li>
        </ul>
        <Heading level="h3">
          <Rich>{t.owns.notTitle()}</Rich>
        </Heading>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{t.owns.notColours()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{t.owns.notStorage()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{t.owns.notServer()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection description={t.install.description} title={t.install.title}>
        <InstallTabs
          npm={
            <CodeBlock
              code="npm install @k8ordo/color-scheme @k8ordo/state zod"
              lang="bash"
            />
          }
          pnpm={
            <CodeBlock
              code="pnpm add @k8ordo/color-scheme @k8ordo/state zod"
              lang="bash"
            />
          }
          yarn={
            <CodeBlock
              code="yarn add @k8ordo/color-scheme @k8ordo/state zod"
              lang="bash"
            />
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={thClass}>
                  <Rich>{t.install.columnPackage()}</Rich>
                </th>
                <th className={thClass}>
                  <Rich>{t.install.columnVersion()}</Rich>
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  <Rich>{t.install.columnPurpose()}</Rich>
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {PEERS.map((peer) => (
                <tr className="border-border-mute border-b" key={peer.name}>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    <Code>{peer.name}</Code>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    <Code>{peer.version}</Code>
                  </td>
                  <td className="py-3 align-top">
                    <Rich>{peer.purpose()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection description={t.provider.description} title={t.provider.title}>
        <CodeBlock code={LAYOUT} lang="tsx" />
        <Heading level="h3">
          <Rich>{t.provider.bodyTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.provider.bodyDescription()}</Rich>
        </p>
        <Heading level="h3">
          <Rich>{t.provider.hydrationTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.provider.hydrationDescription()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.switcher.description} title={t.switcher.title}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={thClass}>
                  <Rich>{t.switcher.columnMember()}</Rich>
                </th>
                <th className={thClass}>
                  <Rich>{t.switcher.columnType()}</Rich>
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  <Rich>{t.switcher.columnMeaning()}</Rich>
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {MEMBERS.map((member) => (
                <tr className="border-border-mute border-b" key={member.name}>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    <Code>{member.name}</Code>
                  </td>
                  <td className={tdClass}>
                    <Code>{member.type}</Code>
                  </td>
                  <td className="py-3 align-top">
                    <Rich>{member.meaning()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.switcher.choicesDescription()}</Rich>
        </p>
        <CodeBlock code={SWITCHER} lang="tsx" />
        <Heading level="h3">
          <Rich>{t.switcher.toggleTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.switcher.toggleDescription()}</Rich>
        </p>
        <CodeBlock code={TOGGLE} lang="tsx" />
        <Heading level="h3">
          <Rich>{t.switcher.systemTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.switcher.systemDescription()}</Rich>
        </p>
        <Heading level="h3">
          <Rich>{t.switcher.beforeHydrationTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.switcher.beforeHydrationDescription()}</Rich>{' '}
          <LocaleAnchor path="/:locale/color-scheme/how-it-works">
            <Rich>{t.switcher.beforeHydrationLink()}</Rich>
          </LocaleAnchor>
        </p>
        <Heading level="h3">
          <Rich>{t.switcher.outsideTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.switcher.outsideDescription()}</Rich>
        </p>
        <CodeBlock code={OUTSIDE_ERROR} lang="md" />
      </DocSection>

      <DocSection description={t.defaults.description} title={t.defaults.title}>
        <CodeBlock code={DEFAULT_DARK} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.defaults.notStored()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.csp.description} title={t.csp.title}>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.csp.nonce()}</Rich>
        </p>
        <CodeBlock code={WITH_NONCE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.csp.hash()}</Rich>
        </p>
        <CodeBlock code={WITH_HASH} lang="ts" />
      </DocSection>

      <DocSection description={t.styling.description} title={t.styling.title}>
        <Heading level="h3">
          <Rich>{t.styling.uiTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.styling.uiDescription()}</Rich>
        </p>
        <CodeBlock code={UI_CSS} lang="css" />
        <CodeBlock code={UI_MARKUP} lang="tsx" />
        <Heading level="h3">
          <Rich>{t.styling.tailwindTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.styling.tailwindDescription()}</Rich>
        </p>
        <CodeBlock code={TAILWIND_CSS} lang="css" />
        <Heading level="h3">
          <Rich>{t.styling.plainTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.styling.plainDescription()}</Rich>
        </p>
        <CodeBlock code={PLAIN_CSS} lang="css" />
      </DocSection>

      <DocSection title={t.next.title}>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/color-scheme/how-it-works">
              <Rich>{t.next.howItWorks()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/state/places">
              <Rich>{t.next.state()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/ui/theming">
              <Rich>{t.next.theming()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
