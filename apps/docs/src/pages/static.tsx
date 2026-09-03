'use client';

import { AtomIcon, LocationIcon, LockIcon, PackageIcon } from '@k8ordo/ui';

import { PackageLanding } from '../components/package-landing';
import type { PackageFeature } from '../components/package-landing';

const FEATURES: PackageFeature[] = [
  {
    title: 'static.featureRoutes',
    description: 'static.featureRoutesDescription',
    icon: <LocationIcon />,
  },
  {
    title: 'static.featureGenerated',
    description: 'static.featureGeneratedDescription',
    icon: <AtomIcon />,
  },
  {
    title: 'static.featureBoundary',
    description: 'static.featureBoundaryDescription',
    icon: <LockIcon />,
  },
  {
    title: 'static.featureFiles',
    description: 'static.featureFilesDescription',
    icon: <PackageIcon />,
  },
];

export function StaticPage() {
  return (
    <PackageLanding
      description="static.description"
      directory="static"
      docsDescription="static.docsDescription"
      docsTitle="static.docsTitle"
      features={FEATURES}
      featuresTitle="static.featuresTitle"
      name="@k8ordo/static"
    />
  );
}
