import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { NumberField } from './number-field';

const meta: Meta<typeof NumberField> = {
  title: 'components/form/number-field',
  component: NumberField,
  args: {
    id: 'textfield',
    'aria-label': '数量',
    'aria-describedby': 'numberfield-feedback',
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

const PendingRender = () => {
  // 送信中のまま止めておき、その間のキー操作を見る。終わらない action のままに
  // すると、React が後から始まる action を同じ送信中として束ね、以降のストーリーの
  // action も完了しなくなるので、見終わったら終わらせる。
  const finishRef = useRef(() => {});

  return (
    <form
      action={async () => {
        await new Promise<void>((resolve) => {
          finishRef.current = () => {
            resolve();
          };
        });
      }}
    >
      <NumberField
        aria-label="数量"
        defaultValue={5}
        id="number-field-pending"
      />
      <button type="submit">送信</button>
      <button
        onClick={() => {
          finishRef.current();
        }}
        type="button"
      >
        送信を終える
      </button>
    </form>
  );
};

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

    await userEvent.click(canvas.getByRole('button', { name: '送信を終える' }));
    await waitFor(async () => {
      await expect(input).not.toHaveAttribute('readonly');
    });
  },
};

export const PassesThroughHandlers: Story = {
  args: {
    defaultValue: 0,
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

export const RoundsToPrecisionOnBlur: Story = {
  args: {
    precision: 0,
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '2.5[Tab]');

    await expect(args.onChange).toHaveBeenLastCalledWith(3);
    await expect(input).toHaveValue('3');
    await expect(input).toHaveAttribute('aria-valuenow', '3');
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
      <NumberField
        aria-label="数量"
        defaultValue={0}
        id="number-field-ref"
        ref={ref}
      />
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

const InFormRender: Story['render'] = (args) => (
  <form>
    <NumberField {...args} name="quantity" />
  </form>
);

const submittedValue = (input: HTMLInputElement) =>
  new FormData(input.form ?? undefined).get('quantity');

export const StartsEmptyWithoutDefaultValue: Story = {
  render: InFormRender,
  play: async ({ canvas }) => {
    const input = canvas.getByRole<HTMLInputElement>('spinbutton');

    await expect(input).toHaveValue('');
    await expect(input).not.toHaveAttribute('aria-valuenow');
    await expect(submittedValue(input)).toBe('');
  },
};

export const StaysEmptyOnBlur: Story = {
  render: InFormRender,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole<HTMLInputElement>('spinbutton');
    await userEvent.click(input);
    await userEvent.tab();

    await expect(input).toHaveValue('');
    await expect(input).not.toHaveAttribute('aria-valuenow');
    await expect(submittedValue(input)).toBe('');
  },
};

export const ClearingReportsNull: Story = {
  args: {
    defaultValue: 3,
    onChange: fn(),
  },
  render: InFormRender,
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole<HTMLInputElement>('spinbutton');
    await userEvent.clear(input);
    await userEvent.tab();

    await expect(args.onChange).toHaveBeenLastCalledWith(null);
    await expect(input).toHaveValue('');
    await expect(submittedValue(input)).toBe('');
  },
};

export const StepsFromZeroWhenEmpty: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveValue('0');
    await expect(input).toHaveAttribute('aria-valuenow', '0');
  },
};

export const StepsFromMinWhenEmptyAndZeroIsBelowMin: Story = {
  args: {
    min: 5,
    max: 10,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}');

    await expect(input).toHaveValue('5');
  },
};

export const StepsFromMaxWhenEmptyAndZeroIsAboveMax: Story = {
  args: {
    min: -10,
    max: -5,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveValue('-5');
  },
};

export const ResetsToDefaultValue: Story = {
  args: {
    defaultValue: 5,
  },
  render: InFormRender,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole<HTMLInputElement>('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '42');
    await userEvent.tab();

    await expect(input).toHaveValue('42');

    input.form?.reset();

    await expect(input).toHaveValue('5');
    await expect(submittedValue(input)).toBe('5');
    await waitFor(() => expect(input).toHaveAttribute('aria-valuenow', '5'));
  },
};

export const ResetsToEmptyWithoutDefaultValue: Story = {
  render: InFormRender,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole<HTMLInputElement>('spinbutton');
    await userEvent.type(input, '42');
    await userEvent.tab();

    input.form?.reset();

    await expect(input).toHaveValue('');
    await expect(submittedValue(input)).toBe('');
    await waitFor(() => expect(input).not.toHaveAttribute('aria-valuenow'));
  },
};

export const ReportsResetValueToOnChange: Story = {
  args: {
    defaultValue: 5,
    onChange: fn(),
  },
  render: InFormRender,
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole<HTMLInputElement>('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '42');
    await userEvent.tab();

    input.form?.reset();

    await expect(args.onChange).toHaveBeenLastCalledWith(5);
  },
};

export const ResetsAfterFormAction: Story = {
  args: {
    defaultValue: 5,
  },
  render: (args) => (
    <form action={async () => {}}>
      <NumberField {...args} name="quantity" />
      <button type="submit">submit</button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '42');
    await userEvent.click(canvas.getByRole('button', { name: 'submit' }));

    await waitFor(() => expect(input).toHaveValue('5'));
  },
};

export const KeepsControlledValueOnReset: Story = {
  args: {
    value: 3,
    onChange: fn(),
  },
  render: InFormRender,
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole<HTMLInputElement>('spinbutton');

    input.form?.reset();

    await expect(input).toHaveValue('3');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

const ControlledRender = () => {
  const [value, setValue] = useState<number | null>(3);

  return (
    <div className="flex flex-col items-start gap-2">
      <NumberField
        aria-label="数量"
        id="number-field-controlled"
        onChange={setValue}
        value={value}
      />
      <button
        onClick={() => {
          setValue(null);
        }}
        type="button"
      >
        clear
      </button>
      <button
        onClick={() => {
          setValue(7);
        }}
        type="button"
      >
        seven
      </button>
    </div>
  );
};

export const FollowsControlledValue: Story = {
  render: () => <ControlledRender />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');

    await expect(input).toHaveValue('3');

    await userEvent.click(canvas.getByRole('button', { name: 'clear' }));

    await expect(input).toHaveValue('');
    await expect(input).not.toHaveAttribute('aria-valuenow');

    await userEvent.click(canvas.getByRole('button', { name: 'seven' }));

    await expect(input).toHaveValue('7');
    await expect(input).toHaveAttribute('aria-valuenow', '7');
  },
};

export const ShowsControlledValueWhenParentKeepsIt: Story = {
  args: {
    value: 3,
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.tab();

    await expect(args.onChange).toHaveBeenLastCalledWith(null);
    await expect(input).toHaveValue('3');
  },
};

export const RequiredIsInvalidWhileEmpty: Story = {
  args: {
    required: true,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton');

    await expect(input).toBeInvalid();

    await userEvent.type(input, '1');

    await expect(input).toBeValid();
  },
};
