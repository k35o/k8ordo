import type { Message } from '@k8ordo/i18n';
import { Code, Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { SchemeInspector } from './_parts/scheme-inspector';

const t = m.colorSchemeHowItWorks;

type Cell = { code: string } | { text: Message };

const RULE_ROWS: ReadonlyArray<{
  id: string;
  stored: Cell;
  defaultPreference: Cell;
  systemDark: Cell;
  scheme: string;
}> = [
  {
    id: 'stored-dark',
    stored: { code: "'dark'" },
    defaultPreference: { text: t.rule.any },
    systemDark: { text: t.rule.any },
    scheme: "'dark'",
  },
  {
    id: 'stored-light',
    stored: { code: "'light'" },
    defaultPreference: { text: t.rule.any },
    systemDark: { text: t.rule.any },
    scheme: "'light'",
  },
  {
    id: 'default-dark',
    stored: { text: t.rule.none },
    defaultPreference: { code: "'dark'" },
    systemDark: { text: t.rule.any },
    scheme: "'dark'",
  },
  {
    id: 'default-light',
    stored: { text: t.rule.none },
    defaultPreference: { code: "'light'" },
    systemDark: { text: t.rule.any },
    scheme: "'light'",
  },
  {
    id: 'system-dark',
    stored: { text: t.rule.none },
    defaultPreference: { code: "'system'" },
    systemDark: { text: t.rule.matches },
    scheme: "'dark'",
  },
  {
    id: 'system-light',
    stored: { text: t.rule.none },
    defaultPreference: { code: "'system'" },
    systemDark: { text: t.rule.doesNotMatch },
    scheme: "'light'",
  },
];

const TYPE_ROWS: ReadonlyArray<{ name: string; use: Message }> = [
  { name: 'ColorScheme', use: t.types.colorScheme },
  { name: 'ColorSchemePreference', use: t.types.preference },
  { name: 'ColorSchemeProviderProps', use: t.types.providerProps },
  { name: 'UseColorScheme', use: t.types.hook },
];

const SCRIPT = `(() => {
  const s = (() => {
    try {
      const v = JSON.parse(localStorage.getItem('k8ordo-state:color-scheme'));
      return v !== null && typeof v === 'object' && !Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  })();
  const v = s && s.preference;
  const p = v === 'dark' || v === 'light' ? v : 'system';
  if (
    p === 'dark' ||
    (p !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
  )
    document.documentElement.classList.add('dark');
})();`;

const CSS_TOGGLE = `// src/components/scheme-toggle.tsx
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
      <span className="dark:hidden">Switch to dark</span>
      <span className="hidden dark:inline">Switch to light</span>
    </button>
  );
}`;

const TYPES = `import type { ReactNode } from 'react';

export type ColorScheme = 'light' | 'dark';

export type ColorSchemePreference = ColorScheme | 'system';

export type ColorSchemeProviderProps = {
  readonly defaultPreference?: ColorSchemePreference;
  readonly nonce?: string;
  readonly children: ReactNode;
};

export type UseColorScheme = {
  readonly scheme: ColorScheme;
  readonly preference: ColorSchemePreference;
  readonly setPreference: (preference: ColorSchemePreference) => void;
};`;

const TEST = `// src/color-scheme.browser.test.tsx
import {
  ColorSchemeProvider,
  colorSchemeState,
  useColorScheme,
} from '@k8ordo/color-scheme';
import { resetStateRegistry } from '@k8ordo/state';
import type { ReactNode } from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

const root = document.documentElement;

const wrapper = ({ children }: { children: ReactNode }) => (
  <ColorSchemeProvider>{children}</ColorSchemeProvider>
);

beforeEach(() => {
  localStorage.clear();
  root.classList.remove('dark');
  resetStateRegistry();
});

it('starts from a stored preference', async () => {
  localStorage.setItem(
    colorSchemeState.storageKey,
    JSON.stringify({ preference: 'dark' }),
  );
  const { result } = await renderHook(() => useColorScheme(), { wrapper });

  expect(result.current.preference).toBe('dark');
  expect(result.current.scheme).toBe('dark');
  expect(root.classList.contains('dark')).toBe(true);
});

it('stores a choice, and stores none for system', async () => {
  const { result } = await renderHook(() => useColorScheme(), { wrapper });

  result.current.setPreference('dark');
  await vi.waitFor(() => {
    expect(result.current.scheme).toBe('dark');
  });
  expect(root.classList.contains('dark')).toBe(true);
  expect(localStorage.getItem(colorSchemeState.storageKey)).toBe(
    '{"preference":"dark"}',
  );

  result.current.setPreference('system');
  await vi.waitFor(() => {
    expect(result.current.preference).toBe('system');
  });
  expect(localStorage.getItem(colorSchemeState.storageKey)).toBe('{}');
});`;

const thClass = 'py-3 pr-6 font-medium whitespace-nowrap';

function CellContent({ cell }: { cell: Cell }) {
  return 'code' in cell ? <Code>{cell.code}</Code> : <Rich>{cell.text()}</Rich>;
}

function Bullets({ items }: { items: readonly Message[] }) {
  return (
    <ul className="text-fg-mute flex flex-col gap-2 pl-6">
      {items.map((item) => {
        const text = item();
        return (
          <li className="list-disc" key={text}>
            <Rich>{text}</Rich>
          </li>
        );
      })}
    </ul>
  );
}

export default function ColorSchemeHowItWorksPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/how-it-works"
    >
      <DocSection
        id="rule"
        description={t.rule.description}
        title={t.rule.title}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={thClass}>
                  <Rich>{t.rule.columnStored()}</Rich>
                </th>
                <th className={thClass}>
                  <Code>defaultPreference</Code>
                </th>
                <th className={thClass}>
                  <Code>(prefers-color-scheme: dark)</Code>
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  <Code>scheme</Code>
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {RULE_ROWS.map((row) => (
                <tr className="border-border-mute border-b" key={row.id}>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <CellContent cell={row.stored} />
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <CellContent cell={row.defaultPreference} />
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <CellContent cell={row.systemDark} />
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <Code>{row.scheme}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.rule.invalid()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.rule.notPinned()}</Rich>
        </p>
        <Heading level="h3">
          <Rich>{t.panel.title()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.panel.description()}</Rich>{' '}
          <LocaleAnchor path="/:locale/color-scheme">
            <Rich>{t.panel.landingLink()}</Rich>
          </LocaleAnchor>
        </p>
        <SchemeInspector />
      </DocSection>

      <DocSection
        id="script"
        description={t.script.description}
        title={t.script.title}
      >
        <Heading level="h3">
          <Rich>{t.script.readsTitle()}</Rich>
        </Heading>
        <Bullets
          items={[
            t.script.readsRow,
            t.script.readsValue,
            t.script.readsSystem,
            t.script.writes,
          ]}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.script.codeDescription()}</Rich>
        </p>
        <CodeBlock code={SCRIPT} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.script.hydration()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.script.csp()}</Rich>{' '}
          <LocaleAnchor path="/:locale/color-scheme/csp">
            <Rich>{t.script.cspLink()}</Rich>
          </LocaleAnchor>
        </p>
        <Heading level="h3">
          <Rich>{t.script.serverTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.script.serverDescription()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.script.serverConsequence()}</Rich>
        </p>
        <CodeBlock code={CSS_TOGGLE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.script.darkVariant()}</Rich>{' '}
          <LocaleAnchor path="/:locale/color-scheme/styling">
            <Rich>{t.script.darkVariantLink()}</Rich>
          </LocaleAnchor>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.script.serverBrowserOnly()}</Rich>{' '}
          <LocaleAnchor path="/:locale/static/boundaries">
            <Rich>{t.script.browserOnlyLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        id="step"
        description={t.step.description}
        title={t.step.title}
      >
        <Bullets
          items={[t.step.choice, t.step.system, t.step.tabs, t.step.hydration]}
        />
        <Heading level="h3">
          <Rich>{t.step.oneProviderTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.step.oneProvider()}</Rich>
        </p>
      </DocSection>

      <DocSection
        id="guarantees"
        description={t.guarantees.description}
        title={t.guarantees.title}
      >
        <Bullets
          items={[
            t.guarantees.noFlash,
            t.guarantees.defaults,
            t.guarantees.server,
            t.guarantees.tabs,
          ]}
        />
        <Heading level="h3">
          <Rich>{t.guarantees.limitsTitle()}</Rich>
        </Heading>
        <Bullets
          items={[
            t.guarantees.limitCookie,
            t.guarantees.limitClass,
            t.guarantees.limitProperty,
            t.guarantees.limitContrast,
            t.guarantees.limitPolicy,
          ]}
        />
      </DocSection>

      <DocSection
        id="types"
        description={t.types.description}
        title={t.types.title}
      >
        <CodeBlock code={TYPES} lang="ts" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={thClass}>
                  <Rich>{t.types.columnName()}</Rich>
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  <Rich>{t.types.columnUse()}</Rich>
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {TYPE_ROWS.map((row) => (
                <tr className="border-border-mute border-b" key={row.name}>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <Code>{row.name}</Code>
                  </td>
                  <td className="py-3">
                    <Rich>{row.use()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        id="testing"
        description={t.testing.description}
        title={t.testing.title}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.testing.codeDescription()}</Rich>
        </p>
        <CodeBlock code={TEST} lang="tsx" />
        <Bullets
          items={[t.testing.system, t.testing.script, t.testing.unmount]}
        />
      </DocSection>
    </DocPage>
  );
}
