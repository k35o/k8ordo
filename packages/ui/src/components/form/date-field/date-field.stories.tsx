import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { DateField } from './date-field';

const meta: Meta<typeof DateField> = {
  title: 'components/form/date-field',
  component: DateField,
  decorators: [
    (Story) => (
      <div className="w-72 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DateField>;

export const Default: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-01-15',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('開催日');

    await expect(input).toHaveAttribute('type', 'date');
    await expect(input).toHaveValue('2023-01-15');
  },
};

export const Invalid: Story = {
  args: {
    'aria-label': '開催日',
    invalid: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('開催日')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-01-15',
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('開催日')).toBeDisabled();
  },
};

export const ReadOnly: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-01-15',
    readOnly: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('開催日')).toHaveAttribute('readonly');
  },
};

export const WithMinAndMax: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-02-01',
    min: '2023-01-01',
    max: '2023-01-31',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText<HTMLInputElement>('開催日');

    // 範囲の判定はブラウザが持つ
    await expect(input.validity.rangeOverflow).toBe(true);
  },
};
