import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Source } from '.';

const meta: Meta<typeof Source.List> = {
  title: 'components/ai/source',
  component: Source.List,
};

export default meta;
type Story = StoryObj<typeof Source.List>;

export const Default: Story = {
  render: () => (
    <Source.List>
      <Source.Item
        href="https://ordo.k8o.me/ui/ai/chat"
        title="AI チャット — k8ordo"
      />
      <Source.Item href="https://developer.mozilla.org/ja/docs/Web/API/URL" />
      <Source.Item title="社内設計資料 v3" />
    </Source.List>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('list', { name: '出典' })).toBeVisible();

    const titled = canvas.getByRole('link', { name: 'AI チャット — k8ordo' });
    await expect(titled).toHaveAttribute(
      'href',
      'https://ordo.k8o.me/ui/ai/chat',
    );
    await expect(titled).toHaveAttribute('target', '_blank');
    await expect(titled).toHaveAttribute('rel', 'noopener noreferrer');

    // title が無ければホスト名で示す
    await expect(
      canvas.getByRole('link', { name: 'developer.mozilla.org' }),
    ).toBeVisible();

    // URL の無い文書の出典はリンクにしない
    await expect(canvas.getByText('社内設計資料 v3')).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
  },
};

export const UnsafeUrl: Story = {
  render: () => (
    <Source.List>
      {/* oxlint-disable-next-line no-script-url -- リンクにしないことを確かめる入力 */}
      <Source.Item href="javascript:alert(1)" title="怪しい出典" />
    </Source.List>
  ),
  play: async ({ canvas }) => {
    // モデルが返した URL は信用しない。http(s) 以外はリンクにしない
    await expect(canvas.getByText('怪しい出典')).toBeVisible();
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  },
};
