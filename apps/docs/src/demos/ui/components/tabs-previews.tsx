'use client';

import { Tabs } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './tabs-previews.module.css';

export function TabsBasicPreview() {
  return (
    <div className={styles.frame}>
      <Tabs.Root defaultSelectedId="overview">
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

export function TabsControlledPreview() {
  const [selectedId, setSelectedId] = useState('settings');
  return (
    <div className={styles.frame}>
      <Tabs.Root onChange={setSelectedId} selectedId={selectedId}>
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
