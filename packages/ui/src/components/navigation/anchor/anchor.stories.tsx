import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Anchor } from './anchor';

const meta: Meta<typeof Anchor> = {
  title: 'components/navigation/anchor',
  component: Anchor,
};

export default meta;
type Story = StoryObj<typeof Anchor>;

// kind は renderAnchor に渡す値で、<a> の属性ではない
export const External: Story = {
  args: {
    href: 'https://example.com',
    children: 'external link',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link')).not.toHaveAttribute('kind');
  },
};

export const Internal: Story = {
  args: {
    href: '/blog',
    children: 'internal link',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link')).not.toHaveAttribute('kind');
  },
};

// 内部リンクだけをルーターの Link に差し替えるときは、kind で分ける
export const RenderAnchor: Story = {
  render: () => (
    <>
      {['/blog', 'https://example.com'].map((href) => (
        <p key={href}>
          <Anchor
            href={href}
            renderAnchor={({ kind, children, ...props }) => (
              <a
                {...props}
                data-router-link={kind === 'internal' ? '' : undefined}
              >
                {children}
              </a>
            )}
          >
            {href}
          </Anchor>
        </p>
      ))}
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '/blog' })).toHaveAttribute(
      'data-router-link',
    );
    await expect(
      canvas.getByRole('link', { name: 'https://example.com' }),
    ).not.toHaveAttribute('data-router-link');
  },
};
