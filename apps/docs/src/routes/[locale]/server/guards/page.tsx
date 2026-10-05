import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.serverGuards;

const TREE = `src/routes/
  guard.ts
  layout.tsx
  page.tsx
  admin/
    guard.ts
    page.tsx
    [id]/
      page.tsx`;

const ADMIN = `import { href } from '@k8ordo/router';
import { cookies } from '@k8ordo/server/runtime';
import type { Guard } from '@k8ordo/server/runtime';

const guard: Guard<'/admin'> = () => {
  if (cookies().has('session')) return;
  return new Response(null, {
    status: 303,
    headers: { location: href('/login') },
  });
};

export default guard;`;

const ROOT = `import { responseHeaders } from '@k8ordo/server/runtime';

export default function guard() {
  responseHeaders().set('x-content-type-options', 'nosniff');
}`;

export default function ServerGuardsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/guards">
      <DocSection
        description={t.placeDescription}
        id="place"
        title={t.placeTitle}
      >
        <CodeBlock code={TREE} lang="text" />
        <p>
          <Rich>{t.placeExample()}</Rich>
        </p>
        <CodeBlock
          code={ADMIN}
          lang="ts"
          marks={{ 6: 'highlight', 7: 'highlight' }}
          title="src/routes/admin/guard.ts"
        />
        <p>
          <Rich>{t.placeContext()}</Rich>
        </p>
        <p>
          <Rich>{t.placeType()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.staticNote()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection description={t.endDescription} id="end" title={t.endTitle}>
        <p>
          <Rich>{t.endLocation()}</Rich>
        </p>
        <p>
          <Rich>{t.endOther()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.headersDescription}
        id="headers"
        title={t.headersTitle}
      >
        <CodeBlock
          code={ROOT}
          lang="ts"
          marks={{ 4: 'highlight' }}
          title="src/routes/guard.ts"
        />
        <p>
          <Rich>{t.headersReplace()}</Rich>
        </p>
        <p>
          <Rich>{t.headersWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.headersCsp()}</Rich>{' '}
          <LocaleAnchor path="/:locale/server/csp">
            {m.server.navCsp()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.noNextDescription}
        id="no-next"
        title={t.noNextTitle}
      />

      <DocSection
        description={t.coversDescription}
        id="covers"
        title={t.coversTitle}
      >
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
        <p>
          <Rich>{t.coversRedirect()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.coversActions()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.orderDescription}
        id="order"
        title={t.orderTitle}
      />
    </DocPage>
  );
}
