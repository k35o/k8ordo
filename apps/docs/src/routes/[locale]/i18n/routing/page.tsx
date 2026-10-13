import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nRouting;

const RUN = `import { locales } from '../i18n';
import type { Locale } from '../i18n';
import { welcomeSubject } from '../messages/email';

export const subjectIn = (locale: Locale) =>
  locales.run(locale, () => welcomeSubject());`;

const REGION = `import { locales } from '../i18n';

export function RegionName({ code }: { code: string }) {
  const names = new Intl.DisplayNames(locales.getLocale(), {
    type: 'region',
  });
  return <>{names.of(code)}</>;
}`;

const DOCUMENT = `import type { ReactNode } from 'react';

import { locales } from '../i18n';

export function Document({ children }: { children: ReactNode }) {
  const locale = locales.getLocale();

  return (
    <html dir={locales.definitions[locale].dir} lang={locale}>
      <body>{children}</body>
    </html>
  );
}`;

const BASE = `import { locales } from '../i18n';

// base: '/docs/', URL: '/docs/en/ui'
locales.delocalize('/en/ui');
// { locale: 'en', pathname: '/ui' }
locales.localize('/ui', 'ja');
// '/ja/ui'`;

export default function I18nRoutingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/routing">
      <DocSection id="browser" title={t.browserTitle}>
        <p>
          <Rich>{t.browserUrl()}</Rich>
        </p>
        <p>
          <Rich>{t.browserRun()}</Rich>
        </p>
        <p>
          <Rich>{t.browserSwitch()}</Rich>
          <LocaleAnchor path="/:locale/i18n/switch">
            {m.i18n.navSwitch()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="server" title={t.serverTitle}>
        <CodeBlock
          code={RUN}
          lang="ts"
          marks={{ 6: 'highlight' }}
          title="src/lib/welcome.ts"
        />
        <p>
          <Rich>{t.serverRun()}</Rich>
        </p>
        <p>
          <Rich>{t.serverSchema()}</Rich>
          <LocaleAnchor path="/:locale/framework/routing">
            {m.framework.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.serverDefault()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.serverRuntime()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="get-locale" title={t.getLocaleTitle}>
        <CodeBlock
          code={REGION}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="src/components/region-name.tsx"
        />
        <p>
          <Rich>{t.getLocaleCall()}</Rich>
        </p>
        <p>
          <Rich>{t.getLocaleDestructure()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.getLocaleNoSubscribe()}</Rich>
            <LocaleAnchor path="/:locale/router/location">
              {m.router.navLocation()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="html-lang" title={t.htmlTitle}>
        <CodeBlock
          code={DOCUMENT}
          lang="tsx"
          marks={{ 6: 'highlight', 9: 'highlight' }}
          title="src/components/document.tsx"
        />
        <p>
          <Rich>{t.htmlServer()}</Rich>
        </p>
        <p>
          <Rich>{t.htmlNull()}</Rich>
        </p>
      </DocSection>

      <DocSection id="base" title={t.baseTitle}>
        <CodeBlock code={BASE} lang="ts" />
        <p>
          <Rich>{t.baseSegment()}</Rich>
        </p>
        <p>
          <Rich>{t.baseTerms()}</Rich>
        </p>
        <p>
          <Rich>{t.baseLinks()}</Rich>
          <LocaleAnchor path="/:locale/router/base">
            {m.router.navBase()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
