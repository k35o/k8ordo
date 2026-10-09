import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { demoState } from '../../../../demos/form/demo-state';
import { FormDemo } from '../../../../demos/form/form-demo';
import * as m from '../../../../messages';

const t = m.formSearch;

const SHARE = `export const listState = definePageState('product-list', {
  url: z.object({
    q: z.string().default(''),
    inStock: z.stringbool().default(false),
  }),
});`;

const SHARE_PAGE = `const filterFields = formFields(listState.url);

export default function ProductsPage() {
  return <Filters fields={filterFields} />;
}`;

const FORM = `const form = useForm(fields);
const [current] = useAppState(listState);
const q = form.field('q');
const inStock = form.field('inStock');

<form {...form.props} method="get">
  <input {...q.input} defaultValue={current.q} type="search" />
  <input {...inStock.input} defaultChecked={current.inStock} />
  <button type="submit">Filter</button>
</form>`;

const SERVER = `export const search = listState.url;

export default async function ProductsPage({
  search,
}: PageProps<'/products'>) {
  const products = await findProducts(search);
  return <ProductList products={products} />;
}`;

// Server Component（このファイルにディレクティブは無い）。制約属性はここで
// 導いて JSON として渡すので、zod はブラウザに届かない
const demoFields = formFields(demoState.url);

export default function FormSearchPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/form/search">
      <DocSection
        description={t.shareDescription}
        id="share"
        title={t.shareTitle}
      >
        <CodeBlock code={SHARE} lang="ts" title="src/lib/list-state.ts" />
        <CodeBlock
          code={SHARE_PAGE}
          lang="tsx"
          title="src/routes/products/page.tsx"
        />
        <Note>
          <p>
            <Rich>{t.shareMini()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection description={t.formDescription} id="form" title={t.formTitle}>
        <CodeBlock
          code={FORM}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="src/components/filters.tsx"
        />
        <p>
          <Rich>{t.formCheck()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.formTraverse()}</Rich>
          </p>
        </Note>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <FormDemo fields={demoFields} />
      </Playground>

      <DocSection
        description={t.routerDescription}
        id="router"
        title={t.routerTitle}
      >
        <p>
          <Rich>{t.routerNoJs()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.booleanDescription}
        id="boolean"
        title={t.booleanTitle}
      >
        <Pitfall>
          <p>
            <Rich>{t.booleanUi()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={SERVER}
          lang="tsx"
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.serverStatic()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
