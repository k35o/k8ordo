import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateLinks;

const HREF = `listState.href('/products');
// '/products'

listState.href('/products', { inStock: true, page: 2 });
// '/products?inStock=true&page=2'

listState.search({ page: 2 });
// 'page=2'`;

const BASE = `listState.href('/products', { page: 2 });
// '/docs/products?page=2'`;

const REGISTER_ROUTES = `import type { routes } from './routes';

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

const REGISTER_PATH = `import type { Route } from 'next';

declare module '@k8ordo/state' {
  interface Register {
    path: Route;
  }
}`;

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
          <Rich>{t.hrefSearch()}</Rich>
        </p>
        <p>
          <Rich>{t.hrefEdges()}</Rich>
        </p>
      </DocSection>

      <DocSection id="base" title={t.baseTitle}>
        <CodeBlock code={BASE} lang="ts" />
        <p>
          <Rich>{t.baseRoot()}</Rich>
        </p>
        <p>
          <Rich>{t.baseRouterHref()}</Rich>
        </p>
        <p>
          <Rich>{t.baseOutside()}</Rich>
        </p>
      </DocSection>

      <DocSection id="typed" title={t.typedTitle}>
        <CodeBlock
          code={REGISTER_ROUTES}
          lang="ts"
          marks={{ 9: 'highlight', 10: 'highlight', 11: 'highlight' }}
          title="src/k8ordo.d.ts"
        />
        <p>
          <Rich>{t.typedRegister()}</Rich>
          <LocaleAnchor path="/:locale/router/typed-paths">
            {m.router.navTypedPaths()}
          </LocaleAnchor>
          <Rich>{t.typedRegisterAfter()}</Rich>
        </p>
        <p>
          <Rich>{t.typedMatch()}</Rich>
        </p>
        <p>
          <Rich>{t.typedRuntime()}</Rich>
        </p>
        <CodeBlock code={REGISTER_PATH} lang="ts" title="types/k8ordo.d.ts" />
        <p>
          <Rich>{t.typedPath()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.typedLibrary()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
