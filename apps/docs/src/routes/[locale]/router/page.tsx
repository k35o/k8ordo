import {
  HistoryIcon,
  LinkIcon,
  ListIcon,
  LocationIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from '@k8ordo/ui';

import { PackageExample } from '../../../components/package-example';
import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';
import * as m from '../../../messages';

const FEATURES: PackageFeature[] = [
  {
    title: m.router.featureTable,
    description: m.router.featureTableDescription,
    icon: <ListIcon />,
  },
  {
    title: m.router.featureTypes,
    description: m.router.featureTypesDescription,
    icon: <ShieldCheckIcon />,
  },
  {
    title: m.router.featureNavigation,
    description: m.router.featureNavigationDescription,
    icon: <HistoryIcon />,
  },
  {
    title: m.router.featureNoLink,
    description: m.router.featureNoLinkDescription,
    icon: <LinkIcon />,
  },
  {
    title: m.router.featureMatch,
    description: m.router.featureMatchDescription,
    icon: <LocationIcon />,
  },
  {
    title: m.router.featureError,
    description: m.router.featureErrorDescription,
    icon: <RefreshIcon />,
  },
];

const EXAMPLE = `// routes.ts
export const routes = defineRoutes({
  '/': Home,
  '/products': {
    children: { '/': ProductList, '/:id': ProductPage },
  },
  '/(docs)': { layout: DocsLayout, error: DocsError, children: { '/guide': Guide } },
  '/*': NotFound,
});

// どのページからでも。表は import しない
<a href={href('/products/:id', { id })}>…</a>;

const { id } = useParams('/products/:id');
const inProducts = useMatch('/products/*') !== null; // 表を持たないブラウザでも`;

export default function RouterPage() {
  return (
    <PackageLanding
      description={m.router.description}
      directory="router"
      docsDescription={m.router.docsDescription}
      docsTitle={m.router.docsTitle}
      features={FEATURES}
      featuresTitle={m.router.featuresTitle}
      name="@k8ordo/router"
    >
      <PackageExample
        code={EXAMPLE}
        description={m.router.exampleDescription}
        title={m.router.exampleTitle}
      />
    </PackageLanding>
  );
}
