import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../../components/api-entry';
import { DocPage } from '../../../../../components/doc-page';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

const t = m.formReferenceClient;
const FROM = '@k8ordo/form';

const USE_FORM_EXAMPLE = `const [state, formAction] = useActionState(createTalk, {});
const form = useForm(fields, state);
const title = form.field('title');

<form {...form.props} action={formAction}>
  <input {...title.input} />
  {title.error !== undefined && <p>{title.error}</p>}
</form>`;

const ARRAY_EXAMPLE = `const items = form.array('items');

{items.rows.map((row) => (
  <div key={row.key}>
    <input {...row.field('name').input} />
    {items.canRemove && (
      <button onClick={row.remove} type="button">
        Remove
      </button>
    )}
  </div>
))}
{items.canAdd && (
  <button onClick={items.add} type="button">
    Add a row
  </button>
)}`;

const ASYNC_EXAMPLE = `const slug = form.field('slug');
const taken = useAsyncCheck(checkSlugAvailable);

<input {...slug.input} {...taken.props} />
<button disabled={taken.isChecking} type="submit">Save</button>`;

const HIDDEN_EXAMPLE = `<Editor onChange={setBody} value={body} />
<HiddenValue name="body" value={body} />`;

export default function FormReferenceClientPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/form/reference/client"
    >
      <ApiEntry
        caveats={t.formHookCaveats}
        fields={[
          {
            name: 'props',
            type: '{ onSubmit, onBlur, onInput, onReset, ref }',
            description: t.formHookProps,
          },
          {
            name: 'field',
            type: '(path) => FieldView',
            description: t.formHookField,
          },
          {
            name: 'array',
            type: '(path) => ArrayView',
            description: t.formHookArray,
          },
          {
            name: 'formError',
            type: 'FormErrorView',
            description: t.formHookFormError,
          },
          { name: 'isDirty', type: 'boolean', description: t.formHookIsDirty },
        ]}
        from={FROM}
        id="use-form"
        name="useForm"
        params={[
          { name: 'fields', type: 'FormFields', description: t.formHookFields },
          { name: 'state', type: 'FormState', description: t.formHookState },
        ]}
        returns={{ type: 'UseFormReturn', description: t.formHookReturns }}
        signature="useForm(fields: FormFields, state?: FormState): UseFormReturn"
        summary={t.formHookSummary}
      >
        <CodeBlock code={USE_FORM_EXAMPLE} lang="tsx" title="talk-form.tsx" />
        <p className="leading-relaxed">
          <Rich>{t.formHookExample()}</Rich>
        </p>
      </ApiEntry>

      <ApiEntry
        caveats={t.fieldViewCaveats}
        fields={[
          { name: 'input', type: 'FieldInput', description: t.fieldViewInput },
          {
            name: 'error',
            type: 'string | undefined',
            description: t.fieldViewError,
          },
          { name: 'invalid', type: 'boolean', description: t.fieldViewInvalid },
          {
            name: 'required',
            type: 'boolean',
            description: t.fieldViewRequired,
          },
        ]}
        from={FROM}
        id="field-view"
        name="FieldView"
        signature={`type FieldView = {
  input: FieldInput;
  error: string | undefined;
  invalid: boolean;
  required: boolean;
};`}
        summary={t.fieldViewSummary}
      />

      <ApiEntry
        fields={[
          { name: 'rows', type: 'RowView[]', description: t.arrayViewRows },
          { name: 'add', type: '() => void', description: t.arrayViewAdd },
          { name: 'canAdd', type: 'boolean', description: t.arrayViewCanAdd },
          {
            name: 'canRemove',
            type: 'boolean',
            description: t.arrayViewCanRemove,
          },
          {
            name: 'error',
            type: 'string | undefined',
            description: t.arrayViewError,
          },
          {
            name: 'errorProps',
            type: '{ id: string; tabIndex: -1 }',
            description: t.arrayViewErrorProps,
          },
        ]}
        from={FROM}
        id="array-view"
        name="ArrayView"
        signature={`type ArrayView = {
  rows: RowView[];
  add: () => void;
  canAdd: boolean;
  canRemove: boolean;
  error: string | undefined;
  errorProps: { id: string; tabIndex: -1 };
};`}
        summary={t.arrayViewSummary}
      >
        <CodeBlock code={ARRAY_EXAMPLE} lang="tsx" title="order-form.tsx" />
      </ApiEntry>

      <ApiEntry
        caveats={t.rowViewCaveats}
        fields={[
          { name: 'key', type: 'string', description: t.rowViewKey },
          { name: 'index', type: 'number', description: t.rowViewIndex },
          {
            name: 'field',
            type: '(itemKey?: string) => FieldView',
            description: t.rowViewField,
          },
          { name: 'remove', type: '() => void', description: t.rowViewRemove },
        ]}
        from={FROM}
        id="row-view"
        name="RowView"
        signature={`type RowView = {
  key: string;
  index: number;
  field: (itemKey?: string) => FieldView;
  remove: () => void;
};`}
        summary={t.rowViewSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'message',
            type: 'string | undefined',
            description: t.formErrorViewMessage,
          },
          {
            name: 'props',
            type: '{ id: string; tabIndex: -1 }',
            description: t.formErrorViewProps,
          },
        ]}
        from={FROM}
        id="form-error-view"
        name="FormErrorView"
        signature={`type FormErrorView = {
  message: string | undefined;
  props: { id: string; tabIndex: -1 };
};`}
        summary={t.formErrorViewSummary}
      />

      <ApiEntry
        caveats={t.asyncCheckCaveats}
        fields={[
          {
            name: 'props',
            type: '{ onBlur, ref }',
            description: t.asyncCheckProps,
          },
          {
            name: 'isChecking',
            type: 'boolean',
            description: t.asyncCheckIsChecking,
          },
        ]}
        from={FROM}
        id="use-async-check"
        name="useAsyncCheck"
        params={[
          {
            name: 'check',
            type: '(value: string) => Promise<string | undefined>',
            description: t.asyncCheckCheck,
          },
        ]}
        returns={{ type: 'AsyncCheck', description: t.asyncCheckReturns }}
        signature={`useAsyncCheck(
  check: (value: string) => Promise<string | undefined>,
): AsyncCheck`}
        summary={t.asyncCheckSummary}
      >
        <CodeBlock code={ASYNC_EXAMPLE} lang="tsx" title="slug-field.tsx" />
      </ApiEntry>

      <ApiEntry
        caveats={t.hiddenValueCaveats}
        from={FROM}
        id="hidden-value"
        name="HiddenValue"
        params={[
          { name: 'name', type: 'string', description: t.hiddenValueName },
          { name: 'value', type: 'string', description: t.hiddenValueValue },
        ]}
        signature="<HiddenValue name={string} value={string} />"
        summary={t.hiddenValueSummary}
      >
        <CodeBlock code={HIDDEN_EXAMPLE} lang="tsx" title="post-form.tsx" />
      </ApiEntry>

      <ApiEntry
        caveats={t.formFieldsTypeCaveats}
        fields={[
          {
            name: 'fields',
            type: 'Record<FieldPath, DerivedField>',
            description: t.formFieldsTypeFields,
          },
          {
            name: 'arrays',
            type: 'Record<ArrayPath, DerivedArray>',
            description: t.formFieldsTypeArrays,
          },
          {
            name: 'rules',
            type: 'DerivedRule[]',
            description: t.formFieldsTypeRules,
          },
          {
            name: 'dropped',
            type: 'DroppedCheck[]',
            description: t.formFieldsTypeDropped,
          },
        ]}
        from={FROM}
        id="form-fields"
        name="FormFields"
        signature={`type FormFields<FieldPath, ArrayPath, StringCheckboxPath> = {
  fields: Record<FieldPath, DerivedField>;
  arrays: Record<ArrayPath, DerivedArray>;
  rules: DerivedRule[];
  dropped: DroppedCheck[];
};`}
        summary={t.formFieldsTypeSummary}
      />
    </DocPage>
  );
}
