import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Heading } from './heading';

const meta: Meta<typeof Heading> = {
  title: 'components/data-display/heading',
  component: Heading,
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: {
    level: 'h1',
  },
  render: (args) => <Heading {...args}>k8o</Heading>,
};

export const H2: Story = {
  args: {
    level: 'h2',
  },
  render: (args) => <Heading {...args}>k8o</Heading>,
};

export const H3: Story = {
  args: {
    level: 'h3',
  },
  render: (args) => <Heading {...args}>k8o</Heading>,
};

export const H4: Story = {
  args: {
    level: 'h4',
  },
  render: (args) => <Heading {...args}>k8o</Heading>,
};

export const H5: Story = {
  args: {
    level: 'h5',
  },
  render: (args) => <Heading {...args}>k8o</Heading>,
};

export const H6: Story = {
  args: {
    level: 'h6',
  },
  render: (args) => <Heading {...args}>k8o</Heading>,
};

export const LineClamp: Story = {
  args: {
    level: 'h1',
    lineClamp: 2,
  },
  render: (args) => (
    <div className="w-48">
      <Heading {...args}>
        k8oの見出しはとても長くなることがあるため、行数を制限して折り返しを2行までに抑えられることを確認する。
      </Heading>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveClass(
      'line-clamp-2',
    );
  },
};
