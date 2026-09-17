import * as m from '../../messages';
import { CodeBlock } from '../code-block';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import { ErrorDemo } from './error-demo';
import type { Mode } from './mode';
import { Paragraph } from './prose';

const ERROR = `// src/routes/error.tsx
'use client';

import type { ErrorProps } from '@k8ordo/router';

export default function RouteError({ error, reset }: ErrorProps) {
  return (
    <section role="alert">
      <p>{error instanceof Error ? error.message : 'something went wrong'}</p>
      <button onClick={reset} type="button">
        try again
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

const STATIC_STOP = `static build could not render /broken — see the error above`;

const NOT_FOUND = `// src/routes/not-found.tsx
export default function NotFoundPage() {
  return (
    <>
      <title>Not found</title>
      <h1>This page does not exist</h1>
    </>
  );
}`;

const STATIC_TWO_NOT_FOUND = `a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares /docs/*, /*`;

const REDIRECT = `// src/routes/old/redirect.ts
export default '/products';`;

const REDIRECT_PATTERN = `// src/routes/[locale]/legacy/redirect.ts
export default { to: '/:locale/new', permanent: true };`;

/**
 * `error.tsx`, `not-found.tsx` and `redirect.ts`, shared by `/static/errors`
 * and `/server/errors`. What happens on the server side is the mode's own.
 */
export function ErrorsGuide({ mode }: { mode: Mode }) {
  const t = m.frameworkErrors;
  const own = mode === 'static' ? m.staticErrors : m.serverErrors;

  return (
    <>
      <DocSection description={t.errorDescription} title={t.errorTitle}>
        <CodeBlock code={ERROR} lang="tsx" />
        <Paragraph text={t.errorProps} />
      </DocSection>

      <DocSection description={t.scopeDescription} title={t.scopeTitle}>
        <CodeBlock code={SCOPE_TREE} lang="bash" />
        <Paragraph text={t.scopeExample} />
        <Paragraph text={t.scopeSite} />
        <Paragraph text={t.scopeReset} />
      </DocSection>

      <DocSection
        description={() => t.demoDescription(m.error.retry())}
        title={t.demoTitle}
      >
        <ErrorDemo label={t.demoButton()} />
      </DocSection>

      <DocSection
        description={own.serverRenderDescription}
        title={own.serverRenderTitle}
      >
        {mode === 'static' && <CodeBlock code={STATIC_STOP} lang="bash" />}
        <Paragraph text={own.serverRenderClient} />
        <Paragraph text={own.serverRenderBrowser} />
      </DocSection>

      <DocSection description={t.withoutDescription} title={t.withoutTitle}>
        <Paragraph text={own.withoutNote} />
      </DocSection>

      <DocSection description={t.notFoundDescription} title={t.notFoundTitle}>
        <CodeBlock code={NOT_FOUND} lang="tsx" />
        <Paragraph text={t.notFoundParams} />
        <Paragraph text={own.notFoundNote} />
        {mode === 'static' && (
          <>
            <CodeBlock code={STATIC_TWO_NOT_FOUND} lang="bash" />
            <Paragraph text={m.staticErrors.notFoundMore}>
              <LocaleAnchor path="/:locale/static/deploy">
                {m.static.navDeploy()}
              </LocaleAnchor>
            </Paragraph>
          </>
        )}
      </DocSection>

      <DocSection description={t.redirectDescription} title={t.redirectTitle}>
        <CodeBlock code={REDIRECT} lang="ts" />
        <CodeBlock code={REDIRECT_PATTERN} lang="ts" />
        <Paragraph text={t.redirectPattern} />
        <Paragraph text={t.redirectOrder} />
        <Paragraph text={own.redirectNote} />
        {mode === 'server' && (
          <Paragraph text={m.serverErrors.redirectAction}>
            <LocaleAnchor path="/:locale/server/actions">
              {m.server.navActions()}
            </LocaleAnchor>
          </Paragraph>
        )}
      </DocSection>
    </>
  );
}
