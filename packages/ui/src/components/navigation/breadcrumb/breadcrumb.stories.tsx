import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Breadcrumb } from '.';

const meta: Meta<typeof Breadcrumb.List> = {
  title: 'components/navigation/breadcrumb',
  component: Breadcrumb.List,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb.List>;

export const Medium: Story = {
  render: () => (
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/quizzes">Quizzes</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current href="/quizzes/fish-kanji">
          うおへんクイズ
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('navigation', { name: 'パンくずリスト' }),
    ).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.getByText('うおへんクイズ')).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(
      canvas.getByRole('link', { name: 'Home' }),
    ).not.toHaveAttribute('aria-current');
  },
};

// Breadcrumb.Link は残りの <a> の属性をそのまま渡す
export const LinkAttributes: Story = {
  render: () => (
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link data-testid="home" href="/" hrefLang="ja">
          Home
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Home' });
    await expect(link).toHaveAttribute('hreflang', 'ja');
    await expect(link).toHaveAttribute('data-testid', 'home');
  },
};

export const Large: Story = {
  render: () => (
    <Breadcrumb.List size="lg">
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/quizzes">Quizzes</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current href="/quizzes/fish-kanji">
          うおへんクイズ
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  ),
};

export const Small: Story = {
  render: () => (
    <Breadcrumb.List size="sm">
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/quizzes">Quizzes</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current href="/quizzes/fish-kanji">
          うおへんクイズ
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  ),
};
