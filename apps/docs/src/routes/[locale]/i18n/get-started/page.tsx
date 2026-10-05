import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
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

// コード例の中の `export const { paramsSchema }` は文字列なので、生成器
// （ファイルをパースして export を読む）はこのページの export と取り違えない
const LAYOUT = `import type { ReactNode } from 'react';

import { locales } from '../../i18n';

export const { paramsSchema } = locales;

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}`;

const MESSAGES = `import { message } from '@k8ordo/i18n';

export const title = message({ ja: 'ようこそ', en: 'Welcome' });

export const nameLabel = message({ ja: '名前', en: 'Name' });

export const greeting = message({
  ja: (name: string) => \`こんにちは、\${name}さん\`,
  en: (name) => \`Hello, \${name}\`,
});`;

const PAGE = `import * as home from '../../messages/home';
import { Greeting } from './_parts/greeting';

export default function HomePage() {
  return (
    <main>
      <h1>{home.title()}</h1>
      <Greeting />
    </main>
  );
}`;

const GREETING = `'use client';

import { useState } from 'react';

import * as home from '../../../messages/home';

export function Greeting() {
  const [name, setName] = useState('k8o');

  return (
    <div>
      <label>
        {home.nameLabel()}
        <input
          onChange={(event) => {
            setName(event.currentTarget.value);
          }}
          value={name}
        />
      </label>
      <p>{home.greeting(name)}</p>
    </div>
  );
}`;

const NEXT = [
  {
    path: '/:locale/i18n/messages',
    label: m.i18n.navMessages,
    description: t.nextMessages,
  },
  {
    path: '/:locale/i18n/switch',
    label: m.i18n.navSwitch,
    description: t.nextSwitch,
  },
  {
    path: '/:locale/i18n/negotiate',
    label: m.i18n.navNegotiate,
    description: t.nextNegotiate,
  },
] as const;

export default function I18nGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/get-started">
      <DocSection
        description={t.installDescription}
        id="install"
        title={t.installTitle}
      >
        <PackageInstall name="@k8ordo/i18n" />
        <Note>
          <p>
            <Rich>{t.runtimeNote()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.localesDescription}
        id="locales"
        title={t.localesTitle}
      >
        <CodeBlock
          code={LOCALES}
          lang="ts"
          marks={{ 5: 'highlight', 6: 'highlight' }}
          title="i18n.ts"
        />
        <p>
          <Rich>{t.localesDefault()}</Rich>
        </p>
        <p>
          <Rich>{t.localesRegister()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.segmentDescription}
        id="segment"
        title={t.segmentTitle}
      >
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 5: 'highlight' }}
          title="routes/[locale]/layout.tsx"
        />
        <p>
          <Rich>{t.segmentRefuse()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.segmentPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.messagesDescription}
        id="messages"
        title={t.messagesTitle}
      >
        <CodeBlock
          code={MESSAGES}
          lang="ts"
          marks={{ 8: 'highlight', 9: 'highlight' }}
          title="messages/home.ts"
        />
        <p>
          <Rich>{t.messagesTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={PAGE}
          lang="tsx"
          marks={{ 7: 'highlight' }}
          title="routes/[locale]/page.tsx"
        />
      </DocSection>

      <DocSection
        description={t.clientDescription}
        id="client"
        title={t.clientTitle}
      >
        <CodeBlock
          code={GREETING}
          lang="tsx"
          marks={{ 13: 'highlight', 21: 'highlight' }}
          title="routes/[locale]/_parts/greeting.tsx"
        />
        <p>
          <Rich>{t.clientBoundary()}</Rich>
        </p>
      </DocSection>

      <DocSection id="next" title={t.nextTitle}>
        <ul>
          {NEXT.map((step) => (
            <li key={step.path}>
              <LocaleAnchor path={step.path}>{step.label()}</LocaleAnchor>
              {' — '}
              <Rich>{step.description()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
