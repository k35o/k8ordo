import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { TalkDemo } from './_parts/talk-demo';
import { talkSchema } from './_parts/talk-schema';

const SCHEMA = `import * as z from 'zod';

export const talkSchema = z.object({
  title: z.string().min(1, 'Enter a title').max(120),
  eventUrl: z.url('Enter the event URL'),
  minutes: z.coerce.number().int().min(5).max(60),
});`;

const PAGE = `import { formFields } from '@k8ordo/form/server';

import { createTalk } from './actions';
import { talkSchema } from './schema';
import { TalkForm } from './talk-form';

const talkFields = formFields(talkSchema);

export default function NewTalkPage() {
  return <TalkForm action={createTalk} fields={talkFields} />;
}`;

const ACTION = `'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';
import { href } from '@k8ordo/router';
import { redirect } from '@k8ordo/server/runtime';

import { talkSchema } from './schema';

export async function createTalk(
  _prev: FormState,
  formData: FormData,
) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;

  await saveTalk(parsed.data);
  redirect(href('/talks'));
}`;

const FORM = `'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields, FormState } from '@k8ordo/form';
import { useActionState } from 'react';

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: FormFields<'title' | 'eventUrl' | 'minutes', never>;
};

export function TalkForm({ action, fields }: Props) {
  const [state, formAction] = useActionState(action, {});
  const form = useForm(fields, state);
  const title = form.field('title');
  const eventUrl = form.field('eventUrl');
  const minutes = form.field('minutes');

  return (
    <form {...form.props} action={formAction}>
      <label>
        Title <input {...title.input} />
      </label>
      {title.error !== undefined && <p>{title.error}</p>}
      <label>
        Event URL <input {...eventUrl.input} />
      </label>
      {eventUrl.error !== undefined && <p>{eventUrl.error}</p>}
      <label>
        Length (minutes) <input {...minutes.input} />
      </label>
      {minutes.error !== undefined && <p>{minutes.error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}`;

const NEXT = [
  {
    path: '/:locale/form/field-types',
    label: m.form.navFieldTypes,
    description: m.formGetStarted.nextFieldTypes,
  },
  {
    path: '/:locale/form/errors',
    label: m.form.navErrors,
    description: m.formGetStarted.nextErrors,
  },
  {
    path: '/:locale/form/reference/server',
    label: m.form.navReferenceServer,
    description: m.formGetStarted.nextReference,
  },
] as const;

export default function FormGetStartedPage() {
  // 文言はロケールに従うので、描画のたびに導く（モジュールスコープでは導かない）
  const talkFields = formFields(talkSchema);

  return (
    <DocPage
      introduction={m.formGetStarted.introduction}
      path="/:locale/form/get-started"
    >
      <DocSection
        description={m.formGetStarted.installDescription}
        id="install"
        title={m.formGetStarted.installTitle}
      >
        <PackageInstall name="@k8ordo/form" />
        <Note>
          <p>
            <Rich>{m.formGetStarted.zodMini()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={m.formGetStarted.schemaDescription}
        id="schema"
        title={m.formGetStarted.schemaTitle}
      >
        <CodeBlock
          code={SCHEMA}
          lang="ts"
          marks={{ 6: 'highlight' }}
          title="schema.ts"
        />
        <p>
          <Rich>{m.formGetStarted.schemaCoerce()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formGetStarted.deriveDescription}
        id="derive"
        title={m.formGetStarted.deriveTitle}
      >
        <CodeBlock
          code={PAGE}
          lang="tsx"
          marks={{ 7: 'highlight' }}
          title="page.tsx"
        />
        <p>
          <Rich>{m.formGetStarted.deriveJson()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formGetStarted.actionDescription}
        id="action"
        title={m.formGetStarted.actionTitle}
      >
        <CodeBlock
          code={ACTION}
          lang="ts"
          marks={{ 11: 'highlight', 12: 'highlight' }}
          title="actions.ts"
        />
        <p>
          <Rich>{m.formGetStarted.actionResult()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.formGetStarted.formDescription}
        id="form"
        title={m.formGetStarted.formTitle}
      >
        <CodeBlock
          code={FORM}
          lang="tsx"
          marks={{
            13: 'highlight',
            14: 'highlight',
            20: 'highlight',
            22: 'highlight',
            24: 'highlight',
          }}
          title="talk-form.tsx"
        />
        <p>
          <Rich>{m.formGetStarted.formSpread()}</Rich>
        </p>
        <p>
          <Rich>{m.formGetStarted.formDom()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={m.formGetStarted.tryDescription}
        id="try"
        steps={m.formGetStarted.trySteps}
        title={m.formGetStarted.tryTitle}
      >
        <TalkDemo fields={talkFields} />
      </Playground>

      <DocSection id="next" title={m.formGetStarted.nextTitle}>
        <ul>
          {NEXT.map((step) => (
            <li key={step.path}>
              <LocaleAnchor path={step.path}>{step.label()}</LocaleAnchor>
              {m.docPage.termSeparator()}
              <Rich>{step.description()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
