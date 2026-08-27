import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Tabs } from './tabs';

const meta: Meta<typeof Tabs.Root> = {
  title: 'components/navigation/tabs',
  component: Tabs.Root,
};

export default meta;
type Story = StoryObj<typeof Tabs.Root>;

export const Primary: Story = {
  render: () => (
    <Tabs.Root ids={['overview', 'settings', 'history']}>
      <Tabs.List label="設定メニュー">
        <Tabs.Tab id="overview">概要</Tabs.Tab>
        <Tabs.Tab id="settings">設定</Tabs.Tab>
        <Tabs.Tab id="history">履歴</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="overview">
        <p>ここに概要が表示されます。</p>
      </Tabs.Panel>
      <Tabs.Panel id="settings">
        <p>ここに設定項目が表示されます。</p>
      </Tabs.Panel>
      <Tabs.Panel id="history">
        <p>ここに履歴が表示されます。</p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const settingsTab = canvas.getByRole('tab', { name: '設定' });
    const historyTab = canvas.getByRole('tab', { name: '履歴' });

    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('概要');

    await userEvent.click(settingsTab);
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('設定項目');

    await userEvent.click(historyTab);
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('履歴');
  },
};

export const DefaultSelected: Story = {
  render: () => (
    <Tabs.Root
      defaultSelectedId="settings"
      ids={['overview', 'settings', 'history']}
    >
      <Tabs.List label="設定メニュー">
        <Tabs.Tab id="overview">概要</Tabs.Tab>
        <Tabs.Tab id="settings">設定</Tabs.Tab>
        <Tabs.Tab id="history">履歴</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="overview">
        <p>ここに概要が表示されます。</p>
      </Tabs.Panel>
      <Tabs.Panel id="settings">
        <p>ここに設定項目が表示されます。</p>
      </Tabs.Panel>
      <Tabs.Panel id="history">
        <p>ここに履歴が表示されます。</p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('設定項目');
  },
};
