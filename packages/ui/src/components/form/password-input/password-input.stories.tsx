import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect } from 'storybook/test';
import { z } from 'zod';

import {
  ActionForm,
  fill,
  memo,
  MemoField,
} from '../../../../.storybook/action-form';
import { FormControl } from '../form-control';
import { PasswordInput } from './password-input';

import styles from './password-input.stories.module.css';

const meta: Meta<typeof PasswordInput> = {
  title: 'components/form/password-input',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
  args: {
    invalid: false,
    disabled: false,
    required: false,
    placeholder: 'Enter your password',
    defaultValue: 'secret-password',
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

// type は show/hide トグルが占有するため利用者に開放していない
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Enter your password');

    await expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(
      canvas.getByRole('button', { name: 'パスワードを表示' }),
    );

    await expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(
      canvas.getByRole('button', { name: 'パスワードを非表示' }),
    );

    await expect(input).toHaveAttribute('type', 'password');
  },
};

export const Empty: Story = {
  args: {
    defaultValue: undefined,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: 'too-short',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

const RefRender = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.column}>
      <PasswordInput placeholder="password" ref={ref} />
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

    await expect(canvas.getByPlaceholderText('password')).toHaveFocus();
  },
};

const login = z.object({
  password: z
    .string()
    .min(8, '8文字以上で入力してください')
    .meta({ input: 'password' }),
  memo,
});
const loginFields = formFields(login);

const LoginForm = () => (
  <ActionForm fields={loginFields} serve={(data) => parseForm(login, data)}>
    {(form) => {
      const password = form.field('password');
      return (
        <>
          <FormControl
            errorText={password.error}
            invalid={password.invalid}
            label="パスワード"
            renderInput={(props) => (
              <PasswordInput {...props} {...password.input} />
            )}
            required={password.required}
          />
          <MemoField field={form.field('memo')} />
        </>
      );
    }}
  </ActionForm>
);

// @k8ordo/form の formFields を広げるだけでつながる
export const WithForm: Story = {
  render: () => <LoginForm />,
  play: async ({ canvas, userEvent }) => {
    // 表示を切り替えるボタンも名前に「パスワード」を含むので、input に絞る
    const password = () =>
      canvas.getByLabelText('パスワード', { exact: false, selector: 'input' });

    // 導かれた type="password" を広げても、表示の切り替えが効く
    await expect(password()).toHaveAttribute('type', 'password');
    await userEvent.click(
      canvas.getByRole('button', { name: 'パスワードを表示' }),
    );
    await expect(password()).toHaveAttribute('type', 'text');

    // 送信に失敗しても、入力したパスワードは描き直さない
    await fill(userEvent, password(), 'correct-horse');
    await fill(
      userEvent,
      canvas.getByLabelText('メモ', { exact: false }),
      '却下',
    );
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    await expect(await canvas.findByText('却下されました')).toBeVisible();
    await expect(password()).toHaveValue('');
  },
};
