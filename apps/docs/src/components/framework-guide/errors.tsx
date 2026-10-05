import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import { Playground } from '../playground';
import { Rich } from '../rich';
import { ErrorDemo } from './error-demo';
import type { Mode } from './mode';

const ERROR = `'use client';

import type { ErrorProps } from '@k8ordo/router';

export default function RouteError({ reset }: ErrorProps) {
  return (
    <section role="alert">
      <p>Something went wrong.</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </section>
  );
}`;

const SCOPE_TREE = `src/routes/
  layout.tsx
  error.tsx
  page.tsx
  shop/
    layout.tsx
    error.tsx
    page.tsx
    [id]/
      page.tsx`;

const NOT_FOUND = `export default function NotFoundPage() {
  return (
    <>
      <title>Not found</title>
      <h1>This page does not exist</h1>
    </>
  );
}`;

const PAGE_NOT_FOUND = `import { notFound } from '@k8ordo/router';
import type { PageProps } from '@k8ordo/router';

import { findProduct } from '../../_data/catalog.server';

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  if (product === undefined) notFound();
  return <h1>{product.name}</h1>;
}`;

const REDIRECT = `export default '/products';`;

const REDIRECT_PATTERN = `export default { to: '/:locale/new', permanent: true };`;

const staticBuild = () => {
  const t = m.staticErrors;
  return (
    <DocSection
      description={t.buildDescription}
      id="build"
      title={t.buildTitle}
    >
      <p>
        <Rich>{t.buildLog()}</Rich>
      </p>
      <p>
        <Rich>{t.buildClient()}</Rich>
      </p>
      <p>
        <Rich>{t.buildBrowser()}</Rich>
      </p>
    </DocSection>
  );
};

const serverRender = () => {
  const t = m.serverErrors;
  return (
    <DocSection
      description={t.renderDescription}
      id="server-render"
      title={t.renderTitle}
    >
      <p>
        <Rich>{t.renderBrowser()}</Rich>
      </p>
      <p>
        <Rich>{t.renderMessage()}</Rich>
      </p>
      <p>
        <Rich>{t.renderNoBoundary()}</Rich>
      </p>
    </DocSection>
  );
};

/**
 * `error.tsx`, `not-found.tsx`, `notFound()` and `redirect.ts`, shared by
 * `/static/errors` and `/server/errors`; what happens when something fails
 * on the server side is the mode's own. A function rather than a component,
 * so `DocPage` sees the sections it returns and lists them in the contents.
 */
export const errorsSections = (mode: Mode) => {
  const t = m.frameworkErrors;
  const own = mode === 'static' ? m.staticErrors : m.serverErrors;
  return (
    <>
      <DocSection
        description={t.errorDescription}
        id="error"
        title={t.errorTitle}
      >
        <CodeBlock code={ERROR} lang="tsx" title="src/routes/error.tsx" />
        <p>
          <Rich>{t.errorClient()}</Rich>
        </p>
        <p>
          <Rich>{t.errorAway()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.scopeDescription}
        id="scope"
        title={t.scopeTitle}
      >
        <CodeBlock code={SCOPE_TREE} lang="text" />
        <p>
          <Rich>{t.scopeExample()}</Rich>
        </p>
        <p>
          <Rich>{t.scopeNone()}</Rich>
        </p>
        <p>
          <Rich>{own.scopeMode()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <ErrorDemo label={t.demoButton()} />
      </Playground>

      {mode === 'static' ? staticBuild() : serverRender()}

      <DocSection
        description={t.notFoundDescription}
        id="not-found"
        title={t.notFoundTitle}
      >
        <CodeBlock
          code={NOT_FOUND}
          lang="tsx"
          title="src/routes/not-found.tsx"
        />
        <p>
          <Rich>{t.notFoundProps()}</Rich>
        </p>
        <p>
          <Rich>{own.notFoundMode()}</Rich>
        </p>
        {mode === 'static' ? (
          <>
            <p>
              <Rich>{m.staticErrors.notFoundCount()}</Rich>
            </p>
            <p>
              <Rich>{m.staticErrors.notFoundMore()}</Rich>{' '}
              <LocaleAnchor path="/:locale/static/deploy">
                {m.static.navDeploy()}
              </LocaleAnchor>
            </p>
          </>
        ) : (
          <p>
            <Rich>{m.serverErrors.notFoundNone()}</Rich>
          </p>
        )}
      </DocSection>

      <DocSection
        description={t.pageNotFoundDescription}
        id="page-not-found"
        title={t.pageNotFoundTitle}
      >
        <CodeBlock
          code={PAGE_NOT_FOUND}
          lang="tsx"
          marks={{ 10: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.pageNotFoundAnswer()}</Rich>
        </p>
        <p>
          <Rich>{t.pageNotFoundRouter()}</Rich>
        </p>
        <p>
          <Rich>{own.pageNotFoundMode()}</Rich>
        </p>
        {mode === 'server' && (
          <>
            <p>
              <Rich>{m.serverErrors.pageNotFoundNavigation()}</Rich>
            </p>
            <p>
              <Rich>{m.serverErrors.pageNotFoundDeep()}</Rich>
            </p>
          </>
        )}
      </DocSection>

      <DocSection
        description={t.redirectDescription}
        id="redirect"
        title={t.redirectTitle}
      >
        <CodeBlock
          code={REDIRECT}
          lang="ts"
          title="src/routes/old/redirect.ts"
        />
        <CodeBlock
          code={REDIRECT_PATTERN}
          lang="ts"
          title="src/routes/[locale]/legacy/redirect.ts"
        />
        <p>
          <Rich>{t.redirectPattern()}</Rich>
        </p>
        <p>
          <Rich>{t.redirectAlone()}</Rich>
        </p>
        <p>
          <Rich>{own.redirectMode()}</Rich>
        </p>
        {mode === 'static' ? (
          <p>
            <Rich>{m.staticErrors.redirectNavigation()}</Rich>
          </p>
        ) : (
          <>
            <p>
              <Rich>{m.serverErrors.redirectType()}</Rich>
            </p>
            <p>
              <Rich>{m.serverErrors.redirectAction()}</Rich>{' '}
              <LocaleAnchor path="/:locale/server/actions">
                {m.server.navActions()}
              </LocaleAnchor>
            </p>
          </>
        )}
      </DocSection>
    </>
  );
};
