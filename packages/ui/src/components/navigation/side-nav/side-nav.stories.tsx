import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { SideNav } from '.';

const meta: Meta<typeof SideNav.Root> = {
  title: 'components/navigation/side-nav',
  component: SideNav.Root,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SideNav.Root>;

export const Default: Story = {
  render: () => (
    <div className="w-60">
      <SideNav.Root label="コンポーネント">
        <SideNav.Group title="ボタン">
          <SideNav.Link href="/button">Button</SideNav.Link>
          <SideNav.Link href="/icon-button">IconButton</SideNav.Link>
        </SideNav.Group>
        <SideNav.Group title="ナビゲーション">
          <SideNav.Link current href="/side-nav">
            SideNav
          </SideNav.Link>
          <SideNav.Link href="/tabs">Tabs</SideNav.Link>
        </SideNav.Group>
      </SideNav.Root>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('navigation', { name: 'コンポーネント' }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('list', { name: 'ナビゲーション' }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'SideNav' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(
      canvas.getByRole('link', { name: 'Tabs' }),
    ).not.toHaveAttribute('aria-current');
  },
};

const navigate = fn();

// ルーターの Link に差し替えるときは、渡された束をそのまま展開する。
// 利用側が渡した onClick も束に入っている
export const RenderAnchor: Story = {
  render: () => (
    <div className="w-60">
      <SideNav.Root label="ガイド">
        <SideNav.Group title="はじめに">
          <SideNav.Link
            href="/get-started"
            onClick={navigate}
            renderAnchor={({ children, ...props }) => (
              <a {...props} data-router-link="">
                {children}
              </a>
            )}
          >
            Get Started
          </SideNav.Link>
        </SideNav.Group>
      </SideNav.Root>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'Get Started' });

    await expect(link).toHaveAttribute('data-router-link');
    await expect(link).toHaveAttribute('href', '/get-started');

    link.addEventListener('click', (event) => {
      event.preventDefault();
    });
    await userEvent.click(link);

    await expect(navigate).toHaveBeenCalledOnce();
  },
};

// 開閉できる段で木にする。今のページを含む段だけを開いておく
export const Nested: Story = {
  render: () => (
    <div className="w-60">
      <SideNav.Root label="UI">
        <SideNav.Group title="コンポーネント">
          <SideNav.Link href="/components">一覧</SideNav.Link>
          <SideNav.Sub title="ボタン">
            <SideNav.Link href="/button">Button</SideNav.Link>
            <SideNav.Link href="/icon-button">IconButton</SideNav.Link>
          </SideNav.Sub>
          <SideNav.Sub defaultOpen title="ナビゲーション">
            <SideNav.Link current href="/side-nav">
              SideNav
            </SideNav.Link>
            <SideNav.Link href="/tabs">Tabs</SideNav.Link>
          </SideNav.Sub>
        </SideNav.Group>
      </SideNav.Root>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('link', { name: 'SideNav' })).toBeVisible();
    // 閉じた段のリンクは描かれているが見えない（読み上げにも出ない）
    const button = canvas.getByRole('link', { name: 'Button', hidden: true });
    await expect(button).not.toBeVisible();

    // 段の名前を押すと開く
    await userEvent.click(canvas.getByText('ボタン'));
    await expect(button).toBeVisible();
  },
};
