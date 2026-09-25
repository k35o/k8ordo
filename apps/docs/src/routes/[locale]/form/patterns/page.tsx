import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const JOIN_SCHEMA = `// src/routes/join/_parts/join-schema.ts
import * as z from 'zod';

export const joinSchema = z.object({
  email: z.email('Enter your email address'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .meta({ input: 'password' }),
  name: z.string().min(1, 'Enter your name'),
  city: z.string().max(80, 'Use 80 characters or fewer'),
});`;

const JOIN_FORM = `// src/routes/join/_parts/join-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState, useRef, useState, useSyncExternalStore } from 'react';

import { join } from './actions';

const ACCOUNT_FIELDS: readonly string[] = ['email', 'password'];

const subscribe = () => () => {};

type Props = {
  fields: FormFields<'email' | 'password' | 'name' | 'city', never>;
};

export function JoinForm({ fields }: Props) {
  const [state, formAction] = useActionState(join, {});
  const form = useForm(fields, state);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(state);
  const account = useRef<HTMLFieldSetElement>(null);

  if (answered !== state) {
    setAnswered(state);
    const failed = Object.keys(state.errors ?? {});
    if (failed.length > 0) {
      setStep(failed.some((name) => ACCOUNT_FIELDS.includes(name)) ? 0 : 1);
    }
  }

  const next = () => {
    const invalid = [
      ...(account.current?.querySelectorAll('input') ?? []),
    ].find((control) => !control.checkValidity());
    if (invalid === undefined) {
      setStep(1);
    } else {
      invalid.focus();
    }
  };

  const email = form.field('email');
  const password = form.field('password');
  const name = form.field('name');
  const city = form.field('city');

  return (
    <form {...form.props} action={formAction}>
      <fieldset hidden={hydrated && step !== 0} ref={account}>
        <legend>Account</legend>
        <input {...email.input} aria-label="Email" />
        {email.error !== undefined && <p>{email.error}</p>}
        <input {...password.input} aria-label="Password" />
        {password.error !== undefined && <p>{password.error}</p>}
        {hydrated && (
          <button onClick={next} type="button">
            Next
          </button>
        )}
      </fieldset>

      <fieldset hidden={hydrated && step !== 1}>
        <legend>Profile</legend>
        <input {...name.input} aria-label="Name" />
        {name.error !== undefined && <p>{name.error}</p>}
        <input {...city.input} aria-label="City" />
        {city.error !== undefined && <p>{city.error}</p>}
        {hydrated && (
          <button
            onClick={() => {
              setStep(0);
            }}
            type="button"
          >
            Back
          </button>
        )}
        {(!hydrated || step === 1) && <button type="submit">Join</button>}
      </fieldset>
    </form>
  );
}`;

const LIST_STATE = `// src/routes/products/_parts/list-state.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const listState = definePageState('product-list', {
  url: z.object({
    q: z._default(z.string(), ''),
    min: z._default(z.coerce.number().check(z.int(), z.gte(0)), 0),
  }),
});`;

const LIST_PAGE = `// src/routes/products/page.tsx
import { formFields } from '@k8ordo/form/server';

import { FilterForm } from './_parts/filter-form';
import { listState } from './_parts/list-state';

const filterFields = formFields(listState.url);

export default function ProductsPage() {
  return <FilterForm fields={filterFields} />;
}`;

const LIST_FORM = `// src/routes/products/_parts/filter-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useAppState } from '@k8ordo/state';

import { listState } from './list-state';

type Props = {
  fields: FormFields<'q' | 'min', never>;
};

export function FilterForm({ fields }: Props) {
  const form = useForm(fields);
  const q = form.field('q');
  const min = form.field('min');
  const [current] = useAppState(listState);

  return (
    <form {...form.props} method="get">
      <input {...q.input} aria-label="Keyword" defaultValue={current.q} />
      <input {...min.input} aria-label="Minimum" defaultValue={current.min} />
      {min.error !== undefined && <p>{min.error}</p>}
      <button type="submit">Filter</button>
    </form>
  );
}`;

const UI_SCHEMA = `// src/routes/settings/_parts/account-schema.ts
import * as z from 'zod';

export const accountSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Enter a display name')
    .max(50, 'Use 50 characters or fewer'),
  website: z.url('Enter a URL'),
  plan: z.enum(['personal', 'business'], 'Choose a plan'),
  seats: z.coerce
    .number('Enter a number')
    .int('Enter a whole number')
    .min(1, 'Use at least 1 seat')
    .max(50, 'Use 50 seats or fewer'),
  topics: z.array(z.enum(['design', 'code', 'writing'])),
  bio: z.string().max(1000, 'Use 1000 characters or fewer'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .meta({ input: 'password' }),
});`;

const UI_FORM = `// src/routes/settings/_parts/account-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import {
  Button,
  CheckboxCard,
  FormControl,
  NumberField,
  PasswordInput,
  Select,
  TextField,
  Textarea,
} from '@k8ordo/ui';
import { useActionState } from 'react';

import { saveAccount } from './actions';

const PLANS = [
  { value: '', label: 'Choose a plan' },
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
];

const TOPICS = [
  { value: 'design', label: 'Design' },
  { value: 'code', label: 'Code' },
  { value: 'writing', label: 'Writing' },
];

type Props = {
  fields: FormFields<
    | 'displayName'
    | 'website'
    | 'plan'
    | 'seats'
    | 'topics'
    | 'bio'
    | 'password',
    never
  >;
};

export function AccountForm({ fields }: Props) {
  const [state, formAction] = useActionState(saveAccount, {});
  const form = useForm(fields, state);
  const displayName = form.field('displayName');
  const website = form.field('website');
  const plan = form.field('plan');
  const seats = form.field('seats');
  const topics = form.field('topics');
  const bio = form.field('bio');
  const password = form.field('password');
  const checkedTopics = state.values?.topics;

  return (
    <form {...form.props} action={formAction}>
      <FormControl
        errorText={displayName.error}
        invalid={displayName.invalid}
        label="Display name"
        renderInput={(props) => <TextField {...props} {...displayName.input} />}
        required={displayName.required}
      />
      <FormControl
        errorText={website.error}
        invalid={website.invalid}
        label="Website"
        renderInput={(props) => <TextField {...props} {...website.input} />}
        required={website.required}
      />
      <FormControl
        errorText={plan.error}
        invalid={plan.invalid}
        label="Plan"
        renderInput={(props) => (
          <Select {...props} {...plan.input} options={PLANS} />
        )}
        required={plan.required}
      />
      <FormControl
        errorText={seats.error}
        invalid={seats.invalid}
        label="Seats"
        renderInput={(props) => <NumberField {...props} {...seats.input} />}
        required={seats.required}
      />
      <FormControl
        errorText={topics.error}
        invalid={topics.invalid}
        label="Topics"
        labelAs="legend"
        renderInput={(props) => (
          <CheckboxCard
            {...props}
            {...topics.input}
            defaultValue={Array.isArray(checkedTopics) ? checkedTopics : []}
            options={TOPICS}
          />
        )}
        required={topics.required}
      />
      <FormControl
        errorText={bio.error}
        invalid={bio.invalid}
        label="Bio"
        renderInput={(props) => <Textarea {...props} {...bio.input} />}
        required={bio.required}
      />
      <FormControl
        errorText={password.error}
        invalid={password.invalid}
        label="Current password"
        renderInput={(props) => (
          <PasswordInput {...props} {...password.input} />
        )}
        required={password.required}
      />
      <Button type="submit">Save</Button>
    </form>
  );
}`;

export default function FormPatternsPage() {
  return (
    <DocPage
      introduction={m.formPatterns.introduction}
      path="/:locale/form/patterns"
    >
      <DocSection
        description={m.formPatterns.multiStepDescription}
        title={m.formPatterns.multiStepTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formPatterns.multiStepHydrated()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.multiStepValidate()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.multiStepFocus()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.multiStepSubmit()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.multiStepErrors()}</Rich>
          </li>
        </ul>
        <CodeBlock code={JOIN_SCHEMA} lang="ts" />
        <CodeBlock code={JOIN_FORM} lang="tsx" />
      </DocSection>

      <DocSection
        description={m.formPatterns.getDescription}
        title={m.formPatterns.getTitle}
      >
        <CodeBlock code={LIST_STATE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formPatterns.getMini()}</Rich>
        </p>
        <CodeBlock code={LIST_PAGE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formPatterns.getNoState()}</Rich>
        </p>
        <CodeBlock code={LIST_FORM} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formPatterns.getRouter()}</Rich>
        </p>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/form">
              <Rich>{m.formPatterns.getDemo()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/state/integrations">
              <Rich>{m.formPatterns.getStateDocs()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formPatterns.uiDescription}
        title={m.formPatterns.uiTitle}
      >
        <CodeBlock code={UI_SCHEMA} lang="ts" />
        <CodeBlock code={UI_FORM} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formPatterns.uiSpread()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.uiDom()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.uiRadio()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.uiSelect()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.uiGroups()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.uiNumber()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.uiTextarea()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.uiFile()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formPatterns.notYetDescription}
        title={m.formPatterns.notYetTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formPatterns.notYetFiles()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.notYetTransform()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.notYetCustom()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.notYetRefine()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.notYetRowRules()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formPatterns.notYetMask()}</Rich>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
