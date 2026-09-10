import {
  AtomIcon,
  CodeXmlIcon,
  Heading,
  ListIcon,
  LocationIcon,
  SendIcon,
  ShieldCheckIcon,
} from '@k8ordo/ui';

import { PackageExample } from '../../../components/package-example';
import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';
import { T } from '../../../components/t';
import { EXAMPLE } from './_parts/example';
import { I18nDemo } from './_parts/i18n-demo';

const FEATURES: PackageFeature[] = [
  {
    title: 'i18n.featureLocales',
    description: 'i18n.featureLocalesDescription',
    icon: <ListIcon />,
  },
  {
    title: 'i18n.featureSegment',
    description: 'i18n.featureSegmentDescription',
    icon: <LocationIcon />,
  },
  {
    title: 'i18n.featureNegotiate',
    description: 'i18n.featureNegotiateDescription',
    icon: <SendIcon />,
  },
  {
    title: 'i18n.featureDictionary',
    description: 'i18n.featureDictionaryDescription',
    icon: <AtomIcon />,
  },
  {
    title: 'i18n.featureFunctions',
    description: 'i18n.featureFunctionsDescription',
    icon: <CodeXmlIcon />,
  },
  {
    title: 'i18n.featureBoundary',
    description: 'i18n.featureBoundaryDescription',
    icon: <ShieldCheckIcon />,
  },
];

export default function I18nPage() {
  return (
    <PackageLanding
      description="i18n.description"
      directory="i18n"
      docsDescription="i18n.docsDescription"
      docsTitle="i18n.docsTitle"
      features={FEATURES}
      featuresTitle="i18n.featuresTitle"
      name="@k8ordo/i18n"
    >
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">
          <T k="i18n.demoTitle" />
        </Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <T k="i18n.demoDescription" />
        </p>
        <div className="mt-6 max-w-2xl">
          <I18nDemo />
        </div>
      </section>
      <PackageExample
        code={EXAMPLE}
        description="i18n.exampleDescription"
        title="i18n.exampleTitle"
      />
    </PackageLanding>
  );
}
