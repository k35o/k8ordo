import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { ErrorDemo } from '../../../../demos/framework/errors/error-demo';
import * as m from '../../../../messages';

const t = m.frameworkErrors;

const ERROR = `'use client';

import type { ErrorProps } from '@k8ordo/framework';

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

const PAGE_NOT_FOUND = `import { notFound } from '@k8ordo/framework';
import type { PageProps } from '@k8ordo/framework';

import { findProduct } from '../../../lib/catalog.server';

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  if (product === undefined) notFound();
  return <h1>{product.name}</h1>;
}`;

const REDIRECT = `export default '/products';`;

const REDIRECT_PATTERN = `export default { to: '/:locale/new', permanent: true };`;

export default function FrameworkErrorsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/errors">
      <DocSection id="error" title={t.errorTitle}>
        <CodeBlock
          callouts={{ 1: t.errorClientCallout(), 5: t.errorResetCallout() }}
          code={ERROR}
          lang="tsx"
          marks={{ 1: 'highlight', 5: 'highlight' }}
          title="src/routes/error.tsx"
        />
        <p>
          <Rich>{t.errorPlace()}</Rich>
        </p>
        <p>
          <Rich>{t.errorProps()}</Rich>
        </p>
        <p>
          <Rich>{t.errorAway()}</Rich>
        </p>
      </DocSection>

      <DocSection id="scope" title={t.scopeTitle}>
        <CodeBlock
          code={SCOPE_TREE}
          lang="text"
          marks={{ 3: 'highlight', 7: 'highlight' }}
        />
        <p>
          <Rich>{t.scopeNearest()}</Rich>
        </p>
        <p>
          <Rich>{t.scopeLayout()}</Rich>
        </p>
        <p>
          <Rich>{t.scopeNone()}</Rich>
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

      <DocSection id="build" title={t.buildTitle}>
        <p>
          <Rich>{t.buildServer()}</Rich>
        </p>
        <p>
          <Rich>{t.buildClient()}</Rich>
        </p>
      </DocSection>

      <DocSection id="server-render" title={t.renderTitle}>
        <p>
          <Rich>{t.renderBoundary()}</Rich>
        </p>
        <p>
          <Rich>{t.renderBrowser()}</Rich>
        </p>
        <p>
          <Rich>{t.renderNoBoundary()}</Rich>
        </p>
      </DocSection>

      <DocSection id="not-found" title={t.notFoundTitle}>
        <CodeBlock
          code={NOT_FOUND}
          lang="tsx"
          title="src/routes/not-found.tsx"
        />
        <p>
          <Rich>{t.notFoundAnswers()}</Rich>
        </p>
        <p>
          <Rich>{t.notFoundStatic()}</Rich>
          <LocaleAnchor path="/:locale/framework/deploy">
            {m.framework.navDeploy()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.notFoundServer()}</Rich>
        </p>
      </DocSection>

      <DocSection id="page-not-found" title={t.pageNotFoundTitle}>
        <CodeBlock
          callouts={{ 10: t.pageNotFoundCallout() }}
          code={PAGE_NOT_FOUND}
          lang="tsx"
          marks={{ 10: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.pageNotFoundSchema()}</Rich>
        </p>
        <p>
          <Rich>{t.pageNotFoundStatic()}</Rich>
        </p>
        <p>
          <Rich>{t.pageNotFoundShell()}</Rich>
          <LocaleAnchor path="/:locale/framework/params">
            {m.framework.navParams()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.pageNotFoundServer()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.pageNotFoundDeep()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="redirect" title={t.redirectTitle}>
        <CodeBlock
          code={REDIRECT}
          lang="ts"
          title="src/routes/old/redirect.ts"
        />
        <CodeBlock
          callouts={{ 1: t.redirectPatternCallout() }}
          code={REDIRECT_PATTERN}
          lang="ts"
          marks={{ 1: 'highlight' }}
          title="src/routes/[locale]/legacy/redirect.ts"
        />
        <p>
          <Rich>{t.redirectFile()}</Rich>
        </p>
        <p>
          <Rich>{t.redirectStatic()}</Rich>
        </p>
        <p>
          <Rich>{t.redirectServer()}</Rich>
          <LocaleAnchor path="/:locale/framework/actions">
            {m.framework.navActions()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.redirectType()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
