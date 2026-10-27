import type { Message } from '@k8ordo/i18n';

import { Note, Pitfall } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { PrefetchDemo } from '../../../../demos/framework/routing/prefetch-demo';
import * as m from '../../../../messages';

const t = m.frameworkRouting;

const TREE = `src/routes/
  layout.tsx
  page.tsx
  not-found.tsx
  products/
    page.tsx
    [id]/
      page.tsx
  (docs)/
    layout.tsx
    guide/
      page.tsx`;

const PAGE_PROPS = `import type { PageProps } from '@k8ordo/framework';

export default function ProductPage({
  params,
  pathname,
}: PageProps<'/products/:id'>) {
  return (
    <>
      <h1>{params.id}</h1>
      <p>{pathname}</p>
    </>
  );
}`;

const ROUTER_API = `'use client';

import { href, useMatch } from '@k8ordo/framework';

export function ProductsLink() {
  const showing = useMatch('/products/*', { inclusive: true }) !== null;
  return (
    <a aria-current={showing ? 'page' : undefined} href={href('/products')}>
      Products
    </a>
  );
}`;

const LOCALE_LAYOUT = `import type { ReactNode } from 'react';

import { locales } from '../../i18n';

export const { paramsSchema } = locales;

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}`;

const HOME_TREE = `src/routes/
  layout.tsx
  (home)/
    guard.ts
    page.tsx
  [locale]/
    layout.tsx
    page.tsx`;

const HOME_GUARD = `import { withBase } from '@k8ordo/framework';
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

const HOME_PAGE = `export default function HomePage() {
  return null;
}`;

const HOME_STATIC = `'use client';

import { navigateTo } from '@k8ordo/framework';
import { useEffect } from 'react';

import { locales } from '../i18n';

export default function HomePage() {
  useEffect(() => {
    navigateTo(
      '/:locale',
      { locale: locales.negotiate(navigator.languages) },
      { history: 'replace' },
    );
  }, []);

  return null;
}`;

const HOME_COOKIE = `useEffect(() => {
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

const HTML_LANG = `import type { LayoutProps } from '@k8ordo/framework';

import { locales } from '../i18n';

export default function RootLayout({
  children,
  pathname,
}: LayoutProps<'/'>) {
  const locale =
    locales.delocalize(pathname).locale ?? locales.default;

  return (
    <html dir={locales.definitions[locale].dir} lang={locale}>
      <body>{children}</body>
    </html>
  );
}`;

const SHADOW_TREE = `src/routes/
  about/
    page.tsx
  (shop)/
    sale/
      page.tsx
    [id]/
      page.tsx`;

const LOADING = `export default function ProductsLoading() {
  return <p>Loading products…</p>;
}`;

const PENDING = `'use client';

import { usePendingPathname } from '@k8ordo/framework';

export function Progress() {
  const pending = usePendingPathname();
  if (pending === null) return null;
  return <p role="status">Loading {pending}…</p>;
}`;

const ROUTE = `import type { RouteContext } from '@k8ordo/framework';

import { renderFeed } from '../../lib/feed.server';

export async function GET({ request }: RouteContext<'/feed.xml'>) {
  const { origin } = new URL(request.url);
  return new Response(await renderFeed(origin), {
    headers: { 'content-type': 'application/rss+xml' },
  });
}`;

const GENERATED = `import { defineRoutes } from '@k8ordo/framework/generated';
// …

export const routes = defineRoutes({
  '/': {
    layout: layout satisfies Layout<'/'>,
    children: {
      '/': page satisfies Page<'/'>,
      '/products': {
        children: {
          '/': products_page satisfies Page<'/products'>,
          '/:id': products_id_page satisfies Page<'/products/:id'>,
        },
      },
    },
  },
});`;

const GENERATE_CI = `- run: pnpm exec k8ordo generate
- run: pnpm exec tsc --noEmit`;

const TITLE = `import type { PageProps } from '@k8ordo/framework';

export default function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  return (
    <>
      <title>{\`Product \${params.id}\`}</title>
      <meta content="One product" name="description" />
      <h1>{params.id}</h1>
    </>
  );
}`;

const PREFETCH = `<nav data-k8ordo-prefetch="false">
  <a href={href('/reports')}>Reports</a>
  <a data-k8ordo-prefetch="true" href={href('/')}>
    Home
  </a>
</nav>`;

const Items = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function FrameworkRoutingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/routing">
      <DocSection id="tree" title={t.treeTitle}>
        <CodeBlock code={TREE} lang="text" />
        <Items items={t.treeMap} />
      </DocSection>

      <DocSection id="names" title={t.namesTitle}>
        <p>
          <Rich>{t.namesLead()}</Rich>
        </p>
        <Items items={t.namesList} />
        <p>
          <Rich>{t.namesNoRest()}</Rich>
        </p>
      </DocSection>

      <DocSection id="files" title={t.filesTitle}>
        <p>
          <Rich>{t.filesLead()}</Rich>
        </p>
        <Items items={[...t.filesList, t.guardFile, t.fallbackFile]} />
        <p>
          <Rich>{t.filesOther()}</Rich>
        </p>
      </DocSection>

      <DocSection id="props" title={t.propsTitle}>
        <CodeBlock
          code={PAGE_PROPS}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.propsReceive()}</Rich>
        </p>
        <p>
          <Rich>{t.propsTypes()}</Rich>
        </p>
        <p>
          <Rich>{t.propsRequest()}</Rich>
          <LocaleAnchor path="/:locale/framework/request">
            {m.framework.navRequest()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="router" title={t.routerTitle}>
        <CodeBlock
          code={ROUTER_API}
          lang="tsx"
          marks={{ 3: 'highlight', 6: 'highlight', 8: 'highlight' }}
          title="src/components/products-link.tsx"
        />
        <p>
          <Rich>{t.routerCarry()}</Rich>
        </p>
        <p>
          <Rich>{t.routerNoMatch()}</Rich>
          <LocaleAnchor path="/:locale/framework/boundaries">
            {m.framework.navBoundaries()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="locale" title={t.localeTitle}>
        <CodeBlock
          code={LOCALE_LAYOUT}
          lang="tsx"
          marks={{ 5: 'highlight' }}
          title="src/routes/[locale]/layout.tsx"
        />
        <p>
          <Rich>{t.localeSchema()}</Rich>
          <LocaleAnchor path="/:locale/i18n/routing">
            {m.i18n.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.localeRuns()}</Rich>
          <LocaleAnchor path="/:locale/i18n/negotiate">
            {m.i18n.navNegotiate()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.localeStatic()}</Rich>
          <LocaleAnchor path="/:locale/framework/params">
            {m.framework.navParams()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="root-server" title={t.rootServerTitle}>
        <CodeBlock code={HOME_TREE} lang="text" />
        <CodeBlock
          callouts={{
            7: t.rootServerChooseCallout(),
            11: t.rootServerStatusCallout(),
          }}
          code={HOME_GUARD}
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
          <Rich>{t.rootServerGuard()}</Rich>
        </p>
        <p>
          <Rich>{t.rootServerGroup()}</Rich>
        </p>
        <p>
          <Rich>{t.rootServerAnswers()}</Rich>
        </p>
      </DocSection>

      <DocSection id="root-static" title={t.rootStaticTitle}>
        <CodeBlock
          code={HOME_STATIC}
          lang="tsx"
          marks={{ 12: 'highlight', 13: 'highlight' }}
          title="src/routes/page.tsx"
        />
        <p>
          <Rich>{t.rootStaticPage()}</Rich>
        </p>
        <p>
          <Rich>{t.rootStaticEffect()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.rootStaticNoJs()}</Rich>
          </p>
        </Note>
        <DocSubsection id="root-static-cookie" title={t.rootCookieTitle}>
          <CodeBlock
            code={HOME_COOKIE}
            lang="tsx"
            marks={{ 2: 'highlight', 6: 'highlight', 7: 'highlight' }}
            title="src/routes/page.tsx"
          />
          <p>
            <Rich>{t.rootCookie()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection id="html-lang" title={t.htmlTitle}>
        <CodeBlock
          code={HTML_LANG}
          lang="tsx"
          marks={{ 7: 'highlight', 10: 'highlight', 13: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <p>
          <Rich>{t.htmlPathname()}</Rich>
        </p>
        <p>
          <Rich>{t.htmlGetLocale()}</Rich>
        </p>
      </DocSection>

      <DocSection id="order" title={t.orderTitle}>
        <CodeBlock code={SHADOW_TREE} lang="text" />
        <p>
          <Rich>{t.orderRule()}</Rich>
        </p>
        <p>
          <Rich>{t.orderGroup()}</Rich>
        </p>
        <p>
          <Rich>{t.orderShadow()}</Rich>
        </p>
      </DocSection>

      <DocSection id="refuses" title={t.refusesTitle}>
        <p>
          <Rich>{t.refusesLead()}</Rich>
        </p>
        <Items items={t.refusesList} />
        <p>
          <Rich>{t.refusesDev()}</Rich>
        </p>
        <p>
          <Rich>{t.refusesMode()}</Rich>
          <LocaleAnchor path="/:locale/framework/modes">
            {m.framework.navModes()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="loading" title={t.loadingTitle}>
        <CodeBlock
          code={LOADING}
          lang="tsx"
          title="src/routes/products/loading.tsx"
        />
        <p>
          <Rich>{t.loadingWhen()}</Rich>
        </p>
        <p>
          <Rich>{t.loadingStatic()}</Rich>
        </p>
        <p>
          <Rich>{t.loadingServer()}</Rich>
        </p>
        <CodeBlock
          code={PENDING}
          lang="tsx"
          title="src/components/progress.tsx"
        />
        <p>
          <Rich>{t.loadingKeep()}</Rich>
        </p>
      </DocSection>

      <DocSection id="route" title={t.routeTitle}>
        <CodeBlock
          code={ROUTE}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="src/routes/feed.xml/route.ts"
        />
        <p>
          <Rich>{t.routeLead()}</Rich>
        </p>
        <p>
          <Rich>{t.routeName()}</Rich>
        </p>
        <DocSubsection id="route-static" title={t.routeStaticTitle}>
          <p>
            <Rich>{t.routeStatic()}</Rich>
          </p>
          <Pitfall>
            <p>
              <Rich>{t.routeRefusedLead()}</Rich>
            </p>
            <Items items={t.routeRefused} />
          </Pitfall>
          <p>
            <Rich>{t.routeStaticType()}</Rich>
          </p>
          <Pitfall>
            <p>
              <Rich>{t.routeStaticPlainText()}</Rich>
            </p>
          </Pitfall>
        </DocSubsection>
        <DocSubsection id="route-server" title={t.routeServerTitle}>
          <p>
            <Rich>{t.routeServer()}</Rich>
          </p>
          <p>
            <Rich>{t.routeServerGuard()}</Rich>
          </p>
          <Pitfall>
            <p>
              <Rich>{t.routePost()}</Rich>
            </p>
          </Pitfall>
        </DocSubsection>
      </DocSection>

      <DocSection id="generated" title={t.generatedTitle}>
        <CodeBlock
          code={GENERATED}
          lang="ts"
          marks={{ 1: 'highlight' }}
          title=".k8ordo/routes.gen.ts"
        />
        <p>
          <Rich>{t.generatedWhen()}</Rich>
        </p>
        <Items items={t.generatedFiles} />
        <p>
          <Rich>{t.generatedRead()}</Rich>
        </p>
        <p>
          <Rich>{t.generatedTsc()}</Rich>
        </p>
        <CodeBlock
          code={GENERATE_CI}
          lang="yaml"
          title=".github/workflows/ci.yml"
        />
      </DocSection>

      <DocSection id="titles" title={t.titlesTitle}>
        <CodeBlock
          code={TITLE}
          lang="tsx"
          marks={{ 8: 'highlight', 9: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.titlesApi()}</Rich>
        </p>
        <p>
          <Rich>{t.titlesOne()}</Rich>
        </p>
      </DocSection>

      <DocSection id="prefetch" title={t.prefetchTitle}>
        <CodeBlock
          code={PREFETCH}
          lang="tsx"
          marks={{ 1: 'highlight', 3: 'highlight' }}
        />
        <p>
          <Rich>{t.prefetchWhen()}</Rich>
        </p>
        <Items items={t.prefetchSkipped} />
        <p>
          <Rich>{t.prefetchStop()}</Rich>
        </p>
        <p>
          <Rich>{t.prefetchOnce()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.prefetchSpeculation()}</Rich>
          </p>
        </Note>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="prefetch-demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <PrefetchDemo />
      </Playground>
    </DocPage>
  );
}
