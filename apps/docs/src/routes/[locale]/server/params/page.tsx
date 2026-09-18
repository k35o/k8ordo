import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { ParamsGuide } from '../../../../components/framework-guide/params';
import * as m from '../../../../messages';

const CATALOG = `// src/routes/_data/catalog.server.ts
import 'server-only';

export type Product = { id: number; name: string };

const CATALOG: readonly Product[] = [
  { id: 1, name: 'first product' },
  { id: 2, name: 'second product' },
];

export const findProduct = (id: number): Product | undefined =>
  CATALOG.find((product) => product.id === id);`;

const PAGE = `// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

import { findProduct } from '../../_data/catalog.server';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  const product = findProduct(params.id);
  const name = product?.name ?? 'unknown product';
  return (
    <>
      <title>{name}</title>
      <h1>{name}</h1>
    </>
  );
}`;

export default function ServerParamsPage() {
  const t = m.serverParams;
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/params">
      <ParamsGuide mode="server" />

      <DocSection description={t.noListDescription} title={t.noListTitle}>
        <CodeBlock code={CATALOG} lang="ts" />
        <CodeBlock code={PAGE} lang="tsx" />
      </DocSection>

      <DocSection description={t.existDescription} title={t.existTitle} />
    </DocPage>
  );
}
