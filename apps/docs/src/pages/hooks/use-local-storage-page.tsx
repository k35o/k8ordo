import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import {
  UseLocalStorageBasicPreview,
  UseLocalStorageRemovePreview,
} from './_previews/use-local-storage-previews';

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

export function UseLocalStoragePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useLocalStorage</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useLocalStorage.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useLocalStorage } from '@k8ordo/ui';"
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
            code={`const [value, setValue] = useLocalStorage('demo-count', 0);

return (
  <div>
    <span>Count: {value}</span>
    <button onClick={() => setValue(value + 1)}>
      Increment
    </button>
  </div>
);`}
          >
            <UseLocalStorageBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="hooks.useLocalStorage.removeTitle" />
          </Heading>
          <ComponentPreview
            code={`const [value, setValue, handleRemove] = useLocalStorage(
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
            <UseLocalStorageRemovePreview />
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
