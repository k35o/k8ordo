import { Note } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkRequest;

const LAYOUT = `import type { LayoutProps } from '@k8ordo/framework';

import { Header } from '../components/header';

export default function RootLayout({
  children,
  request,
}: LayoutProps<'/'>) {
  const session = request.cookies.get('session');
  return (
    <html lang="en">
      <body>
        <Header signedIn={session !== undefined} />
        {children}
      </body>
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

import { startSession } from './sessions.server';

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

import { saveReport } from './reports.server';

export async function report(formData: FormData): Promise<void> {
  const agent = requestHeaders().get('user-agent') ?? 'unknown';
  await saveReport(formData.get('body'), agent);
}`;

const CHAT = `import { waitUntil } from '@k8ordo/framework/server';

import { saveChat } from '../../../lib/chats.server';
import { generate } from '../../../lib/generate.server';

export async function POST({ request }: { request: Request }) {
  const generation = await generate(await request.json());
  const [forVisitor, forStore] = generation.tee();
  waitUntil(saveChat(forStore));
  return new Response(forVisitor);
}`;

const OPTIONS = `cookies().set('session', token, { maxAge: 3600, sameSite: 'strict' });`;

const STATE_LAYOUT = `import type { LayoutProps } from '@k8ordo/framework';

import { Shell } from '../components/shell';
import { density } from '../state';

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

import { density } from '../state';

export async function compact() {
  cookies().set(
    ...density.cookie({ density: 'compact' }, cookies()),
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
          callouts={{ 9: t.readCookieCallout() }}
          code={LAYOUT}
          lang="tsx"
          marks={{ 7: 'highlight', 9: 'highlight' }}
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
          title="src/components/greeting.tsx"
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
          title="src/lib/sign-in.ts"
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

      <DocSection id="preferences" title={t.prefsTitle}>
        <p>
          <Rich>{t.prefsLead()}</Rich>
        </p>
        <ul>
          {t.prefsList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.prefsScript()}</Rich>
          <LocaleAnchor path="/:locale/framework/csp">
            {m.framework.navCsp()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.prefsLanguage()}</Rich>
          <LocaleAnchor path="/:locale/i18n/negotiate">
            {m.i18n.navNegotiate()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
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
          callouts={{ 9: t.stateWriteCallout() }}
          code={STATE_ACTION}
          lang="ts"
          marks={{ 9: 'highlight' }}
          title="src/lib/compact.ts"
        />
        <p>
          <Rich>{t.stateWrite()}</Rich>
        </p>
        <p>
          <Rich>{t.stateAttributes()}</Rich>
        </p>
        <p>
          <Rich>{t.stateReset()}</Rich>
        </p>
      </DocSection>

      <DocSection id="headers" title={t.headersTitle}>
        <CodeBlock
          callouts={{ 8: t.headersCallout() }}
          code={REPORT}
          lang="ts"
          marks={{ 8: 'highlight' }}
          title="src/lib/report.ts"
        />
        <p>
          <Rich>{t.headersArguments()}</Rich>
        </p>
        <p>
          <Rich>{t.headersWhere()}</Rich>
        </p>
      </DocSection>

      <DocSection id="wait-until" title={t.waitTitle}>
        <CodeBlock
          callouts={{ 9: t.waitCallout() }}
          code={CHAT}
          lang="ts"
          marks={{ 9: 'highlight' }}
          title="src/routes/api/chat/route.ts"
        />
        <p>
          <Rich>{t.waitWhat()}</Rich>
        </p>
        <p>
          <Rich>{t.waitStarted()}</Rich>
        </p>
        <p>
          <Rich>{t.waitWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.waitReject()}</Rich>
        </p>
        <p>
          <Rich>{t.waitHost()}</Rich>
          <LocaleAnchor path="/:locale/framework/deploy">
            {m.framework.navDeploy()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
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
