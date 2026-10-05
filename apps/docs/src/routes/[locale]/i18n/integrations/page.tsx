import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nIntegrations;

const UI_LOCALES = `import { defineLocales } from '@k8ordo/i18n';
import { registerMessages } from '@k8ordo/ui/i18n';

import { fr } from './ui-messages/fr';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
  fr: { timeZone: 'Europe/Paris', dir: 'ltr' },
});

registerMessages('fr', fr);`;

const TALK_SCHEMA = `import * as z from 'zod';

import * as m from '../messages';

export const talkSchema = z.object({
  title: z
    .string()
    .min(1, { error: m.talk.titleRequired })
    .max(120, { error: () => m.talk.titleTooLong(120) }),
});`;

const TALK_PAGE = `export default function NewTalkPage() {
  const talkFields = formFields(talkSchema);
  return <TalkForm action={createTalk} fields={talkFields} />;
}`;

const LINKS = `import { bindParams } from '@k8ordo/router';

import { locales } from './i18n';

export const { href, navigateTo } = bindParams(() => ({
  locale: locales.getLocale(),
}));`;

const HREF = `href('/:locale/products/:id', { id: '42' });
// '/en/products/42'

navigateTo('/:locale', { locale: 'ja' }, { history: 'replace' });`;

export default function I18nIntegrationsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/integrations">
      <DocSection description={t.uiDescription} id="ui" title={t.uiTitle}>
        <p>
          <Rich>{t.uiBuiltIn()}</Rich>
        </p>
        <CodeBlock
          code={UI_LOCALES}
          lang="ts"
          marks={{ 2: 'highlight', 12: 'highlight' }}
          title="i18n.ts"
        />
        <p>
          <Rich>{t.uiTypes()}</Rich>
        </p>
        <p>
          <Rich>{t.uiProps()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.uiPitfall()}</Rich>
          </p>
        </Pitfall>
        <p>
          <LocaleAnchor path="/:locale/ui/i18n">
            <Rich>{t.uiLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={t.formDescription} id="form" title={t.formTitle}>
        <CodeBlock
          code={TALK_SCHEMA}
          lang="ts"
          marks={{ 8: 'highlight', 9: 'highlight' }}
          title="schema.ts"
        />
        <p>
          <Rich>{t.formRule()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.formFieldsPitfall()}</Rich>
          </p>
        </Pitfall>
        <CodeBlock
          code={TALK_PAGE}
          lang="tsx"
          marks={{ 2: 'highlight' }}
          title="page.tsx"
        />
        <p>
          <Rich>{t.formAction()}</Rich>
        </p>
        <p>
          <Rich>{t.formOutside()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/form/errors">
            <Rich>{t.formLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.routerDescription}
        id="router"
        title={t.routerTitle}
      >
        <CodeBlock
          code={LINKS}
          lang="ts"
          marks={{ 5: 'highlight', 6: 'highlight' }}
          title="links.ts"
        />
        <CodeBlock code={HREF} lang="ts" />
        <p>
          <Rich>{t.routerSource()}</Rich>
        </p>
        <p>
          <Rich>{t.routerOverride()}</Rich>
        </p>
        <p>
          <Rich>{t.routerTyped()}</Rich>
        </p>
        <p>
          <Rich>{t.routerMatch()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/router/links">
            <Rich>{t.routerLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.frameworkDescription}
        id="framework"
        title={t.frameworkTitle}
      >
        <ul>
          {t.frameworkList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
