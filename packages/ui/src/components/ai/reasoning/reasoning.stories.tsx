import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Reasoning } from './reasoning';

const meta: Meta<typeof Reasoning> = {
  title: 'components/ai/reasoning',
  component: Reasoning,
  args: {
    children:
      'ユーザーは会話の器から作りたい。まず MessageList と入力欄を用意し、Markdown は後段で扱う。',
  },
};

export default meta;
type Story = StoryObj<typeof Reasoning>;

export const Collapsed: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: '思考の過程' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};

export const Open: Story = {
  args: { defaultOpen: true },
};

export const Streaming: Story = {
  args: { isStreaming: true, defaultOpen: true },
};
