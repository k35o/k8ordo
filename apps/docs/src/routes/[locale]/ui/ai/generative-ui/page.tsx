import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { T } from '../../../../../components/t';

export default function GenerativeUi() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <T k="nav.generativeUi" />
        </Heading>
        <p className="text-fg-mute text-lg">
          <T k="generativeUi.introduction" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="generativeUi.promptTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="generativeUi.promptDescription" />
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
          <T k="generativeUi.renderTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="generativeUi.renderDescription" />
        </p>
        <CodeBlock
          code={`'use client';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: unknown }) {
  return <JsonRenderUI spec={spec} />;
}`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="generativeUi.validateTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="generativeUi.validateDescription" />
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
          <T k="generativeUi.typedTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="generativeUi.typedDescription" />
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
          <T k="generativeUi.openuiTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="generativeUi.openuiDescription" />
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
