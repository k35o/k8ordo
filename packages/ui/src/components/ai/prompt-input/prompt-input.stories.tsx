import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { PromptInput } from '.';

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

    await expect(args.onSubmit).toHaveBeenCalledWith(
      'こんにちは',
      expect.any(FileList),
    );
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

const onSubmitWithFiles = fn<(message: string, files: FileList) => void>();

const pdf = new File(['%PDF-1.7'], 'spec.pdf', { type: 'application/pdf' });
const png = new File(['png'], 'screenshot.png', { type: 'image/png' });
const note = new File(['memo'], 'note.txt', { type: 'text/plain' });

const fileInputOf = (canvasElement: HTMLElement): HTMLInputElement => {
  const input =
    canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
  if (input === null) {
    throw new Error('PromptInput.Attach did not render its file input');
  }
  return input;
};

const transferOf = (files: File[]): DataTransfer => {
  const transfer = new DataTransfer();
  for (const file of files) {
    transfer.items.add(file);
  }
  return transfer;
};

const submittedFileNames = () =>
  Array.from(onSubmitWithFiles.mock.lastCall?.[1] ?? [], (file) => file.name);

const withAttachments: Story['render'] = (args) => (
  <PromptInput.Root {...args}>
    <PromptInput.Attachments />
    <PromptInput.Attach />
    <PromptInput.Textarea placeholder="メッセージを入力" />
    <PromptInput.Submit />
  </PromptInput.Root>
);

export const WithoutAcceptTakesNoFiles: Story = {
  render: withAttachments,
  play: async ({ canvas, canvasElement }) => {
    // accept を渡さない入力欄は文字だけを受け取る
    await expect(
      canvas.queryByRole('button', { name: 'ファイルを添付' }),
    ).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('input[type="file"]')).toBeNull();

    const transfer = transferOf([pdf]);
    const over = new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      dataTransfer: transfer,
    });
    canvas.getByRole('textbox').dispatchEvent(over);

    // それでもドラッグは止める。止めないとブラウザがファイルを開いて
    // ページを離れる。none で、落とせないことをカーソルで示す
    await expect(over.defaultPrevented).toBe(true);
    await expect(transfer.dropEffect).toBe('none');

    const drop = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: transfer,
    });
    canvas.getByRole('textbox').dispatchEvent(drop);

    await expect(drop.defaultPrevented).toBe(true);
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument();
  },
};

export const Attachments: Story = {
  args: { accept: 'image/*,application/pdf', onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvas, canvasElement, userEvent }) => {
    onSubmitWithFiles.mockClear();
    await expect(
      canvas.getByRole('button', { name: 'ファイルを添付' }),
    ).toBeVisible();

    await userEvent.upload(fileInputOf(canvasElement), pdf);

    const list = canvas.getByRole('list', { name: '添付ファイル' });
    await expect(list).toHaveTextContent('spec.pdf');

    // 本文が空でも、添付があれば送れる
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));

    await expect(onSubmitWithFiles).toHaveBeenCalledOnce();
    await expect(onSubmitWithFiles.mock.lastCall?.[0]).toBe('');
    await expect(submittedFileNames()).toStrictEqual(['spec.pdf']);
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument();
  },
};

export const AttachmentsWithText: Story = {
  args: { accept: 'image/*,application/pdf', onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvas, canvasElement, userEvent }) => {
    onSubmitWithFiles.mockClear();
    await userEvent.upload(fileInputOf(canvasElement), [pdf, png]);
    await userEvent.type(canvas.getByRole('textbox'), '見比べて');
    await userEvent.keyboard('{Enter}');

    await expect(onSubmitWithFiles.mock.lastCall?.[0]).toBe('見比べて');
    await expect(submittedFileNames()).toStrictEqual([
      'spec.pdf',
      'screenshot.png',
    ]);
  },
};

export const RemoveAttachment: Story = {
  args: { accept: 'image/*,application/pdf', onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvas, canvasElement, userEvent }) => {
    onSubmitWithFiles.mockClear();
    await userEvent.upload(fileInputOf(canvasElement), [pdf, png]);

    // 画像はサムネイルで出る
    await expect(
      canvas.getByRole('img', { name: 'screenshot.png' }),
    ).toHaveAttribute('src', expect.stringMatching(/^blob:/u));

    await userEvent.click(
      canvas.getByRole('button', {
        name: '添付を外す',
        description: /spec\.pdf/u,
      }),
    );
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));

    await expect(submittedFileNames()).toStrictEqual(['screenshot.png']);
  },
};

export const DropFiles: Story = {
  args: { accept: 'image/*,application/pdf', onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvas, canvasElement }) => {
    const form = canvasElement.querySelector('form');
    const textarea = canvas.getByRole('textbox');
    const transfer = transferOf([png, note]);

    // 素の dispatchEvent で起こした更新を React が描くのは、この関数が返った後
    textarea.dispatchEvent(
      new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer }),
    );
    await waitFor(() => expect(form).toHaveAttribute('data-dragging', 'true'));

    const over = new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      dataTransfer: transfer,
    });
    textarea.dispatchEvent(over);
    // 既定の動作（ファイルを開いてページを離れる）を止めて、ここに落とさせる
    await expect(over.defaultPrevented).toBe(true);

    textarea.dispatchEvent(
      new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: transfer,
      }),
    );

    const list = await canvas.findByRole('list', { name: '添付ファイル' });
    await expect(form).not.toHaveAttribute('data-dragging');
    await expect(
      canvas.getByRole('img', { name: 'screenshot.png' }),
    ).toBeVisible();
    // accept に当たらないファイルは受け取らない
    await expect(list.children).toHaveLength(1);
  },
};

export const PasteImage: Story = {
  args: { accept: 'image/*', onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox');
    const paste = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: transferOf([png]),
    });
    textarea.dispatchEvent(paste);

    await expect(
      await canvas.findByRole('img', { name: 'screenshot.png' }),
    ).toBeVisible();
    // 画像と一緒に届くファイル名などの文字列は本文に貼らない
    await expect(paste.defaultPrevented).toBe(true);
    await expect(textarea).toHaveValue('');
  },
};

export const PasteTextStaysText: Story = {
  args: { accept: 'image/*', onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvas }) => {
    const transfer = new DataTransfer();
    transfer.setData('text/plain', 'ただの文字');
    const paste = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: transfer,
    });
    canvas.getByRole('textbox').dispatchEvent(paste);

    await expect(paste.defaultPrevented).toBe(false);
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument();
  },
};

export const MaxFiles: Story = {
  args: {
    accept: 'image/*,application/pdf',
    maxFiles: 2,
    onSubmit: onSubmitWithFiles,
  },
  render: withAttachments,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.upload(fileInputOf(canvasElement), [
      pdf,
      png,
      new File(['png'], 'third.png', { type: 'image/png' }),
    ]);

    const list = canvas.getByRole('list', { name: '添付ファイル' });
    await expect(list.children).toHaveLength(2);
    await expect(list).not.toHaveTextContent('third.png');
  },
};

export const PasteBeyondMaxFiles: Story = {
  args: { accept: 'image/*', maxFiles: 1, onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox');
    textarea.dispatchEvent(
      new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: transferOf([png]),
      }),
    );
    const list = await canvas.findByRole('list', { name: '添付ファイル' });

    const transfer = transferOf([
      new File(['png'], 'second.png', { type: 'image/png' }),
    ]);
    transfer.setData('text/plain', 'second.png');
    const overflow = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: transfer,
    });
    textarea.dispatchEvent(overflow);

    // 上限で捨てたファイルでも、一緒に届いたファイル名を本文に貼らない
    await expect(overflow.defaultPrevented).toBe(true);
    await expect(textarea).toHaveValue('');
    await expect(list.children).toHaveLength(1);
    await expect(list).not.toHaveTextContent('second.png');
  },
};

export const SingleFile: Story = {
  args: { accept: 'image/*', maxFiles: 1, onSubmit: onSubmitWithFiles },
  render: withAttachments,
  play: async ({ canvasElement }) => {
    // 1 件しか取らないなら、選択ダイアログでも複数を選ばせない
    await expect(fileInputOf(canvasElement).multiple).toBe(false);
  },
};
