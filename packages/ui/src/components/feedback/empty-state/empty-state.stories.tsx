import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from '../../buttons/button';
import { Card } from '../../data-display/card';
import { TableIcon } from '../../icons';
import { EmptyState } from './empty-state';

const meta: Meta<typeof EmptyState> = {
  title: 'components/feedback/empty-state',
  component: EmptyState,
  args: {
    title: 'まだ記事がありません',
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('まだ記事がありません')).toBeInTheDocument();
  },
};

const reset = fn();

export const WithDescriptionAndAction: Story = {
  args: {
    title: '条件に合う記事はありません',
    description: '絞り込みの条件を減らすと見つかるかもしれません。',
    icon: <TableIcon size="lg" />,
    action: (
      <Button color="base" onClick={reset} size="sm" variant="outline">
        条件をクリア
      </Button>
    ),
  },
  render: (args) => (
    <Card variant="shadow">
      <EmptyState {...args} />
    </Card>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.getByText('絞り込みの条件を減らすと見つかるかもしれません。'),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: '条件をクリア' }));

    await expect(reset).toHaveBeenCalledOnce();
  },
};
