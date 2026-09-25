import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, spyOn, waitFor } from 'storybook/test';

import { CopyButton } from './copy-button';

// クリップボードを読み返すには権限が要り、テストの中では与えられないので、
// 書き込み口で ClipboardItem を受け取って中身を確かめる
const written: ClipboardItem[] = [];
let rejectWrites = false;

const lastCopiedText = async (): Promise<string> => {
  const item = written.at(-1);
  if (!item) {
    throw new Error('クリップボードに何も書き込まれていない');
  }
  return (await item.getType('text/plain')).text();
};

const iconOf = (button: HTMLElement): string =>
  button.querySelector('svg')?.innerHTML ?? '';

const meta: Meta<typeof CopyButton> = {
  title: 'components/buttons/copy-button',
  component: CopyButton,
  args: {
    value: 'pnpm add @k8ordo/ui',
  },
  beforeEach: () => {
    written.length = 0;
    const write = spyOn(navigator.clipboard, 'write').mockImplementation(
      (items) => {
        if (rejectWrites) {
          return Promise.reject(
            new DOMException('Write permission denied.', 'NotAllowedError'),
          );
        }
        written.push(...items);
        return Promise.resolve();
      },
    );
    return () => {
      write.mockRestore();
    };
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'コピー' });
    const idleIcon = iconOf(button);

    await userEvent.click(button);

    await expect(await lastCopiedText()).toBe('pnpm add @k8ordo/ui');
    await waitFor(() => {
      expect(canvas.getByRole('status')).toHaveTextContent('コピーしました');
    });
    // 名前は変えず、アイコンだけで押した結果を見せる
    await expect(button).toHaveAccessibleName('コピー');
    await expect(iconOf(button)).not.toBe(idleIcon);

    await waitFor(
      () => {
        expect(iconOf(button)).toBe(idleIcon);
      },
      { timeout: 3000 },
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('');
  },
};

export const IconOnly: Story = {
  args: {
    label: 'コードをコピー',
    iconOnly: true,
    size: 'sm',
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'コードをコピー' });
    await expect(button).not.toHaveTextContent('コードをコピー');

    await userEvent.click(button);

    await expect(await lastCopiedText()).toBe('pnpm add @k8ordo/ui');
    await waitFor(() => {
      expect(canvas.getByRole('status')).toHaveTextContent('コピーしました');
    });
  },
};

export const Labeled: Story = {
  args: {
    label: 'CSS をコピー',
    size: 'sm',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'CSS をコピー' }),
    ).toHaveTextContent('CSS をコピー');
  },
};

// コピーする中身を押した時点で作る（DOM から読む、fetch するなど）。
export const LazyValue: Story = {
  args: {
    label: 'Markdown をコピー',
    value: fn(async () => {
      await Promise.resolve();
      return '# 見出し';
    }),
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(args.value).not.toHaveBeenCalled();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Markdown をコピー' }),
    );

    await expect(args.value).toHaveBeenCalledOnce();
    await expect(await lastCopiedText()).toBe('# 見出し');
    await waitFor(() => {
      expect(canvas.getByRole('status')).toHaveTextContent('コピーしました');
    });
  },
};

export const Failed: Story = {
  beforeEach: () => {
    rejectWrites = true;
    return () => {
      rejectWrites = false;
    };
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'コピー' });
    const idleIcon = iconOf(button);

    await userEvent.click(button);

    await waitFor(() => {
      expect(canvas.getByRole('status')).toHaveTextContent(
        'コピーできませんでした',
      );
    });
    await expect(iconOf(button)).not.toBe(idleIcon);
  },
};

// 結果を見せている間にもう一度押すと、同じ文言でも読み上げ直させる。
// ライブリージョンは中身が変わったときにしか読まないので、要素を作り直す
export const CopyAgain: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'コピー' });
    const status = canvas.getByRole('status');

    await userEvent.click(button);
    await waitFor(() => {
      expect(status).toHaveTextContent('コピーしました');
    });
    const first = status.firstElementChild;

    await userEvent.click(button);
    await waitFor(() => {
      expect(status.firstElementChild).not.toBe(first);
    });
    await expect(status).toHaveTextContent('コピーしました');
    await expect(written).toHaveLength(2);
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'コピー' })).toBeDisabled();
  },
};
