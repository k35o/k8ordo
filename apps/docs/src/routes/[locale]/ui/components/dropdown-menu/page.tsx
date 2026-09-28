import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  DropdownMenuBasicPreview,
  DropdownMenuIconTriggerPreview,
  DropdownMenuPlacementPreview,
  DropdownMenuSizesPreview,
} from '../_previews/dropdown-menu-previews';

export default function DropdownMenuPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="DropdownMenu" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">DropdownMenu</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.dropdownMenu.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-dropdown-menu--default`}
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
          code="import { DropdownMenu } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<DropdownMenu.Root>
  <DropdownMenu.Trigger label="Actions" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Edit" onAction={() => {}} />
    <DropdownMenu.Item label="Duplicate" onAction={() => {}} />
    <DropdownMenu.Item label="Delete" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>`}
          >
            <DropdownMenuBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dropdownMenu.iconTriggerTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`import { DarkModeIcon } from '@k8ordo/ui';

<DropdownMenu.Root>
  <DropdownMenu.IconTrigger
    icon={<DarkModeIcon size="lg" />}
    label="Theme"
  />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Light" onAction={() => {}} />
    <DropdownMenu.Item label="Dark" onAction={() => {}} />
    <DropdownMenu.Item label="System" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>`}
          >
            <DropdownMenuIconTriggerPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dropdownMenu.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<DropdownMenu.Root>
  <DropdownMenu.Trigger label="Small" size="sm" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Edit" onAction={() => {}} />
    <DropdownMenu.Item label="Delete" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>

<DropdownMenu.Root>
  <DropdownMenu.Trigger label="Medium" size="md" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Edit" onAction={() => {}} />
    <DropdownMenu.Item label="Delete" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>

<DropdownMenu.Root>
  <DropdownMenu.Trigger label="Large" size="lg" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Edit" onAction={() => {}} />
    <DropdownMenu.Item label="Delete" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>`}
          >
            <DropdownMenuSizesPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dropdownMenu.placementTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<DropdownMenu.Root placement="bottom-start">
  <DropdownMenu.Trigger label="Bottom Start" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Edit" onAction={() => {}} />
    <DropdownMenu.Item label="Delete" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>

<DropdownMenu.Root placement="bottom-end">
  <DropdownMenu.Trigger label="Bottom End" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Edit" onAction={() => {}} />
    <DropdownMenu.Item label="Delete" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>

<DropdownMenu.Root placement="top-start">
  <DropdownMenu.Trigger label="Top Start" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Edit" onAction={() => {}} />
    <DropdownMenu.Item label="Delete" onAction={() => {}} />
  </DropdownMenu.Content>
</DropdownMenu.Root>`}
          >
            <DropdownMenuPlacementPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">DropdownMenu.Root</Heading>
        <PropsTable items={propsOf('DropdownMenu.Root')} />
        <Heading level="h3">DropdownMenu.Trigger</Heading>
        <PropsTable items={propsOf('DropdownMenu.Trigger')} />
        <Heading level="h3">DropdownMenu.IconTrigger</Heading>
        <PropsTable items={propsOf('DropdownMenu.IconTrigger')} />
        <Heading level="h3">DropdownMenu.Content</Heading>
        <PropsTable items={propsOf('DropdownMenu.Content')} />
        <Heading level="h3">DropdownMenu.Item</Heading>
        <PropsTable items={propsOf('DropdownMenu.Item')} />
        <Heading level="h3">DropdownMenu.SubMenu</Heading>
        <PropsTable items={propsOf('DropdownMenu.SubMenu')} />
      </section>
    </div>
  );
}
