import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { NumberField } from './number-field';

const meta: Meta<typeof NumberField> = {
  title: 'components/form/number-field',
  component: NumberField,
  args: {
    id: 'textfield',
    'aria-describedby': 'numberfield-feedback',
    defaultValue: 0,
  },
  parameters: {
    a11y: {
      options: {
        rules: {
          // NumberField単体ではラベルを付随しない
          'label-title-only': { enabled: false },
          label: { enabled: false },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.type(input, '2.0[Tab]');

    await expect(input).toHaveValue('2');

    await userEvent.click(input);

    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveValue('0');
  },
};

export const Min0Max100: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    min: 0,
    max: 100,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.type(input, '-10[Tab]');

    await expect(input).toHaveValue('0');

    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveValue('0');

    await userEvent.type(input, '111[Tab]');

    await expect(input).toHaveValue('100');

    await userEvent.keyboard('{ArrowUp}');

    await expect(input).toHaveValue('100');
  },
};

export const NegativeDecimal: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    min: -10,
    precision: 1,
    step: 0.1,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '-1.5[Tab]');

    await expect(input).toHaveValue('-1.5');
    await expect(input).toBeValid();
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 5,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.type(input, '9');
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.click(
      canvas.getByRole('button', { name: '増やす', hidden: true }),
    );

    await expect(input).toHaveValue('5');
  },
};

const PendingRender = () => (
  <form
    action={async () => {
      // 送信中のまま止めておき、その間のキー操作を見る
      await new Promise<void>(() => {});
    }}
  >
    <NumberField defaultValue={5} id="number-field-pending" />
    <button type="submit">送信</button>
  </form>
);

export const IgnoresArrowKeysWhilePending: Story = {
  render: () => <PendingRender />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    await waitFor(async () => {
      await expect(input).toHaveAttribute('readonly');
    });

    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveValue('5');
  },
};

export const PassesThroughHandlers: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    onKeyDown: fn(),
    onBlur: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}');

    await expect(args.onKeyDown).toHaveBeenCalled();
    await expect(input).toHaveValue('1');

    await userEvent.tab();

    await expect(args.onBlur).toHaveBeenCalled();
    await expect(input).toHaveValue('1');
  },
};

export const Precision: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    precision: 2,
    step: 0.01,
  },
};

export const Placeholder: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    placeholder: '10.2',
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

const RefRender = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <NumberField defaultValue={0} id="number-field-ref" ref={ref} />
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

    await expect(canvas.getByRole('spinbutton')).toHaveFocus();
  },
};
