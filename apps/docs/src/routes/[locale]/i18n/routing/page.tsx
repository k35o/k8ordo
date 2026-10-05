import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nRouting;

// コード例の中の `export const { paramsSchema }` は文字列なので、生成器
// （ファイルをパースして export を読む）はこのページの export と取り違えない
const LAYOUT = `import { locales } from '../../i18n';

export const { paramsSchema } = locales;`;

const RUN = `import { locales } from '../i18n';
import type { Locale } from '../i18n';
import * as m from '../messages';

export const welcomeSubject = (locale: Locale) =>
  locales.run(locale, () => m.email.welcomeSubject());`;

const REGION = `import { locales } from '../i18n';

export function RegionName({ code }: { code: string }) {
  const names = new Intl.DisplayNames(locales.getLocale(), {
    type: 'region',
  });
  return <>{names.of(code)}</>;
}`;

const ROOT_LAYOUT = `import type { ReactNode } from 'react';

import { locales } from '../i18n';

export default function RootLayout({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  const locale =
    locales.delocalize(pathname).locale ?? locales.default;

  return (
    <html dir={locales.definitions[locale].dir} lang={locale}>
      <body>{children}</body>
    </html>
  );
}`;

const BASE = `import { withBase } from '@k8ordo/router';

withBase(locales.localize('/ui', 'en'));
// '/docs/en/ui'`;

export default function I18nRoutingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/routing">
      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 3: 'highlight' }}
          title="routes/[locale]/layout.tsx"
        />
        <p>
          <Rich>{t.serverScope()}</Rich>
        </p>
        <p>
          <Rich>{t.serverRefused()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.serverParams()}</Rich>
          </p>
        </Note>
        <Pitfall>
          <p>
            <Rich>{t.serverRuntime()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection description={t.runDescription} id="run" title={t.runTitle}>
        <CodeBlock
          code={RUN}
          lang="ts"
          marks={{ 6: 'highlight' }}
          title="emails/welcome.ts"
        />
        <p>
          <Rich>{t.runReturns()}</Rich>
        </p>
        <p>
          <Rich>{t.runAction()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.runBrowser()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.browserDescription}
        id="browser"
        title={t.browserTitle}
      >
        <p>
          <Rich>{t.browserDefault()}</Rich>
        </p>
        <p>
          <Rich>{t.browserSwitch()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.getLocaleDescription}
        id="get-locale"
        title={t.getLocaleTitle}
      >
        <CodeBlock
          code={REGION}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="region-name.tsx"
        />
        <p>
          <Rich>{t.getLocaleDestructure()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.getLocaleNoSubscribe()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.htmlDescription}
        id="html-lang"
        title={t.htmlTitle}
      >
        <CodeBlock
          code={ROOT_LAYOUT}
          lang="tsx"
          marks={{ 12: 'highlight', 13: 'highlight', 16: 'highlight' }}
          title="routes/layout.tsx"
        />
        <p>
          <Rich>{t.htmlNull()}</Rich>
        </p>
        <p>
          <Rich>{t.htmlSame()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.baseDescription} id="base" title={t.baseTitle}>
        <p>
          <Rich>{t.baseTerms()}</Rich>
        </p>
        <CodeBlock code={BASE} lang="ts" />
        <p>
          <Rich>{t.baseLinks()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
