import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import {
  TabsBasicPreview,
  TabsDefaultSelectedPreview,
} from '../_previews/tabs-previews';

export default function TabsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Tabs</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.tabs.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-tabs--docs`}
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
        <CodeBlock code="import { Tabs } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<Tabs.Root ids={['overview', 'settings', 'history']}>
  <Tabs.List label="Navigation">
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
    <Tabs.Tab id="history">History</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="overview">
    <p>Overview content goes here.</p>
  </Tabs.Panel>
  <Tabs.Panel id="settings">
    <p>Settings content goes here.</p>
  </Tabs.Panel>
  <Tabs.Panel id="history">
    <p>History content goes here.</p>
  </Tabs.Panel>
</Tabs.Root>`}
          >
            <TabsBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.tabs.defaultSelectedTitle" />
          </Heading>
          <ComponentPreview
            code={`<Tabs.Root
  defaultSelectedId="settings"
  ids={['overview', 'settings', 'history']}
>
  <Tabs.List label="Navigation">
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
    <Tabs.Tab id="history">History</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="overview">
    <p>Overview content goes here.</p>
  </Tabs.Panel>
  <Tabs.Panel id="settings">
    <p>Settings content goes here.</p>
  </Tabs.Panel>
  <Tabs.Panel id="history">
    <p>History content goes here.</p>
  </Tabs.Panel>
</Tabs.Root>`}
          >
            <TabsDefaultSelectedPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <Heading level="h3">Tabs.Root</Heading>
        <PropsTable items={propsOf('Tabs.Root')} />
        <Heading level="h3">Tabs.List</Heading>
        <PropsTable items={propsOf('Tabs.List')} />
        <Heading level="h3">Tabs.Tab</Heading>
        <PropsTable items={propsOf('Tabs.Tab')} />
        <Heading level="h3">Tabs.Panel</Heading>
        <PropsTable items={propsOf('Tabs.Panel')} />
      </section>
    </div>
  );
}
