import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { UseDebouncedTransitionPreview } from '../_previews/use-debounced-transition-previews';

const parameters: PropItem[] = [
  {
    name: 'delay',
    types: ['number'],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: '[boolean, (action) => void]',
    types: [
      'readonly [isPending: boolean, run: (action: (signal: AbortSignal) => void | Promise<void>) => void]',
    ],
    defaultValue: null,
  },
];

export default function UseDebouncedTransitionPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useDebouncedTransition" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useDebouncedTransition</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.debouncedTransition.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useDebouncedTransition } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <Rich>{m.hooks.common.usageTitle()}</Rich>
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.hooks.common.basicUsageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [query, setQuery] = useState('');
const [result, setResult] = useState('');
const [isPending, run] = useDebouncedTransition(500);

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const next = e.target.value;
  setQuery(next);
  run(async (signal) => {
    await sleep(800, signal);
    setResult(\`Results for "\${next}"\`);
  });
};

return (
  <>
    <TextField value={query} onChange={handleChange} />
    <p aria-busy={isPending}>{isPending ? 'Loading…' : result}</p>
  </>
);`}
          >
            <UseDebouncedTransitionPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.parametersTitle()}</Rich>
        </Heading>
        <PropsTable items={parameters} />
      </section>
      <Separator color="mute" />
      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.returnValueTitle()}</Rich>
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
