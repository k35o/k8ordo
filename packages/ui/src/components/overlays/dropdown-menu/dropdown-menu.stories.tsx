import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { DropdownMenu } from '.';
import { tokenColor } from '../../../../.storybook/tokens';
import { MoonIcon } from '../../icons/moon';

const meta: Meta<typeof DropdownMenu.Root> = {
  title: 'components/overlays/dropdown-menu',
  component: DropdownMenu.Root,
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
        icon={<MoonIcon size="lg" />}
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

const visit = fn();

const linkMenu = (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger label="パッケージ" />
    <DropdownMenu.Content>
      <DropdownMenu.Item href="#ui" label="ui" />
      <DropdownMenu.Item
        href="#form"
        label="form"
        renderAnchor={({ children, href, onClick, ...props }) => (
          <a
            {...props}
            data-rendered=""
            href={href}
            onClick={(event) => {
              onClick();
              visit(href);
              event.preventDefault();
            }}
          >
            {children}
          </a>
        )}
      />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

/**
 * `href` を渡した項目は `<a role="menuitem">` になる。矢印キーで移れて、押すと
 * メニューを閉じ、遷移はブラウザに任せる。
 */
export const LinkItems: Story = {
  render: () => linkMenu,
  play: async ({ canvas, userEvent }) => {
    visit.mockClear();
    const trigger = canvas.getByRole('button', { name: 'パッケージ' });
    await userEvent.click(trigger);

    const ui = await screen.findByRole('menuitem', { name: 'ui' });
    await expect(ui.tagName).toBe('A');
    await expect(ui).toHaveAttribute('href', '#ui');
    await waitFor(() => {
      expect(ui).toHaveFocus();
    });

    await userEvent.keyboard('{ArrowDown}');
    const form = screen.getByRole('menuitem', { name: 'form' });
    await expect(form).toHaveFocus();
    await expect(form).toHaveAttribute('data-rendered');

    await userEvent.keyboard('{Enter}');
    await expect(visit).toHaveBeenCalledWith('#form');
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

export const LinkItemSpace: Story = {
  render: () => linkMenu,
  play: async ({ canvas, userEvent }) => {
    visit.mockClear();
    const trigger = canvas.getByRole('button', { name: 'パッケージ' });
    await userEvent.click(trigger);

    const ui = await screen.findByRole('menuitem', { name: 'ui' });
    await waitFor(() => {
      expect(ui).toHaveFocus();
    });
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'form' })).toHaveFocus();

    await userEvent.keyboard(' ');
    await expect(visit).toHaveBeenCalledOnce();
    await expect(visit).toHaveBeenCalledWith('#form');
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

export const TriggerProps: Story = {
  render: () => (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          color="primary"
          label="操作"
          size="sm"
          variant="outline"
        />
        <DropdownMenu.Content>
          <DropdownMenu.Item label="編集" onAction={() => undefined} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.IconTrigger
          icon={<MoonIcon size="sm" />}
          label="テーマ切替"
          size="sm"
          variant="skeleton"
        />
        <DropdownMenu.Content>
          <DropdownMenu.Item label="ライト" onAction={() => undefined} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  ),
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByRole('button', { name: '操作' }))
        .borderColor,
    ).toBe(tokenColor('--color-primary-border'));
    await expect(
      getComputedStyle(canvas.getByRole('button', { name: 'テーマ切替' }))
        .backgroundColor,
    ).toBe('rgba(0, 0, 0, 0)');
  },
};

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

// 項目を自前の部品にまとめても、矢印キーは描かれた並びのとおりに移る
const ClipboardItems = () => (
  <>
    <DropdownMenu.Item
      label="コピー"
      onAction={() => {
        console.warn('コピー');
      }}
    />
    <DropdownMenu.Item
      label="貼り付け"
      onAction={() => {
        console.warn('貼り付け');
      }}
    />
  </>
);

export const ItemsInOwnComponent: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger label="操作" />
      <DropdownMenu.Content>
        <DropdownMenu.Item
          label="切り取り"
          onAction={() => {
            console.warn('切り取り');
          }}
        />
        <ClipboardItems />
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
    canvas.getByRole('button', { name: '操作' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: '切り取り' })).toHaveFocus();
    });
    for (const name of ['コピー', '貼り付け', '削除', '切り取り']) {
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name })).toHaveFocus();
      });
    }
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
