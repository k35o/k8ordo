import { Anchor } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import type { Mode } from './mode';
import { Paragraph } from './prose';
import { SITE_LAYOUT } from './site-samples';

const STRINGS = `// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/router';

export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  return <h1>{params.id.toUpperCase()}</h1>;
}`;

const SCHEMA = `// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  return <h1>{params.id.toFixed(0)}</h1>;
}`;

const STACK_LOCALES = `// src/i18n.ts
import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});`;

const STACK_LAYOUT = `// src/routes/[locale]/layout.tsx
import type { ReactNode } from 'react';

import { locales } from '../../i18n';

export const { paramsSchema } = locales;

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}`;

const STACK_PAGE = `// src/routes/[locale]/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({
  params,
}: PageProps<'/:locale/products/:id'>) {
  return <h1 lang={params.locale}>{params.id.toFixed(0)}</h1>;
}`;

const SYNC_ERROR = `TypeError: a params schema must validate synchronously — which pattern answers a pathname is decided before anything renders`;

const LINKS = `// src/routes/products/page.tsx
import { href } from '@k8ordo/router';

export default function ProductsPage() {
  return (
    <ul>
      {[1, 2, 3].map((id) => (
        <li key={id}>
          <a href={href('/products/:id', { id })}>
            {\`product \${String(id)}\`}
          </a>
        </li>
      ))}
    </ul>
  );
}`;

const LAYOUT_STRINGS = `// src/routes/products/[id]/layout.tsx
import type { LayoutProps } from '@k8ordo/router';

export default function ProductLayout({
  params,
  children,
}: LayoutProps<'/products/:id'>) {
  return <section data-product={params.id}>{children}</section>;
}`;

/**
 * Parameters and their schemas, shared by `/static/params` and
 * `/server/params`. Each mode page adds how its values are found.
 */
export function ParamsGuide({ mode }: { mode: Mode }) {
  const t = m.frameworkParams;
  const own = mode === 'static' ? m.staticParams : m.serverParams;

  return (
    <>
      <DocSection description={t.stringsDescription} title={t.stringsTitle}>
        <CodeBlock code={STRINGS} lang="tsx" />
      </DocSection>

      <DocSection description={t.schemaDescription} title={t.schemaTitle}>
        <CodeBlock code={SCHEMA} lang="tsx" />
        <Paragraph text={t.schemaLibraries}>
          <Anchor href="https://standardschema.dev" openInNewTab>
            Standard Schema
          </Anchor>
        </Paragraph>
        <Paragraph text={t.schemaParsing} />
      </DocSection>

      <DocSection description={t.stackDescription} title={t.stackTitle}>
        <Paragraph text={t.stackExample} />
        <CodeBlock code={STACK_LOCALES} lang="ts" />
        <CodeBlock code={STACK_LAYOUT} lang="tsx" />
        <CodeBlock code={STACK_PAGE} lang="tsx" />
      </DocSection>

      <DocSection description={t.refusedDescription} title={t.refusedTitle}>
        <Paragraph text={own.refusedNote} />
        <Paragraph text={t.refusedCatchAll} />
      </DocSection>

      <DocSection description={t.syncDescription} title={t.syncTitle}>
        <CodeBlock code={SYNC_ERROR} lang="bash" />
      </DocSection>

      <DocSection description={t.clientDescription} title={t.clientTitle}>
        <CodeBlock code={SITE_LAYOUT} lang="tsx" />
        <Paragraph text={t.clientMore}>
          {mode === 'static' ? (
            <LocaleAnchor path="/:locale/static/boundaries">
              {m.static.navBoundaries()}
            </LocaleAnchor>
          ) : (
            <LocaleAnchor path="/:locale/server/boundaries">
              {m.server.navBoundaries()}
            </LocaleAnchor>
          )}
        </Paragraph>
      </DocSection>

      <DocSection description={t.typesDescription} title={t.typesTitle}>
        <CodeBlock code={LINKS} lang="tsx" />
        <Paragraph text={t.typesCheck} />
      </DocSection>

      <DocSection description={t.layoutDescription} title={t.layoutTitle}>
        <CodeBlock code={LAYOUT_STRINGS} lang="tsx" />
        <Paragraph text={t.layoutPropsPage} />
      </DocSection>
    </>
  );
}
