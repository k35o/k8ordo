import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { OrderDemo } from '../../../../demos/form/nested/order-demo';
import { orderSchema } from '../../../../demos/form/nested/order-schema';
import * as m from '../../../../messages';

const t = m.formNested;

const NESTED_SCHEMA = `z.object({
  user: z.object({
    email: z.email(),
  }),
});`;

const NESTED_FIELD = `const email = form.field('user.email');

<input {...email.input} />`;

const ROWS_SCHEMA = `z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1)
    .max(3),
});`;

const ROWS_FORM = `const items = form.array('items');

{items.rows.map((row) => (
  <fieldset key={row.key}>
    <input {...row.field('name').input} />
    <input {...row.field('quantity').input} />
    {items.canRemove && (
      <button onClick={row.remove} type="button">
        Remove
      </button>
    )}
  </fieldset>
))}
{items.canAdd && (
  <button onClick={items.add} type="button">
    Add a row
  </button>
)}`;

const ARRAY_ERROR = `<form {...form.props} action={formAction}>
  {items.error !== undefined && (
    <p {...items.errorProps}>{items.error}</p>
  )}
  {items.rows.map((row) => (
    <fieldset key={row.key}>{/* fields */}</fieldset>
  ))}
</form>`;

const NAMES = `row.field('name').input.name;
// 'items[0].name'

state.errors;
// { 'items[1].quantity': 'Order at least one' }`;

const SCALAR = `const tags = form.array('tags');

{tags.rows.map((row) => (
  <input key={row.key} {...row.field().input} />
))}`;

export default function FormNestedPage() {
  // 文言はロケールに従うので、描画のたびに導く
  const orderFields = formFields(orderSchema);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/nested">
      <DocSection id="nested" title={t.nestedTitle}>
        <CodeBlock code={NESTED_SCHEMA} lang="ts" title="schema.ts" />
        <CodeBlock
          code={NESTED_FIELD}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="profile-form.tsx"
        />
        <p>
          <Rich>{t.nestedPath()}</Rich>
        </p>
        <p>
          <Rich>{t.nestedOptional()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.nestedAlwaysRender()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="rows" title={t.rowsTitle}>
        <CodeBlock
          code={ROWS_SCHEMA}
          lang="ts"
          marks={{ 9: 'highlight', 10: 'highlight' }}
          title="schema.ts"
        />
        <CodeBlock
          callouts={{ 4: t.rowsKeyCallout() }}
          code={ROWS_FORM}
          lang="tsx"
          marks={{
            1: 'highlight',
            4: 'highlight',
            7: 'highlight',
            14: 'highlight',
          }}
          title="order-form.tsx"
        />
        <p>
          <Rich>{t.rowsApi()}</Rich>
        </p>
        <p>
          <Rich>{t.rowsBounds()}</Rich>
        </p>
        <p>
          <Rich>{t.rowsState()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <OrderDemo fields={orderFields} />
      </Playground>

      <DocSection id="array-error" title={t.arrayErrorTitle}>
        <CodeBlock
          code={ARRAY_ERROR}
          lang="tsx"
          marks={{ 2: 'highlight', 3: 'highlight', 4: 'highlight' }}
          title="order-form.tsx"
        />
        <p>
          <Rich>{t.arrayErrorOwner()}</Rich>
        </p>
        <p>
          <Rich>{t.arrayErrorProps()}</Rich>
        </p>
        <p>
          <Rich>{t.arrayErrorPlace()}</Rich>
        </p>
      </DocSection>

      <DocSection id="names" title={t.namesTitle}>
        <CodeBlock code={NAMES} lang="ts" />
        <p>
          <Rich>{t.namesIndex()}</Rich>
        </p>
        <p>
          <Rich>{t.namesRemove()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.namesServer()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="initial" title={t.initialTitle}>
        <p>
          <Rich>{t.initialCount()}</Rich>
        </p>
        <p>
          <Rich>{t.initialNoJs()}</Rich>
        </p>
        <p>
          <Rich>{t.initialForged()}</Rich>
        </p>
      </DocSection>

      <DocSection id="scalar" title={t.scalarTitle}>
        <CodeBlock
          code={SCALAR}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="tags-form.tsx"
        />
        <p>
          <Rich>{t.scalarField()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.scalarEnumBefore()}</Rich>
            <LocaleAnchor path="/:locale/form/field-types">
              {m.form.navFieldTypes()}
            </LocaleAnchor>
            <Rich>{t.scalarEnumAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="limits" title={t.limitsTitle}>
        <p>
          <Rich>{t.limitsNested()}</Rich>
        </p>
        <p>
          <Rich>{t.limitsRules()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
