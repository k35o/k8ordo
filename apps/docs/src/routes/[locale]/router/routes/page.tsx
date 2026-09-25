import type { Message } from '@k8ordo/i18n';
import { Code, Heading, Table } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const SHAPE = `// src/routes.ts
import { defineRoutes } from '@k8ordo/router';
import { lazy } from 'react';

import { Home } from './pages/home';
import { ProductList } from './pages/product-list';
import { ProductPage } from './pages/product-page';
import { ProductsLayout } from './products-layout';
import { RootLayout } from './root-layout';

const Settings = lazy(() => import('./pages/settings'));

export const routes = defineRoutes({
  '/': {
    layout: RootLayout,
    children: {
      '/': Home,
      '/products': {
        layout: ProductsLayout,
        children: {
          '/': ProductList,
          '/:id': ProductPage,
        },
      },
      '/settings': Settings,
    },
  },
});`;

const LAYOUTS = `// src/root-layout.tsx
import { Outlet } from '@k8ordo/router';
import { Suspense } from 'react';

export function RootLayout() {
  return (
    <>
      <header>Shop</header>
      <Suspense fallback={<p>Loading…</p>}>
        <Outlet />
      </Suspense>
    </>
  );
}`;

const PRODUCTS_LAYOUT = `// src/products-layout.tsx
import { Outlet } from '@k8ordo/router';

export function ProductsLayout() {
  return (
    <section>
      <h1>Products</h1>
      <Outlet />
    </section>
  );
}`;

const GROUPS = `// src/routes.ts
import { defineRoutes } from '@k8ordo/router';

import { DocsLayout } from './docs-layout';
import { MarketingLayout } from './marketing-layout';
import { Guide } from './pages/guide';
import { Home } from './pages/home';
import { Pricing } from './pages/pricing';

export const routes = defineRoutes({
  '/(marketing)': {
    layout: MarketingLayout,
    children: {
      '/': Home,
      '/pricing': Pricing,
    },
  },
  '/(docs)': {
    layout: DocsLayout,
    children: {
      '/guide': Guide,
    },
  },
});`;

const ORDER_WRONG = `// src/routes.ts
import { defineRoutes } from '@k8ordo/router';

import { NewProduct } from './pages/new-product';
import { ProductPage } from './pages/product-page';

export const routes = defineRoutes({
  '/products/:id': ProductPage,
  '/products/new': NewProduct,
});`;

const ORDER_RIGHT = `// src/routes.ts
import { defineRoutes } from '@k8ordo/router';

import { NewProduct } from './pages/new-product';
import { ProductPage } from './pages/product-page';

export const routes = defineRoutes({
  '/products/new': NewProduct,
  '/products/:id': ProductPage,
});`;

const MATCH = `// src/routes.test.ts
import type { Match } from '@k8ordo/router';
import { expect, it } from 'vitest';

import { routes } from './routes';

it('sends /products/new to its own page, not to :id', () => {
  expect(routes.match('/products/new')?.pattern).toBe('/products/new');
  expect(routes.match('/products/42')?.params).toStrictEqual({ id: '42' });
  expect(routes.match('/nowhere')).toBeNull();
});

it('walks on when the caller declines a fit', () => {
  const onlyNumericIds = (found: Match) =>
    found.pattern !== '/products/:id' ||
    /^\\d+$/u.test(found.params['id'] ?? '');

  expect(routes.match('/products/7', onlyNumericIds)?.pattern).toBe(
    '/products/:id',
  );
  expect(routes.match('/products/shoes', onlyNumericIds)).toBeNull();
});`;

const ERROR_COMPONENT = `// src/products-error.tsx
import type { ErrorProps } from '@k8ordo/router';
import { href } from '@k8ordo/router';

export function ProductsError({ error, reset }: ErrorProps) {
  return (
    <div role="alert">
      <p>{error instanceof Error ? error.message : 'Something went wrong'}</p>
      <button onClick={reset} type="button">
        Try again
      </button>
      <a href={href('/products')}>Back to the list</a>
    </div>
  );
}`;

const ERROR_TABLE = `// src/routes.ts
import { defineRoutes } from '@k8ordo/router';

import { ProductList } from './pages/product-list';
import { ProductPage } from './pages/product-page';
import { ProductsError } from './products-error';
import { ProductsLayout } from './products-layout';

export const routes = defineRoutes({
  '/products': {
    layout: ProductsLayout,
    error: ProductsError,
    children: {
      '/': ProductList,
      '/:id': ProductPage,
    },
  },
});`;

const TYPES = `import type {
  NavigablePath,
  NavigablePatternOf,
  PatternOf,
} from '@k8ordo/router';

import type { routes } from './routes';

type Pattern = PatternOf<typeof routes.record>;
type Linkable = NavigablePatternOf<typeof routes.record>;
type Found = NavigablePath<typeof routes, '/products/42'>;
type Missing = NavigablePath<typeof routes, '/products/42/reviews'>;`;

const TYPES_RESOLVED = `type Pattern = '/' | '/products' | '/products/:id' | '/*';
type Linkable = '/' | '/products' | '/products/:id';
type Found = '/products/42';
type Missing = never;`;

type GrammarRow = {
  pattern: string;
  pathname: string;
  params: string | null;
  note: Message;
};

const GRAMMAR_ROWS: readonly GrammarRow[] = [
  {
    pattern: '/products',
    pathname: '/products/',
    params: '{}',
    note: m.routerRoutes.grammarTable.trailingSlash,
  },
  {
    pattern: '/products/:id',
    pathname: '/products/42',
    params: "{ id: '42' }",
    note: m.routerRoutes.grammarTable.param,
  },
  {
    pattern: '/products/:id',
    pathname: '/products/a%2Fb',
    params: "{ id: 'a/b' }",
    note: m.routerRoutes.grammarTable.decoded,
  },
  {
    pattern: '/products/:id',
    pathname: '/products/a/b',
    params: null,
    note: m.routerRoutes.grammarTable.oneSegment,
  },
  {
    pattern: '/products/:id',
    pathname: '/products/',
    params: null,
    note: m.routerRoutes.grammarTable.empty,
  },
  {
    pattern: '/:locale/*',
    pathname: '/ja/no/such/page',
    params: "{ locale: 'ja' }",
    note: m.routerRoutes.grammarTable.wildcard,
  },
  {
    pattern: '/:locale/*',
    pathname: '/ja',
    params: null,
    note: m.routerRoutes.grammarTable.wildcardIndex,
  },
  {
    pattern: "'/(docs)' › '/guide'",
    pathname: '/guide',
    params: '{}',
    note: m.routerRoutes.grammarTable.group,
  },
];

type RefusedRow = {
  written: Message;
  example: string;
  error: Message | string;
};

const REFUSED_ROWS: readonly RefusedRow[] = [
  {
    written: m.routerRoutes.refusedTable.noSlash,
    example: "{ 'products': Products }",
    error: 'route pattern "products" must start with "/"',
  },
  {
    written: m.routerRoutes.refusedTable.parentheses,
    example: "{ '/(admin)/new': NewItem }",
    error:
      'route group "/(admin)/new" must be "/(name)" and nothing else — a regular expression is not part of the grammar',
  },
  {
    written: m.routerRoutes.refusedTable.groupLeaf,
    example: "{ '/(oops)': Home }",
    error: 'route group "/(oops)" must have children',
  },
  {
    written: m.routerRoutes.refusedTable.twice,
    example: "{ '/x': A, '/': { children: { '/x': B } } }",
    error: 'route pattern "/x" is declared twice',
  },
  {
    written: m.routerRoutes.refusedTable.unparsable,
    example: "{ '/a{b': Home }",
    error: m.routerRoutes.refusedTable.unparsableError,
  },
];

const TYPE_ROWS: ReadonlyArray<{ name: string; meaning: Message }> = [
  { name: 'PatternOf<R>', meaning: m.routerRoutes.typesTable.patternOf },
  {
    name: 'NavigablePatternOf<R>',
    meaning: m.routerRoutes.typesTable.navigablePatternOf,
  },
  {
    name: 'NavigablePath<typeof routes, Path>',
    meaning: m.routerRoutes.typesTable.navigablePath,
  },
  { name: 'Routes<R>', meaning: m.routerRoutes.typesTable.routes },
  { name: 'RoutesRecord', meaning: m.routerRoutes.typesTable.routesRecord },
  { name: 'RouteNode', meaning: m.routerRoutes.typesTable.routeNode },
  { name: 'RouteComponent', meaning: m.routerRoutes.typesTable.routeComponent },
  { name: 'Match', meaning: m.routerRoutes.typesTable.match },
];

export default function RouterRoutesPage() {
  return (
    <DocPage
      introduction={m.routerRoutes.introduction}
      path="/:locale/router/routes"
    >
      <DocSection
        description={m.routerRoutes.shapeDescription}
        title={m.routerRoutes.shapeTitle}
      >
        <CodeBlock code={SHAPE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.shapeIndex()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.shapeStack()}</Rich>
        </p>
        <CodeBlock code={LAYOUTS} lang="tsx" />
        <CodeBlock code={PRODUCTS_LAYOUT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.shapeProps()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.shapeLazy()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerRoutes.grammarDescription}
        title={m.routerRoutes.grammarTitle}
      >
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerRoutes.grammarTable.pattern()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerRoutes.grammarTable.pathname()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerRoutes.grammarTable.params()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerRoutes.grammarTable.note()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {GRAMMAR_ROWS.map((row) => (
              <Table.Row key={`${row.pattern} ${row.pathname}`}>
                <Table.Cell>
                  <Code>{row.pattern}</Code>
                </Table.Cell>
                <Table.Cell>
                  <Code>{row.pathname}</Code>
                </Table.Cell>
                <Table.Cell>
                  {row.params === null ? (
                    <span className="text-fg-mute">
                      <Code>null</Code> ({m.routerRoutes.grammarTable.noMatch()}
                      )
                    </span>
                  ) : (
                    <Code>{row.params}</Code>
                  )}
                </Table.Cell>
                <Table.Cell color="mute">
                  <Rich>{row.note()}</Rich>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerRoutes.paramTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerRoutes.paramDescription()}</Rich>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerRoutes.wildcardTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerRoutes.wildcardDescription()}</Rich>
          </p>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerRoutes.wildcardRoot()}</Rich>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerRoutes.groupTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerRoutes.groupDescription()}</Rich>
          </p>
          <CodeBlock code={GROUPS} lang="ts" />
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerRoutes.groupNested()}</Rich>
          </p>
        </div>
      </DocSection>

      <DocSection
        description={m.routerRoutes.orderDescription}
        title={m.routerRoutes.orderTitle}
      >
        <CodeBlock code={ORDER_WRONG} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.orderWrong()}</Rich>
        </p>
        <CodeBlock code={ORDER_RIGHT} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.orderRight()}</Rich>
        </p>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerRoutes.matchTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerRoutes.matchDescription()}</Rich>
          </p>
          <CodeBlock code={MATCH} lang="ts" />
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerRoutes.matchAccept()}</Rich>
          </p>
        </div>
      </DocSection>

      <DocSection
        description={m.routerRoutes.refusedDescription}
        title={m.routerRoutes.refusedTitle}
      >
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerRoutes.refusedTable.written()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerRoutes.refusedTable.error()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {REFUSED_ROWS.map((row) => (
              <Table.Row key={row.example}>
                <Table.Cell>
                  <span className="flex flex-col gap-1">
                    <Rich>{row.written()}</Rich>
                    <Code>{row.example}</Code>
                  </span>
                </Table.Cell>
                <Table.Cell color="mute">
                  {typeof row.error === 'string' ? (
                    <Code>{row.error}</Code>
                  ) : (
                    <Rich>{row.error()}</Rich>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.refusedWhy()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerRoutes.errorDescription}
        title={m.routerRoutes.errorTitle}
      >
        <CodeBlock code={ERROR_COMPONENT} lang="tsx" />
        <CodeBlock code={ERROR_TABLE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.errorProps()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.errorLeave()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.errorScope()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.errorSuspense()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.errorFramework()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/framework">
            {m.router.navFramework()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.routerRoutes.typesDescription}
        title={m.routerRoutes.typesTitle}
      >
        <CodeBlock code={TYPES} lang="ts" />
        <CodeBlock code={TYPES_RESOLVED} lang="ts" />
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerRoutes.typesTable.type()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerRoutes.typesTable.meaning()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {TYPE_ROWS.map((row) => (
              <Table.Row key={row.name}>
                <Table.Cell>
                  <Code>{row.name}</Code>
                </Table.Cell>
                <Table.Cell color="mute">
                  <Rich>{row.meaning()}</Rich>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerRoutes.typesNavigablePath()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/links">
            {m.router.navLinks()}
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
