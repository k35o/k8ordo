import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateReading;

const SERVER_PAGE = `import type { PageProps } from '@k8ordo/framework';

import { listState } from '../../state';

export const search = listState.url;

export default async function ProductsPage({
  search,
}: PageProps<'/products'>) {
  const products = await fetchProducts(search);
  return <ProductList products={products} />;
}`;

const NEXT_PAGE = `export default async function Page({
  searchParams,
}: PageProps<'/products'>) {
  const url = listState.parseUrl(await searchParams);
  const products = await fetchProducts(url);

  return (
    <>
      <Filters initialUrl={url} />
      <ProductList products={products} />
    </>
  );
}`;

const HREF = `listState.href('/products');
// '/products'

listState.href('/products', { inStock: true, page: 2 });
// '/products?inStock=true&page=2'

listState.search({ page: 2 });
// 'page=2'`;

const BASE = `listState.href('/products', { page: 2 });
// '/docs/products?page=2'`;

const REGISTER_ROUTES = `import type { routes } from './routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}

declare module '@k8ordo/state' {
  interface Register {
    routes: typeof routes;
  }
}`;

const REGISTER_PATH = `import type { Route } from 'next';

declare module '@k8ordo/state' {
  interface Register {
    path: Route;
  }
}`;

export default function StateReadingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/reading">
      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={SERVER_PAGE}
          lang="tsx"
          marks={{ 5: 'highlight', 8: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.serverParse()}</Rich>
        </p>
        <p>
          <Rich>{t.serverReload()}</Rich>
        </p>
        <p>
          <Rich>{t.serverOthers()}</Rich>
        </p>
        <p>
          <Rich>{t.serverSeed()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.staticDescription}
        id="static"
        title={t.staticTitle}
      >
        <p>
          <Rich>{t.staticDefaults()}</Rich>
        </p>
        <p>
          <Rich>{t.staticLinks()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.parseUrlDescription}
        id="parse-url"
        title={t.parseUrlTitle}
      >
        <CodeBlock
          code={NEXT_PAGE}
          lang="tsx"
          marks={{ 4: 'highlight', 9: 'highlight' }}
          title="app/products/page.tsx"
        />
        <p>
          <Rich>{t.parseUrlInput()}</Rich>
        </p>
        <p>
          <Rich>{t.parseUrlNavigation()}</Rich>
        </p>
        <p>
          <Rich>{t.parseUrlReader()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.hrefDescription} id="href" title={t.hrefTitle}>
        <CodeBlock code={HREF} lang="ts" />
        <p>
          <Rich>{t.hrefSearch()}</Rich>
        </p>
        <p>
          <Rich>{t.hrefEdges()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.baseDescription} id="base" title={t.baseTitle}>
        <p>
          <Rich>{t.baseExample()}</Rich>
        </p>
        <CodeBlock code={BASE} lang="ts" />
        <p>
          <Rich>{t.baseRouterHref()}</Rich>
        </p>
        <p>
          <Rich>{t.baseOutside()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.typedDescription}
        id="typed"
        title={t.typedTitle}
      >
        <CodeBlock
          code={REGISTER_ROUTES}
          lang="ts"
          marks={{ 9: 'highlight', 10: 'highlight', 11: 'highlight' }}
          title="src/k8ordo.d.ts"
        />
        <p>
          <Rich>{t.typedGenerated()}</Rich>
        </p>
        <p>
          <Rich>{t.typedMatch()}</Rich>
        </p>
        <p>
          <Rich>{t.typedRuntime()}</Rich>
        </p>
        <p>
          <Rich>{t.typedOtherRouters()}</Rich>
        </p>
        <CodeBlock code={REGISTER_PATH} lang="ts" title="types/k8ordo.d.ts" />
        <p>
          <Rich>{t.typedPrecedence()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
