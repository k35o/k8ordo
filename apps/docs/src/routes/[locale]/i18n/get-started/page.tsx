
import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nGetStarted;

const LOCALES = `import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});

declare module '@k8ordo/i18n' {
  interface Register {
    locale: LocaleOf<typeof locales>;
  }
}`;

const MESSAGES = `import { message } from '@k8ordo/i18n';

export const title = message({ ja: 'ようこそ', en: 'Welcome' });

export const nameLabel = message({ ja: '名前', en: 'Name' });

export const greeting = message({
  ja: (name: string) => \`こんにちは、\${name}さん\`,
  en: (name) => \`Hello, \${name}\`,
});`;

const WELCOME = `import { title } from '../messages/home';
import { Greeting } from './greeting';

export function Welcome() {
  return (
    <main>
      <h1>{title()}</h1>
      <Greeting />
    </main>
  );
}`;

const GREETING = `'use client';

import { useState } from 'react';

import { greeting, nameLabel } from '../messages/home';

export function Greeting() {
  const [name, setName] = useState('k8o');

  return (
    <div>
      <label>
        {nameLabel()}
        <input
          onChange={(event) => {
            setName(event.currentTarget.value);
          }}
          value={name}
        />
      </label>
      <p>{greeting(name)}</p>
    </div>
  );
}`;

export default function I18nGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/get-started">
      <DocSection id="install" title={t.installTitle}>
        <PackageInstall name="@k8ordo/i18n" />
        <p>
          <Rich>{t.runtime()}</Rich>
        </p>
      </DocSection>

      <DocSection id="locales" title={t.localesTitle}>
        <CodeBlock
          callouts={{ 5: t.localesDefaultCallout() }}
          code={LOCALES}
          lang="ts"
          marks={{ 5: 'highlight', 6: 'highlight', 11: 'highlight' }}
          title="src/i18n.ts"
        />
        <p>
          <Rich>{t.localesDefine()}</Rich>
        </p>
        <p>
          <Rich>{t.localesRegister()}</Rich>
          <LocaleAnchor path="/:locale/framework/routing">
            {m.framework.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.localesMore()}</Rich>
          <LocaleAnchor path="/:locale/i18n/locales">
            {m.i18n.navLocales()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="messages" title={t.messagesTitle}>
        <CodeBlock
          callouts={{ 8: t.messagesCallout() }}
          code={MESSAGES}
          lang="ts"
          marks={{ 8: 'highlight', 9: 'highlight' }}
          title="src/messages/home.ts"
        />
        <p>
          <Rich>{t.messagesDefine()}</Rich>
        </p>
        <p>
          <Rich>{t.messagesTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection id="server" title={t.serverTitle}>
        <CodeBlock
          callouts={{ 7: t.serverCallout() }}
          code={WELCOME}
          lang="tsx"
          marks={{ 7: 'highlight' }}
          title="src/components/welcome.tsx"
        />
        <p>
          <Rich>{t.serverCall()}</Rich>
        </p>
        <p>
          <Rich>{t.serverSet()}</Rich>
          <LocaleAnchor path="/:locale/i18n/routing">
            {m.i18n.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.serverFramework()}</Rich>
          <LocaleAnchor path="/:locale/framework/routing">
            {m.framework.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="client" title={t.clientTitle}>
        <CodeBlock
          callouts={{ 21: t.clientCallout() }}
          code={GREETING}
          lang="tsx"
          marks={{ 13: 'highlight', 21: 'highlight' }}
          title="src/components/greeting.tsx"
        />
        <p>
          <Rich>{t.clientSame()}</Rich>
        </p>
        <p>
          <Rich>{t.clientBoundary()}</Rich>
          <LocaleAnchor path="/:locale/i18n/messages">
            {m.i18n.navMessages()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
