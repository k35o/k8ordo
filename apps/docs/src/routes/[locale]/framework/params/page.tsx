import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkParams;

const STRINGS = `import type { PageProps } from '@k8ordo/framework';

export default function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  return <h1>{params.id.toUpperCase()}</h1>;
}`;

const SCHEMA = `import type { PageProps } from '@k8ordo/framework';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  return <h1>{params.id.toFixed(0)}</h1>;
}`;

const STACK_LAYOUT = `import type { ReactNode } from 'react';

import { locales } from '../../i18n';

export const { paramsSchema } = locales;

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}`;

const STACK_PAGE = `import type { PageProps } from '@k8ordo/framework';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({
  params,
}: PageProps<'/:locale/products/:id'>) {
  return <h1 lang={params.locale}>{params.id.toFixed(0)}</h1>;
}`;

const EXIST = `import { notFound } from '@k8ordo/framework';
import type { PageProps } from '@k8ordo/framework';
import * as z from 'zod/mini';

import { findProduct } from '../../_data/catalog.server';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  if (product === undefined) notFound();
  return <h1>{product.name}</h1>;
}`;

const LINKS = `import { href } from '@k8ordo/framework';

const ids = [1, 2, 3];

export default function ProductsPage() {
  return (
    <ul>
      {ids.map((id) => (
        <li key={id}>
          <a href={href('/products/:id', { id })}>Product {id}</a>
        </li>
      ))}
    </ul>
  );
}`;

const PATHS = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { listProductIds } from './src/routes/_data/catalog';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      paths: async () => {
        const ids = await listProductIds();
        return ids.map((id) => \`/products/\${String(id)}\`);
      },
    }),
  ],
});`;

const LOCALES = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  plugins: [framework({ mode: 'static', paths: locales.paths })],
});`;

const PARTIAL = `const slugs = ['hello-world', 'second-post'];

framework({
  mode: 'static',
  paths: (patterns) =>
    locales.paths(patterns).flatMap((pathname) =>
      pathname.endsWith('/:slug')
        ? slugs.map((slug) => pathname.replace(':slug', slug))
        : [pathname],
    ),
});`;

const SEARCH = `import type { PageProps } from '@k8ordo/framework';

import { fetchProducts } from '../_data/catalog.server';
import { listState } from '../_data/list-state';
import { ProductList } from './_parts/product-list';

export const search = listState.url;

export default async function ProductsPage({
  search,
}: PageProps<'/products'>) {
  const products = await fetchProducts(search);
  return <ProductList initialUrl={search} products={products} />;
}`;

export default function FrameworkParamsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/params">
      <DocSection id="strings" title={t.stringsTitle}>
        <CodeBlock
          code={STRINGS}
          lang="tsx"
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.stringsValue()}</Rich>
        </p>
      </DocSection>

      <DocSection id="schema" title={t.schemaTitle}>
        <CodeBlock
          callouts={{ 4: t.schemaNameCallout() }}
          code={SCHEMA}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight', 6: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.schemaExport()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaLibrary()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.schemaSync()}</Rich>
          </p>
          <p>
            <Rich>{t.schemaServerFile()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="stack" title={t.stackTitle}>
        <CodeBlock
          code={STACK_LAYOUT}
          lang="tsx"
          marks={{ 5: 'highlight' }}
          title="src/routes/[locale]/layout.tsx"
        />
        <CodeBlock
          code={STACK_PAGE}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight', 6: 'highlight' }}
          title="src/routes/[locale]/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.stackRuns()}</Rich>
        </p>
        <p>
          <Rich>{t.stackEach()}</Rich>
        </p>
        <p>
          <Rich>{t.stackExample()}</Rich>
        </p>
      </DocSection>

      <DocSection id="refused" title={t.refusedTitle}>
        <p>
          <Rich>{t.refusedRoute()}</Rich>
        </p>
        <p>
          <Rich>{t.refusedMode()}</Rich>
        </p>
        <p>
          <Rich>{t.refusedCatchAll()}</Rich>
        </p>
      </DocSection>

      <DocSection id="exist" title={t.existTitle}>
        <CodeBlock
          code={EXIST}
          lang="tsx"
          marks={{ 14: 'highlight', 15: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.existSchema()}</Rich>
          <LocaleAnchor path="/:locale/framework/errors">
            {m.framework.navErrors()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="links" title={t.linksTitle}>
        <CodeBlock
          code={LINKS}
          lang="tsx"
          marks={{ 10: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.linksTyped()}</Rich>
        </p>
        <p>
          <Rich>{t.linksSpelling()}</Rich>
        </p>
      </DocSection>

      <DocSection id="layout" title={t.layoutTitle}>
        <p>
          <Rich>{t.layoutTyped()}</Rich>
        </p>
        <p>
          <Rich>{t.layoutValue()}</Rich>
        </p>
      </DocSection>

      <DocSection id="paths" title={t.pathsTitle}>
        <CodeBlock
          code={PATHS}
          lang="ts"
          marks={{ 10: 'highlight', 11: 'highlight', 12: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.pathsRole()}</Rich>
        </p>
        <p>
          <Rich>{t.pathsFunction()}</Rich>
        </p>
        <p>
          <Rich>{t.pathsForm()}</Rich>
        </p>
        <DocSubsection id="expand" title={t.expandTitle}>
          <CodeBlock
            code={LOCALES}
            lang="ts"
            marks={{ 7: 'highlight' }}
            title="vite.config.ts"
          />
          <p>
            <Rich>{t.expandLocales()}</Rich>
            <LocaleAnchor path="/:locale/i18n/locales">
              {m.i18n.navLocales()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
          <p>
            <Rich>{t.expandSite()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="partial" title={t.partialTitle}>
          <CodeBlock code={PARTIAL} lang="ts" />
          <p>
            <Rich>{t.expandPartial()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="stops" title={t.stopsTitle}>
          <p>
            <Rich>{t.stopsIntro()}</Rich>
          </p>
          <ul>
            {t.stopsList.map((item) => (
              <li key={item()}>
                <Rich>{item()}</Rich>
              </li>
            ))}
          </ul>
        </DocSubsection>
      </DocSection>

      <DocSection id="search" title={t.searchTitle}>
        <CodeBlock
          callouts={{
            7: t.searchSchemaCallout(),
            13: t.searchInitialCallout(),
          }}
          code={SEARCH}
          lang="tsx"
          marks={{ 7: 'highlight', 10: 'highlight', 13: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.searchDeclare()}</Rich>
        </p>
        <p>
          <Rich>{t.searchState()}</Rich>
          <LocaleAnchor path="/:locale/state/url">
            {m.state.navUrl()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.searchInitial()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
