import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Anchor } from './anchor';

const meta: Meta<typeof Anchor> = {
  title: 'components/navigation/anchor',
  component: Anchor,
};

export default meta;
type Story = StoryObj<typeof Anchor>;

// kind は renderAnchor に渡す値で、<a> の属性ではない。新しいタブで開くことは
// 読み上げ専用の文言で伝え、リンクは本文の行の流れに乗ったまま折り返す
export const External: Story = {
  args: {
    href: 'https://example.com',
    children: 'external link',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link');
    await expect(link).not.toHaveAttribute('kind');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAccessibleName(
      'external link 新しいタブで開きます',
    );
    await expect(getComputedStyle(link).display).toBe('inline');
  },
};

// 外のリンクかは URL の形で決める。プロトコル相対（`//`、ブラウザが同じに
// 読む `/\`）も外。`http` で始まる相対パスや `mailto:` は内のまま
export const ExternalByUrlShape: Story = {
  render: () => (
    <>
      {[
        '//example.com/a',
        '/\\example.com/b',
        'HTTPS://example.com/c',
        'http-guide',
        'mailto:hello@example.com',
        '?page=2',
      ].map((href) => (
        <p key={href}>
          <Anchor href={href}>{href}</Anchor>
        </p>
      ))}
    </>
  ),
  play: async ({ canvas }) => {
    for (const href of [
      '//example.com/a',
      '/\\example.com/b',
      'HTTPS://example.com/c',
    ]) {
      await expect(
        canvas.getByRole('link', { name: `${href} 新しいタブで開きます` }),
      ).toHaveAttribute('target', '_blank');
    }
    for (const href of ['http-guide', 'mailto:hello@example.com', '?page=2']) {
      await expect(
        canvas.getByRole('link', { name: href }),
      ).not.toHaveAttribute('target');
    }
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
      canvas.getByRole('link', {
        name: 'https://example.com 新しいタブで開きます',
      }),
    ).not.toHaveAttribute('data-router-link');
  },
};
