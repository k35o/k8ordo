import type { Meta, StoryObj } from '@storybook/react-vite';

import { AssistantIcon } from '../../icons';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'components/data-display/avatar',
  component: Avatar,
  args: {
    name: 'Ada Lovelace',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    alt: 'k8o',
    src: '/k8o.jpg',
  },
  // 画像の読み込みは非同期で、VRT は画像を待たずに撮る。読み込み前の空の円が
  // 撮られないよう、描画できる状態になるまで待つ（読めなければテストが落ちる）
  play: async ({ canvasElement }) => {
    const image = canvasElement.querySelector('img');
    if (!image) {
      throw new Error('image not found');
    }
    await image.decode();
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithIcon: Story = {
  args: {
    name: 'AI',
    icon: <AssistantIcon />,
  },
};

export const AccentColors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar icon={<AssistantIcon />} name="AI" />
      <Avatar color="primary" icon={<AssistantIcon />} name="AI" />
      <Avatar color="secondary" icon={<AssistantIcon />} name="AI" />
    </div>
  ),
};
