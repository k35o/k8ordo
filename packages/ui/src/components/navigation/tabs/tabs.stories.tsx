import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FC } from 'react';
import { expect, waitFor } from 'storybook/test';

import { Tabs } from '.';

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

    // 選択は transition なので、パネルの入れ替わりは click の後に commit される
    await userEvent.click(settingsTab);
    await waitFor(() => {
      expect(canvas.getByRole('tabpanel')).toHaveTextContent('設定項目');
    });

    await userEvent.click(historyTab);
    await waitFor(() => {
      expect(canvas.getByRole('tabpanel')).toHaveTextContent('履歴');
    });
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

// ResizeObserver の通知はレンダリング更新のあとのタスクで届く。切り替えの前に
// 2 フレーム待ち、観測を始めた時点の通知を出し切らせてから切り替える。
const settle = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
};

const SwitchableWritingModeTabs: FC = () => {
  const [isVertical, setIsVertical] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          setIsVertical(true);
        }}
        type="button"
      >
        縦書きにする
      </button>
      <div className={isVertical ? 'writing-v h-60' : 'h-60'}>
        <Tabs.Root ids={['first', 'second']}>
          <Tabs.List label="縦書きのタブ">
            <Tabs.Tab id="first">一</Tabs.Tab>
            <Tabs.Tab id="second">二</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="first">
            <p>一の内容</p>
          </Tabs.Panel>
          <Tabs.Panel id="second">
            <p>二の内容</p>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </div>
  );
};

// 置かれている場所が縦書きに切り替わると、tablist の向きと矢印キーの割り当てが追従する。
export const FollowsWritingMode: Story = {
  parameters: { vrt: { skip: true } },
  render: () => <SwitchableWritingModeTabs />,
  play: async ({ canvas, userEvent }) => {
    const tablist = canvas.getByRole('tablist');
    await waitFor(() => {
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
    });
    await settle();

    await userEvent.click(canvas.getByRole('button', { name: '縦書きにする' }));
    await waitFor(() => {
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    });

    const first = canvas.getByRole('tab', { name: '一' });
    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('tab', { name: '二' })).toHaveFocus();
  },
};

const ThreeTabs: FC<{ label: string }> = ({ label }) => (
  <Tabs.Root ids={['first', 'second', 'third']}>
    <Tabs.List label={label}>
      <Tabs.Tab id="first">一</Tabs.Tab>
      <Tabs.Tab id="second">二</Tabs.Tab>
      <Tabs.Tab id="third">三</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel id="first">
      <p>一の内容</p>
    </Tabs.Panel>
    <Tabs.Panel id="second">
      <p>二の内容</p>
    </Tabs.Panel>
    <Tabs.Panel id="third">
      <p>三の内容</p>
    </Tabs.Panel>
  </Tabs.Root>
);

// Home と End は最初と最後のタブへ移り、そのタブを選ぶ。ページはスクロールさせない。
// フォーカスはキーを押したその場で移り、選択は transition なのでパネルは後から入れ替わる
export const HomeAndEnd: Story = {
  render: () => <ThreeTabs label="数字のタブ" />,
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole('tab', { name: '一' }).focus();
    const prevented: boolean[] = [];
    const record = (event: KeyboardEvent) => {
      prevented.push(event.defaultPrevented);
    };
    window.addEventListener('keydown', record);

    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: '三' })).toHaveFocus();
    await waitFor(() => {
      expect(canvas.getByRole('tabpanel')).toHaveTextContent('三の内容');
    });

    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('tab', { name: '一' })).toHaveFocus();
    await waitFor(() => {
      expect(canvas.getByRole('tabpanel')).toHaveTextContent('一の内容');
    });

    window.removeEventListener('keydown', record);
    await expect(prevented).toStrictEqual([true, true]);
  },
};

// 右から左へ書く中では次のタブが左にあるので、左右の矢印キーを入れ替える
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <ThreeTabs label="右から左のタブ" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole('tab', { name: '一' }).focus();

    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('tab', { name: '二' })).toHaveFocus();
    await waitFor(() => {
      expect(canvas.getByRole('tab', { name: '二' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: '一' })).toHaveFocus();
  },
};
