import { Note } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
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

const REDIRECT = `import { locales } from '../i18n';

export function redirectToLocale(request: Request): Response {
  const locale = locales.negotiateRequest(request, {
    cookie: 'locale',
  });
  return new Response(null, {
    status: 307,
    headers: { location: locales.localize('/', locale) },
  });
}`;

const ROOT_REDIRECT = `'use client';

import { useEffect } from 'react';

import { locales } from '../i18n';

export function RootRedirect() {
  useEffect(() => {
    const locale = locales.negotiate(navigator.languages);
    location.replace(locales.localize('/', locale));
  }, []);

  return null;
}`;

const ROOT_REDIRECT_COOKIE = `useEffect(() => {
  void cookieStore.get('locale').then((saved) => {
    const locale = locales.negotiate([
      ...(saved?.value === undefined ? [] : [saved.value]),
      ...navigator.languages,
    ]);
    location.replace(locales.localize('/', locale));
  });
}, []);`;

export default function I18nNegotiatePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/negotiate">
      <DocSection id="negotiate" title={t.negotiateTitle}>
        <CodeBlock code={NEGOTIATE} lang="ts" marks={{ 3: 'highlight' }} />
        <p>
          <Rich>{t.negotiateIntro()}</Rich>
        </p>
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

      <DocSection id="accept-language" title={t.headerTitle}>
        <CodeBlock code={HEADER} lang="ts" />
        <p>
          <Rich>{t.headerIntro()}</Rich>
        </p>
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

      <DocSection id="request" title={t.requestTitle}>
        <CodeBlock code={REQUEST} lang="ts" />
        <p>
          <Rich>{t.requestIntro()}</Rich>
        </p>
        <p>
          <Rich>{t.requestCookie()}</Rich>
        </p>
        <p>
          <Rich>{t.requestWriterBefore()}</Rich>
          <LocaleAnchor path="/:locale/i18n/switch">
            {m.i18n.navSwitch()}
          </LocaleAnchor>
          <Rich>{t.requestWriterAfter(m.i18nSwitch.rememberTitle())}</Rich>
        </p>
      </DocSection>

      <DocSection id="server" title={t.serverTitle}>
        <CodeBlock
          callouts={{
            4: t.serverGuardCallout(),
            8: t.serverStatusCallout(),
          }}
          code={REDIRECT}
          lang="ts"
          marks={{ 4: 'highlight', 8: 'highlight', 9: 'highlight' }}
          title="src/lib/redirect-to-locale.ts"
        />
        <p>
          <Rich>{t.serverIntro()}</Rich>
        </p>
        <p>
          <Rich>{t.serverBase()}</Rich>
        </p>
        <p>
          <Rich>{t.serverFramework()}</Rich>
          <LocaleAnchor path="/:locale/framework/routing">
            {m.framework.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="static" title={t.staticTitle}>
        <CodeBlock
          code={ROOT_REDIRECT}
          lang="tsx"
          marks={{ 9: 'highlight', 10: 'highlight' }}
          title="src/components/root-redirect.tsx"
        />
        <p>
          <Rich>{t.staticIntro()}</Rich>
        </p>
        <ul>
          {[t.staticEffect, t.staticReplace].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <Note>
          <p>
            <Rich>{t.staticNoJs()}</Rich>
          </p>
        </Note>
        <DocSubsection id="static-cookie" title={t.staticCookieTitle}>
          <CodeBlock
            code={ROOT_REDIRECT_COOKIE}
            lang="tsx"
            marks={{ 2: 'highlight', 4: 'highlight' }}
            title="src/components/root-redirect.tsx"
          />
          <p>
            <Rich>{t.staticCookie()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>
    </DocPage>
  );
}
