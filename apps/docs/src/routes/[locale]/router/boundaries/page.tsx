import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerBoundaries;

const ERROR_COMPONENT = `import type { ErrorProps } from '@k8ordo/router';

export function ProductsError({ error, reset }: ErrorProps) {
  const message =
    error instanceof Error ? error.message : 'Something went wrong';

  return (
    <div role="alert">
      <p>{message}</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}`;

const ERROR_TABLE = `export const routes = defineRoutes({
  '/products': {
    layout: ProductsLayout,
    error: ProductsError,
    children: {
      '/': ProductList,
      '/:id': ProductPage,
    },
  },
});`;

const LOADING_TABLE = `export const routes = defineRoutes({
  '/products': {
    layout: ProductsLayout,
    error: ProductsError,
    loading: ProductsLoading,
    children: {
      '/': ProductList,
      '/:id': ProductPage,
    },
  },
});`;

const LOADING_COMPONENT = `export function ProductsLoading() {
  return <p role="status">Loading products…</p>;
}`;

const LAZY = `import { defineRoutes } from '@k8ordo/router';
import { lazy } from 'react';

const Settings = lazy(() => import('./pages/settings'));

export const routes = defineRoutes({
  '/': {
    layout: Shell,
    loading: PageLoading,
    children: {
      '/': Home,
      '/settings': Settings,
    },
  },
});`;

export default function RouterBoundariesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/boundaries">
      <DocSection
        description={t.errorDescription}
        id="error"
        title={t.errorTitle}
      >
        <CodeBlock
          code={ERROR_TABLE}
          lang="ts"
          marks={{ 4: 'highlight' }}
          title="src/routes.ts"
        />
        <CodeBlock
          code={ERROR_COMPONENT}
          lang="tsx"
          marks={{ 3: 'highlight' }}
          title="src/products-error.tsx"
        />
        <p>
          <Rich>{t.errorProps()}</Rich>
        </p>
        <p>
          <Rich>{t.errorReset()}</Rich>
        </p>
        <p>
          <Rich>{t.errorLeave()}</Rich>
        </p>
        <p>
          <Rich>{t.errorStateChange()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.errorLayout()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.loadingDescription}
        id="loading"
        title={t.loadingTitle}
      >
        <CodeBlock
          code={LOADING_TABLE}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="src/routes.ts"
        />
        <CodeBlock
          code={LOADING_COMPONENT}
          lang="tsx"
          title="src/products-loading.tsx"
        />
        <p>
          <Rich>{t.loadingSuspense()}</Rich>
        </p>
        <p>
          <Rich>{t.loadingWhen()}</Rich>
        </p>
        <p>
          <Rich>{t.loadingKeep()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.lazyDescription}
        id="lazy"
        title={t.lazyTitle}
      >
        <CodeBlock
          code={LAZY}
          lang="ts"
          marks={{ 4: 'highlight', 9: 'highlight' }}
          title="src/routes.ts"
        />
        <p>
          <Rich>{t.lazyFallback()}</Rich>
        </p>
        <p>
          <Rich>{t.lazyWhen()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.lazyPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
