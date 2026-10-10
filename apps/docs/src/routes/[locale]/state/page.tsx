import { CodeBlock } from '@k8ordo/ui/code-block';

import { LandingClaim, LandingHero } from '../../../components/landing';
import { Playground } from '../../../components/playground';
import { StateDemo } from '../../../demos/state/state-demo';
import * as m from '../../../messages';

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
    q: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
  }),
  entry: z.object({
    expanded: z.array(z.string()).default([]),
  }),
});

export const prefs = defineLocalState(
  'prefs',
  z.object({
    view: z.enum(['grid', 'table']).default('grid'),
  }),
);

export const density = defineCookieState(
  'density',
  z.object({
    density: z.enum(['cozy', 'compact']).default('cozy'),
  }),
);`;

export default function StatePage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock code={HERO_DEFINE} lang="ts" title="src/state.ts" />
            <CodeBlock
              code={HERO_USE}
              lang="tsx"
              title="src/components/filters.tsx"
            />
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
        <CodeBlock code={CLAIM_PLACES} lang="ts" title="src/state.ts" />
      </LandingClaim>
      <LandingClaim
        body={m.state.claimSchemaBody}
        title={m.state.claimSchemaTitle}
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
    </div>
  );
}
