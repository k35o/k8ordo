import { Code } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  Bullet,
  Bullets,
  Cell,
  GuideTable,
  Paragraph,
  Row,
} from '../../../../components/framework-guide/prose';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const TALKS = `// src/routes/_data/talks.server.ts
import 'server-only';

const talks: string[] = [];

export const saveTalk = (title: string): Promise<void> => {
  talks.push(title);
  return Promise.resolve();
};`;

const ACTIONS = `// src/routes/_parts/actions.ts
'use server';

import { saveTalk } from '../_data/talks.server';

export type TalkState = { error?: string };

export async function createTalk(
  _previous: TalkState,
  formData: FormData,
): Promise<TalkState> {
  const title = formData.get('title');
  if (typeof title !== 'string' || title === '') {
    return { error: 'a title is required' };
  }
  await saveTalk(title);
  return {};
}`;

const TALK_FORM = `// src/routes/_parts/talk-form.tsx
'use client';

import { useActionState } from 'react';

import { createTalk } from './actions';

export function TalkForm() {
  const [state, formAction, pending] = useActionState(createTalk, {});
  return (
    <form action={formAction}>
      <input aria-label="title" name="title" />
      <button disabled={pending} type="submit">
        add
      </button>
      {state.error === undefined ? null : <p role="alert">{state.error}</p>}
    </form>
  );
}`;

const LEAVE = `// src/routes/_parts/leave.ts
'use server';

import { redirect } from '@k8ordo/server/runtime';

import { saveTalk } from '../_data/talks.server';

export async function addAndLeave(formData: FormData): Promise<void> {
  const title = formData.get('title');
  if (typeof title === 'string' && title !== '') {
    await saveTalk(title);
  }
  redirect('/products');
}`;

const LEAVE_PAGE = `// src/routes/page.tsx
import { addAndLeave } from './_parts/leave';

export default function HomePage() {
  return (
    <form action={addAndLeave}>
      <input aria-label="title" name="title" />
      <button type="submit">add and leave</button>
    </form>
  );
}`;

const REQUEST = `// src/routes/layout.tsx
import type { LayoutProps } from '@k8ordo/router';

export default function RootLayout({ children, request }: LayoutProps<'/'>) {
  const theme = request.cookies.get('theme') === 'dark' ? 'dark' : 'light';
  const language = request.headers.get('accept-language') ?? 'en';
  return (
    <html data-theme={theme} lang={language.split(',')[0]}>
      <body>{children}</body>
    </html>
  );
}`;

const REQUEST_PROP = `// src/routes/_parts/greeting.tsx
import type { RouteRequest } from '@k8ordo/server/runtime';

export function Greeting({ request }: { request: RouteRequest }) {
  return <p>{request.cookies.get('name') ?? 'welcome'}</p>;
}`;

const GUESTBOOK_SCHEMA = `// src/routes/_parts/guestbook-schema.ts
import * as z from 'zod/mini';

z.config(z.locales.en());

export const guestbookSchema = z.object({
  name: z.string().check(z.minLength(1), z.maxLength(40)),
});`;

const GUESTBOOK_ACTION = `// src/routes/_parts/guestbook.ts
'use server';

import { parseForm } from '@k8ordo/form/server';
import type { FormState } from '@k8ordo/form/server';

import { guestbookSchema } from './guestbook-schema';

const entries: string[] = [];

export async function sign(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseForm(guestbookSchema, formData);
  if (!parsed.success) return parsed.state;
  entries.push(parsed.data.name);
  return {};
}`;

const GUESTBOOK_FORM = `// src/routes/_parts/guestbook-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { sign } from './guestbook';

export function GuestbookForm({ fields }: { fields: FormFields<'name'> }) {
  const [state, formAction] = useActionState(sign, {});
  const form = useForm(fields, state);
  const name = form.field('name');
  return (
    <form {...form.props} action={formAction}>
      <input aria-label="name" {...name.input} />
      <button type="submit">sign</button>
      {name.error === undefined ? null : <p>{name.error}</p>}
    </form>
  );
}`;

const GUESTBOOK_PAGE = `// src/routes/page.tsx
import { formFields } from '@k8ordo/form/server';

import { GuestbookForm } from './_parts/guestbook-form';
import { guestbookSchema } from './_parts/guestbook-schema';

const guestbookFields = formFields(guestbookSchema);

export default function HomePage() {
  return <GuestbookForm fields={guestbookFields} />;
}`;

export default function ServerActionsPage() {
  const t = m.serverActions;
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/actions">
      <DocSection description={t.declareDescription} title={t.declareTitle}>
        <CodeBlock code={TALKS} lang="ts" />
        <CodeBlock code={ACTIONS} lang="ts" />
        <Paragraph text={t.declareForm} />
        <CodeBlock code={TALK_FORM} lang="tsx" />
      </DocSection>

      <DocSection
        description={t.roundTripDescription}
        title={t.roundTripTitle}
      />

      <DocSection description={t.noJsDescription} title={t.noJsTitle} />

      <DocSection
        description={t.directivesDescription}
        title={t.directivesTitle}
      >
        <Paragraph text={t.directivesName} />
      </DocSection>

      <DocSection description={t.redirectDescription} title={t.redirectTitle}>
        <CodeBlock code={LEAVE} lang="ts" />
        <CodeBlock code={LEAVE_PAGE} lang="tsx" />
        <Paragraph text={t.redirectAnswers} />
        <Paragraph text={t.redirectCatch} />
        <Paragraph text={t.redirectPages}>
          <LocaleAnchor path="/:locale/server/errors">
            {m.server.navErrors()}
          </LocaleAnchor>
        </Paragraph>
      </DocSection>

      <DocSection description={t.requestDescription} title={t.requestTitle}>
        <CodeBlock code={REQUEST} lang="tsx" />
        <GuideTable
          head={[
            t.requestTable.field,
            t.requestTable.type,
            t.requestTable.holds,
          ]}
        >
          <Row>
            <Cell nowrap>
              <Code>headers</Code>
            </Cell>
            <Cell nowrap>
              <Code>Headers</Code>
            </Cell>
            <Cell>
              <Rich>{t.requestTable.headers()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>cookies</Code>
            </Cell>
            <Cell nowrap>
              <Code>{'ReadonlyMap<string, string>'}</Code>
            </Cell>
            <Cell>
              <Rich>{t.requestTable.cookies()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
        <Paragraph text={t.requestType} />
        <CodeBlock code={REQUEST_PROP} lang="tsx" />
        <Paragraph text={t.requestReadOnly} />
        <Paragraph text={t.requestStatic} />
      </DocSection>

      <DocSection description={t.originDescription} title={t.originTitle}>
        <Paragraph text={t.originProxy}>
          <LocaleAnchor path="/:locale/server/deploy">
            {m.server.navDeploy()}
          </LocaleAnchor>
        </Paragraph>
      </DocSection>

      <DocSection description={t.formDescription} title={t.formTitle}>
        <CodeBlock code={GUESTBOOK_SCHEMA} lang="ts" />
        <CodeBlock code={GUESTBOOK_ACTION} lang="ts" />
        <CodeBlock code={GUESTBOOK_FORM} lang="tsx" />
        <CodeBlock code={GUESTBOOK_PAGE} lang="tsx" />
        <Paragraph text={t.formFieldsNote}>
          <LocaleAnchor path="/:locale/form">@k8ordo/form</LocaleAnchor>
        </Paragraph>
      </DocSection>

      <DocSection description={t.buysDescription} title={t.buysTitle}>
        <Bullets>
          <Bullet>
            <Rich>{t.buys404()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.buysValues()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.buysActions()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.buysRequest()}</Rich>
          </Bullet>
        </Bullets>
        <p>
          <LocaleAnchor path="/:locale/static">@k8ordo/static</LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
