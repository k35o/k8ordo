import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect } from 'storybook/test';

import { TextField } from './text-field';

const meta: Meta<typeof TextField> = {
  title: 'components/form/text-field',
  component: TextField,
  args: {
    id: 'textfield',
    'aria-describedby': 'textfield-feedback',
  },
  parameters: {
    a11y: {
      options: {
        rules: {
          // TextField単体ではラベルを付随しない
          'label-title-only': { enabled: false },
          label: { enabled: false },
        },
      },
    },
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
    <div className="flex flex-col items-start gap-2">
      <TextField id="text-field-ref" ref={ref} />
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

export const Disabled: Story = {
  args: {
    disabled: true,
    invalid: false,
    required: false,
  },
};
