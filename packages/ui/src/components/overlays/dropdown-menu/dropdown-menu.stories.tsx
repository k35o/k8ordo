import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import { DarkModeIcon } from '../../icons';
import { DropdownMenu } from './dropdown-menu';

const meta: Meta<typeof DropdownMenu.Root> = {
  title: 'components/overlays/dropdown-menu',
  component: DropdownMenu.Root,
  parameters: {
    a11y: {
      options: {
        rules: {
          // https://github.com/floating-ui/floating-ui/pull/2298#issuecomment-1518101512
          'aria-hidden-focus': { enabled: false },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu.Root>;

export const Default: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger label="操作" />
      <DropdownMenu.Content>
        <DropdownMenu.Item
          label="編集"
          onAction={() => {
            console.warn('編集');
          }}
        />
        <DropdownMenu.Item
          label="複製"
          onAction={() => {
            console.warn('複製');
          }}
        />
        <DropdownMenu.Item
          label="削除"
          onAction={() => {
            console.warn('削除');
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: '操作',
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
  },
};

export const TriggerByIcon: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.IconTrigger
        icon={<DarkModeIcon size="lg" />}
        label="テーマ切替"
      />
      <DropdownMenu.Content>
        <DropdownMenu.Item
          label="ライト"
          onAction={() => {
            console.warn('ライト');
          }}
        />
        <DropdownMenu.Item
          label="ダーク"
          onAction={() => {
            console.warn('ダーク');
          }}
        />
        <DropdownMenu.Item
          label="システム"
          onAction={() => {
            console.warn('システム');
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'テーマ切替',
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
  },
};

const menuWithSubMenu = (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger label="操作" />
    <DropdownMenu.Content>
      <DropdownMenu.Item
        label="編集"
        onAction={() => {
          console.warn('編集');
        }}
      />
      <DropdownMenu.SubMenu label="共有">
        <DropdownMenu.Item
          label="リンクをコピー"
          onAction={() => {
            console.warn('リンクをコピー');
          }}
        />
        <DropdownMenu.Item
          label="メールで送る"
          onAction={() => {
            console.warn('メールで送る');
          }}
        />
        <DropdownMenu.Item
          label="SNS に投稿"
          onAction={() => {
            console.warn('SNS に投稿');
          }}
        />
      </DropdownMenu.SubMenu>
      <DropdownMenu.Item
        label="削除"
        onAction={() => {
          console.warn('削除');
        }}
      />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

export const WithSubMenu: Story = {
  render: () => menuWithSubMenu,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: '操作' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: '編集' })).toHaveFocus();
    });
    // ArrowDown でサブメニューのトリガーへ、ArrowRight で開いて先頭項目へ。
    await userEvent.keyboard('{ArrowDown}');
    const subTrigger = screen.getByRole('menuitem', { name: '共有' });
    await waitFor(() => {
      expect(subTrigger).toHaveFocus();
    });
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: 'リンクをコピー' }),
      ).toHaveFocus();
    });
    // ArrowLeft でサブメニューを閉じてトリガーへ戻る。
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(subTrigger).toHaveFocus();
    });
  },
};

/**
 * safe triangle の可視化。サブメニューを hover で開いてトリガーの上で
 * ポインタを動かすと、サブメニューへの斜め移動を許す三角形が着色される。
 */
export const SubMenuSafeTriangleDebug: Story = {
  render: () => (
    <>
      <style>{`[data-submenu-trigger]::after {
        background: color-mix(in oklch, var(--color-primary-bg) 30%, transparent);
      }`}</style>
      {menuWithSubMenu}
    </>
  ),
};
