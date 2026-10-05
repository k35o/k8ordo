import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { Pitfall } from '../callout';
import { DocSection } from '../doc-page';
import { Rich } from '../rich';
import type { Mode } from './mode';

const STRINGS = `import type { PageProps } from '@k8ordo/router';

export default function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  return <h1>{params.id.toUpperCase()}</h1>;
}`;

const SCHEMA = `import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  return <h1>{params.id.toFixed(0)}</h1>;
}`;

const STACK_LAYOUT = `import type { ReactNode } from 'react';

import { locales } from '../../i18n';

export const { paramsSchema } = locales;

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}`;

const STACK_PAGE = `import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({
  params,
}: PageProps<'/:locale/products/:id'>) {
  return <h1 lang={params.locale}>{params.id.toFixed(0)}</h1>;
}`;

const LINKS = `import { href } from '@k8ordo/router';

const ids = [1, 2, 3];

export default function ProductsPage() {
  return (
    <ul>
      {ids.map((id) => (
        <li key={id}>
          <a href={href('/products/:id', { id })}>Product {id}</a>
        </li>
      ))}
    </ul>
  );
}`;

/**
 * What a parameter is and how a schema types it, shared by `/static/params`
 * and `/server/params`. Functions rather than components, so `DocPage` sees
 * the sections they return and lists them in the contents; each mode page
 * puts its own sections between the two.
 */
export const paramsTypingSections = () => {
  const t = m.frameworkParams;
  return (
    <>
      <DocSection
        description={t.stringsDescription}
        id="strings"
        title={t.stringsTitle}
      >
        <CodeBlock
          code={STRINGS}
          lang="tsx"
          title="src/routes/products/[id]/page.tsx"
        />
      </DocSection>

      <DocSection
        description={t.schemaDescription}
        id="schema"
        title={t.schemaTitle}
      >
        <CodeBlock
          code={SCHEMA}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight', 6: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.schemaTyped()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaName()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaLibrary()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaFound()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.schemaSync()}</Rich>
          </p>
          <p>
            <Rich>{t.schemaServerFile()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.stackDescription}
        id="stack"
        title={t.stackTitle}
      >
        <p>
          <Rich>{t.stackEach()}</Rich>
        </p>
        <CodeBlock
          code={STACK_LAYOUT}
          lang="tsx"
          marks={{ 5: 'highlight' }}
          title="src/routes/[locale]/layout.tsx"
        />
        <CodeBlock
          code={STACK_PAGE}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight', 6: 'highlight' }}
          title="src/routes/[locale]/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.stackExample()}</Rich>
        </p>
      </DocSection>
    </>
  );
};

/** What a refused value becomes, links, and a layout's params. */
export const paramsUsingSections = (mode: Mode) => {
  const t = m.frameworkParams;
  const own = mode === 'static' ? m.staticParams : m.serverParams;
  return (
    <>
      <DocSection
        description={t.refusedDescription}
        id="refused"
        title={t.refusedTitle}
      >
        <p>
          <Rich>{own.refusedMode()}</Rich>
        </p>
        <p>
          <Rich>{t.refusedCatchAll()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.linksDescription}
        id="links"
        title={t.linksTitle}
      >
        <CodeBlock
          code={LINKS}
          lang="tsx"
          marks={{ 10: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.linksSpelling()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.layoutDescription}
        id="layout"
        title={t.layoutTitle}
      >
        <p>
          <Rich>{t.layoutValue()}</Rich>
        </p>
      </DocSection>
    </>
  );
};
