import { Anchor, Heading, ResizablePanels, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { ResizablePanelsControlledPreview } from '../_previews/resizable-panels-previews';

const FRAME =
  'border-border-base h-48 w-full overflow-hidden rounded-lg border';

export default function ResizablePanelsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="ResizablePanels" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">ResizablePanels</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.resizablePanels.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-layout-resizable-panels--default`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { ResizablePanels } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.resizablePanels.usageDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<div className="h-48">
  <ResizablePanels.Root defaultValue={30}>
    <ResizablePanels.Panel>Sidebar</ResizablePanels.Panel>
    <ResizablePanels.Handle />
    <ResizablePanels.Panel>Content</ResizablePanels.Panel>
  </ResizablePanels.Root>
</div>`}
          >
            <div className={FRAME}>
              <ResizablePanels.Root defaultValue={30}>
                <ResizablePanels.Panel>
                  <p className="p-4 text-sm">Sidebar</p>
                </ResizablePanels.Panel>
                <ResizablePanels.Handle />
                <ResizablePanels.Panel>
                  <p className="p-4 text-sm">Content</p>
                </ResizablePanels.Panel>
              </ResizablePanels.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.resizablePanels.verticalTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.resizablePanels.verticalDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<div className="h-48">
  <ResizablePanels.Root orientation="vertical">
    <ResizablePanels.Panel>Editor</ResizablePanels.Panel>
    <ResizablePanels.Handle />
    <ResizablePanels.Panel>Terminal</ResizablePanels.Panel>
  </ResizablePanels.Root>
</div>`}
          >
            <div className={FRAME}>
              <ResizablePanels.Root orientation="vertical">
                <ResizablePanels.Panel>
                  <p className="p-4 text-sm">Editor</p>
                </ResizablePanels.Panel>
                <ResizablePanels.Handle />
                <ResizablePanels.Panel>
                  <p className="p-4 text-sm">Terminal</p>
                </ResizablePanels.Panel>
              </ResizablePanels.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.resizablePanels.labelTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.resizablePanels.labelDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<ResizablePanels.Root defaultValue={30}>
  <ResizablePanels.Panel>
    <h2 id="files-heading">Files</h2>
  </ResizablePanels.Panel>
  <ResizablePanels.Handle aria-labelledby="files-heading" />
  <ResizablePanels.Panel>Preview</ResizablePanels.Panel>
</ResizablePanels.Root>`}
          >
            <div className={FRAME}>
              <ResizablePanels.Root defaultValue={30}>
                <ResizablePanels.Panel>
                  <p className="p-4 font-bold" id="resizable-panels-files">
                    Files
                  </p>
                </ResizablePanels.Panel>
                <ResizablePanels.Handle aria-labelledby="resizable-panels-files" />
                <ResizablePanels.Panel>
                  <p className="p-4 text-sm">Preview</p>
                </ResizablePanels.Panel>
              </ResizablePanels.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.resizablePanels.controlledTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.resizablePanels.controlledDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`const [size, setSize] = useState(30);

<ResizablePanels.Root onChange={setSize} value={size}>
  …
</ResizablePanels.Root>`}
          >
            <ResizablePanelsControlledPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">ResizablePanels.Root</Heading>
        <PropsTable
          inherits={inheritsOf('ResizablePanels.Root')}
          items={propsOf('ResizablePanels.Root')}
        />
        <Heading level="h3">ResizablePanels.Panel</Heading>
        <PropsTable
          inherits={inheritsOf('ResizablePanels.Panel')}
          items={propsOf('ResizablePanels.Panel')}
        />
        <Heading level="h3">ResizablePanels.Handle</Heading>
        <PropsTable
          inherits={inheritsOf('ResizablePanels.Handle')}
          items={propsOf('ResizablePanels.Handle')}
          messagesNote
        />
      </section>
    </div>
  );
}
