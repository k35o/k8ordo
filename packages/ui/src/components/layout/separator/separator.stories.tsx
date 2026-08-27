import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'components/layout/separator',
  component: Separator,
  decorators: [
    (Story) => (
      <div className="size-40">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Block: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Inline: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const ColorMute: Story = {
  args: {
    color: 'mute',
  },
};

export const ColorSubtle: Story = {
  args: {
    color: 'subtle',
  },
};
