import { formFields } from '@k8ordo/form/server';
import {
  AccessibilityIcon,
  AtomIcon,
  FormIcon,
  Heading,
  LockIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@k8ordo/ui';

import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';
import { Rich } from '../../../components/rich';
import * as m from '../../../messages';
import { demoState } from './_parts/demo-state';
import { FormDemo } from './_parts/form-demo';

const FEATURES: PackageFeature[] = [
  {
    title: m.form.featureSchema,
    description: m.form.featureSchemaDescription,
    icon: <FormIcon />,
  },
  {
    title: m.form.featureNoJs,
    description: m.form.featureNoJsDescription,
    icon: <SparklesIcon />,
  },
  {
    title: m.form.featureDom,
    description: m.form.featureDomDescription,
    icon: <AtomIcon />,
  },
  {
    title: m.form.featureTypes,
    description: m.form.featureTypesDescription,
    icon: <ShieldCheckIcon />,
  },
  {
    title: m.form.featureLoud,
    description: m.form.featureLoudDescription,
    icon: <AccessibilityIcon />,
  },
  {
    title: m.form.featureSecrets,
    description: m.form.featureSecretsDescription,
    icon: <LockIcon />,
  },
];

// Server Component（このファイルにディレクティブは無い）。スキーマから制約属性を
// 導くのはここで、結果は JSON なので props としてクライアントに渡り、zod は
// ブラウザに届かない。URL 状態のスキーマ（@k8ordo/state）と同じ 1 つを渡す。
const demoFields = formFields(demoState.url);

export default function FormPage() {
  return (
    <PackageLanding
      description={m.form.description}
      directory="form"
      docsDescription={m.form.docsDescription}
      docsTitle={m.form.docsTitle}
      features={FEATURES}
      featuresTitle={m.form.featuresTitle}
      name="@k8ordo/form"
    >
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">
          <Rich>{m.form.demoTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <Rich>{m.form.demoDescription()}</Rich>
        </p>
        <div className="mt-6 max-w-2xl">
          <FormDemo fields={demoFields} />
        </div>
      </section>
    </PackageLanding>
  );
}
