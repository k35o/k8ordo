
import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nTesting;

const NODE = `import { expect, it } from 'vitest';

import { locales } from '../i18n';
import { home } from './nav';

it('renders in the default locale', () => {
  expect(home()).toBe('ホーム');
});

it('renders in the locale run names', () => {
  expect(locales.run('en', () => home())).toBe('Home');
});

it('keeps the locale across awaits', async () => {
  const text = await locales.run('en', async () => {
    await Promise.resolve();
    return home();
  });
  expect(text).toBe('Home');
});`;

const SCHEMA = `import { expect, it } from 'vitest';

import { locales } from './i18n';

it('accepts only the listed locales', () => {
  const { validate } = locales.paramsSchema['~standard'];
  expect(
    locales.run('ja', () => validate({ locale: 'en' })),
  ).toStrictEqual({ value: { locale: 'en' } });
  expect(validate({ locale: 'fr' })).toMatchObject({
    issues: [{ path: ['locale'] }],
  });
});`;

const BROWSER = `import { afterEach, expect, it } from 'vitest';

import { locales } from '../i18n';
import { home } from './nav';

const initial = location.pathname;

afterEach(() => {
  history.replaceState(null, '', initial);
});

it('renders in the locale the URL names', () => {
  history.replaceState(null, '', '/en/cart');
  expect(locales.getLocale()).toBe('en');
  expect(home()).toBe('Home');
});`;

const SET = `import { defineLocales } from '@k8ordo/i18n';
import { beforeEach } from 'vitest';

import { locales } from './src/i18n';

beforeEach(() => {
  defineLocales(locales.definitions, { default: locales.default });
});`;

const TYPES = `import { message } from '@k8ordo/i18n';
import { expectTypeOf, it } from 'vitest';

import { added } from './cart';

it('types the arguments of a message', () => {
  expectTypeOf(added).parameters.toEqualTypeOf<
    [name: string]
  >();
});

it('refuses a message without every locale', () => {
  // @ts-expect-error
  message({ ja: '保存' });
});`;

export default function I18nTestingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/testing">
      <DocSection id="node" title={t.nodeTitle}>
        <CodeBlock
          code={NODE}
          lang="ts"
          marks={{ 11: 'highlight', 15: 'highlight' }}
          title="src/messages/nav.test.ts"
        />
        <p>
          <Rich>{t.nodeDefault()}</Rich>
        </p>
        <p>
          <Rich>{t.nodeAsync()}</Rich>
        </p>
      </DocSection>

      <DocSection id="params-schema" title={t.schemaTitle}>
        <CodeBlock
          code={SCHEMA}
          lang="ts"
          marks={{ 8: 'highlight' }}
          title="src/i18n.test.ts"
        />
        <p>
          <Rich>{t.schemaContext()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaRun()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaRefused()}</Rich>
        </p>
      </DocSection>

      <DocSection id="browser" title={t.browserTitle}>
        <CodeBlock
          code={BROWSER}
          lang="ts"
          marks={{ 9: 'highlight', 13: 'highlight' }}
          title="src/messages/nav.browser.test.ts"
        />
        <p>
          <Rich>{t.browserUrl()}</Rich>
        </p>
        <p>
          <Rich>{t.browserRun()}</Rich>
        </p>
      </DocSection>

      <DocSection id="set" title={t.setTitle}>
        <CodeBlock
          code={SET}
          lang="ts"
          marks={{ 7: 'highlight' }}
          title="vitest.setup.ts"
        />
        <p>
          <Rich>{t.setLastWins()}</Rich>
        </p>
        <p>
          <Rich>{t.setFix()}</Rich>
        </p>
      </DocSection>

      <DocSection id="types" title={t.typesTitle}>
        <CodeBlock
          code={TYPES}
          lang="ts"
          marks={{ 13: 'highlight', 14: 'highlight' }}
          title="src/messages/cart.test.ts"
        />
        <p>
          <Rich>{t.typesPin()}</Rich>
        </p>
        <p>
          <Rich>{t.typesExpect()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
