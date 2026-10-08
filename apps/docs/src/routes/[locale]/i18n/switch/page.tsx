import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { LocalizeDemo } from './_parts/localize-demo';

const t = m.i18nSwitch;

const DESTINATION = `locales.delocalize('/ja/products/42');
// { locale: 'ja', pathname: '/products/42' }

locales.localize('/products/42', 'en');
// '/en/products/42'`;

const SWITCHER = `'use client';

import type { Variants } from '@k8ordo/i18n';
import { usePathname } from '@k8ordo/framework';

import { locales } from '../i18n';

const NAMES: Variants<string> = { ja: '日本語', en: 'English' };

export function LanguageSwitcher() {
  const { pathname } = locales.delocalize(usePathname());
  const current = locales.getLocale();

  return (
    <ul>
      {locales.all.map((locale) => (
        <li key={locale}>
          <a
            aria-current={locale === current ? 'true' : undefined}
            href={locales.localize(pathname, locale)}
            hrefLang={locale}
            lang={locale}
          >
            {NAMES[locale]}
          </a>
        </li>
      ))}
    </ul>
  );
}`;

const REMEMBER = `import type { Locale } from './i18n';

const MAX_AGE = 400 * 24 * 60 * 60 * 1000;

export const rememberLocale = (locale: Locale) =>
  cookieStore.set({
    name: 'locale',
    value: locale,
    sameSite: 'lax',
    expires: Date.now() + MAX_AGE,
  });`;

const REMEMBER_CALL = `<a
  aria-current={locale === current ? 'true' : undefined}
  href={locales.localize(pathname, locale)}
  hrefLang={locale}
  lang={locale}
  onClick={() => {
    void rememberLocale(locale);
  }}
>`;

export default function I18nSwitchPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/switch">
      <DocSection description={t.urlDescription} id="url" title={t.urlTitle}>
        <CodeBlock code={DESTINATION} lang="ts" />
        <ul>
          {[t.urlBySegment, t.urlNull, t.urlRoot].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <Pitfall>
          <p>
            <Rich>{t.urlPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <LocalizeDemo />
      </Playground>

      <DocSection
        description={t.switcherDescription}
        id="switcher"
        title={t.switcherTitle}
      >
        <CodeBlock
          code={SWITCHER}
          lang="tsx"
          marks={{ 11: 'highlight', 20: 'highlight' }}
          title="language-switcher.tsx"
        />
        <p>
          <Rich>{t.switcherPathname()}</Rich>
        </p>
        <p>
          <Rich>{t.switcherAnchor()}</Rich>
        </p>
        <p>
          <Rich>{t.switcherHref()}</Rich>
        </p>
        <p>
          <Rich>{t.switcherVariants()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.switcherQuery()}</Rich>
          </p>
          <p>
            <Rich>{t.switcherBase()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.rememberDescription}
        id="remember"
        title={t.rememberTitle}
      >
        <CodeBlock code={REMEMBER} lang="ts" title="remember-locale.ts" />
        <p>
          <Rich>{t.rememberCall()}</Rich>
        </p>
        <CodeBlock
          code={REMEMBER_CALL}
          lang="tsx"
          marks={{ 6: 'add', 7: 'add', 8: 'add' }}
          title="language-switcher.tsx"
        />
        <p>
          <Rich>{t.rememberDefaults()}</Rich>
        </p>
        <p>
          <Rich>{t.rememberName()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.rememberStatic()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
