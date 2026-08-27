import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from './stack';

const meta: Meta<typeof Stack> = {
  title: 'components/layout/stack',
  component: Stack,
};

export default meta;
type Story = StoryObj<typeof Stack>;

const items = Array.from({ length: 3 }, (_, i) => (
  <div
    className="bg-bg-mute rounded-md p-4 text-center text-sm"
    key={`item-${i}`}
  >
    {i + 1}
  </div>
));

export const Default: Story = {
  render: (args) => <Stack {...args}>{items}</Stack>,
};

export const Row: Story = {
  render: () => <Stack direction="row">{items}</Stack>,
};

export const GapSmall: Story = {
  render: () => (
    <Stack direction="row" gap="sm">
      {items}
    </Stack>
  ),
};

export const GapLarge: Story = {
  render: () => (
    <Stack direction="row" gap="xl">
      {items}
    </Stack>
  ),
};

export const AlignCenter: Story = {
  render: () => (
    <Stack align="center" direction="row">
      <div className="bg-bg-mute rounded-md p-4 text-sm">small</div>
      <div className="bg-bg-mute rounded-md p-8 text-sm">large</div>
      <div className="bg-bg-mute rounded-md p-4 text-sm">small</div>
    </Stack>
  ),
};

export const JustifyBetween: Story = {
  render: () => (
    <div className="w-full">
      <Stack direction="row" justify="between">
        {items}
      </Stack>
    </div>
  ),
};
