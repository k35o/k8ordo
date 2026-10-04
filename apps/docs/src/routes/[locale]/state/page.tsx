import { CodeBlock } from '@k8ordo/ui/code-block';

import {
  LandingClaim,
  LandingHero,
  NextSteps,
} from '../../../components/landing';
import { Playground } from '../../../components/playground';
import * as m from '../../../messages';
import { StateDemo } from './_parts/state-demo';

const HERO_DEFINE = `export const listState = definePageState('product-list', {
  url: z.object({
    q: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
  }),
});`;

const HERO_USE = `const [{ q, page }, update] = useAppState(listState);

update({ page: page + 1 }, { history: 'push' });`;

const HERO_URL = `/products?q=lamp&page=2`;

const CLAIM_PLACES = `export const listState = definePageState('product-list', {
  url: z.object({
    page: z.coerce.number().int().min(1).default(1),
  }),
  entry: z.object({
    expanded: z.array(z.string()).default([]),
  }),
});

export const prefs = defineLocalState(
  'prefs',
  z.object({ view: z.enum(['grid', 'table']).default('grid') }),
);

export const density = defineCookieState(
  'density',
  z.object({
    density: z.enum(['comfortable', 'compact']).default('comfortable'),
  }),
);`;

const CLAIM_SERVER_PAGE = `export const search = listState.url;

export default async function ProductsPage({
  search,
}: PageProps<'/products'>) {
  const products = await fetchProducts(search);
  return <ProductList products={products} />;
}`;

const CLAIM_SERVER_HREF = `listState.href('/products', { q: 'lamp', page: 1 });
// '/products?q=lamp'`;

export default function StatePage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock code={HERO_DEFINE} lang="ts" title="state.ts" />
            <CodeBlock code={HERO_USE} lang="tsx" title="filters.tsx" />
            <CodeBlock code={HERO_URL} lang="text" title="URL" />
          </>
        }
        directory="state"
        install="@k8ordo/state zod"
        name="@k8ordo/state"
        tagline={m.state.tagline}
      />
      <LandingClaim
        body={m.state.claimPlacesBody}
        title={m.state.claimPlacesTitle}
      >
        <CodeBlock code={CLAIM_PLACES} lang="ts" title="state.ts" />
      </LandingClaim>
      <LandingClaim
        body={m.state.claimHistoryBody}
        title={m.state.claimHistoryTitle}
      >
        <Playground
          description={m.state.demoDescription}
          id="demo"
          steps={m.state.demoSteps}
          title={m.state.demoTitle}
        >
          <StateDemo />
        </Playground>
      </LandingClaim>
      <LandingClaim
        body={m.state.claimServerBody}
        title={m.state.claimServerTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock
            code={CLAIM_SERVER_PAGE}
            lang="tsx"
            title="routes/products/page.tsx"
          />
          <CodeBlock code={CLAIM_SERVER_HREF} lang="ts" title="links.ts" />
        </div>
      </LandingClaim>
      <NextSteps
        name="@k8ordo/state"
        steps={[
          {
            path: '/:locale/state/get-started',
            label: m.nav.getStarted,
            description: m.state.nextGetStarted,
          },
          {
            path: '/:locale/state/places',
            label: m.state.navPlaces,
            description: m.state.nextPlaces,
          },
          {
            path: '/:locale/state/reading',
            label: m.state.navReading,
            description: m.state.nextReading,
          },
          {
            path: '/:locale/state/updates',
            label: m.state.navUpdates,
            description: m.state.nextUpdates,
          },
          {
            path: '/:locale/state/integrations',
            label: m.state.navIntegrations,
            description: m.state.nextIntegrations,
          },
        ]}
      />
    </div>
  );
}
