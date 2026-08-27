import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import {
  UseSessionStorageBasicPreview,
  UseSessionStorageRemovePreview,
} from './_previews/use-session-storage-previews';

const parameters: PropItem[] = [
  {
    name: 'key',
    types: ['string'],
    defaultValue: null,
  },
  {
    name: 'initialValue',
    types: ['T'],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: 'current',
    types: ['T'],
    defaultValue: null,
  },
  {
    name: 'setState',
    types: ['(value: T) => void'],
    defaultValue: null,
  },
  {
    name: 'handleRemove',
    types: ['() => void'],
    defaultValue: null,
  },
];

export function UseSessionStoragePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useSessionStorage</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useSessionStorage.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useSessionStorage } from '@k8ordo/ui';"
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
            code={`const [value, setValue] = useSessionStorage('demo-count', 0);

return (
  <div>
    <span>Count: {value}</span>
    <button onClick={() => setValue(value + 1)}>
      Increment
    </button>
  </div>
);`}
          >
            <UseSessionStorageBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="hooks.useSessionStorage.removeTitle" />
          </Heading>
          <ComponentPreview
            code={`const [value, setValue, handleRemove] = useSessionStorage(
  'demo-name',
  'k8ordo UI',
);

return (
  <div>
    <span>Value: {value}</span>
    <button onClick={() => setValue('Updated!')}>Update</button>
    <button onClick={handleRemove}>Remove</button>
  </div>
);`}
          >
            <UseSessionStorageRemovePreview />
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
