import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import { FileField } from '.';
import { Button } from '../../buttons/button';
import { FormControl } from '../form-control';

const meta: Meta<typeof FileField.Root> = {
  title: 'components/form/file-field',
  component: FileField.Root,
  args: {
    id: 'filefield',
    'aria-label': '添付ファイル',
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

// ドラッグしてドロップする。testing-library の fireEvent は DataTransfer の中身を
// 写さないので、ブラウザが渡すのと同じ DragEvent を組み立てて送る
const drag = (target: Element, files: File[]) => {
  const dataTransfer = new DataTransfer();
  for (const file of files) {
    dataTransfer.items.add(file);
  }
  const send = (type: string) => {
    target.dispatchEvent(
      new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer }),
    );
  };
  send('dragenter');
  send('dragover');
  return {
    drop: () => {
      send('drop');
    },
  };
};

const dropzoneOf = (canvasElement: HTMLElement) => {
  const zone = canvasElement.querySelector<HTMLElement>(
    'input[type="file"] ~ div',
  );
  if (zone === null) {
    throw new globalThis.Error('Dropzone が見つかりません');
  }
  return zone;
};

const DropzoneRender: Story['render'] = (args) => (
  <form>
    <FileField.Root {...args} name="attachment">
      <FileField.Dropzone />
      <FileField.ItemList clearable />
    </FileField.Root>
  </form>
);

// 中身を渡さないと、既定の案内と「ファイルを選択」のボタンが入る。
// ボタンがあるので、ドラッグできない人もキーボードで選べる
export const Dropzone: Story = {
  args: {
    onChange: fn(),
  },
  render: DropzoneRender,
  play: async ({ args, canvas, canvasElement }) => {
    await expect(canvas.getByText('ここにファイルをドロップ')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'ファイルを選択' }),
    ).toBeEnabled();

    const zone = dropzoneOf(canvasElement);
    const dragging = drag(zone, [
      new File(['content'], 'notes.txt', { type: 'text/plain' }),
    ]);
    await waitFor(async () => {
      await expect(zone).toHaveAttribute('data-dragging');
    });

    dragging.drop();

    await expect(await canvas.findByText('notes.txt')).toBeInTheDocument();
    await expect(zone).not.toHaveAttribute('data-dragging');
    // ドロップしたファイルも、選んだときと同じく input に載って送られる
    await expect(fileInputOf(canvasElement).files).toHaveLength(1);
    await expect(args.onChange).toHaveBeenCalled();
  },
};

// multiple では、選んだ分とドロップした分が積み重なり、そのまま全部送られる
export const DropAddsToThePickedFiles: Story = {
  args: {
    multiple: true,
  },
  render: DropzoneRender,
  play: async ({ canvas, canvasElement }) => {
    const input = fileInputOf(canvasElement);
    pick(input, new File(['a'], 'picked.txt', { type: 'text/plain' }));
    await canvas.findByText('picked.txt');

    drag(dropzoneOf(canvasElement), [
      new File(['b'], 'dropped.txt', { type: 'text/plain' }),
    ]).drop();
    await canvas.findByText('dropped.txt');

    await expect(
      Array.from(input.files ?? []).map((file) => file.name),
    ).toStrictEqual(['picked.txt', 'dropped.txt']);

    pick(input, new File(['c'], 'picked-again.txt', { type: 'text/plain' }));
    await canvas.findByText('picked-again.txt');
    await expect(input.files).toHaveLength(3);
  },
};

export const DropWhenDisabled: Story = {
  args: {
    disabled: true,
    onChange: fn(),
  },
  render: DropzoneRender,
  play: async ({ args, canvas, canvasElement }) => {
    const zone = dropzoneOf(canvasElement);
    drag(zone, [
      new File(['content'], 'notes.txt', { type: 'text/plain' }),
    ]).drop();

    await expect(zone).not.toHaveAttribute('data-dragging');
    await expect(canvas.queryByText('notes.txt')).not.toBeInTheDocument();
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(
      canvas.getByRole('button', { name: 'ファイルを選択' }),
    ).toBeDisabled();
  },
};

const attachmentFields = formFields(
  z.object({ attachment: z.file('ファイルを選んでください') }),
);

const AttachmentForm = () => {
  const form = useForm(attachmentFields);
  const attachment = form.field('attachment');

  return (
    <form {...form.props}>
      <FormControl
        errorText={attachment.error}
        invalid={attachment.invalid}
        label="添付ファイル"
        renderInput={({ invalid }) => (
          <FileField.Root {...attachment.input} invalid={invalid}>
            <FileField.Dropzone />
            <FileField.ItemList clearable />
          </FileField.Root>
        )}
        required={attachment.required}
      />
      <p data-testid="dirty">{form.isDirty ? '変更あり' : '変更なし'}</p>
    </form>
  );
};

// formFields が z.file() から導いた属性をそのまま広げ、ドロップした
// ファイルも選んだときと同じく form に伝わる（エラーの解除と変更の有無）
export const WithFormFields: Story = {
  render: () => <AttachmentForm />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const input = fileInputOf(canvasElement);
    await expect(input).toHaveAttribute('name', 'attachment');
    await expect(input).toBeRequired();

    input.focus();
    await userEvent.tab();
    await expect(
      await canvas.findByText('ファイルを選んでください'),
    ).toBeInTheDocument();

    drag(dropzoneOf(canvasElement), [
      new File(['content'], 'report.pdf', { type: 'application/pdf' }),
    ]).drop();

    await canvas.findByText('report.pdf');
    await waitFor(async () => {
      await expect(
        canvas.queryByText('ファイルを選んでください'),
      ).not.toBeInTheDocument();
    });
    await expect(canvas.getByTestId('dirty')).toHaveTextContent('変更あり');
  },
};

// multiple で選び直すと、一覧に積み重なった分がそのまま全部送られる
export const PickedFilesAllGetSubmitted: Story = {
  args: {
    multiple: true,
  },
  render: InFormRender,
  play: async ({ canvas, canvasElement }) => {
    const input = fileInputOf(canvasElement);
    pick(input, new File(['a'], 'first.txt', { type: 'text/plain' }));
    await canvas.findByText('first.txt');
    pick(input, new File(['b'], 'second.txt', { type: 'text/plain' }));
    await canvas.findByText('second.txt');

    await expect(
      Array.from(input.files ?? []).map((file) => file.name),
    ).toStrictEqual(['first.txt', 'second.txt']);
  },
};
