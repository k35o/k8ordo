import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { ProductsDemo } from '../../../../demos/state/get-started/products-demo';
import * as m from '../../../../messages';

const t = m.stateGetStarted;

const STATE = `import { definePageState } from '@k8ordo/state';
import * as z from 'zod';

export const listState = definePageState('product-list', {
  url: z.object({
    inStock: z.stringbool().default(false),
    page: z.coerce.number().int().min(1).default(1),
  }),
});`;

const FILTERS = `'use client';

import { useAppState } from '@k8ordo/state';

import { listState } from '../state';

export function Filters() {
  const [{ inStock, page }, update] = useAppState(listState);

  return (
    <div>
      <label>
        <input
          checked={inStock}
          onChange={(event) => {
            update({ inStock: event.target.checked, page: 1 });
          }}
          type="checkbox"
        />
        In stock only
      </label>
      <button
        onClick={() => {
          update({ page: page + 1 }, { history: 'push' });
        }}
        type="button"
      >
        Next page
      </button>
    </div>
  );
}`;

const PAGE = `import type { PageProps } from '@k8ordo/framework';

import { Filters } from '../../components/filters';
import { ProductList } from '../../components/product-list';
import { listState } from '../../state';

export const search = listState.url;

export default async function ProductsPage({
  search,
}: PageProps<'/products'>) {
  const products = await findProducts(search);

  return (
    <>
      <Filters initialUrl={search} />
      <ProductList products={products} />
    </>
  );
}`;

const SEED = `import { useAppState } from '@k8ordo/state';
import type { OutputOf } from '@k8ordo/state';

type Props = {
  initialUrl: OutputOf<typeof listState.url>;
};

export function Filters({ initialUrl }: Props) {
  const [{ inStock, page }, update] = useAppState(listState, {
    initialUrl,
  });`;

const LINKS = `listState.href('/products', { inStock: true });
// '/products?inStock=true'

listState.href('/products', { inStock: false, page: 1 });
// '/products'`;

const NEXT = [
  {
    path: '/:locale/state/places',
    label: m.state.navPlaces,
    description: t.nextPlaces,
  },
  {
    path: '/:locale/state/updates',
    label: m.state.navUpdates,
    description: t.nextUpdates,
  },
  {
    path: '/:locale/state/reading',
    label: m.state.navReading,
    description: t.nextReading,
  },
] as const;

export default function StateGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/get-started">
      <DocSection
        description={t.installDescription}
        id="install"
        title={t.installTitle}
      >
        <PackageInstall name="@k8ordo/state" />
        <p>
          <Rich>{t.navigationApi()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.zodMini()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.defineDescription}
        id="define"
        title={t.defineTitle}
      >
        <CodeBlock
          code={STATE}
          lang="ts"
          marks={{ 6: 'highlight', 7: 'highlight' }}
          title="src/state.ts"
        />
        <p>
          <Rich>{t.defineFields()}</Rich>
        </p>
        <p>
          <Rich>{t.defineModule()}</Rich>
        </p>
        <p>
          <Rich>{t.defineKey()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.componentDescription}
        id="component"
        title={t.componentTitle}
      >
        <CodeBlock
          callouts={{
            16: t.componentReplaceCallout(),
            24: t.componentPushCallout(),
          }}
          code={FILTERS}
          lang="tsx"
          marks={{ 8: 'highlight', 16: 'highlight', 24: 'highlight' }}
          title="src/components/filters.tsx"
        />
        <p>
          <Rich>{t.componentSync()}</Rich>
        </p>
        <p>
          <Rich>{t.componentHistory()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={PAGE}
          lang="tsx"
          marks={{ 7: 'highlight', 10: 'highlight', 16: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.serverParsed()}</Rich>
        </p>
        <p>
          <Rich>{t.serverReload()}</Rich>
        </p>
        <p>
          <Rich>{t.serverSeed()}</Rich>
        </p>
        <CodeBlock
          code={SEED}
          lang="tsx"
          marks={{ 5: 'highlight', 10: 'highlight' }}
          title="src/components/filters.tsx"
        />
        <Note>
          <p>
            <Rich>{t.serverStatic()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.linksDescription}
        id="links"
        title={t.linksTitle}
      >
        <CodeBlock code={LINKS} lang="ts" title="src/lib/links.ts" />
        <p>
          <Rich>{t.linksCanonical()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.tryDescription}
        id="try"
        steps={t.trySteps}
        title={t.tryTitle}
      >
        <ProductsDemo />
      </Playground>

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
