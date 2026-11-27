import type { Meta, StoryObj } from '@storybook/react-vite';
import { clsx } from 'clsx';
import { Suspense, use, useState } from 'react';
import type { FC } from 'react';
import { expect, waitFor } from 'storybook/test';

import { Tabs } from '.';
import { afterRenderingUpdate } from '../../../../.storybook/rendering';

import styles from './tabs.stories.module.css';

const meta: Meta<typeof Tabs.Root> = {
  title: 'components/navigation/tabs',
  component: Tabs.Root,
};

export default meta;
type Story = StoryObj<typeof Tabs.Root>;

export const Primary: Story = {
  render: () => (
    <Tabs.Root defaultSelectedId="overview">
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

    // パネルは選択の遅延値で描くので、入れ替わりは click の後の描画になる
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
    <Tabs.Root defaultSelectedId="settings">
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

const SwitchableWritingModeTabs: FC = () => {
  const [isVertical, setIsVertical] = useState(false);
  return (
    <div className={styles.switchable}>
      <button
        onClick={() => {
          setIsVertical(true);
        }}
        type="button"
      >
        縦書きにする
      </button>
      <div className={clsx(isVertical && 'writing-v', styles.area)}>
        <Tabs.Root defaultSelectedId="first">
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
    await afterRenderingUpdate();

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
  <Tabs.Root defaultSelectedId="first">
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
// フォーカスはキーを押したその場で移り、パネルは選択の遅延値で後から入れ替わる
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

const InsertedTabRender: FC = () => {
  const [inserted, setInserted] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setInserted(true);
        }}
        type="button"
      >
        二を足す
      </button>
      <Tabs.Root defaultSelectedId="first">
        <Tabs.List label="あとから足すタブ">
          <Tabs.Tab id="first">一</Tabs.Tab>
          {inserted ? <Tabs.Tab id="second">二</Tabs.Tab> : null}
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
    </>
  );
};

// 矢印キーの行き先は、タブが足された順でなく画面に並んだ順で決まる
export const KeyboardFollowsDocumentOrder: Story = {
  render: () => <InsertedTabRender />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '二を足す' }));
    canvas.getByRole('tab', { name: '一' }).focus();

    await userEvent.keyboard('{ArrowRight}');

    await expect(canvas.getByRole('tab', { name: '二' })).toHaveFocus();
  },
};

const neverLoaded = Promise.withResolvers<string>().promise;

const NeverLoaded: FC = () => <p>{use(neverLoaded)}</p>;

const DeferredPanelsRender: FC = () => {
  const [selectedId, setSelectedId] = useState('first');
  return (
    <Tabs.Root onChange={setSelectedId} selectedId={selectedId}>
      <Tabs.List label="遅れて描くタブ">
        <Tabs.Tab id="first">一</Tabs.Tab>
        <Tabs.Tab id="second">二</Tabs.Tab>
      </Tabs.List>
      <Suspense fallback={<p>読み込み中</p>}>
        <Tabs.Panel id="first">
          <p>一の内容</p>
        </Tabs.Panel>
        <Tabs.Panel id="second">
          <NeverLoaded />
        </Tabs.Panel>
      </Suspense>
    </Tabs.Root>
  );
};

// 選択を同期の setState で制御しても、パネルは遅延値で入れ替わる。suspend する
// パネルは前のパネルを残し、フォールバックを出さない。Storybook のテストの中では
// suspend した描画がやり直されないので、読み込みが終わった後は確かめない
export const DeferredPanels: Story = {
  render: () => <DeferredPanelsRender />,
  play: async ({ canvas, userEvent }) => {
    const second = canvas.getByRole('tab', { name: '二' });

    await userEvent.click(second);

    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('一の内容');
    await expect(canvas.queryByText('読み込み中')).not.toBeInTheDocument();
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
    await expect(canvas.getByRole('tab', { name: '二' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    // パネルの入れ替わりを commit している間に押したキーは React が捨てる
    await waitFor(() => {
      expect(canvas.getByRole('tabpanel')).toHaveTextContent('二の内容');
    });

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: '一' })).toHaveFocus();
  },
};
