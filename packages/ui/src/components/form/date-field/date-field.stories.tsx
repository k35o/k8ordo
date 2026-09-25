import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { z } from 'zod';

import { FormControl } from '../form-control';
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

const eventFields = formFields(
  z.object({ eventDate: z.iso.date('日付を入力してください') }),
);

const EventForm = () => {
  const form = useForm(eventFields);
  const eventDate = form.field('eventDate');

  return (
    <form {...form.props}>
      <FormControl
        errorText={eventDate.error}
        invalid={eventDate.invalid}
        label="開催日"
        renderInput={(props) => <DateField {...props} {...eventDate.input} />}
        required={eventDate.required}
      />
    </form>
  );
};

// formFields が z.iso.date() から導いた属性を、そのまま spread して受け取れる
export const WithFormFields: Story = {
  render: () => <EventForm />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText<HTMLInputElement>(/開催日/u);

    await expect(input).toHaveAttribute('name', 'eventDate');
    await expect(input).toHaveAttribute('type', 'date');
    await expect(input).toBeRequired();

    // 触れて離れると、zod の文言でブラウザの判定を伝える
    input.focus();
    await userEvent.tab();
    await expect(
      await canvas.findByText('日付を入力してください'),
    ).toBeInTheDocument();
    await expect(input).toHaveAttribute('aria-invalid', 'true');

    await userEvent.type(input, '2023-01-20');
    await expect(input).toHaveValue('2023-01-20');
    await expect(
      canvas.queryByText('日付を入力してください'),
    ).not.toBeInTheDocument();
  },
};
