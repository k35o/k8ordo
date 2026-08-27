import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { propsOf } from '../../data/component-props';
import {
  PopoverBasicPreview,
  PopoverPlacementPreview,
} from './_previews/popover-previews';

export function PopoverPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Popover</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.popover.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-popover--docs`}
            openInNewTab
          >
            <T k="components.common.storybookLink" />
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.importTitle" />
        </Heading>
        <CodeBlock code="import { Popover } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<Popover.Root>
  <Popover.Trigger
    renderItem={(props) => (
      <Button {...props} type="button">
        Open Popover
      </Button>
    )}
  />
  <Popover.Content
    renderItem={(props) => (
      <div
        className="rounded-lg bg-bg-raised p-4 shadow-md"
        {...props}
      >
        <p>Popover content goes here.</p>
      </div>
    )}
  />
</Popover.Root>`}
          >
            <PopoverBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.popover.placementTitle" />
          </Heading>
          <ComponentPreview
            code={`<Popover.Root placement="top">
  <Popover.Trigger
    renderItem={(props) => (
      <Button {...props} type="button">Top</Button>
    )}
  />
  <Popover.Content
    renderItem={(props) => (
      <div className="rounded-lg bg-bg-raised p-4 shadow-md" {...props}>
        <p>Top placement</p>
      </div>
    )}
  />
</Popover.Root>

<Popover.Root placement="right">
  <Popover.Trigger
    renderItem={(props) => (
      <Button {...props} type="button">Right</Button>
    )}
  />
  <Popover.Content
    renderItem={(props) => (
      <div className="rounded-lg bg-bg-raised p-4 shadow-md" {...props}>
        <p>Right placement</p>
      </div>
    )}
  />
</Popover.Root>

<Popover.Root placement="bottom">
  <Popover.Trigger
    renderItem={(props) => (
      <Button {...props} type="button">Bottom</Button>
    )}
  />
  <Popover.Content
    renderItem={(props) => (
      <div className="rounded-lg bg-bg-raised p-4 shadow-md" {...props}>
        <p>Bottom placement</p>
      </div>
    )}
  />
</Popover.Root>

<Popover.Root placement="left">
  <Popover.Trigger
    renderItem={(props) => (
      <Button {...props} type="button">Left</Button>
    )}
  />
  <Popover.Content
    renderItem={(props) => (
      <div className="rounded-lg bg-bg-raised p-4 shadow-md" {...props}>
        <p>Left placement</p>
      </div>
    )}
  />
</Popover.Root>`}
          >
            <PopoverPlacementPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <Heading level="h3">Popover.Root</Heading>
        <PropsTable items={propsOf('Popover.Root')} />
        <Heading level="h3">Popover.Trigger</Heading>
        <PropsTable items={propsOf('Popover.Trigger')} />
        <Heading level="h3">Popover.Content</Heading>
        <PropsTable items={propsOf('Popover.Content')} />
      </section>
    </div>
  );
}
