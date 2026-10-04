import { CodeBlock } from '@k8ordo/ui/code-block';

import {
  LandingClaim,
  LandingHero,
  NextSteps,
} from '../../../components/landing';
import * as m from '../../../messages';

const HERO_ROUTES = `export const routes = defineRoutes({
  '/': Home,
  '/products': ProductList,
  '/products/:id': ProductPage,
});`;

const HERO_APP = `export const App = () => <Router routes={routes} />;`;

const HERO_LINK = `<a href={href('/products/:id', { id: product.id })}>
  {product.name}
</a>`;

const CLAIM_ANCHOR = `export function ProductsLink({ children }: { children: ReactNode }) {
  const current = useMatch('/products/*', { inclusive: true });

  return (
    <a aria-current={current ? 'page' : undefined} href={href('/products')}>
      {children}
    </a>
  );
}`;

const CLAIM_TYPES_REGISTER = `declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}`;

const CLAIM_TYPES_HREF = `href('/products/:id', { id: '42' });
// '/products/42'

href('/prodcuts/:id', { id: '42' });
href('/products/:id');`;

const CLAIM_NAVIGATION_WAIT = `const [isPending, startTransition] = useTransition();

startTransition(async () => {
  await navigateTo('/products/:id', { id }).finished;
});`;

const CLAIM_NAVIGATION_ANIMATE = `<ViewTransition default="none" update={{ navigation: 'auto', default: 'none' }}>
  <Outlet />
</ViewTransition>`;

export default function RouterPage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock code={HERO_ROUTES} lang="ts" title="routes.ts" />
            <CodeBlock code={HERO_APP} lang="tsx" title="app.tsx" />
            <CodeBlock code={HERO_LINK} lang="tsx" title="product-card.tsx" />
          </>
        }
        directory="router"
        install="@k8ordo/router"
        name="@k8ordo/router"
        tagline={m.router.tagline}
      />
      <LandingClaim
        body={m.router.claimAnchorBody}
        title={m.router.claimAnchorTitle}
      >
        <CodeBlock code={CLAIM_ANCHOR} lang="tsx" title="products-link.tsx" />
      </LandingClaim>
      <LandingClaim
        body={m.router.claimTypesBody}
        title={m.router.claimTypesTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock
            code={CLAIM_TYPES_REGISTER}
            lang="ts"
            title="k8ordo-router.d.ts"
          />
          <CodeBlock
            callouts={{
              4: m.router.claimTypesTypo(),
              5: m.router.claimTypesMissing(),
            }}
            code={CLAIM_TYPES_HREF}
            lang="ts"
            title="product-card.tsx"
          />
        </div>
      </LandingClaim>
      <LandingClaim
        body={m.router.claimNavigationBody}
        title={m.router.claimNavigationTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock
            code={CLAIM_NAVIGATION_WAIT}
            lang="tsx"
            title="open-product.tsx"
          />
          <CodeBlock
            code={CLAIM_NAVIGATION_ANIMATE}
            lang="tsx"
            title="layout.tsx"
          />
        </div>
      </LandingClaim>
      <NextSteps
        directory="router"
        steps={[
          {
            path: '/:locale/router/get-started',
            label: m.nav.getStarted,
            description: m.router.nextGetStarted,
          },
          {
            path: '/:locale/router/routes',
            label: m.router.navRoutes,
            description: m.router.nextRoutes,
          },
          {
            path: '/:locale/router/links',
            label: m.router.navLinks,
            description: m.router.nextLinks,
          },
          {
            path: '/:locale/router/navigation',
            label: m.router.navNavigation,
            description: m.router.nextNavigation,
          },
          {
            path: '/:locale/router/framework',
            label: m.router.navFramework,
            description: m.router.nextFramework,
          },
        ]}
      />
    </div>
  );
}
