import { formFields } from '@k8ordo/form/server';
import type { Message } from '@k8ordo/i18n';
import { Code, Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { signupDefinition } from './_parts/signup-definition';
import { SignupDemo } from './_parts/signup-demo';

const TH = 'py-3 pr-6 font-medium whitespace-nowrap';
const TD = 'py-3 pr-6 align-top';

const STATE_MEMBERS: ReadonlyArray<{
  name: string;
  type: string;
  meaning: Message;
}> = [
  {
    name: 'errors?',
    type: 'Record<string, string>',
    meaning: m.formValidation.stateErrors,
  },
  {
    name: 'values?',
    type: 'Record<string, string | string[]>',
    meaning: m.formValidation.stateValues,
  },
  {
    name: 'rows?',
    type: 'Record<string, number>',
    meaning: m.formValidation.stateRows,
  },
  {
    name: 'formError?',
    type: 'string',
    meaning: m.formValidation.stateFormError,
  },
  { name: 'token?', type: 'string', meaning: m.formValidation.stateToken },
];

const RULES: ReadonlyArray<{ signature: string; breach: Message }> = [
  {
    signature: 'sameAs(field, other, message)',
    breach: m.formValidation.ruleSameAs,
  },
  {
    signature: 'minChecked(field, min, message)',
    breach: m.formValidation.ruleMinChecked,
  },
  {
    signature: 'requiredWhen(field, when, equals, message)',
    breach: m.formValidation.ruleRequiredWhen,
  },
];

const HANDLE_SCHEMA = `// src/routes/settings/_parts/handle-schema.ts
import * as z from 'zod';

export const handleSchema = z.object({
  handle: z
    .string()
    .min(3, 'Use at least 3 characters')
    .max(20, 'Use 20 characters or fewer')
    .regex(/^[a-z0-9_]+$/u, 'Use lowercase letters, digits and _'),
});`;

const HANDLE_ACTIONS = `// src/routes/settings/_parts/actions.ts
'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';

import { isHandleTaken, saveHandle } from './accounts.server';
import { handleSchema } from './handle-schema';

export async function changeHandle(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseForm(handleSchema, formData);
  if (!parsed.success) return parsed.state;
  if (await isHandleTaken(parsed.data.handle)) {
    return { ...parsed.state, errors: { handle: 'That handle is taken' } };
  }
  await saveHandle(parsed.data.handle);
  return {};
}

export async function checkHandle(
  handle: string,
): Promise<string | undefined> {
  return (await isHandleTaken(handle)) ? 'That handle is taken' : undefined;
}`;

const HANDLE_FORM = `// src/routes/settings/_parts/handle-form.tsx
'use client';

import { useAsyncCheck, useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { changeHandle, checkHandle } from './actions';

type Props = {
  fields: FormFields<'handle', never>;
};

export function HandleForm({ fields }: Props) {
  const [state, formAction] = useActionState(changeHandle, {});
  const form = useForm(fields, state);
  const handle = form.field('handle');
  const taken = useAsyncCheck(checkHandle);

  return (
    <form {...form.props} action={formAction}>
      <label>
        Handle
        <input {...handle.input} {...taken.props} />
      </label>
      {handle.error !== undefined && <p>{handle.error}</p>}
      <button disabled={taken.isChecking} type="submit">
        Save
      </button>
    </form>
  );
}`;

const SIGNUP_DEFINITION = `// src/routes/signup/_parts/signup-definition.ts
import {
  defineForm,
  minChecked,
  requiredWhen,
  sameAs,
} from '@k8ordo/form/server';
import * as z from 'zod';

export const signup = defineForm(
  z.object({
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .meta({ input: 'password' }),
    confirm: z.string().meta({ input: 'password' }),
    plan: z.enum(['personal', 'business'], 'Choose a plan'),
    company: z.string().max(100, 'Use 100 characters or fewer'),
    topics: z.array(z.enum(['react', 'css', 'a11y'])),
  }),
  [
    sameAs('confirm', 'password', 'The passwords do not match'),
    requiredWhen(
      'company',
      'plan',
      'business',
      'Enter your company for a business plan',
    ),
    minChecked('topics', 2, 'Pick at least two topics'),
  ],
);`;

const SIGNUP_FORM = `// src/routes/signup/_parts/signup-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { signUp } from './actions';

const TOPICS = ['react', 'css', 'a11y'] as const;

type Props = {
  fields: FormFields<
    'password' | 'confirm' | 'plan' | 'company' | 'topics',
    never
  >;
};

export function SignupForm({ fields }: Props) {
  const [state, formAction] = useActionState(signUp, {});
  const form = useForm(fields, state);
  const password = form.field('password');
  const confirm = form.field('confirm');
  const plan = form.field('plan');
  const company = form.field('company');
  const topics = form.field('topics');
  const echoed = state.values?.topics ?? [];
  const checked = typeof echoed === 'string' ? [echoed] : echoed;

  return (
    <form {...form.props} action={formAction}>
      <input {...password.input} aria-label="Password" />
      {password.error !== undefined && <p>{password.error}</p>}
      <input {...confirm.input} aria-label="Confirm password" />
      {confirm.error !== undefined && <p>{confirm.error}</p>}

      <select {...plan.input} aria-label="Plan">
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </select>
      <input {...company.input} aria-label="Company" />
      {company.error !== undefined && <p>{company.error}</p>}

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

      <button type="submit">Sign up</button>
    </form>
  );
}`;

const SIGNUP_ACTION = `// src/routes/signup/_parts/actions.ts
'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';
import { href } from '@k8ordo/router';
import { redirect } from '@k8ordo/server/runtime';

import { createAccount } from './accounts.server';
import { signup } from './signup-definition';

export async function signUp(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseForm(signup, formData);
  if (!parsed.success) return parsed.state;
  await createAccount(parsed.data);
  redirect(href('/welcome'));
}`;

export default function FormValidationPage() {
  const demoFields = formFields(signupDefinition());
  const demoData = JSON.stringify(
    { fields: { handle: demoFields.fields.handle }, rules: demoFields.rules },
    null,
    2,
  );

  return (
    <DocPage
      introduction={m.formValidation.introduction}
      path="/:locale/form/validation"
    >
      <DocSection
        description={m.formValidation.layersDescription}
        title={m.formValidation.layersTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.layersNoJs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.layersJs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.layersServer()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formValidation.demoDescription}
        title={m.formValidation.demoTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.demoTryBlur()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.demoTryTyping()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.demoTryRule()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.demoTryReset()}</Rich>
          </li>
        </ul>
        <div className="max-w-xl">
          <SignupDemo fields={demoFields} />
        </div>
        <p className="text-fg-mute text-sm leading-relaxed">
          <Rich>{m.formValidation.demoNoSubmit()}</Rich>
        </p>
        <p className="text-fg-mute text-sm leading-relaxed">
          <Rich>{m.formValidation.demoJson()}</Rich>
        </p>
        <CodeBlock code={demoData} lang="json" />
      </DocSection>

      <DocSection
        description={m.formValidation.lifecycleDescription}
        title={m.formValidation.lifecycleTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.lifeBlur()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.lifeInput()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.lifeSubmit()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.lifeOrder()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.lifeRules()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.lifeServer()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.lifeNewState()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.lifeToken()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formValidation.resetDescription}
        title={m.formValidation.resetTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.resetMessages()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.resetEdited()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.resetRows()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.resetDirty()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formValidation.resetEcho()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formValidation.dirtyDescription}
        title={m.formValidation.dirtyTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.dirtyText()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.dirtyCheckbox()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.dirtySelect()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.dirtyHidden()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.dirtyRows()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formValidation.dirtyHiddenReset()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formValidation.dirtyServer()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formValidation.parseDescription}
        title={m.formValidation.parseTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.parseSuccess()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.parseFailure()}</Rich>
          </li>
        </ul>
        <Heading level="h3">
          <Rich>{m.formValidation.stateTitle()}</Rich>
        </Heading>
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
              {STATE_MEMBERS.map((row) => (
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
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formValidation.parseThrows()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <LocaleAnchor path="/:locale/form/fields">
            <Rich>{m.formValidation.parseUntouched()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.formValidation.serverDescription}
        title={m.formValidation.serverTitle}
      >
        <CodeBlock code={HANDLE_SCHEMA} lang="ts" />
        <CodeBlock code={HANDLE_ACTIONS} lang="ts" />
      </DocSection>

      <DocSection
        description={m.formValidation.rulesDescription}
        title={m.formValidation.rulesTitle}
      >
        <CodeBlock code={SIGNUP_DEFINITION} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formValidation.rulesBoth()}</Rich>
        </p>
        <CodeBlock code={SIGNUP_FORM} lang="tsx" />
        <CodeBlock code={SIGNUP_ACTION} lang="ts" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={TH}>{m.formValidation.ruleColumn()}</th>
                <th className={TH}>{m.formValidation.breachColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {RULES.map((row) => (
                <tr className="border-border-mute border-b" key={row.signature}>
                  <td className={`${TD} whitespace-nowrap`}>
                    <Code>{row.signature}</Code>
                  </td>
                  <td className={TD}>
                    <Rich>{row.breach()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.rulesClient()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.rulesStrings()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.rulesServerOnly()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.rulesTyped()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.rulesElse()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formValidation.asyncDescription}
        title={m.formValidation.asyncTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formValidation.asyncSignature()}</Rich>
        </p>
        <CodeBlock code={HANDLE_FORM} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formValidation.asyncLatest()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.asyncSame()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.asyncEmpty()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.asyncError()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formValidation.asyncUnmount()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formValidation.asyncServer()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
