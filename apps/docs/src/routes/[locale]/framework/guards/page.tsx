import { Note } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkGuards;

const TREE = `src/routes/
  guard.ts
  layout.tsx
  page.tsx
  admin/
    guard.ts
    page.tsx
    [id]/
      page.tsx`;

const ADMIN = `import { href } from '@k8ordo/framework';
import { cookies, redirect } from '@k8ordo/framework/server';
import type { Guard } from '@k8ordo/framework/server';

import { sessionOf } from '../../lib/session.server';

const guard: Guard<'/admin'> = async () => {
  const session = await sessionOf(cookies().get('session'));
  if (session === null) redirect(href('/login'));
  if (!session.admin) return new Response('admins only', { status: 403 });
};

export default guard;`;

const ROOT = `import { responseHeaders } from '@k8ordo/framework/server';

export default function guard() {
  responseHeaders().set('x-content-type-options', 'nosniff');
}`;

export default function FrameworkGuardsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/guards">
      <DocSection id="place" title={t.placeTitle}>
        <CodeBlock code={TREE} lang="text" />
        <p>
          <Rich>{t.placeAnywhere()}</Rich>
        </p>
        <p>
          <Rich>{t.placeTree()}</Rich>
        </p>
        <p>
          <Rich>{t.placeGroup()}</Rich>
          <LocaleAnchor path="/:locale/framework/routing">
            {m.framework.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="end" title={t.endTitle}>
        <CodeBlock
          callouts={{
            9: t.endRedirectCallout(),
            10: t.endResponseCallout(),
            11: t.endPassCallout(),
          }}
          code={ADMIN}
          lang="ts"
          marks={{ 9: 'highlight', 10: 'highlight' }}
          title="src/routes/admin/guard.ts"
        />
        <p>
          <Rich>{t.endResponse()}</Rich>
        </p>
        <p>
          <Rich>{t.endUrl()}</Rich>
        </p>
        <p>
          <Rich>{t.endContext()}</Rich>
        </p>
        <p>
          <Rich>{t.endType()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.endOther()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="headers" title={t.headersTitle}>
        <CodeBlock
          code={ROOT}
          lang="ts"
          marks={{ 4: 'highlight' }}
          title="src/routes/guard.ts"
        />
        <p>
          <Rich>{t.headersAnswer()}</Rich>
        </p>
        <p>
          <Rich>{t.headersWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.headersCspBefore()}</Rich>
          <LocaleAnchor path="/:locale/framework/csp">
            {m.framework.navCsp()}
          </LocaleAnchor>
          <Rich>{t.headersCspAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="no-next" title={t.noNextTitle}>
        <p>
          <Rich>{t.noNextStreams()}</Rich>
        </p>
      </DocSection>

      <DocSection id="covers" title={t.coversTitle}>
        <p>
          <Rich>{t.coversLead()}</Rich>
        </p>
        <ul>
          {t.coversList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.coversRoot()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.coversActions()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="order" title={t.orderTitle}>
        <p>
          <Rich>{t.orderWhen()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
