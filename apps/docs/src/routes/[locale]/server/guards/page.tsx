import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  Bullet,
  Bullets,
  Paragraph,
} from '../../../../components/framework-guide/prose';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const TREE = `src/routes/
  layout.tsx
  guard.ts
  page.tsx
  admin/
    guard.ts
    page.tsx
    [id]/
      page.tsx`;

const ADMIN = `// src/routes/admin/guard.ts
import { cookies } from '@k8ordo/server/runtime';
import type { Guard } from '@k8ordo/server/runtime';

const guard: Guard<'/admin'> = () => {
  if (cookies().has('session')) return;
  return new Response(null, { status: 303, headers: { location: '/login' } });
};

export default guard;`;

const ROOT = `// src/routes/guard.ts
import { responseHeaders } from '@k8ordo/server/runtime';

export default function guard() {
  responseHeaders().set('x-content-type-options', 'nosniff');
}`;

const COOKIES = `import { cookies } from '@k8ordo/server/runtime';

cookies().get('session');
cookies().set('session', token, { maxAge: 60 * 60 * 24 });
cookies().delete('session');`;

export default function ServerGuardsPage() {
  const t = m.serverGuards;
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/guards">
      <DocSection description={t.guardDescription} title={t.guardTitle}>
        <CodeBlock code={TREE} lang="bash" />
        <CodeBlock code={ADMIN} lang="ts" />
        <Paragraph text={t.guardReceives} />
      </DocSection>

      <DocSection description={t.endDescription} title={t.endTitle} />

      <DocSection description={t.addDescription} title={t.addTitle}>
        <CodeBlock code={ROOT} lang="ts" />
        <Paragraph text={t.addReplace} />
      </DocSection>

      <DocSection description={t.nextDescription} title={t.nextTitle} />

      <DocSection description={t.coversDescription} title={t.coversTitle}>
        <Bullets>
          <Bullet>
            <Rich>{t.coversPage()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.coversHead()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.coversAction()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.coversNotFound()}</Rich>
          </Bullet>
        </Bullets>
        <Paragraph text={t.coversRedirect} />
        <Paragraph text={t.coversActions}>
          <LocaleAnchor path="/:locale/server/actions">
            {m.server.navActions()}
          </LocaleAnchor>
        </Paragraph>
      </DocSection>

      <DocSection description={t.orderDescription} title={t.orderTitle} />

      <DocSection description={t.cookiesDescription} title={t.cookiesTitle}>
        <CodeBlock code={COOKIES} lang="ts" />
        <Paragraph text={t.cookiesOptions} />
        <Paragraph text={t.cookiesPage} />
      </DocSection>

      <DocSection description={t.staticDescription} title={t.staticTitle}>
        <p>
          <LocaleAnchor path="/:locale/static/get-started">
            @k8ordo/static
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
