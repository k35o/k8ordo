import { Code, Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { PeerTable } from '../../../../components/peer-table';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeGetStarted;

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

const thClass = 'py-3 pr-6 font-medium whitespace-nowrap';
const tdClass = 'py-3 pr-6 align-top';

export default function ColorSchemeGetStartedPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/get-started"
    >
      <DocSection
        id="owns"
        description={t.owns.description}
        title={t.owns.title}
      >
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

      <DocSection
        id="install"
        description={t.install.description}
        title={t.install.title}
      >
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
        <PeerTable
          name="@k8ordo/color-scheme"
          neededFor={{
            '@k8ordo/state': t.install.purposeState,
            react: t.install.purposeReact,
            zod: t.install.purposeZod,
            typescript: t.install.purposeTypescript,
            '@types/react': t.install.purposeTypesReact,
          }}
        />
      </DocSection>

      <DocSection
        id="provider"
        description={t.provider.description}
        title={t.provider.title}
      >
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

      <DocSection
        id="switcher"
        description={t.switcher.description}
        title={t.switcher.title}
      >
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

      <DocSection
        id="defaults"
        description={t.defaults.description}
        title={t.defaults.title}
      >
        <CodeBlock code={DEFAULT_DARK} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.defaults.notStored()}</Rich>
        </p>
      </DocSection>

      <DocSection id="next" title={t.next.title}>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/color-scheme/styling">
              <Rich>{t.next.styling()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/color-scheme/storage">
              <Rich>{t.next.storage()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/color-scheme/csp">
              <Rich>{t.next.csp()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/color-scheme/how-it-works">
              <Rich>{t.next.howItWorks()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
