import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { Pitfall } from '../callout';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import { Rich } from '../rich';
import type { Mode } from './mode';

const CATALOG = `import 'server-only';

export type Product = { id: number; name: string };

const products: readonly Product[] = [
  { id: 1, name: 'Lamp' },
  { id: 2, name: 'Desk' },
];

export const listProducts = async (): Promise<readonly Product[]> =>
  products;`;

const PRODUCTS = `import { href } from '@k8ordo/router';

import { listProducts } from '../_data/catalog.server';

export default async function ProductsPage() {
  const products = await listProducts();
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

const COUNTER = `'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => {
        setCount(count + 1);
      }}
      type="button"
    >
      {count}
    </button>
  );
}`;

const HOME = `import { Counter } from './_parts/counter';

export default function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <Counter />
    </>
  );
}`;

const LAYOUT = `import type { ReactNode } from 'react';

import { locales } from '../../i18n';
import { LocaleShell } from './_parts/locale-shell';

export const { paramsSchema } = locales;

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LocaleShell>{children}</LocaleShell>;
}`;

const SHELL = `'use client';

import { UIProvider } from '@k8ordo/ui';
import type { ReactNode } from 'react';

export function LocaleShell({ children }: { children: ReactNode }) {
  return <UIProvider>{children}</UIProvider>;
}`;

const BROWSER = `'use client';

import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('the draft is in localStorage'));
  const draft = localStorage.getItem('draft') ?? '';
  return <textarea defaultValue={draft} />;
}

export function Editor() {
  return (
    <Suspense fallback={<p>Loading the draft…</p>}>
      <SavedDraft />
    </Suspense>
  );
}`;

const SERVER_ONLY = `'server-only' cannot be imported in client build ('ssr' environment):
 imported by src/routes/_data/catalog.server.ts
  imported by src/routes/_parts/counter.tsx
   imported by virtual:vite-rsc/client-references`;

const WHERE = `'use client';

import { useMatch, usePathname } from '@k8ordo/router';

export function Where() {
  const pathname = usePathname();
  const inProducts = useMatch('/products/*') !== null;
  return <p data-products={inProducts}>{pathname}</p>;
}`;

/**
 * Execution boundaries, shared by `/static/boundaries` and
 * `/server/boundaries`; when a Server Component runs is the mode's own. A
 * function rather than a component, so `DocPage` sees the sections it
 * returns and lists them in the contents.
 */
export const boundariesSections = (mode: Mode) => {
  const t = m.frameworkBoundaries;
  const own = mode === 'static' ? m.staticBoundaries : m.serverBoundaries;
  return (
    <>
      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={CATALOG}
          lang="ts"
          title="src/routes/_data/catalog.server.ts"
        />
        <CodeBlock
          code={PRODUCTS}
          lang="tsx"
          marks={{ 5: 'highlight', 6: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{own.serverWhen()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.clientDescription}
        id="client"
        title={t.clientTitle}
      >
        <CodeBlock
          code={COUNTER}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="src/routes/_parts/counter.tsx"
        />
        <CodeBlock code={HOME} lang="tsx" title="src/routes/page.tsx" />
        <p>
          <Rich>{t.clientSsr()}</Rich>
        </p>
        <p>
          <Rich>{own.directiveNote()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.propsDescription}
        id="props"
        title={t.propsTitle}
      >
        <ul>
          {t.propsList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.propsNo()}</Rich>
        </p>
        <p>
          <Rich>{own.propsFunction()}</Rich>
        </p>
        <p>
          <Rich>{t.propsSite()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.shellDescription}
        id="shell"
        title={t.shellTitle}
      >
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="src/routes/[locale]/layout.tsx"
        />
        <CodeBlock
          code={SHELL}
          lang="tsx"
          title="src/routes/[locale]/_parts/locale-shell.tsx"
        />
        <p>
          <Rich>{t.shellChildren()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.browserDescription}
        id="browser"
        title={t.browserTitle}
      >
        <CodeBlock
          code={BROWSER}
          lang="tsx"
          marks={{ 7: 'highlight', 14: 'highlight' }}
          title="src/routes/_parts/editor.tsx"
        />
        <p>
          <Rich>{t.browserHow()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.browserSuspense()}</Rich>
          </p>
        </Pitfall>
        <p>
          <Rich>{t.browserNoFlag()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serverOnlyDescription}
        id="server-only"
        title={t.serverOnlyTitle}
      >
        <CodeBlock code={SERVER_ONLY} lang="text" title="vite build" />
        <p>
          <Rich>{t.serverOnlyChain()}</Rich>
        </p>
        <p>
          <Rich>{t.serverOnlyName()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.whereDescription}
        id="where"
        title={t.whereTitle}
      >
        <p>
          <Rich>{t.whereUse()}</Rich>
        </p>
        <CodeBlock
          code={WHERE}
          lang="tsx"
          title="src/routes/_parts/where.tsx"
        />
      </DocSection>

      <DocSection
        description={t.searchDescription}
        id="search"
        title={t.searchTitle}
      >
        <p>
          <Rich>{t.searchRender()}</Rich>
        </p>
        <p>
          <Rich>{t.searchRegister()}</Rich>
        </p>
        <p>
          <Rich>{own.searchMode()}</Rich>
          {mode === 'static' && (
            <>
              {' '}
              <LocaleAnchor path="/:locale/form/search">
                {m.form.navSearch()}
              </LocaleAnchor>
            </>
          )}
        </p>
      </DocSection>
    </>
  );
};
