import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallCommand } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkBoundaries;

const CATALOG = `import 'server-only';

export type Product = { id: number; name: string };

const products: readonly Product[] = [
  { id: 1, name: 'Lamp' },
  { id: 2, name: 'Desk' },
];

export const listProducts = async (): Promise<readonly Product[]> =>
  products;`;

const PRODUCTS = `import { href } from '@k8ordo/framework';

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

import { useMatch, usePathname } from '@k8ordo/framework';

export function Where() {
  const pathname = usePathname();
  const inProducts = useMatch('/products/*') !== null;
  return <p data-products={inProducts}>{pathname}</p>;
}`;

export default function FrameworkBoundariesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/boundaries">
      <DocSection id="server" title={t.serverTitle}>
        <CodeBlock
          code={CATALOG}
          lang="ts"
          marks={{ 1: 'highlight' }}
          title="src/routes/_data/catalog.server.ts"
        />
        <CodeBlock
          callouts={{ 5: t.serverAsyncCallout() }}
          code={PRODUCTS}
          lang="tsx"
          marks={{ 5: 'highlight', 6: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.serverDefault()}</Rich>
        </p>
        <p>
          <Rich>{t.serverWhen()}</Rich>
        </p>
      </DocSection>

      <DocSection id="client" title={t.clientTitle}>
        <CodeBlock
          code={COUNTER}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="src/routes/_parts/counter.tsx"
        />
        <CodeBlock
          code={HOME}
          lang="tsx"
          marks={{ 1: 'highlight', 7: 'highlight' }}
          title="src/routes/page.tsx"
        />
        <p>
          <Rich>{t.clientOptIn()}</Rich>
        </p>
        <p>
          <Rich>{t.clientSsr()}</Rich>
        </p>
        <p>
          <Rich>{t.directiveNote()}</Rich>
          <LocaleAnchor path="/:locale/framework/actions">
            {m.framework.navActions()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="props" title={t.propsTitle}>
        <p>
          <Rich>{t.propsSerialized()}</Rich>
        </p>
        <ul>
          {t.propsList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.propsFunction()}</Rich>
        </p>
      </DocSection>

      <DocSection id="shell" title={t.shellTitle}>
        <CodeBlock
          callouts={{ 6: t.shellSchemaCallout() }}
          code={LAYOUT}
          lang="tsx"
          marks={{ 6: 'highlight', 13: 'highlight' }}
          title="src/routes/[locale]/layout.tsx"
        />
        <CodeBlock
          code={SHELL}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="src/routes/[locale]/_parts/locale-shell.tsx"
        />
        <p>
          <Rich>{t.shellWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.shellChildren()}</Rich>
        </p>
      </DocSection>

      <DocSection id="browser" title={t.browserTitle}>
        <CodeBlock
          callouts={{
            7: t.browserUseCallout(),
            14: t.browserSuspenseCallout(),
          }}
          code={BROWSER}
          lang="tsx"
          marks={{ 7: 'highlight', 14: 'highlight' }}
          title="src/routes/_parts/editor.tsx"
        />
        <p>
          <Rich>{t.browserHow()}</Rich>
        </p>
        <p>
          <Rich>{t.browserRender()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.browserSuspense()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="server-only" title={t.serverOnlyTitle}>
        <InstallCommand packages="server-only" />
        <CodeBlock code={SERVER_ONLY} lang="text" title="vite build" />
        <p>
          <Rich>{t.serverOnlyInstall()}</Rich>
          {t.sentenceGap()}
          <Rich>{t.serverOnlyImport()}</Rich>
        </p>
        <p>
          <Rich>{t.serverOnlyName()}</Rich>
        </p>
      </DocSection>

      <DocSection id="where" title={t.whereTitle}>
        <CodeBlock
          code={WHERE}
          lang="tsx"
          marks={{ 3: 'highlight', 6: 'highlight', 7: 'highlight' }}
          title="src/routes/_parts/where.tsx"
        />
        <p>
          <Rich>{t.whereNoTable()}</Rich>
        </p>
        <p>
          <Rich>{t.whereUse()}</Rich>
        </p>
      </DocSection>

      <DocSection id="search" title={t.searchTitle}>
        <p>
          <Rich>{t.searchSplit()}</Rich>
        </p>
        <p>
          <Rich>{t.searchRender()}</Rich>
        </p>
        <p>
          <Rich>{t.searchMode()}</Rich>
          <LocaleAnchor path="/:locale/framework/params">
            {m.framework.navParams()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
          {t.sentenceGap()}
          <Rich>{t.searchStatic()}</Rich>
          <LocaleAnchor path="/:locale/form/search">
            {m.form.navSearch()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
