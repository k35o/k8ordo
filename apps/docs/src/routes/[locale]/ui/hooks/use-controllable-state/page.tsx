import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { UseControllableStatePreview } from '../_previews/use-controllable-state-previews';

const parameters: PropItem[] = [
  {
    name: 'value',
    types: ['T | undefined'],
    defaultValue: 'undefined',
  },
  {
    name: 'defaultValue',
    types: ['T'],
    defaultValue: null,
  },
  {
    name: 'onChange',
    types: ['(value: T) => void'],
    defaultValue: 'undefined',
  },
];

const returnValue: PropItem[] = [
  {
    name: '[0]',
    types: ['T'],
    defaultValue: null,
  },
  {
    name: '[1]',
    types: ['(next: T | ((prev: T) => T)) => void'],
    defaultValue: null,
  },
];

export default function UseControllableStatePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useControllableState</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useControllableState.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useControllableState } from '@k8ordo/ui';"
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
            code={`const [count, setCount] = useControllableState({ defaultValue: 0 });

return (
  <div>
    <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
    <button onClick={() => setCount(0)}>Reset</button>
    <p>Count: {count}</p>
  </div>
);`}
          >
            <UseControllableStatePreview />
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
