import { Anchor, Heading, ResizablePanels, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { ResizablePanelsControlledPreview } from '../../../../../demos/ui/components/resizable-panels-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/resizable-panels.module.css';

export default function ResizablePanelsPage() {
  return (
    <div className={page.page}>
      <PageTitle name="ResizablePanels" />
      <div className={page.stack}>
        <Heading level="h1">ResizablePanels</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { ResizablePanels } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.resizablePanels.usageDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<div className={styles.frame}>
  <ResizablePanels.Root defaultValue={30}>
    <ResizablePanels.Panel>Sidebar</ResizablePanels.Panel>
    <ResizablePanels.Handle />
    <ResizablePanels.Panel>Content</ResizablePanels.Panel>
  </ResizablePanels.Root>
</div>`}
          >
            <div className={styles.frame}>
              <ResizablePanels.Root defaultValue={30}>
                <ResizablePanels.Panel>
                  <p className={styles.panelText}>Sidebar</p>
                </ResizablePanels.Panel>
                <ResizablePanels.Handle />
                <ResizablePanels.Panel>
                  <p className={styles.panelText}>Content</p>
                </ResizablePanels.Panel>
              </ResizablePanels.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.resizablePanels.verticalTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.resizablePanels.verticalDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<div className={styles.frame}>
  <ResizablePanels.Root orientation="vertical">
    <ResizablePanels.Panel>Editor</ResizablePanels.Panel>
    <ResizablePanels.Handle />
    <ResizablePanels.Panel>Terminal</ResizablePanels.Panel>
  </ResizablePanels.Root>
</div>`}
          >
            <div className={styles.frame}>
              <ResizablePanels.Root orientation="vertical">
                <ResizablePanels.Panel>
                  <p className={styles.panelText}>Editor</p>
                </ResizablePanels.Panel>
                <ResizablePanels.Handle />
                <ResizablePanels.Panel>
                  <p className={styles.panelText}>Terminal</p>
                </ResizablePanels.Panel>
              </ResizablePanels.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.resizablePanels.labelTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
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
            <div className={styles.frame}>
              <ResizablePanels.Root defaultValue={30}>
                <ResizablePanels.Panel>
                  <p className={styles.panelTitle} id="resizable-panels-files">
                    Files
                  </p>
                </ResizablePanels.Panel>
                <ResizablePanels.Handle aria-labelledby="resizable-panels-files" />
                <ResizablePanels.Panel>
                  <p className={styles.panelText}>Preview</p>
                </ResizablePanels.Panel>
              </ResizablePanels.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.resizablePanels.controlledTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
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

      <section className={page.stack}>
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
