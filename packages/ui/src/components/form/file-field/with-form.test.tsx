import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { FileField } from '.';
import { FormControl } from '../form-control';

const fields = formFields(
  z.object({ attachment: z.file('ファイルを選んでください') }),
);

const AttachmentForm = () => {
  const form = useForm(fields);
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
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

const fileInput = () =>
  document.querySelector<HTMLInputElement>('input[type="file"]')!;
const dropzone = () =>
  document.querySelector<HTMLElement>('input[type="file"] ~ div')!;

// ブラウザがファイルを渡すのと同じく、DataTransfer に載せた DragEvent を送る
const drop = (target: Element, files: File[]) => {
  const dataTransfer = new DataTransfer();
  for (const file of files) {
    dataTransfer.items.add(file);
  }
  for (const type of ['dragenter', 'dragover', 'drop']) {
    target.dispatchEvent(
      new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer }),
    );
  }
};

describe('FileField.Dropzone と formFields', () => {
  it('z.file() から導いた属性をそのまま広げて受ける', async () => {
    await render(<AttachmentForm />);

    expect(fileInput()).toHaveAttribute('name', 'attachment');
    expect(fileInput()).toBeRequired();
  });

  it('ドロップしたファイルも、選んだときと同じくエラーを消し、変更ありにする', async () => {
    await render(<AttachmentForm />);

    fileInput().focus();
    await userEvent.tab();
    await expect
      .element(page.getByText('ファイルを選んでください'))
      .toBeVisible();

    drop(dropzone(), [
      new File(['content'], 'report.pdf', { type: 'application/pdf' }),
    ]);

    await expect.element(page.getByText('report.pdf')).toBeVisible();
    expect(fileInput().files).toHaveLength(1);
    await expect
      .element(page.getByText('ファイルを選んでください'))
      .not.toBeInTheDocument();
    await expect.element(page.getByTestId('dirty')).toHaveTextContent('true');
  });
});
