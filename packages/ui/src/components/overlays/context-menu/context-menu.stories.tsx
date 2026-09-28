import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, waitFor } from 'storybook/test';

import { ContextMenu } from '.';

const copy = fn();
const remove = fn();
const sortByName = fn();

const FileArea = () => (
  <ContextMenu.Root>
    <ContextMenu.Trigger
      renderItem={(props) => (
        // キーボードからも Shift+F10 で開けるよう、フォーカスを受けられる領域にする
        <div
          {...props}
          className="border-border-base text-fg-mute grid h-40 w-80 place-items-center rounded-xl border border-dashed"
          // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          ここで右クリック
        </div>
      )}
    />
    <ContextMenu.Content>
      <ContextMenu.Item label="コピー" onAction={copy} />
      <ContextMenu.SubMenu label="並び替え">
        <ContextMenu.Item label="名前順" onAction={sortByName} />
        <ContextMenu.Item label="日付順" onAction={() => {}} />
      </ContextMenu.SubMenu>
      <ContextMenu.Item label="削除" onAction={remove} />
    </ContextMenu.Content>
  </ContextMenu.Root>
);

const meta: Meta<typeof ContextMenu.Root> = {
  title: 'components/overlays/context-menu',
  component: ContextMenu.Root,
  render: () => <FileArea />,
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ContextMenu.Root>;

const areaOf = (canvas: { getByText: (text: string) => HTMLElement }) =>
  canvas.getByText('ここで右クリック');

// 開くときは少し拡大しながら出るので、位置は動きが止まってから測る
const settledRect = async (menu: HTMLElement) => {
  await Promise.all(
    menu.parentElement
      ?.getAnimations()
      .map((animation) => animation.finished) ?? [],
  );
  return menu.getBoundingClientRect();
};

// 右クリックした点にメニューを出し、先頭の項目へフォーカスを移す
export const OpensAtThePointer: Story = {
  play: async ({ canvas }) => {
    const area = areaOf(canvas);
    const rect = area.getBoundingClientRect();
    fireEvent.contextMenu(area, {
      clientX: rect.left + 40,
      clientY: rect.top + 30,
    });

    const menu = await canvas.findByRole('menu');
    await waitFor(async () => {
      await expect(
        canvas.getByRole('menuitem', { name: 'コピー' }),
      ).toHaveFocus();
    });
    const menuRect = await settledRect(menu);
    await expect(Math.round(menuRect.left)).toBe(Math.round(rect.left + 40));
    await expect(menuRect.top).toBeGreaterThanOrEqual(rect.top + 30);
    await expect(menuRect.top).toBeLessThan(rect.top + 30 + 16);
  },
};

export const RunsAnItemAndReturnsFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    const area = areaOf(canvas);
    area.focus();
    fireEvent.contextMenu(area, { clientX: 100, clientY: 100 });
    await canvas.findByRole('menu');

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: '削除' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    await expect(remove).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
    });
    // 見えない点に出したメニューなので、開く前にいた要素へ戻す
    await expect(area).toHaveFocus();
  },
};

export const EscapeCloses: Story = {
  play: async ({ canvas, userEvent }) => {
    const area = areaOf(canvas);
    area.focus();
    fireEvent.contextMenu(area, { clientX: 100, clientY: 100 });
    await canvas.findByRole('menu');

    await userEvent.keyboard('{Escape}');

    await waitFor(async () => {
      await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
    });
    await expect(area).toHaveFocus();
  },
};

export const OpensASubMenu: Story = {
  play: async ({ canvas, userEvent }) => {
    const area = areaOf(canvas);
    fireEvent.contextMenu(area, { clientX: 100, clientY: 100 });
    await canvas.findByRole('menu');

    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    await waitFor(async () => {
      await expect(
        canvas.getByRole('menuitem', { name: '名前順' }),
      ).toHaveFocus();
    });
    await userEvent.keyboard('{Enter}');

    await expect(sortByName).toHaveBeenCalledOnce();
  },
};
