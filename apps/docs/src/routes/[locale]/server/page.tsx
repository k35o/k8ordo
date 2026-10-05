import { CodeBlock } from '@k8ordo/ui/code-block';

import {
  LandingClaim,
  LandingHero,
  NextSteps,
} from '../../../components/landing';
import * as m from '../../../messages';

const HERO_CONFIG = `export default defineConfig({ plugins: [framework()] });`;

const HERO_PAGE = `export default function ProductsPage() {
  return <h1>Products</h1>;
}`;

const HERO_RUN = `vite build
node serve.js`;

const CLAIM_ACTION = `'use server';

export async function createTalk(
  _previous: FormState,
  formData: FormData,
) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;

  await insertTalk(parsed.data);
  redirect(href('/talks'));
}`;

const CLAIM_ACTION_FORM = `const [state, formAction] = useActionState(createTalk, {});

<form action={formAction}>…</form>`;

const CLAIM_GUARD = `const guard: Guard<'/admin'> = () => {
  if (cookies().has('session')) return;
  return new Response(null, {
    status: 303,
    headers: { location: href('/login') },
  });
};

export default guard;`;

const CLAIM_MODE = `import { framework } from '@k8ordo/static';
import { framework } from '@k8ordo/server';

export default defineConfig({ plugins: [framework()] });`;

export default function ServerPage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock code={HERO_CONFIG} lang="ts" title="vite.config.ts" />
            <CodeBlock
              code={HERO_PAGE}
              lang="tsx"
              title="src/routes/products/page.tsx"
            />
            <CodeBlock code={HERO_RUN} lang="bash" title="Terminal" />
          </>
        }
        directory="server"
        install="@k8ordo/server @k8ordo/router"
        name="@k8ordo/server"
        tagline={m.server.tagline}
      />
      <LandingClaim
        body={m.server.claimActionsBody}
        title={m.server.claimActionsTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock
            code={CLAIM_ACTION}
            lang="ts"
            title="src/routes/talks/_parts/actions.ts"
          />
          <CodeBlock
            code={CLAIM_ACTION_FORM}
            lang="tsx"
            title="src/routes/talks/_parts/talk-form.tsx"
          />
        </div>
      </LandingClaim>
      <LandingClaim
        body={m.server.claimGuardsBody}
        title={m.server.claimGuardsTitle}
      >
        <CodeBlock
          code={CLAIM_GUARD}
          lang="ts"
          title="src/routes/admin/guard.ts"
        />
      </LandingClaim>
      <LandingClaim
        body={m.server.claimModeBody}
        title={m.server.claimModeTitle}
      >
        <CodeBlock
          code={CLAIM_MODE}
          lang="ts"
          marks={{ 1: 'remove', 2: 'add' }}
          title="vite.config.ts"
        />
      </LandingClaim>
      <NextSteps
        name="@k8ordo/server"
        steps={[
          {
            path: '/:locale/server/get-started',
            label: m.nav.getStarted,
            description: m.server.nextGetStarted,
          },
          {
            path: '/:locale/server/routing',
            label: m.server.navRouting,
            description: m.server.nextRouting,
          },
          {
            path: '/:locale/server/actions',
            label: m.server.navActions,
            description: m.server.nextActions,
          },
          {
            path: '/:locale/server/guards',
            label: m.server.navGuards,
            description: m.server.nextGuards,
          },
          {
            path: '/:locale/server/request',
            label: m.server.navRequest,
            description: m.server.nextRequest,
          },
          {
            path: '/:locale/server/deploy',
            label: m.server.navDeploy,
            description: m.server.nextDeploy,
          },
        ]}
      />
    </div>
  );
}
