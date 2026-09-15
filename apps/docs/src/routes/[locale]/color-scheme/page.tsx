import {
  AtomIcon,
  DarkModeIcon,
  Heading,
  LightModeIcon,
  ShieldCheckIcon,
} from '@k8ordo/ui';

import { PackageExample } from '../../../components/package-example';
import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';
import { Rich } from '../../../components/rich';
import * as m from '../../../messages';
import { SchemeDemo } from './_parts/scheme-demo';

const FEATURES: PackageFeature[] = [
  {
    title: m.colorScheme.featureNoFlash,
    description: m.colorScheme.featureNoFlashDescription,
    icon: <DarkModeIcon />,
  },
  {
    title: m.colorScheme.featureSystem,
    description: m.colorScheme.featureSystemDescription,
    icon: <LightModeIcon />,
  },
  {
    title: m.colorScheme.featureState,
    description: m.colorScheme.featureStateDescription,
    icon: <ShieldCheckIcon />,
  },
  {
    title: m.colorScheme.featureHook,
    description: m.colorScheme.featureHookDescription,
    icon: <AtomIcon />,
  },
];

const EXAMPLE = `// routes/layout.tsx — Provider を body の中で全部に被せる。
// 先頭にインラインスクリプトを描くので、最初の描画から dark が付いている
import { ColorSchemeProvider } from '@k8ordo/color-scheme';

<html suppressHydrationWarning>
  <body>
    <ColorSchemeProvider>{children}</ColorSchemeProvider>
  </body>
</html>

// components/scheme-switcher.tsx
'use client';
import { useColorScheme } from '@k8ordo/color-scheme';

const { scheme, preference, setPreference } = useColorScheme();
setPreference(scheme === 'dark' ? 'light' : 'dark'); // 切り替える
setPreference('system'); // 保存行を消してシステムに追従する

// 訪問者が選ぶまでダークで始めたいなら、1 回だけ言う
<ColorSchemeProvider defaultPreference="dark">`;

export default function ColorSchemePage() {
  return (
    <PackageLanding
      description={m.colorScheme.description}
      directory="color-scheme"
      docsDescription={m.colorScheme.docsDescription}
      docsTitle={m.colorScheme.docsTitle}
      features={FEATURES}
      featuresTitle={m.colorScheme.featuresTitle}
      name="@k8ordo/color-scheme"
    >
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">
          <Rich>{m.colorScheme.demoTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <Rich>{m.colorScheme.demoDescription()}</Rich>
        </p>
        <div className="mt-6 max-w-2xl">
          <SchemeDemo />
        </div>
      </section>
      <PackageExample
        code={EXAMPLE}
        description={m.colorScheme.exampleDescription}
        title={m.colorScheme.exampleTitle}
      />
    </PackageLanding>
  );
}
