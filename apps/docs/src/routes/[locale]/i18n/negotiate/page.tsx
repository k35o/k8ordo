import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { NegotiationDemo } from '../../../../demos/i18n/negotiate/negotiation-demo';
import * as m from '../../../../messages';

const t = m.i18nNegotiate;

const NEGOTIATE = `locales.all; // ['ja', 'en', 'en-GB']

locales.negotiate(navigator.languages);

locales.negotiate(['en-GB']); // 'en-GB'
locales.negotiate(['en-US', 'ja']); // 'en'
locales.negotiate(['ja-JP', 'en']); // 'ja'
locales.negotiate(['***', 'en']); // 'en'
locales.negotiate(['fr', 'de']); // 'ja'`;

const HEADER = `import { parseAcceptLanguage } from '@k8ordo/i18n';

parseAcceptLanguage('en-US;q=0.8, ja, en;q=0.9');
// ['ja', 'en', 'en-US']`;

const REQUEST = `locales.negotiateRequest(request, { cookie: 'locale' });`;

const GUARD = `import { withBase } from '@k8ordo/framework';
import type { Guard } from '@k8ordo/framework/server';

import { locales } from '../../i18n';

const guard: Guard<'/'> = ({ request }) => {
  const locale = locales.negotiateRequest(request, {
    cookie: 'locale',
  });
  return new Response(null, {
    status: 307,
    headers: { location: withBase(locales.localize('/', locale)) },
  });
};

export default guard;`;

const HOME_PAGE = `export default function RootPage() {
  return null;
}`;

const TREE = `routes/
  layout.tsx
  (home)/
    page.tsx
    guard.ts
  [locale]/
    layout.tsx`;

const STATIC_PAGE = `'use client';

import { useEffect } from 'react';

import { locales } from '../i18n';
import { navigateTo } from '../lib/links';

export default function RootRedirect() {
  useEffect(() => {
    navigateTo(
      '/:locale',
      { locale: locales.negotiate(navigator.languages) },
      { history: 'replace' },
    );
  }, []);

  return null;
}`;

const STATIC_COOKIE = `useEffect(() => {
  void cookieStore.get('locale').then((saved) => {
    navigateTo(
      '/:locale',
      {
        locale: locales.negotiate([
          ...(saved?.value === undefined ? [] : [saved.value]),
          ...navigator.languages,
        ]),
      },
      { history: 'replace' },
    );
  });
}, []);`;

export default function I18nNegotiatePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/negotiate">
      <DocSection
        description={t.negotiateDescription}
        id="negotiate"
        title={t.negotiateTitle}
      >
        <CodeBlock code={NEGOTIATE} lang="ts" marks={{ 3: 'highlight' }} />
        <ol>
          {t.negotiateSteps.map((step) => (
            <li key={step()}>
              <Rich>{step()}</Rich>
            </li>
          ))}
        </ol>
        <p>
          <Rich>{t.negotiateWhy()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.negotiateLanguage()}</Rich>
          </p>
        </Note>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <NegotiationDemo />
      </Playground>

      <DocSection
        description={t.headerDescription}
        id="accept-language"
        title={t.headerTitle}
      >
        <CodeBlock code={HEADER} lang="ts" />
        <ul>
          {t.headerRules.map((rule) => (
            <li key={rule()}>
              <Rich>{rule()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.headerTags()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.requestDescription}
        id="request"
        title={t.requestTitle}
      >
        <CodeBlock code={REQUEST} lang="ts" />
        <p>
          <Rich>{t.requestCookie()}</Rich>
        </p>
        <p>
          <Rich>{t.requestWriter()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={GUARD}
          lang="ts"
          marks={{ 7: 'highlight', 11: 'highlight', 12: 'highlight' }}
          title="src/routes/(home)/guard.ts"
        />
        <CodeBlock
          code={HOME_PAGE}
          lang="tsx"
          title="src/routes/(home)/page.tsx"
        />
        <p>
          <Rich>{t.serverTree()}</Rich>
        </p>
        <CodeBlock code={TREE} lang="text" />
        <ul>
          {[t.serverGroup, t.serverPage, t.serverStatus, t.serverPayload].map(
            (item) => (
              <li key={item()}>
                <Rich>{item()}</Rich>
              </li>
            ),
          )}
        </ul>
      </DocSection>

      <DocSection
        description={t.staticDescription}
        id="static"
        title={t.staticTitle}
      >
        <CodeBlock
          code={STATIC_PAGE}
          lang="tsx"
          marks={{ 12: 'highlight' }}
          title="src/routes/page.tsx"
        />
        <p>
          <Rich>{t.staticLinks()}</Rich>
        </p>
        <ul>
          {[t.staticEffect, t.staticReplace, t.staticWithoutRouter].map(
            (item) => (
              <li key={item()}>
                <Rich>{item()}</Rich>
              </li>
            ),
          )}
        </ul>
        <Note>
          <p>
            <Rich>{t.staticNoJs()}</Rich>
          </p>
        </Note>
        <p>
          <Rich>{t.staticCookie()}</Rich>
        </p>
        <CodeBlock
          code={STATIC_COOKIE}
          lang="tsx"
          marks={{ 2: 'highlight', 7: 'highlight', 8: 'highlight' }}
          title="src/routes/page.tsx"
        />
      </DocSection>
    </DocPage>
  );
}
