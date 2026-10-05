import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.serverRequest;

const LAYOUT = `import type { LayoutProps } from '@k8ordo/router';

export default function RootLayout({
  children,
  request,
}: LayoutProps<'/'>) {
  const theme = request.cookies.get('theme') ?? 'light';
  return (
    <html data-theme={theme} lang="en">
      <body>{children}</body>
    </html>
  );
}`;

const GREETING = `import type { RouteRequest } from '@k8ordo/server/runtime';

export function Greeting({ request }: { request: RouteRequest }) {
  const name = request.cookies.get('name') ?? 'there';
  return <p>Hello, {name}</p>;
}`;

const SIGN_IN = `'use server';

import { href } from '@k8ordo/router';
import { cookies, redirect } from '@k8ordo/server/runtime';

import { startSession } from '../../_data/sessions.server';

export type SignInState = { error?: string };

export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const session = await startSession(formData);
  if (session === null) return { error: 'Wrong password' };
  cookies().set('session', session.token, {
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(href('/account'));
}`;

const REPORT = `'use server';

import { requestHeaders } from '@k8ordo/server/runtime';

import { saveReport } from '../_data/reports.server';

export async function report(formData: FormData): Promise<void> {
  const agent = requestHeaders().get('user-agent') ?? 'unknown';
  await saveReport(formData.get('body'), agent);
}`;

const Items = ({ items }: { items: ReadonlyArray<() => string> }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function ServerRequestPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/request">
      <DocSection description={t.readDescription} id="read" title={t.readTitle}>
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 5: 'highlight', 7: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <Items items={t.readFields} />
        <p>
          <Rich>{t.readType()}</Rich>
        </p>
        <CodeBlock
          code={GREETING}
          lang="tsx"
          title="src/routes/_parts/greeting.tsx"
        />
        <p>
          <Rich>{t.readClient()}</Rich>
        </p>
        <p>
          <Rich>{t.readSearch()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.cookiesDescription}
        id="cookies"
        title={t.cookiesTitle}
      >
        <CodeBlock
          code={SIGN_IN}
          lang="ts"
          marks={{ 16: 'highlight', 17: 'highlight', 18: 'highlight' }}
          title="src/routes/login/_parts/sign-in.ts"
        />
        <p>
          <Rich>{t.cookiesRead()}</Rich>
        </p>
        <p>
          <Rich>{t.cookiesWrite()}</Rich>
        </p>
        <p>
          <Rich>{t.cookiesEncode()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.cookiesAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.optionsDescription}
        id="options"
        title={t.optionsTitle}
      >
        <Items items={t.optionsList} />
        <p>
          <Rich>{t.optionsLocal()}</Rich>
        </p>
        <p>
          <Rich>{t.optionsPlain()}</Rich>
        </p>
        <p>
          <Rich>{t.optionsDelete()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.headersDescription}
        id="headers"
        title={t.headersTitle}
      >
        <CodeBlock
          code={REPORT}
          lang="ts"
          marks={{ 8: 'highlight' }}
          title="src/routes/_parts/report.ts"
        />
        <p>
          <Rich>{t.headersWhere()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.pageDescription} id="page" title={t.pageTitle}>
        <p>
          <Rich>{t.pageInstead()}</Rich>
        </p>
        <p>
          <Rich>{t.pageStatic()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
