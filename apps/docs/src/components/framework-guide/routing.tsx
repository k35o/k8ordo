import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import { Playground } from '../playground';
import { Rich } from '../rich';
import type { Mode } from './mode';
import { PrefetchDemo } from './prefetch-demo';

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
      page.tsx
  _parts/
    counter.tsx`;

const PAGE_PROPS = `import type { PageProps } from '@k8ordo/router';

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

import { usePendingPathname } from '@k8ordo/router';

export function Progress() {
  const pending = usePendingPathname();
  if (pending === null) return null;
  return <p role="status">Loading {pending}…</p>;
}`;

const ROUTE = `import type { RouteContext } from '@k8ordo/router';

import { renderFeed } from '../_data/feed.server';

export async function GET({ request }: RouteContext<'/feed.xml'>) {
  const { origin } = new URL(request.url);
  return new Response(await renderFeed(origin), {
    headers: { 'content-type': 'application/rss+xml' },
  });
}`;

const GENERATED = `export const routes = defineRoutes({
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

const TITLE = `import type { PageProps } from '@k8ordo/router';

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

const PREFETCH = `<nav data-k8ordo-prefetch={false}>
  <a href={href('/reports')}>Reports</a>
  <a data-k8ordo-prefetch href={href('/')}>
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

const Paragraphs = ({ items }: { items: readonly Message[] }) =>
  items.map((item) => (
    <p key={item()}>
      <Rich>{item()}</Rich>
    </p>
  ));

/**
 * The `routes/` grammar, shared by `/static/routing` and `/server/routing`;
 * where the modes differ it reads the mode's own messages. A function rather
 * than a component, so `DocPage` sees the sections it returns and lists them
 * in the contents.
 */
export const routingSections = (mode: Mode) => {
  const t = m.frameworkRouting;
  const own = mode === 'static' ? m.staticRouting : m.serverRouting;
  const routeOwn =
    mode === 'static'
      ? [
          m.staticRouting.routeMode,
          m.staticRouting.routeSite,
          m.staticRouting.routeLimits,
          m.staticRouting.routeSitemap,
        ]
      : [
          m.serverRouting.routeMode,
          m.serverRouting.routeGuard,
          m.serverRouting.routeApi,
        ];
  const loadingOwn =
    mode === 'static'
      ? [m.staticRouting.loadingMode]
      : [m.serverRouting.loadingMode, m.serverRouting.loadingNav];

  return (
    <>
      <DocSection description={t.treeDescription} id="tree" title={t.treeTitle}>
        <CodeBlock code={TREE} lang="text" />
        <Items items={t.treeMap} />
        <p>
          <Rich>{t.treeChecked()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.namesDescription}
        id="names"
        title={t.namesTitle}
      >
        <Items items={t.namesList} />
        <p>
          <Rich>{t.namesNoRest()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.filesDescription}
        id="files"
        title={t.filesTitle}
      >
        <Items items={[...t.filesList, own.guardFile]} />
        <p>
          <Rich>{t.filesOther()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.propsDescription}
        id="props"
        title={t.propsTitle}
      >
        <CodeBlock
          code={PAGE_PROPS}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.propsPathname()}</Rich>
        </p>
        <p>
          <Rich>{t.propsTypes()}</Rich>
        </p>
        <p>
          <Rich>{own.propsRequest()}</Rich>
          {mode === 'server' && (
            <>
              {' '}
              <LocaleAnchor path="/:locale/server/request">
                {m.server.navRequest()}
              </LocaleAnchor>
            </>
          )}
        </p>
      </DocSection>

      <DocSection
        description={t.orderDescription}
        id="order"
        title={t.orderTitle}
      >
        <p>
          <Rich>{t.orderGroup()}</Rich>
        </p>
        <CodeBlock code={SHADOW_TREE} lang="text" />
        <p>
          <Rich>{t.orderShadow()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.refusesDescription}
        id="refuses"
        title={t.refusesTitle}
      >
        <Items items={t.refusesList} />
        <p>
          <Rich>{t.refusesDev()}</Rich>
        </p>
        <p>
          <Rich>{own.refusesMode()}</Rich>
          {mode === 'static' && (
            <>
              {' '}
              <LocaleAnchor path="/:locale/static/how-it-works">
                {m.static.navHowItWorks()}
              </LocaleAnchor>
            </>
          )}
        </p>
      </DocSection>

      <DocSection
        description={t.loadingDescription}
        id="loading"
        title={t.loadingTitle}
      >
        <CodeBlock
          code={LOADING}
          lang="tsx"
          title="src/routes/products/loading.tsx"
        />
        <p>
          <Rich>{t.loadingWhen()}</Rich>
        </p>
        <p>
          <Rich>{t.loadingKeep()}</Rich>
        </p>
        <CodeBlock
          code={PENDING}
          lang="tsx"
          title="src/routes/_parts/progress.tsx"
        />
        <Paragraphs items={loadingOwn} />
      </DocSection>

      <DocSection
        description={t.routeDescription}
        id="route"
        title={t.routeTitle}
      >
        <CodeBlock
          code={ROUTE}
          lang="ts"
          title="src/routes/feed.xml/route.ts"
        />
        <p>
          <Rich>{t.routeContext()}</Rich>
        </p>
        <p>
          <Rich>{t.routeName()}</Rich>
        </p>
        <p>
          <Rich>{t.routeAlone()}</Rich>
        </p>
        <Paragraphs items={routeOwn} />
      </DocSection>

      <DocSection
        description={t.generatedDescription}
        id="generated"
        title={t.generatedTitle}
      >
        <Items items={t.generatedFiles} />
        <CodeBlock code={GENERATED} lang="ts" title=".k8ordo/routes.gen.ts" />
        <p>
          <Rich>{t.generatedRead()}</Rich>
        </p>
        {mode === 'server' && (
          <p>
            <Rich>{m.serverRouting.generatedMode()}</Rich>
          </p>
        )}
        <p>
          <Rich>{t.generatedTsc()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.titlesDescription}
        id="titles"
        title={t.titlesTitle}
      >
        <CodeBlock
          code={TITLE}
          lang="tsx"
          marks={{ 8: 'highlight', 9: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.titlesOne()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.prefetchDescription}
        id="prefetch"
        title={t.prefetchTitle}
      >
        <p>
          <Rich>{t.prefetchAny()}</Rich>
        </p>
        <Items items={t.prefetchSkipped} />
        <p>
          <Rich>{t.prefetchStop()}</Rich>
        </p>
        <CodeBlock code={PREFETCH} lang="tsx" />
        <p>
          <Rich>{t.prefetchOnce()}</Rich>
        </p>
        <p>
          <Rich>{own.prefetchMode()}</Rich>
        </p>
        <p>
          <Rich>{t.prefetchSpeculation()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="prefetch-demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <PrefetchDemo mode={mode} />
      </Playground>
    </>
  );
};
