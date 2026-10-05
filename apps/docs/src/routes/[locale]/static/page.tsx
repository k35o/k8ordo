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

const HERO_OUTPUT = `dist/client/
  index.html
  products/index.html
  404.html`;

const CLAIM_ROUTES = `src/routes/
  layout.tsx
  page.tsx
  not-found.tsx
  products/
    page.tsx
    [id]/page.tsx
  _parts/`;

const CLAIM_PATHS = `framework({
  paths: async () => {
    const products = await readCatalog();
    return products.map(({ id }) => \`/products/\${id}\`);
  },
});`;

const CLAIM_PATHS_ERROR = `static build needs pathnames for /products/:id — supply them with the "paths" option`;

const CLAIM_REFUSE = `static build cannot ship Server Actions — a file cannot receive one, and these declare 'use server':
  src/routes/_parts/guestbook.ts
this application wants @k8ordo/server`;

export default function StaticPage() {
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
        directory="static"
        install="@k8ordo/static @k8ordo/router"
        name="@k8ordo/static"
        tagline={m.static.tagline}
      />
      <LandingClaim
        body={m.static.claimRoutesBody}
        title={m.static.claimRoutesTitle}
      >
        <CodeBlock code={CLAIM_ROUTES} lang="text" title="src/routes/" />
      </LandingClaim>
      <LandingClaim
        body={m.static.claimPathsBody}
        title={m.static.claimPathsTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock code={CLAIM_PATHS} lang="ts" title="vite.config.ts" />
          <CodeBlock code={CLAIM_PATHS_ERROR} lang="text" title="vite build" />
        </div>
      </LandingClaim>
      <LandingClaim
        body={m.static.claimRefuseBody}
        title={m.static.claimRefuseTitle}
      >
        <CodeBlock code={CLAIM_REFUSE} lang="text" title="vite build" />
      </LandingClaim>
      <NextSteps
        name="@k8ordo/static"
        steps={[
          {
            path: '/:locale/static/get-started',
            label: m.nav.getStarted,
            description: m.static.nextGetStarted,
          },
          {
            path: '/:locale/static/routing',
            label: m.static.navRouting,
            description: m.static.nextRouting,
          },
          {
            path: '/:locale/static/params',
            label: m.static.navParams,
            description: m.static.nextParams,
          },
          {
            path: '/:locale/static/errors',
            label: m.static.navErrors,
            description: m.static.nextErrors,
          },
          {
            path: '/:locale/static/boundaries',
            label: m.static.navBoundaries,
            description: m.static.nextBoundaries,
          },
          {
            path: '/:locale/static/deploy',
            label: m.static.navDeploy,
            description: m.static.nextDeploy,
          },
        ]}
      />
    </div>
  );
}
