import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { PageTitle } from '../../../../../components/page-title';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

export default function GenerativeUi() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle title={m.nav.generativeUi} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <Rich>{m.nav.generativeUi()}</Rich>
        </Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.generativeUi.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.generativeUi.promptTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.generativeUi.promptDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { catalog, uiRules } from '@k8ordo/ui/json-render';

// Runs on the server. customRules injects constraints the model tends to break.
const systemPrompt = catalog.prompt({ customRules: [...uiRules] });`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.generativeUi.renderTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.generativeUi.renderDescription()}</Rich>
        </p>
        <CodeBlock
          code={`'use client';
import type { UISpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: UISpec }) {
  return <JsonRenderUI spec={spec} />;
}`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.generativeUi.validateTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.generativeUi.validateDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { validateGeneratedSpec } from '@k8ordo/ui/json-render';

const result = validateGeneratedSpec(JSON.parse(llmOutput));
if (result.ok) {
  return <JsonRenderUI spec={result.spec} />;
}
const retried = await llm(result.repairPrompt); // fix and retry`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.generativeUi.typedTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.generativeUi.typedDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import type { UISpec } from '@k8ordo/ui/json-render';

const spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { direction: 'column' }, children: ['ok'] },
    ok: { type: 'Button', props: { label: 'OK' } },
  },
} satisfies UISpec;`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.generativeUi.openuiTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.generativeUi.openuiDescription()}</Rich>
        </p>
        <CodeBlock
          code={`'use client';
import { library } from '@k8ordo/ui/openui';
import { Renderer } from '@openuidev/react-lang';

export function GenUi({ response }: { response: string }) {
  return <Renderer library={library} response={response} />;
}`}
          lang="tsx"
        />
        <CodeBlock
          code={`// Server-safe prompt generation (symmetric with catalog.prompt()).
import { prompt } from '@k8ordo/ui/openui/prompt';

const systemPrompt = prompt();`}
          lang="tsx"
        />
      </section>
    </div>
  );
}
