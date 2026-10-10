import { Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../../components/callout';
import {
  InstallCommand,
  peerSeriesOf,
} from '../../../../../components/install';
import { PageTitle } from '../../../../../components/page-title';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

const t = m.generativeUi;

const PROMPT = `import { catalog, uiRules } from '@k8ordo/ui/json-render';

const systemPrompt = catalog.prompt({ customRules: [...uiRules] });`;

const PROMPT_LANGUAGE = `const systemPrompt = catalog.prompt({
  customRules: [...uiRules, 'Write all UI text in Japanese.'],
});`;

const RENDER = `'use client';
import type { UISpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: UISpec }) {
  return (
    <JsonRenderUI
      spec={spec}
      onStateChange={(changes) => console.log(changes)}
    />
  );
}`;

const VALIDATE = `import { validateGeneratedSpec } from '@k8ordo/ui/json-render';

async function toSpec(
  output: string,
  ask: (prompt: string) => Promise<string>,
) {
  const result = validateGeneratedSpec(JSON.parse(output));
  if (result.ok) return result.spec;
  const retried = validateGeneratedSpec(
    JSON.parse(await ask(result.repairPrompt)),
  );
  return retried.ok ? retried.spec : null;
}`;

const TYPED = `import type { UISpec } from '@k8ordo/ui/json-render';

const spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { direction: 'column' }, children: ['ok'] },
    ok: { type: 'Button', props: { label: 'OK' } },
  },
} satisfies UISpec;`;

const OPENUI_RENDER = `'use client';
import { library } from '@k8ordo/ui/openui';
import { Renderer } from '@openuidev/react-lang';

export function GenUi({ response }: { response: string }) {
  return <Renderer library={library} response={response} />;
}`;

const OPENUI_PROMPT = `import { prompt } from '@k8ordo/ui/openui/prompt';

const systemPrompt = prompt();`;

export default function GenerativeUi() {
  return (
    <div className="flex flex-col gap-8 py-12">
      <PageTitle title={m.nav.generativeUi} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <Rich>{m.nav.generativeUi()}</Rich>
        </Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{t.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.installTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{t.installDescription()}</Rich>
        </p>
        <Heading level="h3">json-render</Heading>
        <InstallCommand packages="@json-render/core @json-render/react zod" />
        <Heading level="h3">OpenUI</Heading>
        <InstallCommand packages="@openuidev/react-lang @openuidev/lang-core zod" />
        <p className="text-fg-mute">
          <Rich>
            {t.installSeries(
              peerSeriesOf('@k8ordo/ui', '@json-render/core'),
              peerSeriesOf('@k8ordo/ui', '@openuidev/lang-core'),
            )}
          </Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.installOneCopy()}</Rich>
          </p>
        </Pitfall>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.promptTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={PROMPT}
          lang="ts"
          marks={{ 3: 'highlight' }}
          title="system-prompt.ts"
        />
        <p className="text-fg-mute">
          <Rich>{t.promptServer()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.promptRules()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 2: t.promptLanguageCallout() }}
          code={PROMPT_LANGUAGE}
          lang="ts"
          marks={{ 2: 'highlight' }}
          title="system-prompt.ts"
        />
        <p className="text-fg-mute">
          <Rich>{t.promptLanguage()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.renderTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={RENDER}
          lang="tsx"
          marks={{ 8: 'highlight', 9: 'highlight' }}
          title="gen-ui.tsx"
        />
        <p className="text-fg-mute">
          <Rich>{t.renderDescription()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.renderStateChange()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.validateTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={VALIDATE}
          lang="ts"
          marks={{ 7: 'highlight', 10: 'highlight' }}
        />
        <p className="text-fg-mute">
          <Rich>{t.validateDescription()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.validateRepair()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.typedTitle()}</Rich>
        </Heading>
        <CodeBlock code={TYPED} lang="tsx" marks={{ 9: 'highlight' }} />
        <p className="text-fg-mute">
          <Rich>{t.typedDescription()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.openuiTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={OPENUI_RENDER}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="gen-ui.tsx"
        />
        <p className="text-fg-mute">
          <Rich>{t.openuiDescription()}</Rich>
        </p>
        <CodeBlock
          code={OPENUI_PROMPT}
          lang="ts"
          marks={{ 3: 'highlight' }}
          title="system-prompt.ts"
        />
        <p className="text-fg-mute">
          <Rich>{t.openuiPrompt()}</Rich>
        </p>
      </section>
    </div>
  );
}
