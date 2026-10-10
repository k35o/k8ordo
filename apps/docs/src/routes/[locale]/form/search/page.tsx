import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
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

// Server Component（このファイルにディレクティブは無い）。制約属性はここで
// 導いて JSON として渡すので、zod はブラウザに届かない
const demoFields = formFields(demoState.url);

export default function FormSearchPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/form/search">
      <DocSection id="share" title={t.shareTitle}>
        <CodeBlock
          code={SHARE}
          lang="ts"
          marks={{ 2: 'highlight' }}
          title="src/lib/list-state.ts"
        />
        <CodeBlock
          code={SHARE_PAGE}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="src/routes/products/page.tsx"
        />
        <p>
          <Rich>{t.sharePageState()}</Rich>
          <LocaleAnchor path="/:locale/state/url">
            {m.state.navUrl()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.shareFields()}</Rich>
        </p>
        <p>
          <Rich>{t.shareServer()}</Rich>
          <LocaleAnchor path="/:locale/framework/params">
            {m.framework.navParams()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="form" title={t.formTitle}>
        <CodeBlock
          code={FORM}
          lang="tsx"
          marks={{ 1: 'highlight', 7: 'highlight', 8: 'highlight' }}
          title="src/components/filters.tsx"
        />
        <p>
          <Rich>{t.formNoState()}</Rich>
        </p>
        <p>
          <Rich>{t.formDefault()}</Rich>
        </p>
        <p>
          <Rich>{t.formRouter()}</Rich>
          <LocaleAnchor path="/:locale/router/how-it-works">
            {m.router.navHowItWorks()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
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

      <DocSection id="boolean" title={t.booleanTitle}>
        <p>
          <Rich>{t.boolean()}</Rich>
        </p>
        <p>
          <Rich>{t.booleanUi()}</Rich>
          <LocaleAnchor path="/:locale/ui/form">{m.nav.uiForm()}</LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
