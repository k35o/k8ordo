import { CodeBlock } from '@k8ordo/ui/code-block';

import {
  LandingClaim,
  LandingHero,
  NextSteps,
} from '../../../components/landing';
import { Playground } from '../../../components/playground';
import { OverlayDemo } from '../../../demos/ui/overlay-demo';
import { VerticalDemo } from '../../../demos/ui/vertical-demo';
import * as m from '../../../messages';

const HERO_STYLES = `import '@k8ordo/ui/styles.css';`;

const HERO_FORM = `<FormControl
  label="Email"
  renderInput={(props) => (
    <TextField {...props} type="email" />
  )}
/>
<Button type="submit" variant="solid">
  Subscribe
</Button>`;

const CLAIM_GENERATIVE = `const systemPrompt = catalog.prompt({
  customRules: [...uiRules],
});

const result = validateGeneratedSpec(JSON.parse(llmOutput));
if (result.ok) return <JsonRenderUI spec={result.spec} />;`;

export default function UiPage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock code={HERO_STYLES} lang="tsx" title="main.tsx" />
            <CodeBlock code={HERO_FORM} lang="tsx" title="subscribe-form.tsx" />
          </>
        }
        directory="ui"
        install="@k8ordo/ui @k8ordo/i18n"
        name="@k8ordo/ui"
        tagline={m.ui.tagline}
      />
      <LandingClaim
        body={m.ui.claimPlatformBody}
        title={m.ui.claimPlatformTitle}
      >
        <Playground
          description={m.ui.demoOverlayDescription}
          id="overlays"
          steps={m.ui.demoOverlaySteps}
          title={m.ui.demoOverlayTitle}
        >
          <OverlayDemo />
        </Playground>
      </LandingClaim>
      <LandingClaim
        body={m.ui.claimVerticalBody}
        title={m.ui.claimVerticalTitle}
      >
        <Playground
          description={m.ui.demoVerticalDescription}
          id="vertical"
          title={m.ui.demoVerticalTitle}
        >
          <VerticalDemo />
        </Playground>
      </LandingClaim>
      <LandingClaim body={m.ui.claimAgentsBody} title={m.ui.claimAgentsTitle}>
        <CodeBlock code={CLAIM_GENERATIVE} lang="tsx" title="gen-ui.tsx" />
      </LandingClaim>
      <NextSteps
        name="@k8ordo/ui"
        steps={[
          {
            path: '/:locale/ui/get-started',
            label: m.nav.getStarted,
            description: m.ui.nextGetStarted,
          },
          {
            path: '/:locale/ui/components',
            label: m.nav.components,
            description: m.ui.nextComponents,
          },
          {
            path: '/:locale/ui/theming',
            label: m.nav.theming,
            description: m.ui.nextTheming,
          },
          {
            path: '/:locale/ui/i18n',
            label: m.nav.i18n,
            description: m.ui.nextI18n,
          },
          {
            path: '/:locale/ui/ai',
            label: m.nav.ai,
            description: m.ui.nextAi,
          },
        ]}
      />
    </div>
  );
}
