import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';

import { Radio } from '../radio';
import { TextField } from '../text-field';
import { FormControl } from './form-control';

type RenderInputProps = {
  id: string;
  'aria-describedby': string | undefined;
  'aria-labelledby': string;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
};

const RenderInput = (props: RenderInputProps) => {
  const [state, setState] = useState('');
  return (
    <TextField
      {...props}
      onChange={(e) => {
        setState(e.target.value);
      }}
      value={state}
    />
  );
};

const meta: Meta<typeof FormControl> = {
  title: 'components/form/form-control',
  component: FormControl,
  args: {
    renderInput: (props) => <RenderInput {...props} />,
  },
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const Default: Story = {
  args: {
    label: 'メールアドレス',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'メールアドレス' }),
    ).toBeVisible();
    // fieldset で包むと、ラベルは label 要素に付くのでグループ側が名前の無い
    // role="group" になる。1 フィールドをグループにしないことを固定する。
    await expect(canvas.queryAllByRole('group')).toHaveLength(0);
    await expect(canvasElement.querySelector('fieldset')).toBeNull();
  },
};

export const HelpText: Story = {
  args: {
    label: 'メールアドレス',
    helpText: 'RFCに準拠したメールアドレスを入力してください。',
  },
};

export const Required: Story = {
  args: {
    label: 'メールアドレス',
    helpText: 'RFCに準拠したメールアドレスを入力してください。',
    required: true,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'メールアドレス 必須' });

    await expect(input).toBeRequired();
  },
};

export const Error: Story = {
  args: {
    label: 'メールアドレス',
    helpText: 'RFCに準拠したメールアドレスを入力してください。',
    invalid: true,
    errorText: 'メールアドレスが正しくありません。',
    required: true,
  },
};

export const ErrorWithoutText: Story = {
  args: {
    label: 'メールアドレス',
    helpText: 'RFCに準拠したメールアドレスを入力してください。',
    invalid: true,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'メールアドレス',
    helpText: 'RFCに準拠したメールアドレスを入力してください。',
    disabled: true,
  },
};

export const Group: Story = {
  args: {
    label: 'プラン',
    helpText: 'あとから変えられます。',
    labelAs: 'group',
    required: true,
    renderInput: (props) => (
      <Radio
        {...props}
        name="plan"
        options={[
          { value: 'free', label: '無料' },
          { value: 'pro', label: 'プロ' },
        ]}
      />
    ),
  },
  play: async ({ canvas, canvasElement }) => {
    const group = canvas.getByRole('radiogroup', { name: 'プラン 必須' });

    await expect(group).toHaveAccessibleDescription('あとから変えられます。');
    await expect(canvas.queryAllByRole('group')).toHaveLength(0);
    await expect(
      canvasElement.querySelector('fieldset, legend, label[for]'),
    ).toBeNull();
    await expect(canvas.getByRole('radio', { name: '無料' })).toBeRequired();
  },
};
