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

export default function RouterGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/get-started">
      <DocSection id="install" title={t.installTitle}>
        <PackageInstall name="@k8ordo/router" />
        <p>
          <Rich>{t.platform()}</Rich>
        </p>
      </DocSection>

      <DocSection id="table" title={t.tableTitle}>
        <CodeBlock
          callouts={{
            11: t.tableParamCallout(),
            12: t.tableWildcardCallout(),
          }}
          code={ROUTES}
          lang="ts"
          marks={{ 11: 'highlight', 12: 'highlight' }}
          title="src/routes.ts"
        />
        <p>
          <Rich>{t.tableShape()}</Rich>
        </p>
        <p>
          <Rich>{t.tableMatch()}</Rich>
        </p>
        <p>
          <Rich>{t.tableMoreBefore()}</Rich>
          <LocaleAnchor path="/:locale/router/routes">
            {m.router.navRoutes()}
          </LocaleAnchor>
          <Rich>{t.tableMoreAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="mount" title={t.mountTitle}>
        <CodeBlock
          code={MAIN}
          lang="tsx"
          marks={{ 12: 'highlight' }}
          title="src/main.tsx"
        />
        <p>
          <Rich>{t.mountRouter()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.mountBrowserOnlyBefore()}</Rich>
            <LocaleAnchor path="/:locale/framework/get-started">
              <code>@k8ordo/framework</code>
            </LocaleAnchor>
            <Rich>{t.mountBrowserOnlyAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="link" title={t.linkTitle}>
        <CodeBlock
          callouts={{ 13: t.linkHrefCallout() }}
          code={PRODUCT_LIST}
          lang="tsx"
          marks={{ 13: 'highlight' }}
          title="src/pages/product-list.tsx"
        />
        <p>
          <Rich>{t.linkHref()}</Rich>
        </p>
        <p>
          <Rich>{t.linkAnchor()}</Rich>
        </p>
      </DocSection>

      <DocSection id="params" title={t.paramsTitle}>
        <CodeBlock
          callouts={{ 4: t.linkParamsCallout() }}
          code={PRODUCT_PAGE}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="src/pages/product-page.tsx"
        />
        <p>
          <Rich>{t.linkParams()}</Rich>
        </p>
        <p>
          <Rich>{t.linkRegisterBefore()}</Rich>
          <LocaleAnchor path="/:locale/router/typed-paths">
            {m.router.navTypedPaths()}
          </LocaleAnchor>
          <Rich>{t.linkRegisterAfter()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
