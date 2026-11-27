import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateNextjs;

const STATE = `import { definePageState } from '@k8ordo/state';
import * as z from 'zod';

export const listState = definePageState('product-list', {
  url: z.object({
    inStock: z.stringbool().default(false),
    page: z.coerce.number().int().min(1).default(1),
  }),
});`;

const PAGE = `import Link from 'next/link';

import { Filters } from './filters';
import { listState } from './state';

export default async function Page({
  searchParams,
}: PageProps<'/products'>) {
  const url = listState.parseUrl(await searchParams);
  const products = await fetchProducts(url);
  const nextPage = listState.href('/products', {
    ...url,
    page: url.page + 1,
  });

  return (
    <>
      <Filters initialUrl={url} />
      <ProductList products={products} />
      <Link href={nextPage}>Next page</Link>
    </>
  );
}`;

const FILTERS = `'use client';

import { useAppState } from '@k8ordo/state';
import type { OutputOf } from '@k8ordo/state';

import { listState } from './state';

type FiltersProps = { initialUrl: OutputOf<typeof listState.url> };

export function Filters({ initialUrl }: FiltersProps) {
  const [{ inStock }] = useAppState(listState, { initialUrl });

  return (
    <form action="/products" method="get">
      <label>
        <input
          defaultChecked={inStock}
          name="inStock"
          type="checkbox"
          value="true"
        />
        In stock only
      </label>
      <button type="submit">Apply</button>
    </form>
  );
}`;

const COOKIE_LAYOUT = `import { cookies } from 'next/headers';

import { Shell } from './shell';
import { density } from './state';

export default async function Layout({
  children,
}: LayoutProps<'/'>) {
  const store = await cookies();
  const initialCookie = density.parseCookies({
    get: (name) => store.get(name)?.value,
  });
  return <Shell initialCookie={initialCookie}>{children}</Shell>;
}`;

const COOKIE_ACTION = `'use server';

import { cookies } from 'next/headers';

import { density } from './state';

export async function compact() {
  const store = await cookies();
  store.set(
    ...density.cookie(
      { density: 'compact' },
      { get: (name) => store.get(name)?.value },
    ),
  );
}`;

export default function StateNextjsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/nextjs">
      <DocSection id="works" title={t.worksTitle}>
        <CodeBlock code={STATE} lang="ts" title="app/products/state.ts" />
        <p>
          <Rich>{t.worksSame()}</Rich>
        </p>
        <p>
          <Rich>{t.worksDiffers()}</Rich>
        </p>
      </DocSection>

      <DocSection id="server" title={t.serverTitle}>
        <CodeBlock
          code={PAGE}
          lang="tsx"
          marks={{ 9: 'highlight', 18: 'highlight' }}
          title="app/products/page.tsx"
        />
        <p>
          <Rich>{t.serverParse()}</Rich>
        </p>
        <p>
          <Rich>{t.serverInput()}</Rich>
        </p>
        <p>
          <Rich>{t.serverHref()}</Rich>
        </p>
        <CodeBlock
          code={FILTERS}
          lang="tsx"
          marks={{ 11: 'highlight' }}
          title="app/products/filters.tsx"
        />
        <p>
          <Rich>{t.serverInitial()}</Rich>
        </p>
      </DocSection>

      <DocSection id="cookie" title={t.cookieTitle}>
        <CodeBlock
          code={COOKIE_LAYOUT}
          lang="tsx"
          marks={{ 10: 'highlight', 11: 'highlight', 12: 'highlight' }}
          title="app/layout.tsx"
        />
        <p>
          <Rich>{t.cookieRead()}</Rich>
        </p>
        <CodeBlock
          code={COOKIE_ACTION}
          lang="ts"
          marks={{ 10: 'highlight', 11: 'highlight', 12: 'highlight' }}
          title="app/actions.ts"
        />
        <p>
          <Rich>{t.cookieWrite()}</Rich>
        </p>
      </DocSection>

      <DocSection id="typed" title={t.typedTitle}>
        <p>
          <Rich>{t.typedRoute()}</Rich>
        </p>
      </DocSection>

      <DocSection id="update" title={t.updateTitle}>
        <p>
          <Rich>{t.updateNavigate()}</Rich>
        </p>
        <p>
          <Rich>{t.updateLinksBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/links">
            {m.state.navLinks()}
          </LocaleAnchor>
          <Rich>{t.updateLinksAfter()}</Rich>
        </p>
        <p>
          <Rich>{t.updateOthers()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
