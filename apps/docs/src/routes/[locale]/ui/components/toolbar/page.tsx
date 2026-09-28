import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { ToolbarPreview } from '../_previews/toolbar-previews';

const CODE = `<Toolbar.Root aria-label="Formatting">
  <Toolbar.Item
    renderItem={(props) => (
      <IconButton {...props} label="Copy">
        <CopyIcon size="sm" />
      </IconButton>
    )}
  />
  <Toolbar.Item
    renderItem={(props) => (
      <IconButton
        {...props}
        aria-pressed={isList}
        label="Bulleted list"
        onClick={toggleList}
      >
        <ListIcon size="sm" />
      </IconButton>
    )}
  />
  <Toolbar.Separator />
  <Toolbar.Item
    renderItem={(props) => (
      <Button {...props} size="sm">
        Save
      </Button>
    )}
  />
</Toolbar.Root>`;

export default function ToolbarPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Toolbar" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Toolbar</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.toolbar.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-buttons-toolbar--default`}
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
        <CodeBlock code="import { Toolbar } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.toolbar.keyboardDescription()}</Rich>
          </p>
          <ComponentPreview code={CODE}>
            <ToolbarPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.toolbar.toggleTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.toolbar.toggleDescription()}</Rich>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.toolbar.verticalTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Toolbar.Root aria-label="Formatting" orientation="vertical">
  {/* … */}
</Toolbar.Root>`}
          >
            <ToolbarPreview orientation="vertical" />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">Toolbar.Root</Heading>
        <PropsTable
          inherits={inheritsOf('Toolbar.Root')}
          items={propsOf('Toolbar.Root')}
        />
        <Heading level="h3">Toolbar.Item</Heading>
        <PropsTable
          inherits={inheritsOf('Toolbar.Item')}
          items={propsOf('Toolbar.Item')}
        />
      </section>
    </div>
  );
}
