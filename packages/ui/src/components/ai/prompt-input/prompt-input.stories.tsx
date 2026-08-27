import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { PromptInput } from './prompt-input';

const meta: Meta<typeof PromptInput.Root> = {
  title: 'components/ai/prompt-input',
  component: PromptInput.Root,
  args: {
    status: 'ready',
    onSubmit: fn(),
    onStop: fn(),
  },
  render: (args) => (
    <PromptInput.Root {...args}>
      <PromptInput.Textarea placeholder="メッセージを入力" />
      <PromptInput.Submit />
    </PromptInput.Root>
  ),
};

export default meta;
type Story = StoryObj<typeof PromptInput.Root>;

export const Default: Story = {};

export const EnterToSend: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, 'こんにちは');
    await userEvent.keyboard('{Enter}');

    await expect(args.onSubmit).toHaveBeenCalledWith('こんにちは');
    await expect(textarea).toHaveValue('');
  },
};

export const ShiftEnterInsertsNewline: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, '1行目');
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    await userEvent.type(textarea, '2行目');

    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(textarea).toHaveValue('1行目\n2行目');
  },
};

export const ImeCompositionDoesNotSubmit: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const textarea = canvas.getByRole<HTMLTextAreaElement>('textbox');
    await userEvent.click(textarea);
    await userEvent.type(textarea, 'にほんご');

    // IME変換中の確定Enter（isComposing = true）は送信しない。
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        isComposing: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(textarea).toHaveValue('にほんご');
  },
};

export const EmptyDoesNotSubmit: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const textarea = canvas.getByRole('textbox');
    await userEvent.click(textarea);
    await userEvent.keyboard('{Enter}');

    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Streaming: Story = {
  args: { status: 'streaming' },
  play: async ({ canvas, userEvent, args }) => {
    const stopButton = canvas.getByRole('button', { name: '停止' });
    await userEvent.click(stopButton);

    await expect(args.onStop).toHaveBeenCalled();
  },
};

export const StreamingEnterDoesNotSubmit: Story = {
  args: { status: 'streaming' },
  play: async ({ canvas, userEvent, args }) => {
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, '次の質問');
    await userEvent.keyboard('{Enter}');

    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
