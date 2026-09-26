import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, mocked, waitFor } from 'storybook/test';

import { FileField } from '.';
import { Button } from '../../buttons/button';

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
const pick = (input: HTMLInputElement, ...files: File[]) => {
  const dataTransfer = new DataTransfer();
  for (const file of files) {
    dataTransfer.items.add(file);
  }
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

const textFile = (name: string) =>
  new File(['content'], name, { type: 'text/plain' });

const namesOf = (files: FileList | null | undefined) =>
  Array.from(files ?? [], (file) => file.name);

// form が送信で組み立てるのと同じ FormData から読む
const submittedNames = (input: HTMLInputElement) => {
  if (input.form === null) {
    throw new globalThis.Error('form が見つかりません');
  }
  return new FormData(input.form)
    .getAll('attachment')
    .map((value) => (value instanceof File ? value.name : value));
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

// ブラウザは選び直すたびに files を新しく選んだ分だけに置き換えるが、
// 一覧に積んだファイルはすべて送る
export const EveryListedFileIsSubmitted: Story = {
  args: { multiple: true },
  render: InFormRender,
  play: async ({ canvasElement, canvas }) => {
    const input = fileInputOf(canvasElement);
    pick(input, textFile('first.txt'));
    await expect(canvas.findByText('first.txt')).resolves.toBeInTheDocument();

    pick(input, textFile('second.txt'));
    await expect(canvas.findByText('second.txt')).resolves.toBeInTheDocument();

    await expect(submittedNames(input)).toEqual(['first.txt', 'second.txt']);
  },
};

// multiple でなければ、選び直したファイルが一覧も送信も置き換える
export const PickReplacesTheFileWithoutMultiple: Story = {
  args: { defaultValue: [textFile('default.txt')] },
  render: InFormRender,
  play: async ({ canvasElement, canvas }) => {
    const input = fileInputOf(canvasElement);
    pick(input, textFile('notes.txt'));
    await expect(canvas.findByText('notes.txt')).resolves.toBeInTheDocument();

    await expect(canvas.queryByText('default.txt')).not.toBeInTheDocument();
    await expect(submittedNames(input)).toEqual(['notes.txt']);
  },
};

// maxFiles を超えて選んだ分は、一覧にも送信にも入らない
export const MaxFilesCapsTheSubmission: Story = {
  args: { multiple: true, maxFiles: 2 },
  render: InFormRender,
  play: async ({ canvasElement, canvas }) => {
    const input = fileInputOf(canvasElement);
    pick(input, textFile('first.txt'));
    await expect(canvas.findByText('first.txt')).resolves.toBeInTheDocument();

    pick(input, textFile('second.txt'), textFile('third.txt'));
    await expect(canvas.findByText('second.txt')).resolves.toBeInTheDocument();

    await expect(canvas.queryByText('third.txt')).not.toBeInTheDocument();
    await expect(submittedNames(input)).toEqual(['first.txt', 'second.txt']);
  },
};

// onChange には選んだ分ではなく、一覧に並ぶ（送る）ファイルの列全体が渡る
export const OnChangeReceivesTheWholeList: Story = {
  args: { multiple: true, onChange: fn() },
  render: InFormRender,
  play: async ({ args, canvasElement, canvas }) => {
    const input = fileInputOf(canvasElement);
    pick(input, textFile('first.txt'));
    await expect(canvas.findByText('first.txt')).resolves.toBeInTheDocument();

    pick(input, textFile('second.txt'));
    await expect(canvas.findByText('second.txt')).resolves.toBeInTheDocument();

    await expect(namesOf(mocked(args.onChange)?.mock.lastCall?.[0])).toEqual([
      'first.txt',
      'second.txt',
    ]);
  },
};

// 選び直しで書き戻した列を、input イベントで form 側に知らせる
export const AnnouncesTheWrittenList: Story = {
  args: { multiple: true },
  render: InFormRender,
  play: async ({ canvasElement, canvas }) => {
    const input = fileInputOf(canvasElement);
    pick(input, textFile('first.txt'));
    await expect(canvas.findByText('first.txt')).resolves.toBeInTheDocument();
    const announced: string[][] = [];
    input.form?.addEventListener('input', () => {
      announced.push(namesOf(input.files));
    });

    pick(input, textFile('second.txt'));

    await expect(announced).toEqual([['first.txt', 'second.txt']]);
  },
};

// 既定のファイルも、一覧に出るだけでなく送る
export const DefaultFilesAreSubmitted: Story = {
  args: {
    multiple: true,
    defaultValue: [textFile('default.txt')],
  },
  render: InFormRender,
  play: async ({ canvasElement }) => {
    const input = fileInputOf(canvasElement);

    await waitFor(() => expect(submittedNames(input)).toEqual(['default.txt']));
  },
};

// form の reset は一覧も送るものも既定のファイルに戻す
export const ResetRestoresTheDefaultFiles: Story = {
  args: {
    multiple: true,
    defaultValue: [textFile('default.txt')],
  },
  render: InFormRender,
  play: async ({ canvasElement, canvas }) => {
    const input = fileInputOf(canvasElement);
    pick(input, textFile('notes.txt'));
    await expect(canvas.findByText('notes.txt')).resolves.toBeInTheDocument();

    input.form?.reset();

    await waitFor(() =>
      expect(canvas.queryByText('notes.txt')).not.toBeInTheDocument(),
    );
    await expect(canvas.getByText('default.txt')).toBeInTheDocument();
    await waitFor(() => expect(submittedNames(input)).toEqual(['default.txt']));
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
    pick(input, textFile('picked.txt'));
    await canvas.findByText('picked.txt');

    drag(dropzoneOf(canvasElement), [textFile('dropped.txt')]).drop();
    await canvas.findByText('dropped.txt');

    await expect(submittedNames(input)).toEqual(['picked.txt', 'dropped.txt']);

    pick(input, textFile('picked-again.txt'));
    await canvas.findByText('picked-again.txt');
    await expect(submittedNames(input)).toEqual([
      'picked.txt',
      'dropped.txt',
      'picked-again.txt',
    ]);
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

// ブラウザが accept を当てるのは選択ダイアログだけなので、ドロップで届いた
// ファイルは FileField が選り分ける。当たらない分は一覧にも送信にも入らない
export const DropSkipsFilesOutsideAccept: Story = {
  args: {
    accept: 'image/*',
    multiple: true,
  },
  render: DropzoneRender,
  play: async ({ canvas, canvasElement }) => {
    drag(dropzoneOf(canvasElement), [
      new File(['png'], 'photo.png', { type: 'image/png' }),
      new File(['pdf'], 'report.pdf', { type: 'application/pdf' }),
    ]).drop();
    await canvas.findByText('photo.png');

    await expect(canvas.queryByText('report.pdf')).not.toBeInTheDocument();
    await expect(submittedNames(fileInputOf(canvasElement))).toEqual([
      'photo.png',
    ]);
  },
};

// 当たるファイルが 1 つも無いドロップは、選んであったファイルを置き換えず、
// onChange も input イベントも出さない
export const DropOfRejectedFilesKeepsTheSelection: Story = {
  args: {
    accept: 'image/*',
    onChange: fn(),
  },
  render: DropzoneRender,
  play: async ({ args, canvas, canvasElement }) => {
    const input = fileInputOf(canvasElement);
    pick(input, new File(['png'], 'photo.png', { type: 'image/png' }));
    await canvas.findByText('photo.png');
    const onInput = fn();
    input.addEventListener('input', onInput);

    drag(dropzoneOf(canvasElement), [
      new File(['pdf'], 'report.pdf', { type: 'application/pdf' }),
    ]).drop();

    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await expect(onInput).not.toHaveBeenCalled();
    await expect(submittedNames(input)).toEqual(['photo.png']);
    await expect(canvas.getByText('photo.png')).toBeInTheDocument();
  },
};
