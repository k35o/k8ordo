import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  paramsTypingSections,
  paramsUsingSections,
} from '../../../../components/framework-guide/params';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.serverParams;

const EXIST = `import { notFound } from '@k8ordo/router';
import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

import { findProduct } from '../../_data/catalog.server';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  if (product === undefined) notFound();
  return <h1>{product.name}</h1>;
}`;

export default function ServerParamsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/params">
      {paramsTypingSections()}
      {paramsUsingSections('server')}

      <DocSection
        description={t.noListDescription}
        id="no-list"
        title={t.noListTitle}
      />

      <DocSection
        description={t.existDescription}
        id="exist"
        title={t.existTitle}
      >
        <CodeBlock
          code={EXIST}
          lang="tsx"
          marks={{ 14: 'highlight', 15: 'highlight' }}
          title="src/routes/products/[id]/page.tsx"
        />
        <p>
          <Rich>{t.existAnswer()}</Rich>
        </p>
        <p>
          <Rich>{t.existMore()}</Rich>{' '}
          <LocaleAnchor path="/:locale/server/errors">
            {m.server.navErrors()}
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
