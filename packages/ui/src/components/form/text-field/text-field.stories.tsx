import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import {
  ActionForm,
  fill,
  memo,
  MemoField,
} from '../../../../.storybook/action-form';
import { tokenColor } from '../../../../.storybook/tokens';
import { FormControl } from '../form-control';
import { TextField } from './text-field';

import styles from './text-field.stories.module.css';

const meta: Meta<typeof TextField> = {
  title: 'components/form/text-field',
  component: TextField,
  args: {
    id: 'textfield',
    'aria-label': '名前',
    'aria-describedby': 'textfield-feedback',
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveAttribute('type', 'text');
  },
};

export const Email: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    type: 'email',
    placeholder: 'mail@example.com',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveAttribute('type', 'email');
  },
};

const RefRender = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.column}>
      <TextField aria-label="名前" id="text-field-ref" ref={ref} />
      <button
        onClick={() => {
          ref.current?.focus();
        }}
        type="button"
      >
        focus
      </button>
    </div>
  );
};

export const ForwardsRef: Story = {
  render: () => <RefRender />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'focus' }));

    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};

export const Placeholder: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    placeholder: 'ID',
  },
};

export const Invalid: Story = {
  args: {
    disabled: false,
    invalid: true,
    required: false,
  },
};

// フォーカスの輪が付いても、不正な値の枠線は消えない
export const InvalidWhileFocused: Story = {
  args: {
    disabled: false,
    invalid: true,
    required: false,
  },
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox');
    field.focus();

    await expect(field).toHaveFocus();
    await expect(getComputedStyle(field).borderColor).toBe(
      tokenColor('--color-border-error'),
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    invalid: false,
    required: false,
  },
};

// @k8ordo/form が z.iso.date() から導く type="date" のように、日付・時刻の入力も描く
export const DateInput: Story = {
  args: {
    type: 'date',
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('input')).toHaveAttribute(
      'type',
      'date',
    );
  },
};

const profile = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  email: z.email('メールアドレスの形式で入力してください'),
  birthday: z.iso.date('日付を入力してください'),
  memo,
});
const profileFields = formFields(profile);
const received = fn();

const ProfileForm = () => (
  <ActionForm
    fields={profileFields}
    onReceive={received}
    serve={(data) => parseForm(profile, data)}
  >
    {(form) => {
      const title = form.field('title');
      const email = form.field('email');
      const birthday = form.field('birthday');
      return (
        <>
          <FormControl
            errorText={title.error}
            invalid={title.invalid}
            label="タイトル"
            renderInput={(props) => <TextField {...props} {...title.input} />}
            required={title.required}
          />
          <FormControl
            errorText={email.error}
            invalid={email.invalid}
            label="メール"
            renderInput={(props) => <TextField {...props} {...email.input} />}
            required={email.required}
          />
          <FormControl
            errorText={birthday.error}
            invalid={birthday.invalid}
            label="誕生日"
            renderInput={(props) => (
              <TextField {...props} {...birthday.input} />
            )}
            required={birthday.required}
          />
          <MemoField field={form.field('memo')} />
        </>
      );
    }}
  </ActionForm>
);

// @k8ordo/form の formFields を広げるだけでつながる
export const WithForm: Story = {
  render: () => <ProfileForm />,
  play: async ({ canvas, userEvent }) => {
    // FormControl のラベルは必須のバッジまで名前に含むので、前方で引く
    const field = (label: string) =>
      canvas.getByLabelText(label, { exact: false });
    const submit = () =>
      userEvent.click(canvas.getByRole('button', { name: '送信' }));

    // 導かれた type をそのまま描き、z.iso.date() は日付の入力になる
    await expect(field('メール')).toHaveAttribute('type', 'email');
    await expect(field('誕生日')).toHaveAttribute('type', 'date');

    // 空のまま離れると zod の文言を出し、入力すると消える
    await userEvent.click(field('タイトル'));
    await userEvent.tab();
    await expect(
      await canvas.findByText('タイトルを入力してください'),
    ).toBeVisible();
    await userEvent.type(field('タイトル'), 'a');
    await waitFor(() =>
      expect(
        canvas.queryByText('タイトルを入力してください'),
      ).not.toBeInTheDocument(),
    );

    // reset で描画時の値に戻り、isDirty も下りる
    await expect(await canvas.findByText('変更あり')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'リセット' }));
    await expect(field('タイトル')).toHaveValue('');
    await expect(await canvas.findByText('変更なし')).toBeVisible();

    // すべて満たして送ると値が届く
    await fill(userEvent, field('タイトル'), '秋の予定');
    await fill(userEvent, field('メール'), 'me@example.com');
    await fill(userEvent, field('誕生日'), '2026-09-25');
    await submit();
    await waitFor(() =>
      expect(received).toHaveBeenLastCalledWith({
        title: '秋の予定',
        email: 'me@example.com',
        birthday: '2026-09-25',
        memo: '',
      }),
    );

    // 送信に失敗したら入力を描き直し、最初に失敗した欄へフォーカスを移す
    await fill(userEvent, field('タイトル'), '秋の予定');
    await fill(userEvent, field('メール'), 'me@example.com');
    await fill(userEvent, field('誕生日'), '2026-09-25');
    await fill(userEvent, field('メモ'), '却下');
    await submit();
    await expect(await canvas.findByText('却下されました')).toBeVisible();
    await waitFor(() => expect(field('メモ')).toHaveFocus());
    await expect(field('タイトル')).toHaveValue('秋の予定');
    await expect(field('誕生日')).toHaveValue('2026-09-25');
  },
};
