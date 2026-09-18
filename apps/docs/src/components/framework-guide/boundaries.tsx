import * as m from '../../messages';
import { CodeBlock } from '../code-block';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import type { Mode } from './mode';
import { Paragraph } from './prose';
import { SITE_LAYOUT, SITE_SHELL } from './site-samples';

const CATALOG = `// src/routes/_data/catalog.server.ts
import 'server-only';

export type Product = { id: number; name: string };

const CATALOG: readonly Product[] = [
  { id: 1, name: 'first product' },
  { id: 2, name: 'second product' },
];

export const listProducts = (): readonly Product[] => CATALOG;`;

const PRODUCTS = `// src/routes/products/page.tsx
import { href } from '@k8ordo/router';

import { listProducts } from '../_data/catalog.server';

export default function ProductsPage() {
  const products = listProducts();
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

const COUNTER = `// src/routes/_parts/counter.tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [n, setN] = useState(0);
  return (
    <button
      onClick={() => {
        setN(n + 1);
      }}
      type="button"
    >
      {n}
    </button>
  );
}`;

const HOME = `// src/routes/page.tsx
import { Counter } from './_parts/counter';

export default function HomePage() {
  return (
    <>
      <h1>home</h1>
      <Counter />
    </>
  );
}`;

const GREETING = `// src/routes/_parts/greeting.tsx
'use client';

import type { ReactNode } from 'react';

export function Greeting({
  renderedAt,
  tags,
  children,
}: {
  renderedAt: Date;
  tags: string[];
  children: ReactNode;
}) {
  return (
    <section>
      <time dateTime={renderedAt.toISOString()}>
        {renderedAt.toISOString()}
      </time>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {children}
    </section>
  );
}`;

const GREETING_PAGE = `// src/routes/page.tsx
import { Greeting } from './_parts/greeting';

export default function HomePage() {
  return (
    <Greeting renderedAt={new Date()} tags={['rsc', 'boundaries']}>
      <p>rendered on the server</p>
    </Greeting>
  );
}`;

const BROWSER = `// src/routes/_parts/editor.tsx
'use client';

import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('the draft is stored in localStorage'));
  return <textarea defaultValue={localStorage.getItem('draft') ?? ''} />;
}

export function Editor() {
  return (
    <Suspense fallback={<p>loading the draft…</p>}>
      <SavedDraft />
    </Suspense>
  );
}`;

const SERVER_ONLY_ERROR = `'server-only' cannot be imported in client build ('ssr' environment):
 imported by src/routes/_data/catalog.server.ts
  imported by src/routes/_parts/counter.tsx
   imported by virtual:vite-rsc/client-references`;

const WHERE = `// src/routes/_parts/where.tsx
'use client';

import { useMatch, usePathname } from '@k8ordo/router';

export function Where() {
  const pathname = usePathname();
  const inProducts = useMatch('/products/*') !== null;
  return <p data-section={inProducts ? 'products' : 'other'}>{pathname}</p>;
}`;

/**
 * Execution boundaries, shared by `/static/boundaries` and
 * `/server/boundaries`. When a Server Component runs is the mode's own.
 */
export function BoundariesGuide({ mode }: { mode: Mode }) {
  const t = m.frameworkBoundaries;
  const own = mode === 'static' ? m.staticBoundaries : m.serverBoundaries;

  return (
    <>
      <DocSection description={t.serverDescription} title={t.serverTitle}>
        <Paragraph text={own.serverWhen} />
        <CodeBlock code={CATALOG} lang="ts" />
        <CodeBlock code={PRODUCTS} lang="tsx" />
      </DocSection>

      <DocSection description={t.clientDescription} title={t.clientTitle}>
        <CodeBlock code={COUNTER} lang="tsx" />
        <CodeBlock code={HOME} lang="tsx" />
        <Paragraph text={t.clientSsr} />
        <Paragraph text={own.directiveNote}>
          {mode === 'static' ? (
            <LocaleAnchor path="/:locale/static/get-started">
              {m.nav.getStarted()}
            </LocaleAnchor>
          ) : (
            <LocaleAnchor path="/:locale/server/actions">
              {m.server.navActions()}
            </LocaleAnchor>
          )}
        </Paragraph>
      </DocSection>

      <DocSection description={t.propsDescription} title={t.propsTitle}>
        <CodeBlock code={GREETING_PAGE} lang="tsx" />
        <CodeBlock code={GREETING} lang="tsx" />
        <Paragraph text={own.propsFunction} />
        <Paragraph text={t.propsSite} />
      </DocSection>

      <DocSection description={t.shellDescription} title={t.shellTitle}>
        <CodeBlock code={SITE_LAYOUT} lang="tsx" />
        <CodeBlock code={SITE_SHELL} lang="tsx" />
        <Paragraph text={t.shellExcerpt} />
        <Paragraph text={t.shellWhy} />
      </DocSection>

      <DocSection description={t.browserDescription} title={t.browserTitle}>
        <CodeBlock code={BROWSER} lang="tsx" />
        <Paragraph text={t.browserHow} />
        <Paragraph text={t.browserSuspense} />
      </DocSection>

      <DocSection
        description={t.serverOnlyDescription}
        title={t.serverOnlyTitle}
      >
        <Paragraph text={t.serverOnlyFails} />
        <CodeBlock code={SERVER_ONLY_ERROR} lang="bash" />
        <Paragraph text={t.serverOnlyWhy} />
        <Paragraph text={t.serverOnlyName} />
      </DocSection>

      <DocSection description={t.whereDescription} title={t.whereTitle}>
        <CodeBlock code={WHERE} lang="tsx" />
        <Paragraph text={t.whereMore}>
          <LocaleAnchor path="/:locale/router/framework">
            {m.router.navFramework()}
          </LocaleAnchor>
        </Paragraph>
      </DocSection>

      <DocSection description={t.searchDescription} title={t.searchTitle}>
        <Paragraph text={t.searchRegister}>
          <LocaleAnchor path="/:locale/state">@k8ordo/state</LocaleAnchor>
        </Paragraph>
        <Paragraph text={own.searchNote}>
          {mode === 'static' ? (
            <LocaleAnchor path="/:locale/form">@k8ordo/form</LocaleAnchor>
          ) : null}
        </Paragraph>
      </DocSection>
    </>
  );
}
