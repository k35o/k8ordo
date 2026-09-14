import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { UseDisclosurePreview } from '../_previews/use-disclosure-previews';

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

export default function UseDisclosurePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useDisclosure" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useDisclosure</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.disclosure.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useDisclosure } from '@k8ordo/ui';"
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
