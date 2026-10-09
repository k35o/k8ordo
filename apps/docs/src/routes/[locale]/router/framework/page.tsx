import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerFramework;

const PAGE = `import { href, notFound } from '@k8ordo/framework';
import type { PageProps } from '@k8ordo/framework';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  if (product === undefined) notFound();

  return (
    <article>
      <h1>{product.name}</h1>
      <a href={href('/products/:id', { id: params.id + 1 })}>Next</a>
    </article>
  );
}`;

const LAYOUT = `import type { LayoutProps } from '@k8ordo/framework';

export default function ProductsLayout({
  children,
}: LayoutProps<'/products'>) {
  return <section>{children}</section>;
}`;

const ROUTE = `import type { RouteContext } from '@k8ordo/framework';

export async function GET({ request }: RouteContext<'/feed.xml'>) {
  const origin = new URL(request.url).origin;
  return new Response(await renderFeed(origin), {
    headers: { 'content-type': 'application/rss+xml' },
  });
}`;

const List = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function RouterFrameworkPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/framework">
      <DocSection
        description={t.noTableDescription}
        id="no-table"
        title={t.noTableTitle}
      >
        <p>
          <Rich>{t.noTableNavigation()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.carryDescription}
        id="carry"
        title={t.carryTitle}
      >
        <List
          items={[
            t.carryLinks,
            t.carryLocation,
            t.carryPaths,
            t.carryProps,
            t.carryNotFound,
          ]}
        />
        <p>
          <Rich>{t.carryClient()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.notUsedDescription}
        id="not-used"
        title={t.notUsedTitle}
      >
        <List
          items={[
            t.notUsedTable,
            t.notUsedRouter,
            t.notUsedBoundaries,
            t.notUsedRegister,
            t.notUsedHost,
          ]}
        />
        <Pitfall>
          <p>
            <Rich>{t.notUsedParams()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.pagePropsDescription}
        id="page-props"
        title={t.pagePropsTitle}
      >
        <CodeBlock
          code={PAGE}
          lang="tsx"
          marks={{ 11: 'highlight', 18: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.pagePropsParams()}</Rich>
        </p>
        <p>
          <Rich>{t.pagePropsLinks()}</Rich>
        </p>
        <p>
          <Rich>{t.pagePropsNotFound()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.pagePropsNotFoundWhy()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.layoutPropsDescription}
        id="layout-props"
        title={t.layoutPropsTitle}
      >
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 5: 'highlight' }}
          title="src/routes/products/layout.tsx"
        />
        <p>
          <Rich>{t.layoutPropsStrings()}</Rich>
        </p>
        <p>
          <Rich>{t.layoutPropsPage()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.requestDescription}
        id="request"
        title={t.requestTitle}
      >
        <p>
          <Rich>{t.requestStatic()}</Rich>
        </p>
        <p>
          <Rich>{t.requestSearch()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.routeDescription}
        id="route"
        title={t.routeTitle}
      >
        <CodeBlock
          code={ROUTE}
          lang="ts"
          marks={{ 3: 'highlight' }}
          title="src/routes/feed.xml/route.ts"
        />
        <p>
          <Rich>{t.routeFields()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
