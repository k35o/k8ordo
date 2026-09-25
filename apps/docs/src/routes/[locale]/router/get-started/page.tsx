import { Code, Heading, Table } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const INSTALL = '@k8ordo/router react react-dom';

const ROUTES = `// src/routes.ts
import { defineRoutes } from '@k8ordo/router';

import { Home } from './pages/home';
import { NotFound } from './pages/not-found';
import { ProductList } from './pages/product-list';
import { ProductPage } from './pages/product-page';
import { RootLayout } from './root-layout';

export const routes = defineRoutes({
  '/': {
    layout: RootLayout,
    children: {
      '/': Home,
      '/products': ProductList,
      '/products/:id': ProductPage,
      '/*': NotFound,
    },
  },
});`;

const MAIN = `// src/main.tsx
import { Router } from '@k8ordo/router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { routes } from './routes';

const root = document.querySelector('#root');
if (root === null) {
  throw new Error('#root is missing');
}

createRoot(root).render(
  <StrictMode>
    <Router routes={routes} />
  </StrictMode>,
);`;

const LAYOUT = `// src/root-layout.tsx
import { href, Outlet } from '@k8ordo/router';

export function RootLayout() {
  return (
    <>
      <nav>
        <a href={href('/')}>Home</a>
        <a href={href('/products')}>Products</a>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}`;

const PRODUCT_LIST = `// src/pages/product-list.tsx
import { href } from '@k8ordo/router';

const products = [
  { id: '1', name: 'Desk lamp' },
  { id: '2', name: 'Notebook' },
];

export function ProductList() {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <a href={href('/products/:id', { id: product.id })}>
            {product.name}
          </a>
        </li>
      ))}
    </ul>
  );
}`;

const PRODUCT_PAGE = `// src/pages/product-page.tsx
import { href, navigateTo, useParams } from '@k8ordo/router';

export function ProductPage() {
  const { id } = useParams('/products/:id');
  return (
    <article>
      <h1>Product {id}</h1>
      <a href={href('/products')}>Back to the list</a>
      <button
        onClick={() => {
          navigateTo('/');
        }}
        type="button"
      >
        Home
      </button>
    </article>
  );
}`;

const HOME = `// src/pages/home.tsx
export function Home() {
  return <h1>Home</h1>;
}`;

const NOT_FOUND = `// src/pages/not-found.tsx
import { usePathname } from '@k8ordo/router';

export function NotFound() {
  return <p>Nothing at {usePathname()}</p>;
}`;

const REGISTER = `// types/k8ordo-router.d.ts
import type { routes } from '../src/routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}`;

const TSCONFIG = `{
  "include": ["src", "types"]
}`;

const CHECKED = `import { href } from '@k8ordo/router';

href('/products/:id', { id: '1' });

// @ts-expect-error
href('/product/:id', { id: '1' });

// @ts-expect-error
href('/products/:id');`;

const URL_PARTS = [
  {
    part: m.routerGetStarted.scopeTable.pathname,
    example: '/products/42',
    owner: '@k8ordo/router',
  },
  {
    part: m.routerGetStarted.scopeTable.search,
    example: '?sort=price',
    owner: '@k8ordo/state',
  },
  {
    part: m.routerGetStarted.scopeTable.entryState,
    example: null,
    owner: '@k8ordo/state',
  },
  {
    part: m.routerGetStarted.scopeTable.fragment,
    example: '#reviews',
    owner: null,
  },
] as const;

export default function RouterGetStartedPage() {
  return (
    <DocPage
      introduction={m.routerGetStarted.introduction}
      path="/:locale/router/get-started"
    >
      <DocSection
        description={m.routerGetStarted.scopeDescription}
        title={m.routerGetStarted.scopeTitle}
      >
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerGetStarted.scopeTable.part()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerGetStarted.scopeTable.example()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerGetStarted.scopeTable.owner()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {URL_PARTS.map((row) => (
              <Table.Row key={row.part()}>
                <Table.Cell>{row.part()}</Table.Cell>
                <Table.Cell color="mute">
                  {row.example === null ? (
                    m.routerGetStarted.scopeTable.entryStateExample()
                  ) : (
                    <Code>{row.example}</Code>
                  )}
                </Table.Cell>
                <Table.Cell color="mute">
                  {row.owner === null ? (
                    m.routerGetStarted.scopeTable.fragmentOwner()
                  ) : (
                    <Code>{row.owner}</Code>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerGetStarted.scopeNoSearch()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state">@k8ordo/state</LocaleAnchor>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerGetStarted.scopeNoFetch()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerGetStarted.installDescription}
        title={m.routerGetStarted.installTitle}
      >
        <InstallTabs
          npm={<CodeBlock code={`npm install ${INSTALL}`} lang="bash" />}
          pnpm={<CodeBlock code={`pnpm add ${INSTALL}`} lang="bash" />}
          yarn={<CodeBlock code={`yarn add ${INSTALL}`} lang="bash" />}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerGetStarted.requirementsDescription()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.routerGetStarted.requirementReact()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.routerGetStarted.requirementTypes()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.routerGetStarted.requirementPlatform()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.routerGetStarted.requirementEsm()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.routerGetStarted.buildDescription}
        title={m.routerGetStarted.buildTitle}
      >
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerGetStarted.stepTableTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerGetStarted.stepTableDescription()}</Rich>
          </p>
          <CodeBlock code={ROUTES} lang="ts" />
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerGetStarted.stepMountTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerGetStarted.stepMountDescription()}</Rich>
          </p>
          <CodeBlock code={MAIN} lang="tsx" />
          <CodeBlock code={LAYOUT} lang="tsx" />
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerGetStarted.stepPagesTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerGetStarted.stepPagesDescription()}</Rich>
          </p>
          <CodeBlock code={PRODUCT_LIST} lang="tsx" />
          <CodeBlock code={PRODUCT_PAGE} lang="tsx" />
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerGetStarted.stepPagesPlainAnchor()}</Rich>
          </p>
          <CodeBlock code={HOME} lang="tsx" />
          <CodeBlock code={NOT_FOUND} lang="tsx" />
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerGetStarted.stepRegisterTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerGetStarted.stepRegisterDescription()}</Rich>
          </p>
          <CodeBlock code={REGISTER} lang="ts" />
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerGetStarted.stepRegisterInclude()}</Rich>
          </p>
          <CodeBlock code={TSCONFIG} lang="json" />
          <CodeBlock code={CHECKED} lang="ts" />
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerGetStarted.stepRegisterResult()}</Rich>
          </p>
        </div>
      </DocSection>

      <DocSection title={m.routerGetStarted.nextTitle}>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/router/routes">
              <Rich>{m.routerGetStarted.nextRoutes()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/router/links">
              <Rich>{m.routerGetStarted.nextLinks()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/router/navigation">
              <Rich>{m.routerGetStarted.nextNavigation()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/router/framework">
              <Rich>{m.routerGetStarted.nextFramework()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/static">
              <Rich>{m.routerGetStarted.nextStatic()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/server">
              <Rich>{m.routerGetStarted.nextServer()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
