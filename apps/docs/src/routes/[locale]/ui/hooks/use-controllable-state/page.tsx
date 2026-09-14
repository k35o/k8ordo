import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
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
      <PageTitle name="useControllableState" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useControllableState</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.controllableState.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useControllableState } from '@k8ordo/ui';"
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
