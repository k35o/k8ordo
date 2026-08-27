import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Suggestion } from './suggestion';

const meta: Meta<{ onSelect: (value: string) => void }> = {
  title: 'components/ai/suggestion',
  args: {
    onSelect: fn(),
  },
  render: ({ onSelect }) => (
    <Suggestion.List>
      <Suggestion.Item onSelect={onSelect} value="使い方を教えて">
        使い方を教えて
      </Suggestion.Item>
      <Suggestion.Item onSelect={onSelect} value="サンプルを見せて">
        サンプルを見せて
      </Suggestion.Item>
      <Suggestion.Item onSelect={onSelect} value="料金は？">
        料金は？
      </Suggestion.Item>
    </Suggestion.List>
  ),
};

export default meta;
type Story = StoryObj<{ onSelect: (value: string) => void }>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: '使い方を教えて' }),
    );
    await expect(args.onSelect).toHaveBeenCalledWith('使い方を教えて');
  },
};
