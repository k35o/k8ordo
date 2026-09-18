import type { Message } from '@k8ordo/i18n';
import { Code, Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const PEERS: ReadonlyArray<{
  name: string;
  version: string;
  purpose: Message;
}> = [
  { name: 'react', version: '>=19.3.0', purpose: m.formGetStarted.peerReact },
  {
    name: 'react-dom',
    version: '>=19.3.0',
    purpose: m.formGetStarted.peerReactDom,
  },
  { name: 'zod', version: '^4.4.3', purpose: m.formGetStarted.peerZod },
  {
    name: 'typescript',
    version: '>=7.0.2',
    purpose: m.formGetStarted.peerTypes,
  },
  {
    name: '@types/react',
    version: '>=19.3.0',
    purpose: m.formGetStarted.peerTypes,
  },
];

const ENTRIES: ReadonlyArray<{
  entry: string;
  values: readonly string[];
  types: readonly string[];
}> = [
  {
    entry: '@k8ordo/form/server',
    values: [
      'formFields',
      'parseForm',
      'defineForm',
      'sameAs',
      'minChecked',
      'requiredWhen',
    ],
    types: ['ParseResult', 'FormDefinition'],
  },
  {
    entry: '@k8ordo/form',
    values: ['useForm', 'useAsyncCheck', 'HiddenValue'],
    types: ['UseFormReturn', 'FieldView', 'ArrayView', 'RowView', 'AsyncCheck'],
  },
];

const SHARED_TYPES = [
  'FormFields',
  'FormState',
  'DerivedField',
  'DerivedArray',
  'DroppedCheck',
  'FieldInput',
  'ValidityFlag',
  'Rule',
] as const;

const TH = 'py-3 pr-6 font-medium whitespace-nowrap';
const TD = 'py-3 pr-6 align-top';

const codeList = (names: readonly string[]) =>
  names.map((name, index) => (
    <span key={name}>
      {index > 0 && ', '}
      <Code>{name}</Code>
    </span>
  ));

const SCHEMA_ZOD = `import * as z from 'zod';

export const talkSchema = z.object({
  title: z
    .string()
    .min(1, 'Enter a title')
    .max(120, 'Use 120 characters or fewer'),
});`;

const SCHEMA_MINI = `import * as z from 'zod/mini';

export const talkSchema = z.object({
  title: z
    .string()
    .check(
      z.minLength(1, 'Enter a title'),
      z.maxLength(120, 'Use 120 characters or fewer'),
    ),
});`;

const EXAMPLE_SCHEMA = `// src/routes/talks/new/_parts/talk-schema.ts
import * as z from 'zod';

export const talkSchema = z.object({
  title: z
    .string()
    .min(1, 'Enter a title')
    .max(120, 'Use 120 characters or fewer'),
  eventUrl: z.url('Enter the event URL'),
  minutes: z.coerce
    .number('Enter the length in minutes')
    .int('Use whole minutes')
    .min(5, 'A talk is at least 5 minutes'),
  recorded: z.boolean(),
});`;

const EXAMPLE_PAGE = `// src/routes/talks/new/page.tsx
import { formFields } from '@k8ordo/form/server';

import { TalkForm } from './_parts/talk-form';
import { talkSchema } from './_parts/talk-schema';

const talkFields = formFields(talkSchema);

export default function NewTalkPage() {
  return <TalkForm fields={talkFields} />;
}`;

const EXAMPLE_ACTION = `// src/routes/talks/new/_parts/actions.ts
'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';
import { redirect } from '@k8ordo/server';

import { talkSchema } from './talk-schema';
import { insertTalk } from './talks.server';

export async function createTalk(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  redirect('/talks');
}`;

const EXAMPLE_FORM = `// src/routes/talks/new/_parts/talk-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { createTalk } from './actions';

type Props = {
  fields: FormFields<'title' | 'eventUrl' | 'minutes' | 'recorded', never>;
};

export function TalkForm({ fields }: Props) {
  const [state, formAction] = useActionState(createTalk, {});
  const form = useForm(fields, state);
  const title = form.field('title');
  const eventUrl = form.field('eventUrl');
  const minutes = form.field('minutes');
  const recorded = form.field('recorded');

  return (
    <form {...form.props} action={formAction}>
      <label>
        Title
        <input {...title.input} aria-invalid={title.invalid} />
      </label>
      {title.error !== undefined && <p>{title.error}</p>}

      <label>
        Event URL
        <input {...eventUrl.input} aria-invalid={eventUrl.invalid} />
      </label>
      {eventUrl.error !== undefined && <p>{eventUrl.error}</p>}

      <label>
        Minutes
        <input {...minutes.input} aria-invalid={minutes.invalid} />
      </label>
      {minutes.error !== undefined && <p>{minutes.error}</p>}

      <label>
        <input {...recorded.input} />
        Recorded
      </label>

      {state.formError !== undefined && <p>{state.formError}</p>}
      <button type="submit">Register</button>
    </form>
  );
}`;

const EXAMPLE_FORM_TYPES = `// src/routes/talks/new/_parts/talk-form.tsx
'use client';

import type { formFields } from '@k8ordo/form/server';

import type { talkSchema } from './talk-schema';

type Props = {
  fields: ReturnType<typeof formFields<typeof talkSchema>>;
};`;

export default function FormGetStartedPage() {
  return (
    <DocPage
      introduction={m.formGetStarted.introduction}
      path="/:locale/form/get-started"
    >
      <DocSection
        description={m.formGetStarted.ideaDescription}
        title={m.formGetStarted.ideaTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formGetStarted.ideaSchema()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formGetStarted.ideaDom()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formGetStarted.ideaNoJs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formGetStarted.ideaServer()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.formGetStarted.installDescription}
        title={m.formGetStarted.installTitle}
      >
        <InstallTabs
          npm={<CodeBlock code="npm install @k8ordo/form zod" lang="bash" />}
          pnpm={<CodeBlock code="pnpm add @k8ordo/form zod" lang="bash" />}
          yarn={<CodeBlock code="yarn add @k8ordo/form zod" lang="bash" />}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formGetStarted.peersDescription()}</Rich>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={TH}>{m.formGetStarted.peerColumn()}</th>
                <th className={TH}>{m.formGetStarted.versionColumn()}</th>
                <th className={TH}>{m.formGetStarted.purposeColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {PEERS.map((peer) => (
                <tr className="border-border-mute border-b" key={peer.name}>
                  <td className={`${TD} whitespace-nowrap`}>
                    <Code>{peer.name}</Code>
                  </td>
                  <td className={`${TD} whitespace-nowrap`}>{peer.version}</td>
                  <td className={TD}>
                    <Rich>{peer.purpose()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        description={m.formGetStarted.zodDescription}
        title={m.formGetStarted.zodTitle}
      >
        <div className="grid gap-4 *:min-w-0 md:grid-cols-2">
          <CodeBlock code={SCHEMA_ZOD} lang="ts" />
          <CodeBlock code={SCHEMA_MINI} lang="ts" />
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formGetStarted.zodMessages()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formGetStarted.splitDescription}
        title={m.formGetStarted.splitTitle}
      >
        <ol className="text-fg-mute flex list-decimal flex-col gap-2 pl-6">
          <li>
            <Rich>{m.formGetStarted.splitDerive()}</Rich>
          </li>
          <li>
            <Rich>{m.formGetStarted.splitProps()}</Rich>
          </li>
          <li>
            <Rich>{m.formGetStarted.splitParse()}</Rich>
          </li>
        </ol>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className={TH}>{m.formGetStarted.entryColumn()}</th>
                <th className={TH}>{m.formGetStarted.valuesColumn()}</th>
                <th className={TH}>{m.formGetStarted.typesColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {ENTRIES.map((row) => (
                <tr className="border-border-mute border-b" key={row.entry}>
                  <td className={`${TD} whitespace-nowrap`}>
                    <Code>{row.entry}</Code>
                  </td>
                  <td className={TD}>{codeList(row.values)}</td>
                  <td className={TD}>{codeList(row.types)}</td>
                </tr>
              ))}
              <tr className="border-border-mute border-b">
                <td className={`${TD} whitespace-nowrap`}>
                  {m.formGetStarted.bothEntries()}
                </td>
                <td className={TD}>—</td>
                <td className={TD}>{codeList(SHARED_TYPES)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.formGetStarted.splitTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formGetStarted.exampleDescription}
        title={m.formGetStarted.exampleTitle}
      >
        <div className="flex flex-col gap-2">
          <Heading level="h3">{m.formGetStarted.exampleSchemaTitle()}</Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.formGetStarted.exampleSchemaDescription()}</Rich>
          </p>
          <CodeBlock code={EXAMPLE_SCHEMA} lang="ts" />
        </div>
        <div className="flex flex-col gap-2">
          <Heading level="h3">{m.formGetStarted.examplePageTitle()}</Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.formGetStarted.examplePageDescription()}</Rich>
          </p>
          <CodeBlock code={EXAMPLE_PAGE} lang="tsx" />
        </div>
        <div className="flex flex-col gap-2">
          <Heading level="h3">{m.formGetStarted.exampleActionTitle()}</Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.formGetStarted.exampleActionDescription()}</Rich>
          </p>
          <CodeBlock code={EXAMPLE_ACTION} lang="ts" />
          <p className="text-fg-mute text-sm">
            <LocaleAnchor path="/:locale/server/actions">
              {m.formGetStarted.nextServer()}
            </LocaleAnchor>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Heading level="h3">{m.formGetStarted.exampleFormTitle()}</Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.formGetStarted.exampleFormDescription()}</Rich>
          </p>
          <CodeBlock code={EXAMPLE_FORM} lang="tsx" />
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.formGetStarted.exampleFormProps()}</Rich>
          </p>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.formGetStarted.exampleFormTypes()}</Rich>
          </p>
          <CodeBlock code={EXAMPLE_FORM_TYPES} lang="tsx" />
        </div>
      </DocSection>

      <DocSection title={m.formGetStarted.flowTitle}>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.formGetStarted.flowNoJs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formGetStarted.flowJs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.formGetStarted.flowServer()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <LocaleAnchor path="/:locale/form/validation">
            <Rich>{m.formGetStarted.flowMore()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection title={m.formGetStarted.nextTitle}>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/form/fields">
              <Rich>{m.formGetStarted.nextFields()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/form/validation">
              <Rich>{m.formGetStarted.nextValidation()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/form/patterns">
              <Rich>{m.formGetStarted.nextPatterns()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/form">
              <Rich>{m.formGetStarted.nextDemo()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
