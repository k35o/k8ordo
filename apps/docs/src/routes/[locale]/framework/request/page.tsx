import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkRequest;

const LAYOUT = `import type { LayoutProps } from '@k8ordo/framework';

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

const GREETING = `import type { RouteRequest } from '@k8ordo/framework/server';

export function Greeting({ request }: { request: RouteRequest }) {
  const name = request.cookies.get('name') ?? 'there';
  return <p>Hello, {name}</p>;
}`;

const SIGN_IN = `'use server';

import { href } from '@k8ordo/framework';
import { cookies, redirect } from '@k8ordo/framework/server';

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

import { requestHeaders } from '@k8ordo/framework/server';

import { saveReport } from '../_data/reports.server';

export async function report(formData: FormData): Promise<void> {
  const agent = requestHeaders().get('user-agent') ?? 'unknown';
  await saveReport(formData.get('body'), agent);
}`;

const OPTIONS = `cookies().set('session', token, { maxAge: 3600, sameSite: 'strict' });`;

const STATE_LAYOUT = `import type { LayoutProps } from '@k8ordo/framework';

import { density } from '../state';
import { Shell } from './_parts/shell';

export default function RootLayout({
  children,
  request,
}: LayoutProps<'/'>) {
  return (
    <Shell initialCookie={density.parseCookies(request.cookies)}>
      {children}
    </Shell>
  );
}`;

const STATE_ACTION = `'use server';

import { cookies } from '@k8ordo/framework/server';

import { density } from '../../../state';

export async function compact() {
  cookies().set(
    density.cookieName,
    density.cookieValue({ density: 'compact' }),
    { httpOnly: false, maxAge: 34_560_000 },
  );
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

export default function FrameworkRequestPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/request">
      <DocSection id="read" title={t.readTitle}>
        <CodeBlock
          callouts={{ 7: t.readCookieCallout() }}
          code={LAYOUT}
          lang="tsx"
          marks={{ 5: 'highlight', 7: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <p>
          <Rich>{t.readReceives()}</Rich>
        </p>
        <Items items={t.readFields} />
        <p>
          <Rich>{t.pageStatic()}</Rich>
        </p>
        <CodeBlock
          code={GREETING}
          lang="tsx"
          marks={{ 3: 'highlight' }}
          title="src/routes/_parts/greeting.tsx"
        />
        <p>
          <Rich>{t.readProp()}</Rich>
          {t.sentenceGap()}
          <Rich>{t.readSearch()}</Rich>
          <LocaleAnchor path="/:locale/framework/params">
            {m.framework.navParams()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="cookies" title={t.cookiesTitle}>
        <CodeBlock
          callouts={{ 16: t.cookiesSetCallout() }}
          code={SIGN_IN}
          lang="ts"
          marks={{ 16: 'highlight', 17: 'highlight', 18: 'highlight' }}
          title="src/routes/login/_parts/sign-in.ts"
        />
        <p>
          <Rich>{t.cookiesWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.cookiesRead()}</Rich>
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

      <DocSection id="options" title={t.optionsTitle}>
        <CodeBlock code={OPTIONS} lang="ts" />
        <p>
          <Rich>{t.optionsArgument()}</Rich>
        </p>
        <Items items={t.optionsList} />
        <p>
          <Rich>{t.optionsLocal()}</Rich>
        </p>
        <p>
          <Rich>{t.optionsDelete()}</Rich>
        </p>
      </DocSection>

      <DocSection id="state" title={t.stateTitle}>
        <CodeBlock
          callouts={{ 11: t.stateReadCallout() }}
          code={STATE_LAYOUT}
          lang="tsx"
          marks={{ 11: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <p>
          <Rich>{t.stateRead()}</Rich>
        </p>
        <p>
          <Rich>{t.stateOnce()}</Rich>
          <LocaleAnchor path="/:locale/state/cookie">
            {m.state.navCookie()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 11: t.stateWriteCallout() }}
          code={STATE_ACTION}
          lang="ts"
          marks={{ 9: 'highlight', 10: 'highlight', 11: 'highlight' }}
          title="src/routes/settings/_parts/compact.ts"
        />
        <p>
          <Rich>{t.stateWrite()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.stateHttpOnly()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="headers" title={t.headersTitle}>
        <CodeBlock
          callouts={{ 8: t.headersCallout() }}
          code={REPORT}
          lang="ts"
          marks={{ 8: 'highlight' }}
          title="src/routes/_parts/report.ts"
        />
        <p>
          <Rich>{t.headersArguments()}</Rich>
        </p>
        <p>
          <Rich>{t.headersWhere()}</Rich>
        </p>
      </DocSection>

      <DocSection id="page" title={t.pageTitle}>
        <p>
          <Rich>{t.pageInstead()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
