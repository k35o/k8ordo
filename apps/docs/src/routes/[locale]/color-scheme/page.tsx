import { CodeBlock } from '@k8ordo/ui/code-block';

import {
  LandingClaim,
  LandingHero,
  NextSteps,
} from '../../../components/landing';
import { Playground } from '../../../components/playground';
import * as m from '../../../messages';
import { SchemeDemo } from './_parts/scheme-demo';

const HERO_LAYOUT = `<html lang="ja" suppressHydrationWarning>
  <body>
    <ColorSchemeProvider>{children}</ColorSchemeProvider>
  </body>
</html>`;

const HERO_TOGGLE = `const { scheme, setPreference } = useColorScheme();

setPreference(scheme === 'dark' ? 'light' : 'dark');`;

const CLAIM_CSP_SERVER = `<ColorSchemeProvider nonce={nonce()}>
  {children}
</ColorSchemeProvider>`;

const CLAIM_CSP_STATIC = `framework({
  csp: {
    'script-src': ["'self'", await colorSchemeScriptHash()],
  },
});`;

const CLAIM_STORAGE = `colorSchemeState.storageKey;
// 'k8ordo-state:color-scheme'

localStorage.getItem(colorSchemeState.storageKey);
// '{"preference":"dark"}'

const [{ preference }] = useAppState(colorSchemeState);`;

export default function ColorSchemePage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock
              code={HERO_LAYOUT}
              lang="tsx"
              title="routes/layout.tsx"
            />
            <CodeBlock code={HERO_TOGGLE} lang="tsx" title="theme-toggle.tsx" />
          </>
        }
        directory="color-scheme"
        install="@k8ordo/color-scheme @k8ordo/state zod"
        name="@k8ordo/color-scheme"
        tagline={m.colorScheme.tagline}
      />
      <LandingClaim
        body={m.colorScheme.claimNoFlashBody}
        title={m.colorScheme.claimNoFlashTitle}
      >
        <Playground
          description={m.colorScheme.demoDescription}
          id="demo"
          steps={m.colorScheme.demoSteps}
          title={m.colorScheme.demoTitle}
        >
          <SchemeDemo />
        </Playground>
      </LandingClaim>
      <LandingClaim
        body={m.colorScheme.claimCspBody}
        title={m.colorScheme.claimCspTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock
            code={CLAIM_CSP_SERVER}
            lang="tsx"
            title="routes/layout.tsx"
          />
          <CodeBlock code={CLAIM_CSP_STATIC} lang="ts" title="vite.config.ts" />
        </div>
      </LandingClaim>
      <LandingClaim
        body={m.colorScheme.claimStorageBody}
        title={m.colorScheme.claimStorageTitle}
      >
        <CodeBlock code={CLAIM_STORAGE} lang="tsx" title="preference.tsx" />
      </LandingClaim>
      <NextSteps
        name="@k8ordo/color-scheme"
        steps={[
          {
            path: '/:locale/color-scheme/get-started',
            label: m.nav.getStarted,
            description: m.colorScheme.nextGetStarted,
          },
          {
            path: '/:locale/color-scheme/styling',
            label: m.colorScheme.navStyling,
            description: m.colorScheme.nextStyling,
          },
          {
            path: '/:locale/color-scheme/switcher',
            label: m.colorScheme.navSwitcher,
            description: m.colorScheme.nextSwitcher,
          },
          {
            path: '/:locale/color-scheme/storage',
            label: m.colorScheme.navStorage,
            description: m.colorScheme.nextStorage,
          },
          {
            path: '/:locale/color-scheme/csp',
            label: m.colorScheme.navCsp,
            description: m.colorScheme.nextCsp,
          },
          {
            path: '/:locale/color-scheme/how-it-works',
            label: m.colorScheme.navHowItWorks,
            description: m.colorScheme.nextHowItWorks,
          },
        ]}
      />
    </div>
  );
}
