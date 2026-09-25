import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { FileField } from '.';
import { Button } from '../../buttons/button';

const meta: Meta<typeof FileField.Root> = {
  title: 'components/form/file-field',
  component: FileField.Root,
  args: {
    id: 'filefield',
  },
  render: (args) => (
    <FileField.Root {...args}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            ファイルを選択
          </Button>
        )}
      />
      <FileField.ItemList />
    </FileField.Root>
  ),
  parameters: {
    a11y: {
      options: {
        rules: {
          // FileField単体ではラベルを付随しない
          'label-title-only': { enabled: false },
          label: { enabled: false },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileField.Root>;

export const Default: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
  },
};

export const Multiple: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    multiple: true,
  },
};

export const MaxFiles: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    multiple: true,
    maxFiles: 3,
  },
};

export const DefaultValue: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    defaultValue: [
      new File(['file content'], 'default.txt', { type: 'text/plain' }),
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('default.txt')).toBeInTheDocument();
  },
};

export const ImageOnly: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    accept: 'image/*',
  },
};

export const WebkitDirectory: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    webkitDirectory: true,
  },
};

export const HasClearButton: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    multiple: true,
  },
  render: (args) => (
    <FileField.Root {...args}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            ファイルを追加
          </Button>
        )}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  ),
};

export const ShowWebkitRelativePath: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    webkitDirectory: true,
  },
  render: (args) => (
    <FileField.Root {...args}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick} variant="outline">
            ファイルを選択
          </Button>
        )}
      />
      <FileField.ItemList showWebkitRelativePath />
    </FileField.Root>
  ),
};

const RefRender = (args: ComponentProps<typeof FileField.Root>) => {
  const ref = useRef<HTMLInputElement>(null);
  const [refType, setRefType] = useState('');

  return (
    <FileField.Root {...args} ref={ref}>
      <FileField.ItemList clearable />
      <Button
        onClick={() => {
          setRefType(ref.current?.type ?? 'none');
        }}
      >
        ref を確認
      </Button>
      <p data-testid="ref-type">{refType}</p>
    </FileField.Root>
  );
};

// 利用者の ref が内部 ref を上書きすると、削除時に input.files を差し替えられず
// onChange が飛ばなくなる
export const ForwardsRef: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    onChange: fn(),
    defaultValue: [
      new File(['file content'], 'default.txt', { type: 'text/plain' }),
    ],
  },
  render: (args) => <RefRender {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'ref を確認' }));

    await expect(canvas.getByTestId('ref-type')).toHaveTextContent('file');

    await userEvent.click(
      canvas.getByRole('button', { name: 'ファイルを削除' }),
    );

    await expect(canvas.queryByText('default.txt')).not.toBeInTheDocument();
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const OnlyTrigger: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
  },
  render: (args) => (
    <FileField.Root {...args}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick} variant="outline">
            ファイルを選択
          </Button>
        )}
      />
    </FileField.Root>
  ),
};

// storybook/test の userEvent.upload は input の files を getter で差し替え、
// 以後コードから書けなくなる。ブラウザが選んだときと同じく files を置いて change を出す
const pick = (input: HTMLInputElement, file: File) => {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

const fileInputOf = (canvasElement: HTMLElement) => {
  const input =
    canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
  if (input === null) {
    throw new globalThis.Error('file input が見つかりません');
  }
  return input;
};

const InFormRender: Story['render'] = (args) => (
  <form>
    <FileField.Root {...args} name="attachment">
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            ファイルを選択
          </Button>
        )}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  </form>
);

// 一覧から外したファイルは、onChange を渡していなくても送信から外れる
export const RemovedFileLeavesTheSubmission: Story = {
  render: InFormRender,
  play: async ({ canvasElement, canvas, userEvent }) => {
    const input = fileInputOf(canvasElement);
    pick(input, new File(['content'], 'notes.txt', { type: 'text/plain' }));
    await expect(canvas.findByText('notes.txt')).resolves.toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole('button', { name: 'ファイルを削除' }),
    );

    await expect(input.files).toHaveLength(0);
  },
};

// form の reset はファイルを空に戻し、一覧もそれに追従する
export const ListFollowsReset: Story = {
  render: InFormRender,
  play: async ({ canvasElement, canvas }) => {
    const input = fileInputOf(canvasElement);
    pick(input, new File(['content'], 'notes.txt', { type: 'text/plain' }));
    await expect(canvas.findByText('notes.txt')).resolves.toBeInTheDocument();

    input.form?.reset();

    await waitFor(() =>
      expect(canvas.queryByText('notes.txt')).not.toBeInTheDocument(),
    );
  },
};
