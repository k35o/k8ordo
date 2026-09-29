import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { afterRenderingUpdate } from '../../../../.storybook/focus';
import {
  finishPending,
  PendingForm,
} from '../../../../.storybook/pending-form';
import { Radio } from './radio';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
] as const;

const meta: Meta<typeof Radio> = {
  title: 'components/form/radio',
  component: Radio,
  args: {
    disabled: false,
    'aria-labelledby': 'radio-story-label',
    options,
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

const DefaultRender = (props: ComponentProps<typeof Radio>) => {
  const [value, setValue] = useState('react');
  const { defaultValue: _defaultValue, ...radioProps } = props;

  return (
    <div className="w-full max-w-md">
      <p
        className="text-fg-base mb-3 font-medium"
        id={props['aria-labelledby']}
      >
        Framework
      </p>
      <Radio
        {...radioProps}
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
        value={value}
      />
    </div>
  );
};

export const Default: Story = {
  render: (props) => <DefaultRender {...props} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'vue',
    disabled: true,
  },
};

// 送信中もフォーカスを持ち続け、押しても矢印キーでも選び直さない。Enter で
// 送ると、選んでいるラジオにフォーカスがあるまま送信中になる
export const PendingKeepsFocus: Story = {
  args: { onChange: fn() },
  render: (props) => (
    <PendingForm>
      <p id={props['aria-labelledby']}>Framework</p>
      <Radio
        aria-labelledby={props['aria-labelledby']}
        defaultValue="react"
        name="framework"
        onChange={props.onChange}
        options={props.options}
      />
    </PendingForm>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const react = canvas.getByRole<HTMLInputElement>('radio', {
      name: 'React',
    });

    try {
      react.focus();
      react.form?.requestSubmit();
      await canvas.findByText('送信中');
      await afterRenderingUpdate();

      await expect(react).toHaveFocus();
      await Promise.all(
        canvas.getAllByRole('radio').map(async (radio) => {
          await expect(radio).toHaveAttribute('aria-disabled', 'true');
        }),
      );

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.click(canvas.getByText('Svelte'));
      await expect(react).toBeChecked();
    } finally {
      finishPending();
    }
    await waitFor(async () => {
      await expect(react).not.toHaveAttribute('aria-disabled');
    });
    await expect(args.onChange).not.toHaveBeenCalled();

    // 送信中に選びかけたぶんを覚えていると、次に本当に選んでも知らせない
    await userEvent.click(canvas.getByText('Vue'));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith('vue', expect.anything());
  },
};

export const RequiredUntilSelected: Story = {
  args: {
    required: true,
  },
  play: async ({ canvas, userEvent }) => {
    const react = canvas.getByRole('radio', { name: 'React' });

    await expect(react).toBeInvalid();

    await userEvent.click(canvas.getByRole('radio', { name: 'Vue' }));

    await expect(react).toBeValid();
  },
};

const selectionDotOf = (radio: HTMLElement) =>
  radio.closest('label')?.querySelector('[aria-hidden] > span');

// 点は opacity でフェードするので、切り替わり切るのを待つ
export const SelectionFollowsReset: Story = {
  render: () => (
    <form className="flex flex-col items-start gap-2">
      <Radio
        aria-labelledby="radio-story-label"
        defaultValue="react"
        options={options}
      />
      <button type="reset">reset</button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const react = canvas.getByRole('radio', { name: 'React' });
    const vue = canvas.getByRole('radio', { name: 'Vue' });

    await userEvent.click(vue);

    await waitFor(async () => {
      await expect(selectionDotOf(vue)).toBeVisible();
    });

    await userEvent.click(canvas.getByRole('button', { name: 'reset' }));

    await expect(react).toBeChecked();
    await waitFor(async () => {
      await expect(selectionDotOf(vue)).not.toBeVisible();
    });
    await waitFor(async () => {
      await expect(selectionDotOf(react)).toBeVisible();
    });
  },
};

// FormControl の renderInput から受け取る invalid を radiogroup の aria-invalid として伝える
export const Invalid: Story = {
  args: {
    defaultValue: 'vue',
    invalid: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};
