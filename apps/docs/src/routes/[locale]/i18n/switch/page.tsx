
import { CodeBlock } from '../../../../components/code-block';
import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { LocalizeDemo } from '../../../../demos/i18n/switch/localize-demo';
import * as m from '../../../../messages';

const t = m.i18nSwitch;

const DESTINATION = `locales.delocalize('/ja/products/42');
// { locale: 'ja', pathname: '/products/42' }

locales.localize('/products/42', 'en');
// '/en/products/42'`;

const SWITCHER = `import type { Variants } from '@k8ordo/i18n';

import { locales } from '../i18n';

const NAMES: Variants<string> = { ja: '日本語', en: 'English' };

type Props = { pathname: string };

export function LanguageSwitcher({ pathname }: Props) {
  const rest = locales.delocalize(pathname).pathname;
  const current = locales.getLocale();

  return (
    <ul>
      {locales.all.map((locale) => (
        <li key={locale}>
          <a
            aria-current={locale === current ? 'true' : undefined}
            href={locales.localize(rest, locale)}
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

const REMEMBER = `import type { Locale } from '../i18n';

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
  href={locales.localize(rest, locale)}
  hrefLang={locale}
  lang={locale}
  onClick={() => {
    void rememberLocale(locale);
  }}
>`;

export default function I18nSwitchPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/switch">
      <DocSection id="url" title={t.urlTitle}>
        <CodeBlock code={DESTINATION} lang="ts" />
        <p>
          <Rich>{t.urlSegments()}</Rich>
        </p>
        <p>
          <Rich>{t.urlNull()}</Rich>
        </p>
        <p>
          <Rich>{t.urlRoot()}</Rich>
        </p>
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

      <DocSection id="switcher" title={t.switcherTitle}>
        <CodeBlock
          callouts={{
            10: t.switcherDelocalizeCallout(),
            19: t.switcherLocalizeCallout(),
          }}
          code={SWITCHER}
          lang="tsx"
          marks={{ 10: 'highlight', 19: 'highlight' }}
          title="src/components/language-switcher.tsx"
        />
        <p>
          <Rich>{t.switcherPathname()}</Rich>
          <LocaleAnchor path="/:locale/router/location">
            {m.router.navLocation()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.switcherAnchor()}</Rich>
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
            <LocaleAnchor path="/:locale/i18n/routing">
              {m.i18n.navRouting()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="remember" title={t.rememberTitle}>
        <CodeBlock
          code={REMEMBER}
          lang="ts"
          title="src/lib/remember-locale.ts"
        />
        <p>
          <Rich>{t.rememberWhy()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 6: t.rememberCallCallout() }}
          code={REMEMBER_CALL}
          lang="tsx"
          marks={{ 6: 'add', 7: 'add', 8: 'add' }}
          title="src/components/language-switcher.tsx"
        />
        <p>
          <Rich>{t.rememberDefaults()}</Rich>
        </p>
        <p>
          <Rich>{t.rememberName()}</Rich>
          <LocaleAnchor path="/:locale/i18n/negotiate">
            {m.i18n.navNegotiate()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.rememberStatic()}</Rich>
            <LocaleAnchor path="/:locale/i18n/negotiate">
              {m.i18n.navNegotiate()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
