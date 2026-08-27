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
    alt: 'Ada Lovelace',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
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
