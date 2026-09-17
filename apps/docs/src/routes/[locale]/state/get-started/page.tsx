import { Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { DocTable } from '../_parts/doc-table';

const DEFINITION = `// src/state/products.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const productListState = definePageState('product-list', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
    sort: z._default(z.enum(['new', 'price']), 'new'),
  }),
});`;

const COMPONENT = `// src/routes/products/_parts/product-list.tsx
'use client';

import { useAppState } from '@k8ordo/state';

import type { Product } from '../../../data/products';
import { productListState } from '../../../state/products';

const PAGE_SIZE = 20;

type Props = {
  products: readonly Product[];
};

export function ProductList({ products }: Props) {
  const [{ q, page, sort }, update] = useAppState(productListState);

  const visible = products
    .filter((product) => product.name.includes(q))
    .toSorted((a, b) =>
      sort === 'price' ? a.price - b.price : b.createdAt - a.createdAt,
    )
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <button
        onClick={() => {
          update({ sort: sort === 'new' ? 'price' : 'new', page: 1 });
        }}
        type="button"
      >
        {sort === 'new' ? 'Sort by price' : 'Sort by newest'}
      </button>
      <ul>
        {visible.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      <button
        disabled={page === 1}
        onClick={() => {
          update({ page: page - 1 }, { history: 'push' });
        }}
        type="button"
      >
        Previous
      </button>
      <button
        onClick={() => {
          update({ page: page + 1 }, { history: 'push' });
        }}
        type="button"
      >
        Next
      </button>
    </section>
  );
}`;

const PAGE = `// src/routes/products/page.tsx
import { products } from '../../data/products';
import { productListState } from '../../state/products';
import { ProductList } from './_parts/product-list';

export default function ProductsPage() {
  return (
    <>
      <nav>
        <a href={productListState.href('/products')}>All products</a>
        <a href={productListState.href('/products', { sort: 'price' })}>
          Cheapest first
        </a>
      </nav>
      <ProductList products={products} />
    </>
  );
}`;

const SERVER_PAGE = `// src/app/products/page.tsx
import { products } from '../../data/products';
import { productListState } from '../../state/products';
import { ProductList } from './product-list';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const url = productListState.parseUrl(await searchParams);

  return <ProductList initialUrl={url} products={products} />;
}`;

const SERVER_COMPONENT = `// src/app/products/product-list.tsx
'use client';

import { useAppState } from '@k8ordo/state';
import type { OutputOf } from '@k8ordo/state';

import type { Product } from '../../data/products';
import { productListState } from '../../state/products';

const PAGE_SIZE = 20;

type Props = {
  products: readonly Product[];
  initialUrl: OutputOf<typeof productListState.url>;
};

export function ProductList({ products, initialUrl }: Props) {
  const [{ q, page, sort }, update] = useAppState(productListState, {
    initialUrl,
  });

  const visible = products
    .filter((product) => product.name.includes(q))
    .toSorted((a, b) =>
      sort === 'price' ? a.price - b.price : b.createdAt - a.createdAt,
    )
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <button
        onClick={() => {
          update({ sort: sort === 'new' ? 'price' : 'new', page: 1 });
        }}
        type="button"
      >
        {sort === 'new' ? 'Sort by price' : 'Sort by newest'}
      </button>
      <ul>
        {visible.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      <button
        disabled={page === 1}
        onClick={() => {
          update({ page: page - 1 }, { history: 'push' });
        }}
        type="button"
      >
        Previous
      </button>
      <button
        onClick={() => {
          update({ page: page + 1 }, { history: 'push' });
        }}
        type="button"
      >
        Next
      </button>
    </section>
  );
}`;

export default function StateGetStartedPage() {
  return (
    <DocPage
      introduction={m.stateGetStarted.introduction}
      path="/:locale/state/get-started"
    >
      <DocSection
        description={m.stateGetStarted.ideaDescription}
        title={m.stateGetStarted.ideaTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateGetStarted.placeUrl()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateGetStarted.placeEntry()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateGetStarted.placeLocal()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateGetStarted.placeMemory()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateGetStarted.ideaNoProvider()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/state/places">
            <Rich>{m.stateGetStarted.ideaMore()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.stateGetStarted.installDescription}
        title={m.stateGetStarted.installTitle}
      >
        <InstallTabs
          npm={<CodeBlock code="npm install @k8ordo/state zod" lang="bash" />}
          pnpm={<CodeBlock code="pnpm add @k8ordo/state zod" lang="bash" />}
          yarn={<CodeBlock code="yarn add @k8ordo/state zod" lang="bash" />}
        />
        <Heading level="h3">
          <Rich>{m.stateGetStarted.peersTitle()}</Rich>
        </Heading>
        <DocTable
          head={[
            m.stateGetStarted.peersPackage(),
            m.stateGetStarted.peersVersion(),
            m.stateGetStarted.peersNeededFor(),
          ]}
          rows={[
            {
              key: 'react',
              cells: [
                'react',
                '≥19.3.0',
                <Rich key="needed">{m.stateGetStarted.peerReact()}</Rich>,
              ],
            },
            {
              key: 'zod',
              cells: [
                'zod',
                '^4.4.3',
                <Rich key="needed">{m.stateGetStarted.peerZod()}</Rich>,
              ],
            },
            {
              key: 'router',
              cells: [
                '@k8ordo/router',
                '^0.1.0',
                <Rich key="needed">{m.stateGetStarted.peerRouter()}</Rich>,
              ],
            },
            {
              key: 'typescript',
              cells: [
                'typescript',
                '≥7.0.2',
                <Rich key="needed">{m.stateGetStarted.peerTypes()}</Rich>,
              ],
            },
            {
              key: 'types-react',
              cells: [
                '@types/react',
                '≥19.3.0',
                <Rich key="needed">{m.stateGetStarted.peerTypes()}</Rich>,
              ],
            },
          ]}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateGetStarted.baselineNote()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateGetStarted.defineDescription}
        title={m.stateGetStarted.defineTitle}
      >
        <CodeBlock code={DEFINITION} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateGetStarted.defineWhyNoDirective()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateGetStarted.defineKey()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateGetStarted.defineAbsence()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.stateGetStarted.componentDescription}
        title={m.stateGetStarted.componentTitle}
      >
        <CodeBlock code={COMPONENT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateGetStarted.componentHistory()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateGetStarted.pageDescription}
        title={m.stateGetStarted.pageTitle}
      >
        <CodeBlock code={PAGE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateGetStarted.pageSearch()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateGetStarted.serverDescription}
        title={m.stateGetStarted.serverTitle}
      >
        <CodeBlock code={SERVER_PAGE} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateGetStarted.serverExample()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateGetStarted.serverInitialUrl()}</Rich>
          </li>
        </ul>
        <CodeBlock code={SERVER_COMPONENT} lang="tsx" />
        <p>
          <LocaleAnchor path="/:locale/state/reading">
            <Rich>{m.stateGetStarted.serverMore()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.stateGetStarted.routerDescription}
        title={m.stateGetStarted.routerTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateGetStarted.routerElse()}</Rich>
        </p>
        <ul className="flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/router">
              <Rich>{m.stateGetStarted.routerLinkRouter()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/state/integrations">
              <Rich>{m.stateGetStarted.routerLinkIntegrations()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>

      <DocSection title={m.stateGetStarted.nextTitle}>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/state/places">
              <Rich>{m.stateGetStarted.nextPlaces()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/state/reading">
              <Rich>{m.stateGetStarted.nextReading()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/state/updates">
              <Rich>{m.stateGetStarted.nextUpdates()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/state/integrations">
              <Rich>{m.stateGetStarted.nextIntegrations()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
