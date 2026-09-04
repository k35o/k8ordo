import { HistoryIcon, LinkIcon, ListIcon, ShieldCheckIcon } from '@k8ordo/ui';

import { PackageExample } from '../../../components/package-example';
import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';

const FEATURES: PackageFeature[] = [
  {
    title: 'router.featureTable',
    description: 'router.featureTableDescription',
    icon: <ListIcon />,
  },
  {
    title: 'router.featureTypes',
    description: 'router.featureTypesDescription',
    icon: <ShieldCheckIcon />,
  },
  {
    title: 'router.featureNavigation',
    description: 'router.featureNavigationDescription',
    icon: <HistoryIcon />,
  },
  {
    title: 'router.featureNoLink',
    description: 'router.featureNoLinkDescription',
    icon: <LinkIcon />,
  },
];

const EXAMPLE = `// routes.ts
export const routes = defineRoutes({
  '/': Home,
  '/products': {
    children: { '/': ProductList, '/:id': ProductPage },
  },
  '/(docs)': { layout: DocsLayout, children: { '/guide': Guide } },
  '/*': NotFound,
});

// どのページからでも。表は import しない
<a href={href('/products/:id', { id })}>…</a>;

const { id } = useParams('/products/:id');`;

export default function RouterPage() {
  return (
    <PackageLanding
      description="router.description"
      directory="router"
      docsDescription="router.docsDescription"
      docsTitle="router.docsTitle"
      features={FEATURES}
      featuresTitle="router.featuresTitle"
      name="@k8ordo/router"
    >
      <PackageExample
        code={EXAMPLE}
        description="router.exampleDescription"
        title="router.exampleTitle"
      />
    </PackageLanding>
  );
}
