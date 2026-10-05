import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerGetStarted;

const ROUTES = `import { defineRoutes } from '@k8ordo/router';

import { Home } from './pages/home';
import { NotFound } from './pages/not-found';
import { ProductList } from './pages/product-list';
import { ProductPage } from './pages/product-page';

export const routes = defineRoutes({
  '/': Home,
  '/products': ProductList,
  '/products/:id': ProductPage,
  '/*': NotFound,
});`;

const MAIN = `import { Router } from '@k8ordo/router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { routes } from './routes';

const root = document.querySelector('#root');
if (root === null) throw new Error('#root is missing');

createRoot(root).render(
  <StrictMode>
    <Router routes={routes} />
  </StrictMode>,
);`;

const ROUTES_WITH_LAYOUT = `export const routes = defineRoutes({
  '/': {
    layout: Shell,
    children: {
      '/': Home,
      '/products': ProductList,
      '/products/:id': ProductPage,
      '/*': NotFound,
    },
  },
});`;

const SHELL = `import { Outlet } from '@k8ordo/router';

export function Shell() {
  return (
    <>
      <header>
        <a href="/">Shop</a>
        <a href="/products">Products</a>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}`;

const PRODUCT_LIST = `import { href } from '@k8ordo/router';

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

const PRODUCT_PAGE = `import { href, useParams } from '@k8ordo/router';

export function ProductPage() {
  const { id } = useParams('/products/:id');

  return (
    <article>
      <h1>Product {id}</h1>
      <a href={href('/products')}>Back to the list</a>
    </article>
  );
}`;

const REGISTER = `import type { routes } from './routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}`;

const CHECKED = `href('/products/:id', { id: '42' });
href('/prodcuts/:id', { id: '42' });
href('/products/:id');`;

const NEXT = [
  {
    path: '/:locale/router/routes',
    label: m.router.navRoutes,
    description: t.nextRoutes,
  },
  {
    path: '/:locale/router/links',
    label: m.router.navLinks,
    description: t.nextLinks,
  },
  {
    path: '/:locale/router/location',
    label: m.router.navLocation,
    description: t.nextLocation,
  },
] as const;

export default function RouterGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/get-started">
      <DocSection
        description={t.installDescription}
        id="install"
        title={t.installTitle}
      >
        <PackageInstall name="@k8ordo/router" />
        <Note>
          <p>
            <Rich>{t.platform()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.tableDescription}
        id="table"
        title={t.tableTitle}
      >
        <CodeBlock
          code={ROUTES}
          lang="ts"
          marks={{ 11: 'highlight', 12: 'highlight' }}
          title="src/routes.ts"
        />
        <p>
          <Rich>{t.tableParam()}</Rich>
        </p>
        <p>
          <Rich>{t.tableWildcard()}</Rich>
        </p>
        <p>
          <Rich>{t.tablePages()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.mountDescription}
        id="mount"
        title={t.mountTitle}
      >
        <CodeBlock
          code={MAIN}
          lang="tsx"
          marks={{ 12: 'highlight' }}
          title="src/main.tsx"
        />
        <p>
          <Rich>{t.mountResult()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.mountBrowserOnly()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.layoutDescription}
        id="layout"
        title={t.layoutTitle}
      >
        <CodeBlock
          code={ROUTES_WITH_LAYOUT}
          lang="ts"
          marks={{ 3: 'highlight' }}
          title="src/routes.ts"
        />
        <CodeBlock
          code={SHELL}
          lang="tsx"
          marks={{ 11: 'highlight' }}
          title="src/shell.tsx"
        />
        <p>
          <Rich>{t.layoutOutlet()}</Rich>
        </p>
        <p>
          <Rich>{t.layoutRoot()}</Rich>
        </p>
        <p>
          <Rich>{t.layoutAnchor()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.linkDescription} id="link" title={t.linkTitle}>
        <CodeBlock
          code={PRODUCT_LIST}
          lang="tsx"
          marks={{ 13: 'highlight' }}
          title="src/pages/product-list.tsx"
        />
        <p>
          <Rich>{t.linkParams()}</Rich>
        </p>
        <CodeBlock
          code={PRODUCT_PAGE}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="src/pages/product-page.tsx"
        />
        <p>
          <Rich>{t.linkNoImport()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.registerDescription}
        id="register"
        title={t.registerTitle}
      >
        <CodeBlock code={REGISTER} lang="ts" title="src/k8ordo-router.d.ts" />
        <CodeBlock
          callouts={{ 2: t.registerTypo(), 3: t.registerMissing() }}
          code={CHECKED}
          lang="ts"
        />
        <p>
          <Rich>{t.registerOnce()}</Rich>
        </p>
      </DocSection>

      <DocSection id="next" title={t.nextTitle}>
        <ul>
          {NEXT.map((step) => (
            <li key={step.path}>
              <LocaleAnchor path={step.path}>{step.label()}</LocaleAnchor>
              {' — '}
              <Rich>{step.description()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
