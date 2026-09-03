'use client';

import { AtomIcon, FormIcon, LocationIcon, SendIcon } from '@k8ordo/ui';

import { PackageLanding } from '../components/package-landing';
import type { PackageFeature } from '../components/package-landing';

const FEATURES: PackageFeature[] = [
  {
    title: 'server.featureRequest',
    description: 'server.featureRequestDescription',
    icon: <SendIcon />,
  },
  {
    title: 'server.featureRoutes',
    description: 'server.featureRoutesDescription',
    icon: <LocationIcon />,
  },
  {
    title: 'server.featureActions',
    description: 'server.featureActionsDescription',
    icon: <FormIcon />,
  },
  {
    title: 'server.featureSameHandler',
    description: 'server.featureSameHandlerDescription',
    icon: <AtomIcon />,
  },
];

export function ServerPage() {
  return (
    <PackageLanding
      description="server.description"
      directory="server"
      docsDescription="server.docsDescription"
      docsTitle="server.docsTitle"
      features={FEATURES}
      featuresTitle="server.featuresTitle"
      name="@k8ordo/server"
    />
  );
}
