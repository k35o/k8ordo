import { CodeBlock } from '@k8ordo/ui/code-block';

import { LandingClaim, LandingHero } from '../../../components/landing';
import * as m from '../../../messages';

const HERO_CONFIG = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'static' })],
});`;

const HERO_PAGE = `export default function ProductsPage() {
  return <h1>Products</h1>;
}`;

const HERO_OUTPUT = `dist/client/
  products/index.html`;

const CLAIM_ROUTES = `src/routes/
  layout.tsx
  page.tsx
  not-found.tsx
  products/
    page.tsx
    [id]/page.tsx
  _parts/`;

const CLAIM_STATIC = `framework({ mode: 'static' });`;

const CLAIM_STATIC_RUN = `vite build`;

const CLAIM_SERVER = `framework({ mode: 'server' });`;

const CLAIM_SERVER_RUN = `vite build
node dist/server.js`;

const CLAIM_REFUSE = `static build cannot ship Server Actions — a file cannot receive one, and this declares 'use server':
  src/routes/_parts/guestbook.ts
this application wants mode: 'server'`;

export default function FrameworkPage() {
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
            <CodeBlock code={HERO_OUTPUT} lang="text" title="vite build" />
          </>
        }
        directory="framework"
        install="-D @k8ordo/framework @k8ordo/router"
        name="@k8ordo/framework"
        tagline={m.framework.tagline}
      />
      <LandingClaim
        body={m.framework.claimRoutesBody}
        title={m.framework.claimRoutesTitle}
      >
        <CodeBlock code={CLAIM_ROUTES} lang="text" title="src/routes/" />
      </LandingClaim>
      <LandingClaim
        body={m.framework.claimModeBody}
        title={m.framework.claimModeTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock code={CLAIM_STATIC} lang="ts" title="vite.config.ts" />
          <CodeBlock code={CLAIM_STATIC_RUN} lang="bash" title="Terminal" />
          <CodeBlock code={CLAIM_SERVER} lang="ts" title="vite.config.ts" />
          <CodeBlock code={CLAIM_SERVER_RUN} lang="bash" title="Terminal" />
        </div>
      </LandingClaim>
      <LandingClaim
        body={m.framework.claimRefuseBody}
        title={m.framework.claimRefuseTitle}
      >
        <CodeBlock code={CLAIM_REFUSE} lang="text" title="vite build" />
      </LandingClaim>
    </div>
  );
}
