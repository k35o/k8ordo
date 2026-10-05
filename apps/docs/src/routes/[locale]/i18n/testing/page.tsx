import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nTesting;

const NODE = `import { expect, it } from 'vitest';

import { locales } from '../i18n';
import * as nav from './nav';

it('renders in the default locale', () => {
  expect(nav.home()).toBe('ホーム');
});

it('renders in the locale run names', () => {
  expect(locales.run('en', () => nav.home())).toBe('Home');
});

it('keeps the locale across awaits', async () => {
  const text = await locales.run('en', async () => {
    await Promise.resolve();
    return nav.home();
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
import * as nav from './nav';

const initial = location.pathname;

afterEach(() => {
  history.replaceState(null, '', initial);
});

it('renders in the locale the URL names', () => {
  history.replaceState(null, '', '/en/cart');
  expect(locales.getLocale()).toBe('en');
  expect(nav.home()).toBe('Home');
});`;

const SET = `import { defineLocales } from '@k8ordo/i18n';
import { beforeEach } from 'vitest';

import { locales } from '../i18n';

beforeEach(() => {
  defineLocales(locales.definitions, { default: locales.default });
});`;

const TYPES = `import { message } from '@k8ordo/i18n';
import { expectTypeOf, it } from 'vitest';

import * as cart from './cart';

it('types the arguments of a message', () => {
  expectTypeOf(cart.added).parameters.toEqualTypeOf<
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
      <DocSection
        description={t.nodeDescription}
        id="node"
        title={t.nodeTitle}
      >
        <CodeBlock
          code={NODE}
          lang="ts"
          marks={{ 11: 'highlight', 15: 'highlight' }}
          title="messages/nav.test.ts"
        />
        <p>
          <Rich>{t.nodeAsync()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.schemaDescription}
        id="params-schema"
        title={t.schemaTitle}
      >
        <CodeBlock
          code={SCHEMA}
          lang="ts"
          marks={{ 8: 'highlight' }}
          title="i18n.test.ts"
        />
        <p>
          <Rich>{t.schemaRun()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.browserDescription}
        id="browser"
        title={t.browserTitle}
      >
        <CodeBlock
          code={BROWSER}
          lang="ts"
          marks={{ 9: 'highlight', 13: 'highlight' }}
          title="messages/nav.browser.test.ts"
        />
        <p>
          <Rich>{t.browserRun()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.setDescription} id="set" title={t.setTitle}>
        <p>
          <Rich>{t.setFix()}</Rich>
        </p>
        <CodeBlock code={SET} lang="ts" marks={{ 7: 'highlight' }} />
      </DocSection>

      <DocSection
        description={t.typesDescription}
        id="types"
        title={t.typesTitle}
      >
        <CodeBlock
          code={TYPES}
          lang="ts"
          marks={{ 13: 'highlight', 14: 'highlight' }}
          title="messages/cart.test.ts"
        />
        <p>
          <Rich>{t.typesExpect()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
