import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.serverActions;

const ACTIONS = `'use server';

import { saveTalk } from '../../_data/talks.server';

export type TalkState = { error?: string };

export async function createTalk(
  _previous: TalkState,
  formData: FormData,
): Promise<TalkState> {
  const title = formData.get('title');
  if (typeof title !== 'string' || title === '') {
    return { error: 'Enter a title' };
  }
  await saveTalk(title);
  return {};
}`;

const TALK_FORM = `'use client';

import { useActionState } from 'react';

import { createTalk } from './actions';

export function TalkForm() {
  const [state, formAction, pending] = useActionState(createTalk, {});
  return (
    <form action={formAction}>
      <input aria-label="Title" name="title" />
      <button disabled={pending} type="submit">
        Add
      </button>
      {state.error !== undefined && (
        <p role="alert">{state.error}</p>
      )}
    </form>
  );
}`;

const ADD_TALK = `'use server';

import { href } from '@k8ordo/router';
import { redirect } from '@k8ordo/server/runtime';

import { saveTalk } from '../../_data/talks.server';

export async function addTalk(formData: FormData): Promise<void> {
  const title = formData.get('title');
  if (typeof title === 'string' && title !== '') {
    await saveTalk(title);
  }
  redirect(href('/talks'));
}`;

const NEW_TALK = `import { addTalk } from '../_parts/add-talk';

export default function NewTalkPage() {
  return (
    <form action={addTalk}>
      <input aria-label="Title" name="title" />
      <button type="submit">Add</button>
    </form>
  );
}`;

const WITH_FORM = `'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';

import { insertTalk } from '../../_data/talks.server';
import { talkSchema } from './talk-schema';

export async function createTalk(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  return {};
}`;

export default function ServerActionsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/actions">
      <DocSection
        description={t.declareDescription}
        id="declare"
        title={t.declareTitle}
      >
        <CodeBlock
          code={ACTIONS}
          lang="ts"
          marks={{ 1: 'highlight' }}
          title="src/routes/talks/_parts/actions.ts"
        />
        <p>
          <Rich>{t.declareState()}</Rich>
        </p>
        <p>
          <Rich>{t.declareForm()}</Rich>
        </p>
        <CodeBlock
          code={TALK_FORM}
          lang="tsx"
          marks={{ 8: 'highlight', 10: 'highlight' }}
          title="src/routes/talks/_parts/talk-form.tsx"
        />
      </DocSection>

      <DocSection
        description={t.roundTripDescription}
        id="round-trip"
        title={t.roundTripTitle}
      />

      <DocSection
        description={t.noJsDescription}
        id="no-js"
        title={t.noJsTitle}
      >
        <p>
          <Rich>{t.noJsSame()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.directivesDescription}
        id="directives"
        title={t.directivesTitle}
      >
        <p>
          <Rich>{t.directivesWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.directivesName()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.redirectDescription}
        id="redirect"
        title={t.redirectTitle}
      >
        <CodeBlock
          code={ADD_TALK}
          lang="ts"
          marks={{ 13: 'highlight' }}
          title="src/routes/talks/_parts/add-talk.ts"
        />
        <CodeBlock
          code={NEW_TALK}
          lang="tsx"
          marks={{ 5: 'highlight' }}
          title="src/routes/talks/new/page.tsx"
        />
        <Pitfall>
          <p>
            <Rich>{t.redirectThrow()}</Rich>
          </p>
        </Pitfall>
        <p>
          <Rich>{t.redirectAnswer()}</Rich>
        </p>
        <p>
          <Rich>{t.redirectHref()}</Rich>
        </p>
        <p>
          <Rich>{t.redirectPages()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.contextDescription}
        id="context"
        title={t.contextTitle}
      >
        <p>
          <Rich>{t.contextLocale()}</Rich>
        </p>
        <p>
          <Rich>{t.contextApi()}</Rich>{' '}
          <LocaleAnchor path="/:locale/server/request">
            {m.server.navRequest()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.originDescription}
        id="origin"
        title={t.originTitle}
      >
        <p>
          <Rich>{t.originCheck()}</Rich>
        </p>
        <p>
          <Rich>{t.originProxy()}</Rich>{' '}
          <LocaleAnchor path="/:locale/server/deploy">
            {m.server.navDeploy()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.formDescription}
        id="form"
        title={t.formTitle}
      >
        <CodeBlock
          code={WITH_FORM}
          lang="ts"
          marks={{ 13: 'highlight', 14: 'highlight' }}
          title="src/routes/talks/_parts/actions.ts"
        />
        <p>
          <Rich>{t.formMore()}</Rich>{' '}
          <LocaleAnchor path="/:locale/form/get-started">
            @k8ordo/form
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
