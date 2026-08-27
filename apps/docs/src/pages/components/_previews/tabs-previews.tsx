'use client';

import { Tabs } from '@k8ordo/ui';

export function TabsBasicPreview() {
  return (
    <div className="w-full">
      <Tabs.Root ids={['overview', 'settings', 'history']}>
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
      </Tabs.Root>
    </div>
  );
}

export function TabsDefaultSelectedPreview() {
  return (
    <div className="w-full">
      <Tabs.Root
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
      </Tabs.Root>
    </div>
  );
}
