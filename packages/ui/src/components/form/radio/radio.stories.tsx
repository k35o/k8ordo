import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, waitFor } from 'storybook/test';

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
