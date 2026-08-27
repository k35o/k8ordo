import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { UseDisclosurePreview } from './_previews/use-disclosure-previews';

const parameters: PropItem[] = [
  {
    name: 'defaultOpen',
    types: ['boolean'],
    defaultValue: 'false',
  },
];

const returnValue: PropItem[] = [
  {
    name: 'isOpen',
    types: ['boolean'],
    defaultValue: null,
  },
  {
    name: 'open',
    types: ['() => void'],
    defaultValue: null,
  },
  {
    name: 'close',
    types: ['() => void'],
    defaultValue: null,
  },
  {
    name: 'toggle',
    types: ['() => void'],
    defaultValue: null,
  },
];

export function UseDisclosurePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useDisclosure</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useDisclosure.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useDisclosure } from '@k8ordo/ui';"
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
            code={`const { isOpen, open, close, toggle } = useDisclosure();

return (
  <div>
    <button onClick={toggle}>Toggle</button>
    <button onClick={open}>Open</button>
    <button onClick={close}>Close</button>
    {isOpen && <p>Content is visible</p>}
  </div>
);`}
          >
            <UseDisclosurePreview />
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
