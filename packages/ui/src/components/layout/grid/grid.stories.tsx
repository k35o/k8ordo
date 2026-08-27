import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from './grid';

const meta: Meta<typeof Grid> = {
  title: 'components/layout/grid',
  component: Grid,
};

export default meta;
type Story = StoryObj<typeof Grid>;

const items = Array.from({ length: 8 }, (_, i) => (
  <div
    className="bg-bg-mute rounded-md p-4 text-center text-sm"
    key={`item-${i}`}
  >
    {i + 1}
  </div>
));

export const Default: Story = {
  render: (args) => <Grid {...args}>{items}</Grid>,
};

export const FixedCols: Story = {
  render: () => <Grid cols={3}>{items}</Grid>,
};

export const AutoFill: Story = {
  render: () => (
    <Grid cols="auto-fill" minItemSize={32}>
      {items}
    </Grid>
  ),
};

export const AutoFit: Story = {
  render: () => (
    <Grid cols="auto-fit" minItemSize={32}>
      {items}
    </Grid>
  ),
};

export const GapSmall: Story = {
  render: () => (
    <Grid cols={4} gap="sm">
      {items}
    </Grid>
  ),
};

export const GapLarge: Story = {
  render: () => (
    <Grid cols={4} gap="xl">
      {items}
    </Grid>
  ),
};
