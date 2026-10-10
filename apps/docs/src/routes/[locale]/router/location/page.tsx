import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { MatchDemo } from '../../../../demos/router/location/match-demo';
import * as m from '../../../../messages';

const t = m.routerLocation;

const PATHNAME = `import { usePathname } from '@k8ordo/router';

export function CurrentPath() {
  const pathname = usePathname();
  return <p>You are at {pathname}</p>;
}`;

const MATCH = `import { href, useMatch } from '@k8ordo/router';

export function ProductsLink() {
  const isCurrent = useMatch('/products') !== null;

  return (
    <a
      aria-current={isCurrent ? 'page' : undefined}
      href={href('/products')}
    >
      Products
    </a>
  );
}`;

const SECTION = `matchPath('/products/*', '/products/42'); // {}
matchPath('/products/*', '/products'); // null
matchPath('/products/*', '/products', { inclusive: true }); // {}`;

const PENDING = `import { usePendingPathname } from '@k8ordo/router';

export function Progress() {
  const pending = usePendingPathname();
  if (pending === null) return null;

  return <p role="status">Loading {pending}…</p>;
}`;

const PARAMS = `import { useParams } from '@k8ordo/router';

export function ProductPage() {
  const { id } = useParams('/products/:id');
  return <h1>Product {id}</h1>;
}`;

const PARAMS_ERROR = 'useParams("/products/:id") rendered under "/products"';

const ROUTE = 'const { pattern, params } = useRoute();';

export default function RouterLocationPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/location">
      <DocSection id="pathname" title={t.pathnameTitle}>
        <CodeBlock
          code={PATHNAME}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="src/current-path.tsx"
        />
        <p>
          <Rich>{t.pathnameReturns()}</Rich>
        </p>
        <p>
          <Rich>{t.pathnameQuery()}</Rich>
          <LocaleAnchor path="/:locale/state/url">
            <Rich>{t.pathnameQueryLink()}</Rich>
          </LocaleAnchor>
          <Rich>{t.pathnameQueryAfter()}</Rich>
        </p>
        <p>
          <Rich>{t.pathnameFramework()}</Rich>
        </p>
      </DocSection>

      <DocSection id="match" title={t.matchTitle}>
        <CodeBlock
          code={MATCH}
          lang="tsx"
          marks={{ 4: 'highlight', 8: 'highlight' }}
          title="src/products-link.tsx"
        />
        <p>
          <Rich>{t.matchReturns()}</Rich>
        </p>
        <p>
          <Rich>{t.matchNoLink()}</Rich>
        </p>
      </DocSection>

      <DocSection id="section" title={t.sectionTitle}>
        <CodeBlock code={SECTION} lang="ts" />
        <p>
          <Rich>{t.sectionWildcard()}</Rich>
        </p>
        <p>
          <Rich>{t.sectionInclusive()}</Rich>
        </p>
        <p>
          <Rich>{t.sectionMatchPath()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <MatchDemo />
      </Playground>

      <DocSection id="pending" title={t.pendingTitle}>
        <CodeBlock
          code={PENDING}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="src/progress.tsx"
        />
        <p>
          <Rich>{t.pendingReturns()}</Rich>
        </p>
        <p>
          <Rich>{t.pendingWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.pendingWhen()}</Rich>
        </p>
      </DocSection>

      <DocSection id="params" title={t.paramsTitle}>
        <CodeBlock
          code={PARAMS}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="src/pages/product-page.tsx"
        />
        <p>
          <Rich>{t.paramsHook()}</Rich>
        </p>
        <p>
          <Rich>{t.paramsError()}</Rich>
        </p>
        <CodeBlock code={PARAMS_ERROR} lang="text" />
        <p>
          <Rich>{t.paramsRoute()}</Rich>
        </p>
        <CodeBlock code={ROUTE} lang="ts" />
        <Pitfall>
          <p>
            <Rich>{t.paramsFrameworkBefore()}</Rich>
            <LocaleAnchor path="/:locale/framework/params">
              {m.framework.navParams()}
            </LocaleAnchor>
            <Rich>{t.paramsFrameworkAfter()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
