import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
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
      <DocSection
        description={t.nestedDescription}
        id="nested"
        title={t.nestedTitle}
      >
        <CodeBlock code={NESTED_SCHEMA} lang="ts" title="schema.ts" />
        <CodeBlock code={NESTED_FIELD} lang="tsx" title="profile-form.tsx" />
        <p>
          <Rich>{t.nestedOptional()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.nestedAlwaysRender()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection description={t.rowsDescription} id="rows" title={t.rowsTitle}>
        <CodeBlock code={ROWS_SCHEMA} lang="ts" title="schema.ts" />
        <CodeBlock code={ROWS_FORM} lang="tsx" title="order-form.tsx" />
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

      <DocSection
        description={t.arrayErrorDescription}
        id="array-error"
        title={t.arrayErrorTitle}
      >
        <CodeBlock
          code={ARRAY_ERROR}
          lang="tsx"
          marks={{ 2: 'highlight', 3: 'highlight', 4: 'highlight' }}
          title="order-form.tsx"
        />
        <p>
          <Rich>{t.arrayErrorProps()}</Rich>
        </p>
        <p>
          <Rich>{t.arrayErrorPlace()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.namesDescription}
        id="names"
        title={t.namesTitle}
      >
        <CodeBlock code={NAMES} lang="ts" />
        <p>
          <Rich>{t.namesRemove()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.namesServer()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.initialDescription}
        id="initial"
        title={t.initialTitle}
      >
        <p>
          <Rich>{t.initialNoJs()}</Rich>
        </p>
        <p>
          <Rich>{t.initialForged()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.scalarDescription}
        id="scalar"
        title={t.scalarTitle}
      >
        <CodeBlock code={SCALAR} lang="tsx" title="tags-form.tsx" />
        <Note>
          <p>
            <Rich>{t.scalarEnum()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="limits" title={t.limitsTitle}>
        <ul>
          <li>
            <Rich>{t.limitsNested()}</Rich>
          </li>
          <li>
            <Rich>{t.limitsRules()}</Rich>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
