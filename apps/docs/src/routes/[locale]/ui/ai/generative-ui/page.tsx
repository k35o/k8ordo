import { Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { PageTitle } from '../../../../../components/page-title';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

export default function GenerativeUi() {
  return (
    <div className="flex flex-col gap-8 py-12">
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

const systemPrompt = catalog.prompt({ customRules: [...uiRules] });`}
          lang="ts"
          title="system-prompt.ts"
        />
        <p className="text-fg-mute">
          <Rich>{m.generativeUi.promptLanguage()}</Rich>
        </p>
        <CodeBlock
          code={`const systemPrompt = catalog.prompt({
  customRules: [...uiRules, 'Write all UI text in Japanese.'],
});`}
          lang="ts"
          marks={{ 2: 'highlight' }}
          title="system-prompt.ts"
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
          title="gen-ui.tsx"
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
const retried = await llm(result.repairPrompt);`}
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
          title="gen-ui.tsx"
        />
        <p className="text-fg-mute">
          <Rich>{m.generativeUi.openuiPrompt()}</Rich>
        </p>
        <CodeBlock
          code={`import { prompt } from '@k8ordo/ui/openui/prompt';

const systemPrompt = prompt();`}
          lang="ts"
          title="system-prompt.ts"
        />
      </section>
    </div>
  );
}
