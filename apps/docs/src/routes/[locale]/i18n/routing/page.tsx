import { Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const s = m.i18nRouting;

// 文字列の中の `export const { paramsSchema }` は生成器に拾われない
// （ファイルをパースして export を読む）ので、コード例として置ける。
const LOCALE_LAYOUT = `// src/routes/[locale]/layout.tsx
import type { ReactNode } from 'react';

import { locales } from '../../i18n';
import { LocaleShell } from './_parts/locale-shell';

export const { paramsSchema } = locales;

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <LocaleShell>{children}</LocaleShell>;
}`;

const RUN = `// src/emails/welcome.ts
import { locales } from '../i18n';
import type { Locale } from '../i18n';
import * as m from '../messages';

export const welcomeSubject = (locale: Locale): string =>
  locales.run(locale, () => m.email.welcomeSubject());`;

const GET_LOCALE_EXPORT = `// src/i18n.ts
import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});

export type Locale = LocaleOf<typeof locales>;

declare module '@k8ordo/i18n' {
  interface Register {
    locale: Locale;
  }
}

export const { getLocale } = locales;`;

const GET_LOCALE_USE = `// src/components/region-name.tsx
import { getLocale } from '../i18n';

export function RegionName({ code }: { code: string }) {
  return <>{new Intl.DisplayNames(getLocale(), { type: 'region' }).of(code)}</>;
}`;

const SWITCHER = `// src/components/language-switcher.tsx
'use client';

import type { Variants } from '@k8ordo/i18n';
import { usePathname } from '@k8ordo/router';

import { getLocale, locales } from '../i18n';

const LABELS: Variants<string> = { ja: '日本語', en: 'English' };

export function LanguageSwitcher() {
  const { pathname } = locales.delocalize(usePathname());
  const current = getLocale();

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
            {LABELS[locale]}
          </a>
        </li>
      ))}
    </ul>
  );
}`;

const ROOT_PAGE = `// src/routes/page.tsx
'use client';

import { useEffect } from 'react';

import { locales } from '../i18n';
import { navigateTo } from '../links';

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

const ROOT_LAYOUT = `// src/routes/layout.tsx
import type { ReactNode } from 'react';

import { locales } from '../i18n';

export default function RootLayout({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  const locale = locales.delocalize(pathname).locale ?? locales.default;

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}`;

const VITE_CONFIG = `// vite.config.ts
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  plugins: [framework({ paths: locales.paths })],
});`;

const VITE_CONFIG_SLUGS = `// vite.config.ts
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';
import { readSlugs } from './src/posts';

export default defineConfig({
  plugins: [
    framework({
      paths: async (patterns) => {
        const slugs = await readSlugs();
        return locales
          .paths(patterns)
          .flatMap((path) =>
            path.includes('/:slug')
              ? slugs.map((slug) => path.replace('/:slug', \`/\${slug}\`))
              : [path],
          );
      },
    }),
  ],
});`;

const LINKS = `// src/links.ts
import { bindParams } from '@k8ordo/router';

import { locales } from './i18n';

export const { href, navigateTo } = bindParams(() => ({
  locale: locales.getLocale(),
}));`;

const PRODUCT_LINK = `// src/components/product-link.tsx
import { href } from '../links';

export function ProductLink({ id, name }: { id: string; name: string }) {
  return <a href={href('/:locale/products/:id', { id })}>{name}</a>;
}`;

const TH = 'py-3 pr-6 font-medium whitespace-nowrap';
const TR = 'border-border-mute border-b';

export default function I18nRoutingPage() {
  return (
    <DocPage introduction={s.introduction} path="/:locale/i18n/routing">
      <DocSection description={s.sources.description} title={s.sources.title}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={TR}>
                <th className={TH}>{s.sources.sideColumn()}</th>
                <th className={TH}>{s.sources.sourceColumn()}</th>
                <th className={TH}>{s.sources.noneColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              <tr className={TR}>
                <td className="py-3 pr-6 align-top">{s.sources.server()}</td>
                <td className="py-3 pr-6 align-top">
                  <Rich>{s.sources.serverSource()}</Rich>
                </td>
                <td className="py-3 align-top">{s.sources.default()}</td>
              </tr>
              <tr className={TR}>
                <td className="py-3 pr-6 align-top">{s.sources.browser()}</td>
                <td className="py-3 pr-6 align-top">
                  <Rich>{s.sources.browserSource()}</Rich>
                </td>
                <td className="py-3 align-top">{s.sources.browserDefault()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.sources.concurrent()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.sources.detect()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.sources.beforeSet()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.schema.description} title={s.schema.title}>
        <CodeBlock code={LOCALE_LAYOUT} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.schema.shape()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.schema.refuses()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.schema.value()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.schema.current()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.schema.serverFile()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.schema.params()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection description={s.run.description} title={s.run.title}>
        <CodeBlock code={RUN} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.run.throws()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={s.getLocale.description}
        title={s.getLocale.title}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.getLocale.destructure()}</Rich>
        </p>
        <CodeBlock code={GET_LOCALE_EXPORT} lang="ts" />
        <CodeBlock code={GET_LOCALE_USE} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.getLocale.subscribe()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.getLocale.moduleScope()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection description={s.switcher.description} title={s.switcher.title}>
        <CodeBlock code={SWITCHER} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.switcher.bySegment()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.switcher.noGuess()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.switcher.noCheck()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.switcher.pathnameOnly()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.switcher.why()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.root.description} title={s.root.title}>
        <CodeBlock code={ROOT_PAGE} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.root.effect()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.root.replace()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.root.withoutRouter()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.root.server()}</Rich>
          </li>
        </ul>
        <p>
          <LocaleAnchor path="/:locale/i18n/integrations">
            <Rich>{s.root.serverLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={s.htmlLang.description} title={s.htmlLang.title}>
        <CodeBlock code={ROOT_LAYOUT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.htmlLang.same()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={s.staticBuild.description}
        title={s.staticBuild.title}
      >
        <CodeBlock code={VITE_CONFIG} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.staticBuild.expands()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.staticBuild.passes()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.staticBuild.perRequest()}</Rich>
          </li>
        </ul>
        <Heading level="h3">{s.staticBuild.secondTitle()}</Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.staticBuild.secondDescription()}</Rich>
        </p>
        <CodeBlock code={VITE_CONFIG_SLUGS} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.staticBuild.notFound()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.links.description} title={s.links.title}>
        <CodeBlock code={LINKS} lang="ts" />
        <CodeBlock code={PRODUCT_LINK} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.links.source()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.links.override()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.links.independent()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.links.remaining()}</Rich>
          </li>
        </ul>
        <p>
          <LocaleAnchor path="/:locale/router/links">
            <Rich>{s.links.routerLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
