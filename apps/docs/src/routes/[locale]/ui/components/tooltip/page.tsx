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
  TooltipBasicPreview,
  TooltipPlacementPreview,
} from '../_previews/tooltip-previews';

export default function TooltipPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Tooltip" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Tooltip</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.tooltip.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-tooltip--default`}
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
        <CodeBlock code="import { Tooltip } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Tooltip.Root placement="bottom-start">
  <Tooltip.Trigger
    renderItem={(props) => (
      <Button type="button" {...props}>
        Hover me
      </Button>
    )}
  />
  <Tooltip.Content>
    <p>Supplementary information</p>
  </Tooltip.Content>
</Tooltip.Root>`}
          >
            <TooltipBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.tooltip.placementTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Tooltip.Root placement="top">
  <Tooltip.Trigger
    renderItem={(props) => (
      <Button type="button" {...props}>Top</Button>
    )}
  />
  <Tooltip.Content>
    <p>Top tooltip</p>
  </Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root placement="right">
  <Tooltip.Trigger
    renderItem={(props) => (
      <Button type="button" {...props}>Right</Button>
    )}
  />
  <Tooltip.Content>
    <p>Right tooltip</p>
  </Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root placement="bottom">
  <Tooltip.Trigger
    renderItem={(props) => (
      <Button type="button" {...props}>Bottom</Button>
    )}
  />
  <Tooltip.Content>
    <p>Bottom tooltip</p>
  </Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root placement="left">
  <Tooltip.Trigger
    renderItem={(props) => (
      <Button type="button" {...props}>Left</Button>
    )}
  />
  <Tooltip.Content>
    <p>Left tooltip</p>
  </Tooltip.Content>
</Tooltip.Root>`}
          >
            <TooltipPlacementPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">Tooltip.Root</Heading>
        <PropsTable items={propsOf('Tooltip.Root')} />
        <Heading level="h3">Tooltip.Trigger</Heading>
        <PropsTable items={propsOf('Tooltip.Trigger')} />
        <Heading level="h3">Tooltip.Content</Heading>
        <PropsTable items={propsOf('Tooltip.Content')} />
      </section>
    </div>
  );
}
