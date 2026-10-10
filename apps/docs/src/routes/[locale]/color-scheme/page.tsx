import { CodeBlock } from '@k8ordo/ui/code-block';

import { LandingClaim, LandingHero } from '../../../components/landing';
import { Playground } from '../../../components/playground';
import { SchemeDemo } from '../../../demos/color-scheme/scheme-demo';
import * as m from '../../../messages';

const HERO_LAYOUT = `<html lang="ja" suppressHydrationWarning>
  <body>
    <ColorSchemeProvider>{children}</ColorSchemeProvider>
  </body>
</html>`;

const HERO_TOGGLE = `const { scheme, setPreference } = useColorScheme();

setPreference(scheme === 'dark' ? 'light' : 'dark');`;

const CLAIM_CSP_NONCE = `<ColorSchemeProvider nonce={nonce()}>
  {children}
</ColorSchemeProvider>`;

const CLAIM_CSP_HASH = `const scriptSrc = ["'self'", await colorSchemeScriptHash()];`;

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
              title="src/routes/layout.tsx"
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
            code={CLAIM_CSP_NONCE}
            lang="tsx"
            title="src/routes/layout.tsx"
          />
          <CodeBlock code={CLAIM_CSP_HASH} lang="ts" title="csp.ts" />
        </div>
      </LandingClaim>
      <LandingClaim
        body={m.colorScheme.claimStorageBody}
        title={m.colorScheme.claimStorageTitle}
      >
        <CodeBlock code={CLAIM_STORAGE} lang="tsx" title="preference.tsx" />
      </LandingClaim>
    </div>
  );
}
