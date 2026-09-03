'use client';

import { HistoryIcon, LinkIcon, ListIcon, ShieldCheckIcon } from '@k8ordo/ui';

import { PackageLanding } from '../components/package-landing';
import type { PackageFeature } from '../components/package-landing';

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

export function RouterPage() {
  return (
    <PackageLanding
      description="router.description"
      directory="router"
      docsDescription="router.docsDescription"
      docsTitle="router.docsTitle"
      features={FEATURES}
      featuresTitle="router.featuresTitle"
      name="@k8ordo/router"
    />
  );
}
