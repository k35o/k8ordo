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
import { Rich } from '../../../components/rich';
import * as m from '../../../messages';
import { EXAMPLE } from './_parts/example';
import { I18nDemo } from './_parts/i18n-demo';

const FEATURES: PackageFeature[] = [
  {
    title: m.i18n.featureLocales,
    description: m.i18n.featureLocalesDescription,
    icon: <ListIcon />,
  },
  {
    title: m.i18n.featureSegment,
    description: m.i18n.featureSegmentDescription,
    icon: <LocationIcon />,
  },
  {
    title: m.i18n.featureNegotiate,
    description: m.i18n.featureNegotiateDescription,
    icon: <SendIcon />,
  },
  {
    title: m.i18n.featureDictionary,
    description: m.i18n.featureDictionaryDescription,
    icon: <AtomIcon />,
  },
  {
    title: m.i18n.featureFunctions,
    description: m.i18n.featureFunctionsDescription,
    icon: <CodeXmlIcon />,
  },
  {
    title: m.i18n.featureBoundary,
    description: m.i18n.featureBoundaryDescription,
    icon: <ShieldCheckIcon />,
  },
];

export default function I18nPage() {
  return (
    <PackageLanding
      description={m.i18n.description}
      directory="i18n"
      docsDescription={m.i18n.docsDescription}
      docsTitle={m.i18n.docsTitle}
      features={FEATURES}
      featuresTitle={m.i18n.featuresTitle}
      name="@k8ordo/i18n"
    >
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">
          <Rich>{m.i18n.demoTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <Rich>{m.i18n.demoDescription()}</Rich>
        </p>
        <div className="mt-6 max-w-2xl">
          <I18nDemo />
        </div>
      </section>
      <PackageExample
        code={EXAMPLE}
        description={m.i18n.exampleDescription}
        title={m.i18n.exampleTitle}
      />
    </PackageLanding>
  );
}
