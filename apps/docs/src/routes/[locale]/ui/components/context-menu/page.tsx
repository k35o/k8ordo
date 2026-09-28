import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { ContextMenuPreview } from '../_previews/context-menu-previews';

const CODE = `<ContextMenu.Root>
  <ContextMenu.Trigger
    renderItem={(props) => (
      <div {...props} tabIndex={0}>
        report.pdf
      </div>
    )}
  />
  <ContextMenu.Content>
    <ContextMenu.Item label="Rename" onAction={rename} />
    <ContextMenu.SubMenu label="Move to">
      <ContextMenu.Item label="Archive" onAction={archive} />
      <ContextMenu.Item label="Drafts" onAction={toDrafts} />
    </ContextMenu.SubMenu>
    <ContextMenu.Item label="Delete" onAction={remove} />
  </ContextMenu.Content>
</ContextMenu.Root>`;

export default function ContextMenuPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="ContextMenu" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">ContextMenu</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.contextMenu.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-context-menu--opens-at-the-pointer`}
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
        <CodeBlock code="import { ContextMenu } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.usageTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.components.contextMenu.usageDescription()}</Rich>
        </p>
        <ComponentPreview code={CODE}>
          <ContextMenuPreview />
        </ComponentPreview>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">ContextMenu.Root</Heading>
        <PropsTable
          inherits={inheritsOf('ContextMenu.Root')}
          items={propsOf('ContextMenu.Root')}
        />
        <Heading level="h3">ContextMenu.Trigger</Heading>
        <PropsTable
          inherits={inheritsOf('ContextMenu.Trigger')}
          items={propsOf('ContextMenu.Trigger')}
        />
        <Heading level="h3">ContextMenu.Item</Heading>
        <PropsTable
          inherits={inheritsOf('ContextMenu.Item')}
          items={propsOf('ContextMenu.Item')}
        />
        <Heading level="h3">ContextMenu.SubMenu</Heading>
        <PropsTable
          inherits={inheritsOf('ContextMenu.SubMenu')}
          items={propsOf('ContextMenu.SubMenu')}
        />
      </section>
    </div>
  );
}
