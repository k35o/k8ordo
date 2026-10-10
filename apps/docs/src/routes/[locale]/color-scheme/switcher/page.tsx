import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { SwitcherDemo } from '../../../../demos/color-scheme/switcher/switcher-demo';
import * as m from '../../../../messages';

const t = m.colorSchemeSwitcher;

const HOOK = `const { scheme, preference, setPreference } = useColorScheme();`;

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

const CHOICE = `'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import type { ColorSchemePreference } from '@k8ordo/color-scheme';

export function SchemeSelect() {
  const { scheme, preference, setPreference } = useColorScheme();

  return (
    <select
      onChange={(event) => {
        setPreference(
          event.currentTarget.value as ColorSchemePreference,
        );
      }}
      value={preference}
    >
      <option value="system">System ({scheme})</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}`;

const DEFAULT = `<ColorSchemeProvider defaultPreference="dark">
  {children}
</ColorSchemeProvider>`;

const BOTH = `export function SchemeToggle() {
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

const BROWSER = `'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

import { MoonIcon, SunIcon } from './icons';

function SchemeIcon() {
  use(browser('the stored preference is in localStorage'));
  const { scheme } = useColorScheme();
  return scheme === 'dark' ? <MoonIcon /> : <SunIcon />;
}

export function SchemeToggle() {
  const { scheme, setPreference } = useColorScheme();

  return (
    <button
      aria-label="Toggle color scheme"
      onClick={() => {
        setPreference(scheme === 'dark' ? 'light' : 'dark');
      }}
      type="button"
    >
      <Suspense fallback={<span className="size-5" />}>
        <SchemeIcon />
      </Suspense>
    </button>
  );
}`;

export default function ColorSchemeSwitcherPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/switcher"
    >
      <DocSection id="hook" title={t.hookTitle}>
        <CodeBlock code={HOOK} lang="tsx" />
        <p>
          <Rich>{t.hookThree()}</Rich>
        </p>
        <ul>
          {[t.hookScheme, t.hookPreference, t.hookSetPreference].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.hookOnlyReads()}</Rich>
        </p>
      </DocSection>

      <DocSection id="toggle" title={t.toggleTitle}>
        <CodeBlock
          callouts={{ 7: t.toggleNextCallout() }}
          code={TOGGLE}
          lang="tsx"
          marks={{ 7: 'highlight' }}
          title="scheme-toggle.tsx"
        />
        <p>
          <Rich>{t.toggleScheme()}</Rich>
        </p>
        <p>
          <Rich>{t.toggleStores()}</Rich>
        </p>
        <p>
          <Rich>{t.toggleHeader()}</Rich>
        </p>
      </DocSection>

      <DocSection id="choice" title={t.choiceTitle}>
        <CodeBlock
          code={CHOICE}
          lang="tsx"
          marks={{ 16: 'highlight', 18: 'highlight' }}
          title="scheme-select.tsx"
        />
        <p>
          <Rich>{t.choicePreference()}</Rich>
        </p>
        <p>
          <Rich>{t.choiceSystem()}</Rich>
        </p>
        <p>
          <Rich>{t.choiceScheme()}</Rich>
        </p>
      </DocSection>

      <DocSection id="default" title={t.defaultTitle}>
        <CodeBlock code={DEFAULT} lang="tsx" title="layout.tsx" />
        <p>
          <Rich>{t.defaultProp()}</Rich>
        </p>
        <p>
          <Rich>{t.defaultNotStored()}</Rich>
        </p>
        <p>
          <Rich>{t.defaultSystemLabel()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.defaultCsp()}</Rich>
            <LocaleAnchor path="/:locale/color-scheme/csp">
              {m.colorScheme.navCsp()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="before-hydration" title={t.beforeTitle}>
        <p>
          <Rich>{t.beforeGuess()}</Rich>
        </p>
        <p>
          <Rich>{t.beforeClass()}</Rich>
        </p>
        <DocSubsection id="both" title={t.bothTitle}>
          <CodeBlock
            code={BOTH}
            lang="tsx"
            marks={{ 11: 'highlight', 12: 'highlight' }}
            title="scheme-toggle.tsx"
          />
          <p>
            <Rich>{t.bothText()}</Rich>
          </p>
          <Note>
            <p>
              <Rich>{t.bothVariant()}</Rich>
              <LocaleAnchor path="/:locale/color-scheme/styling">
                {m.colorScheme.navStyling()}
              </LocaleAnchor>
              <Rich>{t.bothVariantAfter()}</Rich>
            </p>
          </Note>
        </DocSubsection>
        <DocSubsection id="browser" title={t.browserTitle}>
          <CodeBlock
            code={BROWSER}
            lang="tsx"
            marks={{
              10: 'highlight',
              26: 'highlight',
              27: 'highlight',
              28: 'highlight',
            }}
            title="scheme-toggle.tsx"
          />
          <p>
            <Rich>{t.browserText()}</Rich>
          </p>
          <p>
            <Rich>{t.browserFallback()}</Rich>
          </p>
          <Pitfall>
            <p>
              <Rich>{t.browserPitfall()}</Rich>
            </p>
          </Pitfall>
        </DocSubsection>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <SwitcherDemo />
      </Playground>
    </DocPage>
  );
}
