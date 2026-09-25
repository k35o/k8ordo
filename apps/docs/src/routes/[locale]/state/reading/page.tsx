import { Code } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { DocTable } from '../_parts/doc-table';

const CATALOG = `// src/state/catalog.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const catalogState = definePageState('catalog', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
    tags: z._default(z.array(z.string()), []),
    sort: z._default(z.enum(['new', 'price']), 'new'),
  }),
});`;

const PRICE = `// src/state/price.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const priceState = definePageState('price-filter', {
  url: z
    .object({
      min: z._default(z.coerce.number().check(z.gte(0)), 0),
      max: z._default(z.coerce.number().check(z.gte(0)), 1000),
    })
    .check(z.refine((range) => range.min <= range.max)),
});`;

const SEED_PAGE = `// src/app/catalog/page.tsx
import { catalogState } from '../../state/catalog';
import { CatalogFilters } from './catalog-filters';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const url = catalogState.parseUrl(await searchParams);

  return (
    <>
      <CatalogFilters initialUrl={url} />
      <a href={catalogState.href('/catalog', { ...url, page: url.page + 1 })}>
        Next page
      </a>
    </>
  );
}`;

const SEED_COMPONENT = `// src/app/catalog/catalog-filters.tsx
'use client';

import { useAppState } from '@k8ordo/state';
import type { OutputOf } from '@k8ordo/state';

import { catalogState } from '../../state/catalog';

type Props = {
  initialUrl: OutputOf<typeof catalogState.url>;
};

export function CatalogFilters({ initialUrl }: Props) {
  const [{ sort }, update] = useAppState(catalogState, ['sort'], {
    initialUrl,
  });

  return (
    <select
      onChange={(event) => {
        update({
          sort: event.currentTarget.value === 'price' ? 'price' : 'new',
          page: 1,
        });
      }}
      value={sort}
    >
      <option value="new">Newest</option>
      <option value="price">Price</option>
    </select>
  );
}`;

const PAGER = `// src/catalog/pager.tsx
'use client';

import { useAppState } from '@k8ordo/state';

import { catalogState } from '../state/catalog';

export function Pager() {
  const [state] = useAppState(catalogState);

  return (
    <nav>
      {state.page > 1 && (
        <a
          href={catalogState.href('/catalog', {
            ...state,
            page: state.page - 1,
          })}
        >
          Previous
        </a>
      )}
      <a href={catalogState.href('/catalog', { ...state, page: state.page + 1 })}>
        Next
      </a>
    </nav>
  );
}`;

const EXPORT_LINK = `// src/catalog/export-link.tsx
'use client';

import { useAppState } from '@k8ordo/state';

import { catalogState } from '../state/catalog';

export function ExportLink() {
  const [state] = useAppState(catalogState);
  const query = catalogState.search(state);

  return (
    <a
      download
      href={query === '' ? '/export/catalog.csv' : \`/export/catalog.csv?\${query}\`}
    >
      Download CSV
    </a>
  );
}`;

const REGISTER_ROUTES = `// src/k8ordo.d.ts
import type { routes } from './routes';

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

const REGISTER_PATH = `// src/k8ordo-state.d.ts
import type { Route } from 'next';

declare module '@k8ordo/state' {
  interface Register {
    path: Route;
  }
}`;

const DENSITY = `// src/state/density.ts
import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const densityState = defineLocalState(
  'density',
  z.object({ density: z.optional(z.enum(['comfortable', 'compact'])) }),
);`;

const LAYOUT = `// src/routes/layout.tsx
import type { ReactNode } from 'react';

import { densityState } from '../state/density';

const densityScript = \`(()=>{const s=\${densityState.inlineRead()};if(s&&s.density==="compact")document.documentElement.dataset.density="compact"})()\`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script>{densityScript}</script>
        {children}
      </body>
    </html>
  );
}`;

const PARSE_ROWS = [
  {
    key: 'empty',
    query: null,
    result: "{ q: '', page: 1, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.emptyWhy,
  },
  {
    key: 'coerce',
    query: '?q=shoes&page=3',
    result: "{ q: 'shoes', page: 3, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.coerceWhy,
  },
  {
    key: 'unreadable',
    query: '?q=shoes&page=zero',
    result: "{ q: 'shoes', page: 1, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.unreadableWhy,
  },
  {
    key: 'constraint',
    query: '?q=shoes&page=0',
    result: "{ q: 'shoes', page: 1, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.constraintWhy,
  },
  {
    key: 'int',
    query: '?page=2.5',
    result: "{ q: '', page: 1, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.intWhy,
  },
  {
    key: 'array',
    query: '?tags=sale&tags=new',
    result: "{ q: '', page: 1, tags: ['sale', 'new'], sort: 'new' }",
    why: m.stateReading.parseTable.arrayWhy,
  },
  {
    key: 'first',
    query: '?q=red&q=blue',
    result: "{ q: 'red', page: 1, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.firstWhy,
  },
  {
    key: 'enum',
    query: '?sort=old&q=shoes',
    result: "{ q: 'shoes', page: 1, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.enumWhy,
  },
  {
    key: 'undeclared',
    query: '?utm_source=news&page=2',
    result: "{ q: '', page: 2, tags: [], sort: 'new' }",
    why: m.stateReading.parseTable.undeclaredWhy,
  },
] as const;

const SALVAGE_ROWS = [
  {
    key: 'written',
    query: '?min=200&max=500',
    result: '{ min: 200, max: 500 }',
    why: m.stateReading.salvageTable.asWritten,
  },
  {
    key: 'max-alone',
    query: '?min=200&max=abc',
    result: '{ min: 200, max: 1000 }',
    why: m.stateReading.salvageTable.maxAlone,
  },
  {
    key: 'max-breaks',
    query: '?min=2000&max=abc',
    result: '{ min: 0, max: 1000 }',
    why: m.stateReading.salvageTable.maxBreaks,
  },
  {
    key: 'combination',
    query: '?min=500&max=200',
    result: '{ min: 0, max: 1000 }',
    why: m.stateReading.salvageTable.combination,
  },
  {
    key: 'min-alone',
    query: '?min=-5&max=300',
    result: '{ min: 0, max: 300 }',
    why: m.stateReading.salvageTable.minAlone,
  },
] as const;

const HREF_ROWS = [
  {
    call: "catalogState.href('/catalog')",
    result: '/catalog',
  },
  {
    call: "catalogState.href('/catalog', { page: 1 })",
    result: '/catalog',
  },
  {
    call: "catalogState.href('/catalog', { page: 2 })",
    result: '/catalog?page=2',
  },
  {
    call: "catalogState.href('/catalog', { q: 'red shoes', tags: ['sale', 'new'] })",
    result: '/catalog?q=red+shoes&tags=sale&tags=new',
  },
  {
    call: "catalogState.href('/catalog', { sort: 'price', page: 3 })",
    result: '/catalog?page=3&sort=price',
  },
  {
    call: "catalogState.search({ q: 'red shoes', page: 2 })",
    result: 'q=red+shoes&page=2',
  },
] as const;

export default function StateReadingPage() {
  const parse = m.stateReading.parseTable;
  const href = m.stateReading.hrefTable;

  return (
    <DocPage
      introduction={m.stateReading.introduction}
      path="/:locale/state/reading"
    >
      <DocSection
        description={m.stateReading.parseDescription}
        title={m.stateReading.parseTitle}
      >
        <CodeBlock code={CATALOG} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.parseTableIntro()}</Rich>
        </p>
        <DocTable
          head={[parse.query(), parse.result(), parse.why()]}
          rows={PARSE_ROWS.map((row) => ({
            key: row.key,
            cells: [
              row.query === null ? (
                parse.empty()
              ) : (
                <Code key="query">{row.query}</Code>
              ),
              <Code key="result">{row.result}</Code>,
              <Rich key="why">{row.why()}</Rich>,
            ],
          }))}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.parseRecord()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateReading.salvageDescription}
        title={m.stateReading.salvageTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.salvageArray()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.salvageRefine()}</Rich>
        </p>
        <CodeBlock code={PRICE} lang="ts" />
        <DocTable
          head={[parse.query(), parse.result(), parse.why()]}
          rows={SALVAGE_ROWS.map((row) => ({
            key: row.key,
            cells: [
              <Code key="query">{row.query}</Code>,
              <Code key="result">{row.result}</Code>,
              <Rich key="why">{row.why()}</Rich>,
            ],
          }))}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.salvageSame()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateReading.frameworkDescription}
        title={m.stateReading.frameworkTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.frameworkWhy()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.frameworkLinks()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateReading.initialDescription}
        title={m.stateReading.initialTitle}
      >
        <CodeBlock code={SEED_PAGE} lang="tsx" />
        <CodeBlock code={SEED_COMPONENT} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateReading.initialType()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.initialRouter()}</Rich>{' '}
            <LocaleAnchor path="/:locale/state/integrations">
              <Rich>{m.stateReading.initialRouterLink()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.stateReading.hrefDescription}
        title={m.stateReading.hrefTitle}
      >
        <DocTable
          head={[href.call(), href.result()]}
          rows={[
            ...HREF_ROWS.map((row) => ({
              key: row.call,
              cells: [
                <Code key="call">{row.call}</Code>,
                <Code key="result">{row.result}</Code>,
              ],
            })),
            {
              key: 'search-empty',
              cells: [
                <Code key="call">catalogState.search()</Code>,
                href.emptyString(),
              ],
            },
          ]}
        />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateReading.hrefOrder()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.hrefThrows()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.hrefType()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.entryOnlyLinks()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.hrefSpread()}</Rich>
        </p>
        <CodeBlock code={PAGER} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.hrefPager()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.searchDescription()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.hrefBase()}</Rich>
        </p>
        <CodeBlock code={EXPORT_LINK} lang="tsx" />
      </DocSection>

      <DocSection
        description={m.stateReading.typedDescription}
        title={m.stateReading.typedTitle}
      >
        <CodeBlock code={REGISTER_ROUTES} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateReading.typedParam()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.typedWildcard()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.typedRuntime()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.typedFramework()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.typedPath()}</Rich>
        </p>
        <CodeBlock code={REGISTER_PATH} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.typedRules()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateReading.beforeDescription}
        title={m.stateReading.beforeTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.beforeApi()}</Rich>
        </p>
        <CodeBlock code={DENSITY} lang="ts" />
        <CodeBlock code={LAYOUT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.beforeNull()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateReading.beforeNullNothing()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.beforeNullCorrupt()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.beforeNullNotObject()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateReading.beforeNullBlocked()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.beforeUntrusted()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.beforeEscape()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateReading.beforeAfter()}</Rich>{' '}
          <LocaleAnchor path="/:locale/color-scheme/how-it-works">
            <Rich>{m.stateReading.beforeAfterLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
