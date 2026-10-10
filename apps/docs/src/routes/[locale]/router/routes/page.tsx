import type { Message } from '@k8ordo/i18n';
import { Code } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerRoutes;

const SHAPE = `export const routes = defineRoutes({
  '/': Home,
  '/products': {
    layout: ProductsLayout,
    children: {
      '/': ProductList,
      '/:id': ProductPage,
    },
  },
});`;

const PARAM = `const routes = defineRoutes({ '/products/:id': ProductPage });

routes.match('/products/42')?.params; // { id: '42' }
routes.match('/products/a%2Fb')?.params; // { id: 'a/b' }
routes.match('/products/a/b'); // null
routes.match('/products/'); // null`;

const WILDCARD = `const routes = defineRoutes({
  '/': Home,
  '/products/:id': ProductPage,
  '/*': NotFound,
});

routes.match('/products/42/reviews')?.pattern; // '/*'
routes.match('/no/such/page')?.pattern; // '/*'`;

const GROUP = `export const routes = defineRoutes({
  '/(marketing)': {
    layout: MarketingLayout,
    children: {
      '/': Home,
      '/pricing': Pricing,
    },
  },
  '/(docs)': {
    layout: DocsLayout,
    children: { '/guide': Guide },
  },
});`;

const ORDER_WRONG = `defineRoutes({
  '/products/:id': ProductPage,
  '/products/new': NewProduct,
});`;

const ORDER_RIGHT = `defineRoutes({
  '/products/new': NewProduct,
  '/products/:id': ProductPage,
});`;

type Refused = { label: Message; error?: string };

const REFUSED: readonly Refused[] = [
  {
    label: t.refusedNoSlash,
    error: 'route pattern "products" must start with "/"',
  },
  {
    label: t.refusedParentheses,
    error:
      'route group "/(admin)/new" must be "/(name)" and nothing else — a regular expression is not part of the grammar',
  },
  {
    label: t.refusedGroupLeaf,
    error: 'route group "/(oops)" must have children',
  },
  { label: t.refusedTwice, error: 'route pattern "/x" is declared twice' },
  { label: t.refusedUnparsable },
];

export default function RouterRoutesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/routes">
      <DocSection id="shape" title={t.shapeTitle}>
        <CodeBlock
          code={SHAPE}
          lang="ts"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="src/routes.ts"
        />
        <p>
          <Rich>{t.shapeValues()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeKeys()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeTrailingSlash()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.shapeMoreBefore()}</Rich>
            <LocaleAnchor path="/:locale/router/boundaries">
              {m.router.navBoundaries()}
            </LocaleAnchor>
            <Rich>{t.shapeMoreAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="param" title={t.paramTitle}>
        <CodeBlock code={PARAM} lang="ts" />
        <p>
          <Rich>{t.paramSegment()}</Rich>
        </p>
        <p>
          <Rich>{t.paramType()}</Rich>
        </p>
        <p>
          <Rich>{t.paramMatch()}</Rich>
        </p>
      </DocSection>

      <DocSection id="wildcard" title={t.wildcardTitle}>
        <CodeBlock code={WILDCARD} lang="ts" marks={{ 4: 'highlight' }} />
        <p>
          <Rich>{t.wildcardRest()}</Rich>
        </p>
        <p>
          <Rich>{t.wildcardBelow()}</Rich>
        </p>
        <p>
          <Rich>{t.wildcardNotLink()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.wildcardDownloadBefore()}</Rich>
            <LocaleAnchor path="/:locale/router/links">
              {m.router.navLinks()}
            </LocaleAnchor>
            <Rich>{t.wildcardDownloadAfter()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="group" title={t.groupTitle}>
        <CodeBlock
          code={GROUP}
          lang="ts"
          marks={{ 2: 'highlight', 9: 'highlight' }}
          title="src/routes.ts"
        />
        <p>
          <Rich>{t.groupResult()}</Rich>
        </p>
        <p>
          <Rich>{t.groupWhy()}</Rich>
        </p>
      </DocSection>

      <DocSection id="order" title={t.orderTitle}>
        <CodeBlock
          callouts={{ 3: t.orderShadowed() }}
          code={ORDER_WRONG}
          lang="ts"
        />
        <p>
          <Rich>{t.orderWrong()}</Rich>
        </p>
        <CodeBlock code={ORDER_RIGHT} lang="ts" marks={{ 2: 'highlight' }} />
        <p>
          <Rich>{t.orderRight()}</Rich>
        </p>
      </DocSection>

      <DocSection id="unmatched" title={t.unmatchedTitle}>
        <p>
          <Rich>{t.unmatchedBrowser()}</Rich>
        </p>
        <p>
          <Rich>{t.unmatchedRender()}</Rich>
        </p>
      </DocSection>

      <DocSection id="refused" title={t.refusedTitle}>
        <p>
          <Rich>{t.refusedWhen()}</Rich>
        </p>
        <ul>
          {REFUSED.map((item) => (
            <li key={item.label()}>
              <Rich>{item.label()}</Rich>
              {item.error !== undefined && (
                <span className="block break-all">
                  <Code>{item.error}</Code>
                </span>
              )}
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.refusedWhy()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
