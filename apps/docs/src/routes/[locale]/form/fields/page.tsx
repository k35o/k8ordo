import type { Message } from '@k8ordo/i18n';
import { Code } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const TH = 'py-3 pr-6 font-medium whitespace-nowrap';
const TD = 'py-3 pr-6 align-top';

type MemberRow = { name: string; type: string; meaning: Message };

function MemberTable({ rows }: { rows: readonly MemberRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border-mute border-b">
            <th className={TH}>{m.formFields.memberColumn()}</th>
            <th className={TH}>{m.formFields.typeColumn()}</th>
            <th className={TH}>{m.formFields.meaningColumn()}</th>
          </tr>
        </thead>
        <tbody className="text-fg-mute">
          {rows.map((row) => (
            <tr className="border-border-mute border-b" key={row.name}>
              <td className={`${TD} whitespace-nowrap`}>
                <Code>{row.name}</Code>
              </td>
              <td className={`${TD} whitespace-nowrap`}>
                <Code>{row.type}</Code>
              </td>
              <td className={TD}>
                <Rich>{row.meaning()}</Rich>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const FIELD_VIEW: readonly MemberRow[] = [
  { name: 'input', type: 'FieldInput', meaning: m.formFields.fieldInput },
  {
    name: 'error',
    type: 'string | undefined',
    meaning: m.formFields.fieldError,
  },
  { name: 'invalid', type: 'boolean', meaning: m.formFields.fieldInvalid },
  { name: 'required', type: 'boolean', meaning: m.formFields.fieldRequired },
];

const ARRAY_VIEW: readonly MemberRow[] = [
  { name: 'rows', type: 'RowView[]', meaning: m.formFields.arrayRows },
  { name: 'add', type: '() => void', meaning: m.formFields.arrayAdd },
  { name: 'canAdd', type: 'boolean', meaning: m.formFields.arrayCanAdd },
  { name: 'canRemove', type: 'boolean', meaning: m.formFields.arrayCanRemove },
  {
    name: 'error',
    type: 'string | undefined',
    meaning: m.formFields.arrayError,
  },
  {
    name: 'errorProps',
    type: '{ id: string; tabIndex: -1 }',
    meaning: m.formFields.arrayErrorProps,
  },
];

const MAPPING: ReadonlyArray<{ schema: string; input: string; note: Message }> =
  [
    {
      schema: 'z.string()',
      input: "type: 'text'",
      note: m.formFields.mapString,
    },
    {
      schema: 'z.string().min(1).max(120)',
      input: "type: 'text', required: true, minLength: 1, maxLength: 120",
      note: m.formFields.mapStringBounds,
    },
    {
      schema: 'z.email()',
      input: "type: 'email', required: true",
      note: m.formFields.mapEmail,
    },
    {
      schema: 'z.url()',
      input: "type: 'url', required: true",
      note: m.formFields.mapUrl,
    },
    {
      schema: 'z.string().regex(/^[a-z]+$/u)',
      input: "type: 'text', required: true, pattern: '^[a-z]+$'",
      note: m.formFields.mapRegex,
    },
    {
      schema: 'z.email().regex(/^[a-z@.]+$/u)',
      input: "type: 'email', required: true",
      note: m.formFields.mapFormatStacked,
    },
    {
      schema: 'z.iso.date()',
      input: "type: 'date', required: true",
      note: m.formFields.mapDate,
    },
    {
      schema: 'z.iso.time()',
      input: "type: 'time', required: true",
      note: m.formFields.mapTime,
    },
    {
      schema: 'z.iso.datetime({ local: true })',
      input: "type: 'datetime-local', required: true",
      note: m.formFields.mapDatetimeLocal,
    },
    {
      schema: 'z.iso.datetime()',
      input: "type: 'text', required: true, pattern: '^(…)$'",
      note: m.formFields.mapDatetime,
    },
    {
      schema: 'z.uuid()',
      input: "type: 'text', required: true, pattern: '^(…)$'",
      note: m.formFields.mapFormatText,
    },
    {
      schema: 'z.coerce.number()',
      input: "type: 'number', step: 'any', required: true",
      note: m.formFields.mapNumber,
    },
    {
      schema: 'z.coerce.number().int().min(1).max(10)',
      input: "type: 'number', step: 1, min: 1, max: 10, required: true",
      note: m.formFields.mapInt,
    },
    {
      schema: 'z.coerce.number().multipleOf(0.5)',
      input: "type: 'number', step: 0.5, required: true",
      note: m.formFields.mapMultipleOf,
    },
    {
      schema: 'z.coerce.number().optional()',
      input: "type: 'number', step: 'any'",
      note: m.formFields.mapNumberOptional,
    },
    {
      schema: 'z.boolean()',
      input: "type: 'checkbox'",
      note: m.formFields.mapBoolean,
    },
    {
      schema: "z.literal(true, '…')",
      input: "type: 'checkbox', required: true",
      note: m.formFields.mapLiteralTrue,
    },
    {
      schema: "z.enum(['free', 'team'])",
      input: 'required: true',
      note: m.formFields.mapEnum,
    },
    {
      schema: "z.enum(['free', 'team']).optional()",
      input: '{}',
      note: m.formFields.mapEnumOptional,
    },
    {
      schema: "z.array(z.enum(['a', 'b']))",
      input: '{}',
      note: m.formFields.mapGroup,
    },
    {
      schema: "z.file().mime(['image/png'])",
      input: "type: 'file', required: true, accept: 'image/png'",
      note: m.formFields.mapFile,
    },
    {
      schema: 'z.file().optional()',
      input: "type: 'file'",
      note: m.formFields.mapFileOptional,
    },
    {
      schema: "z.string().min(8).meta({ input: 'password' })",
      input: "type: 'password', required: true, minLength: 8",
      note: m.formFields.mapPassword,
    },
    {
      schema: 'z.string().min(2).nullable()',
      input: "type: 'text', required: true",
      note: m.formFields.mapNullable,
    },
    {
      schema: 'z.coerce.date()',
      input: "type: 'text', required: true",
      note: m.formFields.mapCoerceOther,
    },
    {
      schema: 'z.coerce.bigint()',
      input: "type: 'text', required: true",
      note: m.formFields.mapCoerceOther,
    },
    {
      schema: 'z.string().transform(…)',
      input: "type: 'text'",
      note: m.formFields.mapOpaque,
    },
    {
      schema: 'z.custom<string>(…)',
      input: "type: 'text'",
      note: m.formFields.mapOpaque,
    },
  ];

const EMPTY_SUBMISSIONS: ReadonlyArray<{
  id: string;
  control: Message;
  value: Message;
}> = [
  {
    id: 'text',
    control: m.formFields.emptyText,
    value: m.formFields.emptyTextValue,
  },
  {
    id: 'checkbox',
    control: m.formFields.emptyCheckbox,
    value: m.formFields.emptyCheckboxValue,
  },
  {
    id: 'number',
    control: m.formFields.emptyNumber,
    value: m.formFields.emptyNothingValue,
  },
  {
    id: 'file',
    control: m.formFields.emptyFile,
    value: m.formFields.emptyNothingValue,
  },
  {
    id: 'choice',
    control: m.formFields.emptyChoice,
    value: m.formFields.emptyChoiceValue,
  },
  {
    id: 'group',
    control: m.formFields.emptyGroup,
    value: m.formFields.emptyGroupValue,
  },
];

const RESULT_JSON = `{
  "input": {
    "name": "title",
    "required": true,
    "type": "text",
    "minLength": 1,
    "maxLength": 120
  },
  "messages": {
    "valueMissing": "Enter a title",
    "tooShort": "Enter a title",
    "tooLong": "Use 120 characters or fewer"
  },
  "secret": false
}`;

const EDIT_EXAMPLE = `// src/routes/talks/[id]/edit/_parts/edit-talk-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { updateTalk } from './actions';

type Props = {
  fields: FormFields<'title', never>;
  talk: { title: string };
};

export function EditTalkForm({ fields, talk }: Props) {
  const [state, formAction] = useActionState(updateTalk, {});
  const form = useForm(fields, state);
  const title = form.field('title');

  return (
    <form {...form.props} action={formAction}>
      <label>
        Title
        <input defaultValue={talk.title} {...title.input} />
      </label>
      {title.error !== undefined && <p>{title.error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}`;

const NESTED_SCHEMA = `// src/routes/profile/_parts/profile-schema.ts
import * as z from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Enter your name'),
  address: z.object({
    city: z.string().min(1, 'Enter a city'),
    postalCode: z
      .string()
      .regex(/^[0-9]{3}-[0-9]{4}$/u, 'Use the 123-4567 format'),
  }),
});`;

const NESTED_FORM = `// src/routes/profile/_parts/profile-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { saveProfile } from './actions';

type Props = {
  fields: FormFields<'name' | 'address.city' | 'address.postalCode', never>;
};

export function ProfileForm({ fields }: Props) {
  const [state, formAction] = useActionState(saveProfile, {});
  const form = useForm(fields, state);
  const name = form.field('name');
  const city = form.field('address.city');
  const postalCode = form.field('address.postalCode');

  return (
    <form {...form.props} action={formAction}>
      <input {...name.input} aria-label="Name" />
      {name.error !== undefined && <p>{name.error}</p>}
      <input {...city.input} aria-label="City" />
      {city.error !== undefined && <p>{city.error}</p>}
      <input {...postalCode.input} aria-label="Postal code" />
      {postalCode.error !== undefined && <p>{postalCode.error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}`;

const ARRAY_SCHEMA = `// src/routes/orders/new/_parts/order-schema.ts
import * as z from 'zod';

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Enter an item'),
        quantity: z.coerce
          .number('Enter a quantity')
          .int('Use a whole number')
          .min(1, 'Order at least one'),
      }),
    )
    .min(1, 'Add at least one item')
    .max(10),
});`;

const ARRAY_FORM = `// src/routes/orders/new/_parts/order-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { placeOrder } from './actions';

type Props = {
  fields: FormFields<never, 'items'>;
};

export function OrderForm({ fields }: Props) {
  const [state, formAction] = useActionState(placeOrder, {});
  const form = useForm(fields, state);
  const items = form.array('items');

  return (
    <form {...form.props} action={formAction}>
      {items.error !== undefined && (
        <p {...items.errorProps}>{items.error}</p>
      )}
      {items.rows.map((row) => {
        const name = row.field('name');
        const quantity = row.field('quantity');
        return (
          <fieldset key={row.key}>
            <legend>{\`Item \${String(row.index + 1)}\`}</legend>
            <input {...name.input} aria-label="Item" />
            {name.error !== undefined && <p>{name.error}</p>}
            <input {...quantity.input} aria-label="Quantity" />
            {quantity.error !== undefined && <p>{quantity.error}</p>}
            {items.canRemove && (
              <button onClick={row.remove} type="button">
                Remove
              </button>
            )}
          </fieldset>
        );
      })}
      {items.canAdd && (
        <button onClick={items.add} type="button">
          Add an item
        </button>
      )}
      <button type="submit">Order</button>
    </form>
  );
}`;

const CHOICE_SCHEMA = `// src/routes/signup/_parts/plan-schema.ts
import * as z from 'zod';

export const planSchema = z.object({
  region: z.enum(['asia', 'europe'], 'Choose a region'),
  plan: z.enum(['free', 'team'], 'Choose a plan'),
});`;

const CHOICE_FORM = `// src/routes/signup/_parts/plan-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { choosePlan } from './actions';

const PLANS = ['free', 'team'] as const;

type Props = {
  fields: FormFields<'region' | 'plan', never>;
};

export function PlanForm({ fields }: Props) {
  const [state, formAction] = useActionState(choosePlan, {});
  const form = useForm(fields, state);
  const region = form.field('region');
  const plan = form.field('plan');

  return (
    <form {...form.props} action={formAction}>
      <select {...region.input} aria-label="Region">
        <option value="">Choose a region</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
      </select>
      {region.error !== undefined && <p>{region.error}</p>}

      <fieldset>
        <legend>Plan</legend>
        {PLANS.map((option) => (
          <label key={option}>
            <input
              defaultChecked={state.values?.plan === option}
              name={plan.input.name}
              required={plan.input.required}
              type="radio"
              value={option}
            />
            {option}
          </label>
        ))}
      </fieldset>
      {plan.error !== undefined && <p>{plan.error}</p>}

      <button type="submit">Continue</button>
    </form>
  );
}`;

const CHECKBOX_SCHEMA = `// src/routes/signup/_parts/preferences-schema.ts
import * as z from 'zod';

export const preferencesSchema = z.object({
  newsletter: z.boolean(),
  terms: z.literal(true, 'Agree to the terms to continue'),
  topics: z
    .array(z.enum(['react', 'css', 'a11y']))
    .min(2, 'Pick at least two topics'),
});`;

const CHECKBOX_FORM = `// src/routes/signup/_parts/preferences-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { savePreferences } from './actions';

const TOPICS = ['react', 'css', 'a11y'] as const;

type Props = {
  fields: FormFields<'newsletter' | 'terms' | 'topics', never>;
};

export function PreferencesForm({ fields }: Props) {
  const [state, formAction] = useActionState(savePreferences, {});
  const form = useForm(fields, state);
  const newsletter = form.field('newsletter');
  const terms = form.field('terms');
  const topics = form.field('topics');
  const echoed = state.values?.topics;
  const checked = Array.isArray(echoed) ? echoed : [];

  return (
    <form {...form.props} action={formAction}>
      <label>
        <input {...newsletter.input} />
        Send me the newsletter
      </label>

      <label>
        <input {...terms.input} />
        I agree to the terms
      </label>
      {terms.error !== undefined && <p>{terms.error}</p>}

      <fieldset>
        <legend>Topics</legend>
        {TOPICS.map((option) => (
          <label key={option}>
            <input
              defaultChecked={checked.includes(option)}
              name={topics.input.name}
              type="checkbox"
              value={option}
            />
            {option}
          </label>
        ))}
      </fieldset>
      {topics.error !== undefined && <p>{topics.error}</p>}

      <button type="submit">Save</button>
    </form>
  );
}`;

const FILE_EXAMPLE = `// src/routes/profile/_parts/avatar-schema.ts
import * as z from 'zod';

export const avatarSchema = z.object({
  avatar: z
    .file('Choose an image')
    .mime(['image/png', 'image/jpeg'])
    .max(1_000_000, 'Use an image of 1 MB or less'),
});`;

const SECRET_ZOD = `import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email('Enter your email address'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .meta({ input: 'password' }),
});`;

const SECRET_MINI = `import * as z from 'zod/mini';

export const loginSchema = z.object({
  email: z.email('Enter your email address'),
  password: z
    .string()
    .check(
      z.minLength(8, 'Use at least 8 characters'),
      z.meta({ input: 'password' }),
    ),
});`;

const HIDDEN_EXAMPLE = `// src/routes/posts/new/_parts/post-form.tsx
'use client';

import { HiddenValue, useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState, useState } from 'react';

import { createPost } from './actions';
import { RichTextEditor } from './rich-text-editor';

type Props = {
  fields: FormFields<'title' | 'body', never>;
};

export function PostForm({ fields }: Props) {
  const [state, formAction] = useActionState(createPost, {});
  const form = useForm(fields, state);
  const [body, setBody] = useState('');
  const title = form.field('title');
  const bodyField = form.field('body');

  return (
    <form {...form.props} action={formAction}>
      <input {...title.input} aria-label="Title" />
      {title.error !== undefined && <p>{title.error}</p>}
      <RichTextEditor onChange={setBody} value={body} />
      <HiddenValue name="body" value={body} />
      {bodyField.error !== undefined && <p>{bodyField.error}</p>}
      <button type="submit">Publish</button>
    </form>
  );
}`;

export default function FormFieldsPage() {
  return (
    <DocPage
      introduction={m.formFields.introduction}
      path="/:locale/form/fields"
    >
      <DocSection
        description={m.formFields.resultDescription}
        title={m.formFields.resultTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formFields.resultFields()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.resultArrays()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.resultRules()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.resultDropped()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.resultJson()}</Rich>
        </p>
        <CodeBlock code={RESULT_JSON} lang="json" />
      </DocSection>

      <DocSection
        description={m.formFields.fieldDescription}
        title={m.formFields.fieldTitle}
      >
        <MemberTable rows={FIELD_VIEW} />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.fieldEdit()}</Rich>
        </p>
        <CodeBlock code={EDIT_EXAMPLE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.fieldUnknown()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formFields.mappingDescription}
        title={m.formFields.mappingTitle}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={TH}>{m.formFields.schemaColumn()}</th>
                <th className={TH}>
                  <Rich>{m.formFields.attributesColumn()}</Rich>
                </th>
                <th className={TH}>{m.formFields.notesColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {MAPPING.map((row) => (
                <tr className="border-border-mute border-b" key={row.schema}>
                  <td className={TD}>
                    <Code>{row.schema}</Code>
                  </td>
                  <td className={TD}>
                    <Code>{row.input}</Code>
                  </td>
                  <td className={`${TD} min-w-64`}>
                    <Rich>{row.note()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        description={m.formFields.requiredDescription}
        title={m.formFields.requiredTitle}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={TH}>{m.formFields.controlColumn()}</th>
                <th className={TH}>{m.formFields.emptyColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {EMPTY_SUBMISSIONS.map((row) => (
                <tr className="border-border-mute border-b" key={row.id}>
                  <td className={TD}>
                    <Rich>{row.control()}</Rich>
                  </td>
                  <td className={TD}>
                    <Rich>{row.value()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.requiredOptional()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formFields.messagesDescription}
        title={m.formFields.messagesTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.messagesCustom()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.messagesNoBrowser()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formFields.nestedDescription}
        title={m.formFields.nestedTitle}
      >
        <CodeBlock code={NESTED_SCHEMA} lang="ts" />
        <CodeBlock code={NESTED_FORM} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.nestedOptional()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formFields.arrayDescription}
        title={m.formFields.arrayTitle}
      >
        <MemberTable rows={ARRAY_VIEW} />
        <CodeBlock code={ARRAY_SCHEMA} lang="ts" />
        <CodeBlock code={ARRAY_FORM} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formFields.arrayErrorFocus()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.arrayInitial()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.arrayNames()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.arrayParse()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.arrayScalar()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.arrayNested()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formFields.choiceDescription}
        title={m.formFields.choiceTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.choiceRadio()}</Rich>
        </p>
        <CodeBlock code={CHOICE_SCHEMA} lang="ts" />
        <CodeBlock code={CHOICE_FORM} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.choicePlaceholder()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.choiceOptional()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formFields.checkboxDescription}
        title={m.formFields.checkboxTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.groupDescription()}</Rich>
        </p>
        <CodeBlock code={CHECKBOX_SCHEMA} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formFields.groupParse()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.groupMin()}</Rich>{' '}
            <LocaleAnchor path="/:locale/form/validation">
              {m.formFields.seeValidation()}
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.groupRestore()}</Rich>
          </li>
        </ul>
        <CodeBlock code={CHECKBOX_FORM} lang="tsx" />
      </DocSection>

      <DocSection
        description={m.formFields.filesDescription}
        title={m.formFields.filesTitle}
      >
        <CodeBlock code={FILE_EXAMPLE} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formFields.filesEmpty()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.filesSize()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.filesMultiple()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formFields.secretDescription}
        title={m.formFields.secretTitle}
      >
        <div className="grid gap-4 *:min-w-0 md:grid-cols-2">
          <CodeBlock code={SECRET_ZOD} lang="ts" />
          <CodeBlock code={SECRET_MINI} lang="ts" />
        </div>
      </DocSection>

      <DocSection
        description={m.formFields.hiddenDescription}
        title={m.formFields.hiddenTitle}
      >
        <CodeBlock code={HIDDEN_EXAMPLE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.hiddenWhy()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.hiddenLimits()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formFields.pathsDescription}
        title={m.formFields.pathsTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formFields.pathsTypo()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.pathsArrayAsField()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.pathsObjectAsArray()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.pathsGroupAsArray()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.pathsRule()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formFields.droppedDescription}
        title={m.formFields.droppedTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.droppedList()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formFields.droppedRefine()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedRegex()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedStacked()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedIgnoredPattern()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedExclusive()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedDatetime()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedUnion()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedOpaque()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedMime()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.droppedGroup()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.droppedNotListed()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.droppedRules()}</Rich>{' '}
          <LocaleAnchor path="/:locale/form/validation">
            {m.formFields.seeValidation()}
          </LocaleAnchor>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.droppedReason()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formFields.refusedDescription}
        title={m.formFields.refusedTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formFields.refusedNumber()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.refusedDate()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.refusedStringbool()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.refusedRecord()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.refusedTuple()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.refusedNestedArray()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.refusedNullableObject()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formFields.refusedKeys()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formFields.refusedCustom()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
