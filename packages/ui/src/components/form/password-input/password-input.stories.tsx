import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect } from 'storybook/test';

import { PasswordInput } from './password-input';

const meta: Meta<typeof PasswordInput> = {
  title: 'components/form/password-input',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
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
    <div className="flex flex-col items-start gap-2">
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
