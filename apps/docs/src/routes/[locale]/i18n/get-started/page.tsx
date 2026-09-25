import { Code, Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const I18N_MODULE = `// src/i18n.ts
import { defineLocales } from '@k8ordo/i18n';
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

// 文字列の中の `export const { paramsSchema }` は生成器に拾われない
// （ファイルをパースして export を読む）ので、コード例として置ける。
const LOCALE_LAYOUT = `// src/routes/[locale]/layout.tsx
import type { ReactNode } from 'react';

import { locales } from '../../i18n';

export const { paramsSchema } = locales;

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return children;
}`;

const HOME_MESSAGES = `// src/messages/home.ts
import { message } from '@k8ordo/i18n';

export const title = message({ ja: 'ようこそ', en: 'Welcome' });

export const nameLabel = message({ ja: '名前', en: 'Name' });

export const greeting = message({
  ja: (name: string) => \`こんにちは、\${name}さん\`,
  en: (name) => \`Hello, \${name}\`,
});`;

const SERVER_PAGE = `// src/routes/[locale]/page.tsx
import * as home from '../../messages/home';
import { Greeting } from './_parts/greeting';

export default function HomePage() {
  return (
    <main>
      <h1>{home.title()}</h1>
      <Greeting />
    </main>
  );
}`;

const CLIENT_COMPONENT = `// src/routes/[locale]/_parts/greeting.tsx
'use client';

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

export default function I18nGetStartedPage() {
  const s = m.i18nGetStarted;

  return (
    <DocPage introduction={s.introduction} path="/:locale/i18n/get-started">
      <DocSection description={s.scope.description} title={s.scope.title}>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.scope.set()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.scope.segment()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.scope.negotiation()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.scope.current()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.scope.messages()}</Rich>
          </li>
        </ul>
        <Heading level="h3">
          <Rich>{s.scope.notOwnedTitle()}</Rich>
        </Heading>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.scope.notPathname()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.scope.notGrammar()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.scope.notLoading()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.scope.why()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.install.description} title={s.install.title}>
        <InstallTabs
          npm={<CodeBlock code="npm install @k8ordo/i18n" lang="bash" />}
          pnpm={<CodeBlock code="pnpm add @k8ordo/i18n" lang="bash" />}
          yarn={<CodeBlock code="yarn add @k8ordo/i18n" lang="bash" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  {s.install.packageColumn()}
                </th>
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  {s.install.versionColumn()}
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  {s.install.neededForColumn()}
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              <tr className="border-border-mute border-b">
                <td className="py-3 pr-6 whitespace-nowrap">
                  <Code>typescript</Code>
                </td>
                <td className="py-3 pr-6 whitespace-nowrap">&gt;= 7.0.2</td>
                <td className="py-3">{s.install.typescript()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.install.runtime()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={s.defineSet.description}
        title={s.defineSet.title}
      >
        <CodeBlock code={I18N_MODULE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.defineSet.default()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.defineSet.register()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/i18n/locales">
            {s.defineSet.more()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={s.segment.description} title={s.segment.title}>
        <CodeBlock code={LOCALE_LAYOUT} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.segment.refuses()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.segment.accepts()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.segment.serverFile()}</Rich>
          </li>
        </ul>
        <p>
          <LocaleAnchor path="/:locale/i18n/routing">
            {s.segment.more()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={s.firstMessage.description}
        title={s.firstMessage.title}
      >
        <CodeBlock code={HOME_MESSAGES} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.firstMessage.args()}</Rich>
        </p>
        <Heading level="h3">
          <Rich>{s.firstMessage.serverTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.firstMessage.serverDescription()}</Rich>
        </p>
        <CodeBlock code={SERVER_PAGE} lang="tsx" />
        <Heading level="h3">
          <Rich>{s.firstMessage.clientTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.firstMessage.clientDescription()}</Rich>
        </p>
        <CodeBlock code={CLIENT_COMPONENT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.firstMessage.boundary()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/i18n/messages">
            {s.firstMessage.more()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection title={s.guarantees.title}>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.guarantees.schema()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.guarantees.compile()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.guarantees.args()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.guarantees.locale()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection title={s.nextSteps.title}>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/i18n/locales">
              <Rich>{s.nextSteps.locales()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/i18n/messages">
              <Rich>{s.nextSteps.messages()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/i18n/routing">
              <Rich>{s.nextSteps.routing()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/i18n/integrations">
              <Rich>{s.nextSteps.integrations()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
