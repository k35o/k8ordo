'use client';

import { Tabs } from '@k8ordo/ui';
import type { FC, ReactNode } from 'react';

import * as m from '../messages';

export const InstallTabs: FC<{
  npm: ReactNode;
  yarn: ReactNode;
  pnpm: ReactNode;
}> = ({ npm, yarn, pnpm }) => (
  <Tabs.Root ids={['npm', 'yarn', 'pnpm']}>
    <Tabs.List label={m.getStarted.packageManagerLabel()}>
      <Tabs.Tab id="npm">npm</Tabs.Tab>
      <Tabs.Tab id="yarn">yarn</Tabs.Tab>
      <Tabs.Tab id="pnpm">pnpm</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel id="npm">{npm}</Tabs.Panel>
    <Tabs.Panel id="yarn">{yarn}</Tabs.Panel>
    <Tabs.Panel id="pnpm">{pnpm}</Tabs.Panel>
  </Tabs.Root>
);
