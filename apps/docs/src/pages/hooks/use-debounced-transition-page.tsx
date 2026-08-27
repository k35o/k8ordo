import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { UseDebouncedTransitionPreview } from './_previews/use-debounced-transition-previews';

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

export function UseDebouncedTransitionPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useDebouncedTransition</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useDebouncedTransition.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useDebouncedTransition } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <T k="hooks.common.usageTitle" />
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="hooks.common.basicUsageTitle" />
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
          <T k="hooks.common.parametersTitle" />
        </Heading>
        <PropsTable items={parameters} />
      </section>
      <Separator color="mute" />
      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.returnValueTitle" />
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
