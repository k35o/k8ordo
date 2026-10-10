import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { TalkDemo } from '../../../../demos/form/get-started/talk-demo';
import { talkSchema } from '../../../../demos/form/get-started/talk-schema';
import * as m from '../../../../messages';

const t = m.formGetStarted;

const SCHEMA = `import * as z from 'zod';

export const talkSchema = z.object({
  title: z.string().min(1, 'Enter a title').max(120),
  eventUrl: z.url('Enter the event URL'),
  minutes: z.coerce.number().int().min(5).max(60),
});`;

const PAGE = `import { formFields } from '@k8ordo/form/server';

import { TalkForm } from '../../../components/talk-form';
import { createTalk } from '../../../lib/actions';
import { talkSchema } from '../../../lib/schema';

const talkFields = formFields(talkSchema);

export default function NewTalkPage() {
  return <TalkForm action={createTalk} fields={talkFields} />;
}`;

const ACTION = `'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';
import { href } from '@k8ordo/framework';
import { redirect } from '@k8ordo/framework/server';

import { talkSchema } from './schema';
import { saveTalk } from './talks.server';

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

export default function FormGetStartedPage() {
  // 文言はロケールに従うので、描画のたびに導く（モジュールスコープでは導かない）
  const talkFields = formFields(talkSchema);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/get-started">
      <DocSection id="install" title={t.installTitle}>
        <PackageInstall name="@k8ordo/form" />
        <p>
          <Rich>{t.serverOnly()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.zodMini()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="schema" title={t.schemaTitle}>
        <CodeBlock
          code={SCHEMA}
          lang="ts"
          marks={{ 6: 'highlight' }}
          title="src/lib/schema.ts"
        />
        <p>
          <Rich>{t.schemaFields()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaCoerce()}</Rich>
        </p>
      </DocSection>

      <DocSection id="derive" title={t.deriveTitle}>
        <CodeBlock
          callouts={{ 7: t.deriveCallout() }}
          code={PAGE}
          lang="tsx"
          marks={{ 7: 'highlight' }}
          title="src/routes/talks/new/page.tsx"
        />
        <p>
          <Rich>{t.deriveFields()}</Rich>
        </p>
        <p>
          <Rich>{t.deriveJson()}</Rich>
        </p>
      </DocSection>

      <DocSection id="action" title={t.actionTitle}>
        <CodeBlock
          code={ACTION}
          lang="ts"
          marks={{ 15: 'highlight', 16: 'highlight', 19: 'highlight' }}
          title="src/lib/actions.ts"
        />
        <p>
          <Rich>{t.actionParse()}</Rich>
        </p>
        <p>
          <Rich>{t.actionResult()}</Rich>
        </p>
        <p>
          <Rich>{t.actionRedirectBefore()}</Rich>
          <LocaleAnchor path="/:locale/framework/actions">
            {m.framework.navActions()}
          </LocaleAnchor>
          <Rich>{t.actionRedirectAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="form" title={t.formTitle}>
        <CodeBlock
          callouts={{ 14: t.formHookCallout(), 20: t.formPropsCallout() }}
          code={FORM}
          lang="tsx"
          marks={{
            13: 'highlight',
            14: 'highlight',
            20: 'highlight',
            22: 'highlight',
            24: 'highlight',
          }}
          title="src/components/talk-form.tsx"
        />
        <p>
          <Rich>{t.formHook()}</Rich>
        </p>
        <p>
          <Rich>{t.formSpread()}</Rich>
        </p>
        <p>
          <Rich>{t.formDom()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.tryDescription}
        id="try"
        steps={t.trySteps}
        title={t.tryTitle}
      >
        <TalkDemo fields={talkFields} />
      </Playground>
    </DocPage>
  );
}
