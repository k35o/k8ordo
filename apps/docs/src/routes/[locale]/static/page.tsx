import {
  AtomIcon,
  LocationIcon,
  LockIcon,
  PackageIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from '@k8ordo/ui';

import { PackageExample } from '../../../components/package-example';
import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';
import * as m from '../../../messages';

const FEATURES: PackageFeature[] = [
  {
    title: m.static.featureRoutes,
    description: m.static.featureRoutesDescription,
    icon: <LocationIcon />,
  },
  {
    title: m.static.featureGenerated,
    description: m.static.featureGeneratedDescription,
    icon: <AtomIcon />,
  },
  {
    title: m.static.featureBoundary,
    description: m.static.featureBoundaryDescription,
    icon: <LockIcon />,
  },
  {
    title: m.static.featureFiles,
    description: m.static.featureFilesDescription,
    icon: <PackageIcon />,
  },
  {
    title: m.static.featureRouteFiles,
    description: m.static.featureRouteFilesDescription,
    icon: <RefreshIcon />,
  },
  {
    title: m.static.featureParams,
    description: m.static.featureParamsDescription,
    icon: <ShieldCheckIcon />,
  },
];

const EXAMPLE = `// src/routes/page.tsx                → /
// src/routes/products/page.tsx       → /products
// src/routes/products/[id]/page.tsx  → /products/:id（paramsSchema が id を検証）
// src/routes/error.tsx               → 配下が throw したら layout の内側に
// src/routes/old/redirect.ts         → /old は別の場所へ

// vite.config.ts — 値を持たない区間だけ、ビルドに渡す
export default defineConfig({
  plugins: [
    framework({
      paths: async () => {
        const products = await readCatalog();
        return products.map((product) => \`/products/\${product.id}\`);
      },
    }),
  ],
});`;

export default function StaticPage() {
  return (
    <PackageLanding
      description={m.static.description}
      directory="static"
      docsDescription={m.static.docsDescription}
      docsTitle={m.static.docsTitle}
      features={FEATURES}
      featuresTitle={m.static.featuresTitle}
      name="@k8ordo/static"
    >
      <PackageExample
        code={EXAMPLE}
        description={m.static.exampleDescription}
        lang="ts"
        title={m.static.exampleTitle}
      />
    </PackageLanding>
  );
}
