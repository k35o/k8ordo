import { Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const s = m.i18nIntegrations;

// 文字列の中の `export const { paramsSchema }` は生成器に拾われない
// （ファイルをパースして export を読む）ので、コード例として置ける。
const UI_LAYOUT = `// src/routes/[locale]/layout.tsx
import { UIProvider } from '@k8ordo/ui';
import { dictionaries } from '@k8ordo/ui/i18n';
import type { ReactNode } from 'react';

import { locales } from '../../i18n';

export const { paramsSchema } = locales;

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <UIProvider messages={dictionaries[locales.getLocale()]}>
      {children}
    </UIProvider>
  );
}`;

const TALK_MESSAGES = `// src/messages/talk.ts
import { message } from '@k8ordo/i18n';

export const titleRequired = message({
  ja: 'タイトルを入力してください',
  en: 'Enter a title',
});

export const titleTooLong = message({
  ja: (max: number) => \`\${String(max)} 文字以内で入力してください\`,
  en: (max) => \`Use at most \${String(max)} characters\`,
});`;

const TALK_SCHEMA = `// src/routes/[locale]/talks/new/_parts/schema.ts
import * as z from 'zod';

import * as m from '../../../../../messages';

export const talkSchema = z.object({
  title: z
    .string()
    .min(1, { error: m.talk.titleRequired })
    .max(120, { error: () => m.talk.titleTooLong(120) }),
});`;

const TALK_PAGE = `// src/routes/[locale]/talks/new/page.tsx
import { formFields } from '@k8ordo/form/server';

import { locales } from '../../../../i18n';
import { createTalk } from './_parts/actions';
import { talkSchema } from './_parts/schema';
import { TalkForm } from './_parts/talk-form';

export default function NewTalkPage() {
  return (
    <TalkForm
      action={createTalk.bind(null, locales.getLocale())}
      fields={formFields(talkSchema)}
    />
  );
}`;

const TALK_ACTION = `// src/routes/[locale]/talks/new/_parts/actions.ts
'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';

import { saveTalk } from '../../../../../db/talks';
import { locales } from '../../../../../i18n';
import { talkSchema } from './schema';

export async function createTalk(
  locale: string,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = locales.run(
    locales.is(locale) ? locale : locales.default,
    () => parseForm(talkSchema, formData),
  );
  if (parsed.success) await saveTalk(parsed.data);
  return parsed.state;
}`;

const SERVER_ROOT_PAGE = `// src/routes/page.tsx
import type { PageProps } from '@k8ordo/router';

import { locales } from '../i18n';
import { href } from '../links';
import { RedirectTo } from './_parts/redirect-to';

export default function RootPage({ request }: PageProps<'/'>) {
  const locale = locales.negotiateRequest(request, { cookie: 'locale' });

  return <RedirectTo to={href('/:locale', { locale })} />;
}`;

const REDIRECT_TO = `// src/routes/_parts/redirect-to.tsx
'use client';

import { useEffect } from 'react';

export function RedirectTo({ to }: { to: string }) {
  useEffect(() => {
    navigation.navigate(to, { history: 'replace' });
  }, [to]);

  return <a href={to}>{to}</a>;
}`;

const NODE_TEST = `// src/messages/messages.test.ts
import { describe, expect, expectTypeOf, it } from 'vitest';

import { locales } from '../i18n';
import * as cart from './cart';
import * as nav from './nav';

describe('messages', () => {
  it('renders in the default locale unless run names another', () => {
    expect(nav.home()).toBe('ホーム');
    expect(locales.run('en', () => nav.home())).toBe('Home');
  });

  it('keeps the locale across awaits', async () => {
    const text = await locales.run('en', async () => {
      await Promise.resolve();
      return nav.home();
    });
    expect(text).toBe('Home');
  });

  it('types the arguments of a message', () => {
    expectTypeOf(cart.items).parameters.toEqualTypeOf<[count: number]>();
  });
});`;

const SCHEMA_TEST = `// src/i18n.test.ts
import { expect, it } from 'vitest';

import { locales } from './i18n';

it('accepts only the listed locales', () => {
  const { validate } = locales.paramsSchema['~standard'];
  expect(locales.run('ja', () => validate({ locale: 'en' }))).toStrictEqual({
    value: { locale: 'en' },
  });
  expect(validate({ locale: 'fr' })).toMatchObject({
    issues: [{ path: ['locale'] }],
  });
});`;

const BROWSER_TEST = `// src/messages/messages.browser.test.ts
import { afterEach, expect, it } from 'vitest';

import { locales } from '../i18n';
import * as nav from './nav';

const initial = location.pathname;

afterEach(() => {
  history.replaceState(null, '', initial);
});

it('renders in the locale the URL spells', () => {
  history.replaceState(null, '', '/en/cart');
  expect(locales.getLocale()).toBe('en');
  expect(nav.home()).toBe('Home');
});`;

export default function I18nIntegrationsPage() {
  return (
    <DocPage introduction={s.introduction} path="/:locale/i18n/integrations">
      <DocSection description={s.ui.description} title={s.ui.title}>
        <CodeBlock code={UI_LAYOUT} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.ui.serializable()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.ui.notFound()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.ui.otherLocales()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.ui.props()}</Rich>
          </li>
        </ul>
        <p>
          <LocaleAnchor path="/:locale/ui/i18n">
            <Rich>{s.ui.link()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={s.form.description} title={s.form.title}>
        <ol className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-decimal">
            <Rich>{s.form.errorMap()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{s.form.derive()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{s.form.action()}</Rich>
          </li>
        </ol>
        <CodeBlock code={TALK_MESSAGES} lang="ts" />
        <CodeBlock code={TALK_SCHEMA} lang="ts" />
        <CodeBlock code={TALK_PAGE} lang="tsx" />
        <CodeBlock code={TALK_ACTION} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.form.staticNote()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/form/get-started">
            <Rich>{s.form.guideLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={s.router.description} title={s.router.title}>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.router.links()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.router.switcher()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.router.match()}</Rich>
          </li>
        </ul>
        <p>
          <LocaleAnchor path="/:locale/i18n/routing">
            <Rich>{s.router.link()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={s.staticMode.description}
        title={s.staticMode.title}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.staticMode.paths()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.staticMode.notFound()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection description={s.server.description} title={s.server.title}>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.server.negotiate()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.server.noRedirect()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.server.actions()}</Rich>
          </li>
        </ul>
        <CodeBlock code={SERVER_ROOT_PAGE} lang="tsx" />
        <CodeBlock code={REDIRECT_TO} lang="tsx" />
        <p>
          <LocaleAnchor path="/:locale/server/deploy">
            <Rich>{s.server.deployLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={s.testing.description} title={s.testing.title}>
        <Heading level="h3">{s.testing.nodeTitle()}</Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.testing.nodeDescription()}</Rich>
        </p>
        <CodeBlock code={NODE_TEST} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.testing.nodeSchema()}</Rich>
        </p>
        <CodeBlock code={SCHEMA_TEST} lang="ts" />
        <Heading level="h3">{s.testing.browserTitle()}</Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.testing.browserDescription()}</Rich>
        </p>
        <CodeBlock code={BROWSER_TEST} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.testing.dom()}</Rich>
        </p>
        <Heading level="h3">{s.testing.setTitle()}</Heading>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.testing.otherSet()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.testing.typeTests()}</Rich>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
