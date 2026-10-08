import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { QueryDemo } from '../../../../demos/state/url/query-demo';
import * as m from '../../../../messages';

const t = m.stateUrl;

const CATALOG = `import { definePageState } from '@k8ordo/state';
import * as z from 'zod';

export const catalogState = definePageState('catalog', {
  url: z.object({
    q: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
    inStock: z.stringbool().default(false),
    tags: z.array(z.enum(['sale', 'new'])).default([]),
  }),
});`;

const BOOLEAN = `inStock: z.boolean().default(false),
inStock: z.stringbool().default(false),`;

const ARRAY = `tags: z.array(z.string()).optional(),
tags: z.array(z.string()).default([]),`;

const SALVAGE = `const read = (query: string) =>
  catalogState.parseUrl(new URLSearchParams(query));

read('q=lamp&page=0');
// { q: 'lamp', page: 1, inStock: false, tags: [] }

read('page=abc&inStock=true');
// { q: '', page: 1, inStock: true, tags: [] }

read('tags=sale&tags=new');
// { q: '', page: 1, inStock: false, tags: ['sale', 'new'] }

read('tags=sale&tags=old');
// { q: '', page: 1, inStock: false, tags: [] }

read('q=red&q=blue');
// { q: 'red', page: 1, inStock: false, tags: [] }`;

const REFINE = `export const priceState = definePageState('price', {
  url: z
    .object({
      min: z.coerce.number().min(0).default(0),
      max: z.coerce.number().min(0).default(1000),
    })
    .refine((range) => range.min <= range.max),
});

priceState.parseUrl(new URLSearchParams('min=500&max=100'));
// { min: 0, max: 1000 }`;

const CANONICAL = `catalogState.search({ page: 1, tags: ['sale'] });
// 'tags=sale'

catalogState.search({ tags: ['sale'], q: 'desk lamp' });
// 'q=desk+lamp&tags=sale'`;

export default function StateUrlPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/url">
      <DocSection
        description={t.absenceDescription}
        id="absence"
        title={t.absenceTitle}
      >
        <p>
          <Rich>{t.absenceDefault()}</Rich>
        </p>
        <p>
          <Rich>{t.absenceOptional()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.typesDescription}
        id="types"
        title={t.typesTitle}
      >
        <CodeBlock code={CATALOG} lang="ts" title="catalog-state.ts" />
        <ul>
          {[t.typesString, t.typesNumber, t.typesBoolean, t.typesArray].map(
            (item) => (
              <li key={item()}>
                <Rich>{item()}</Rich>
              </li>
            ),
          )}
        </ul>
        <p>
          <Rich>{t.typesRepeated()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.refusedDescription}
        id="refused"
        title={t.refusedTitle}
      >
        <CodeBlock code={BOOLEAN} lang="ts" marks={{ 1: 'remove', 2: 'add' }} />
        <p>
          <Rich>{t.refusedBoolean()}</Rich>
        </p>
        <CodeBlock code={ARRAY} lang="ts" marks={{ 1: 'remove', 2: 'add' }} />
        <p>
          <Rich>{t.refusedArray()}</Rich>
        </p>
        <p>
          <Rich>{t.refusedDate()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.salvageDescription}
        id="salvage"
        title={t.salvageTitle}
      >
        <CodeBlock code={SALVAGE} lang="ts" />
        <p>
          <Rich>{t.salvageArray()}</Rich>
        </p>
        <p>
          <Rich>{t.salvageRefine()}</Rich>
        </p>
        <CodeBlock
          code={REFINE}
          lang="ts"
          marks={{ 7: 'highlight' }}
          title="price-state.ts"
        />
      </DocSection>

      <DocSection
        description={t.canonicalDescription}
        id="canonical"
        title={t.canonicalTitle}
      >
        <CodeBlock code={CANONICAL} lang="ts" />
        <p>
          <Rich>{t.canonicalOrder()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <QueryDemo />
      </Playground>
    </DocPage>
  );
}
