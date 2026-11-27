import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateLinks;

const HREF = `import { href } from '@k8ordo/router';

listState.href(href('/products'));
// '/products'

listState.href(href('/products'), { inStock: true, page: 2 });
// '/products?inStock=true&page=2'

listState.href('', { page: 2 });
// '?page=2'`;

const SHARED = `const url = campaignState.href(href('/products'), { ref: 'mail' });
// '/products?ref=mail'

listState.href(url, { page: 2 });
// '/products?ref=mail&page=2'

productState.href(href('/products/:id', { id: 42 }), {
  hash: 'reviews',
});
// '/products/42#reviews'`;

const BASE = `listState.href(href('/products'), { page: 2 });
// '/docs/products?page=2'`;

const NEXT = `import Link from 'next/link';

<Link href={listState.href('/products', { page: 2 })}>next</Link>;`;

export default function StateLinksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/links">
      <DocSection id="href" title={t.hrefTitle}>
        <CodeBlock code={HREF} lang="ts" />
        <p>
          <Rich>{t.hrefCanonical()}</Rich>
          <LocaleAnchor path="/:locale/state/url">
            {m.state.navUrl()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.hrefUrl()}</Rich>
        </p>
        <p>
          <Rich>{t.hrefEdges()}</Rich>
        </p>
        <p>
          <Rich>{t.hrefOneWay()}</Rich>
          <LocaleAnchor path="/:locale/router/links">
            {m.router.navLinks()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="shared" title={t.sharedTitle}>
        <CodeBlock code={SHARED} lang="ts" />
        <p>
          <Rich>{t.sharedOwn()}</Rich>
        </p>
        <p>
          <Rich>{t.sharedHash()}</Rich>
        </p>
      </DocSection>

      <DocSection id="base" title={t.baseTitle}>
        <CodeBlock code={BASE} lang="ts" />
        <p>
          <Rich>{t.baseRouter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="typed" title={t.typedTitle}>
        <CodeBlock code={NEXT} lang="tsx" />
        <p>
          <Rich>{t.typedRouter()}</Rich>
          <LocaleAnchor path="/:locale/router/typed-paths">
            {m.router.navTypedPaths()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.typedNext()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
