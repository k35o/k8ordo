import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeTesting;

const RESET = `import { resetStateRegistry } from '@k8ordo/state';
import { beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  resetStateRegistry();
});`;

const RENDER = `import {
  ColorSchemeProvider,
  colorSchemeState,
  useColorScheme,
} from '@k8ordo/color-scheme';
import type { ReactNode } from 'react';
import { expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ColorSchemeProvider>{children}</ColorSchemeProvider>
);

it('starts from a stored preference', async () => {
  localStorage.setItem(
    colorSchemeState.storageKey,
    JSON.stringify({ preference: 'dark' }),
  );
  const { result } = await renderHook(() => useColorScheme(), {
    wrapper,
  });

  expect(result.current.preference).toBe('dark');
  expect(result.current.scheme).toBe('dark');
  expect(
    document.documentElement.classList.contains('dark'),
  ).toBe(true);
});`;

const CHANGE = `it('stores a choice, and stores none for system', async () => {
  const { result } = await renderHook(() => useColorScheme(), {
    wrapper,
  });

  result.current.setPreference('dark');
  await vi.waitFor(() => {
    expect(result.current.scheme).toBe('dark');
  });
  expect(
    document.documentElement.classList.contains('dark'),
  ).toBe(true);
  expect(localStorage.getItem(colorSchemeState.storageKey)).toBe(
    '{"preference":"dark"}',
  );

  result.current.setPreference('system');
  await vi.waitFor(() => {
    expect(result.current.preference).toBe('system');
  });
  expect(
    localStorage.getItem(colorSchemeState.storageKey),
  ).toBe('{}');
});`;

const SYSTEM_DARK = `import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        contextOptions: { colorScheme: 'dark' },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
});`;

export default function ColorSchemeTestingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/testing">
      <DocSection
        description={t.resetDescription}
        id="reset"
        title={t.resetTitle}
      >
        <CodeBlock code={RESET} lang="ts" title="color-scheme.test.tsx" />
        <ul>
          {[t.resetStorage, t.resetClass, t.resetRegistry].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <Note>
          <p>
            <Rich>{t.resetUnmount()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.renderDescription}
        id="render"
        title={t.renderTitle}
      >
        <CodeBlock
          code={RENDER}
          lang="tsx"
          marks={{ 10: 'highlight', 11: 'highlight', 12: 'highlight' }}
          title="color-scheme.test.tsx"
        />
        <p>
          <Rich>{t.renderStorageKey()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.changeDescription}
        id="change"
        title={t.changeTitle}
      >
        <CodeBlock
          code={CHANGE}
          lang="tsx"
          marks={{ 7: 'highlight', 18: 'highlight' }}
          title="color-scheme.test.tsx"
        />
        <p>
          <Rich>{t.changeWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.changeSystem()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.systemDescription}
        id="system"
        title={t.systemTitle}
      >
        <p>
          <Rich>{t.systemDefault()}</Rich>
        </p>
        <CodeBlock
          code={SYSTEM_DARK}
          lang="ts"
          marks={{ 9: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.systemScope()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.scriptDescription}
        id="script"
        title={t.scriptTitle}
      >
        <p>
          <Rich>{t.scriptConsole()}</Rich>
        </p>
        <p>
          <Rich>{t.scriptClass()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
