import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  PopoverBasicPreview,
  PopoverPlacementPreview,
} from '../_previews/popover-previews';

export default function PopoverPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Popover" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Popover</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.popover.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-popover--default`}
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
        <CodeBlock code="import { Popover } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
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
        <div role="menuitem">Popover content goes here.</div>
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
            <Rich>{m.components.popover.placementTitle()}</Rich>
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
        <div role="menuitem">Top placement</div>
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
        <div role="menuitem">Right placement</div>
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
        <div role="menuitem">Bottom placement</div>
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
        <div role="menuitem">Left placement</div>
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
          <Rich>{m.components.common.propsTitle()}</Rich>
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
