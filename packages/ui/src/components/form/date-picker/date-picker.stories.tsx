import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import { FormControl } from '../form-control';
import { DatePicker } from './date-picker';

const meta: Meta<typeof DatePicker> = {
  title: 'components/form/date-picker',
  component: DatePicker,
  decorators: [
    (Story) => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
  // カレンダーの月名・曜日名はページの言語で書く。テストの文言を固定するため英語にする
  beforeEach: () => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = 'en-US';
    return () => {
      document.documentElement.lang = previous;
    };
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Storybook は現在時刻を 2023-01-02 に固定している
export const Default: Story = {
  args: {
    'aria-label': '開催日',
    name: 'eventDate',
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByLabelText<HTMLInputElement>('開催日');
    const trigger = canvas.getByRole('button', { name: 'カレンダーから選ぶ' });

    await userEvent.click(trigger);
    await expect(
      await canvas.findByRole('dialog', { name: '日付を選ぶ' }),
    ).toBeVisible();
    // 未入力なら今日にフォーカスを置く
    await waitFor(async () => {
      await expect(
        canvas.getByRole('button', { name: 'Monday, January 2, 2023' }),
      ).toHaveFocus();
    });

    await userEvent.keyboard('{ArrowRight}{Enter}');

    await expect(input).toHaveValue('2023-01-03');
    await expect(args.onChange).toHaveBeenCalledWith('2023-01-03');
    await waitFor(async () => {
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
  },
};

export const OpensAtTheEnteredDate: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-03-15',
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'カレンダーから選ぶ' }),
    );

    await expect(
      await canvas.findByRole('grid', { name: 'March 2023' }),
    ).toBeInTheDocument();
    await waitFor(async () => {
      await expect(
        canvas.getByRole('button', { name: 'Wednesday, March 15, 2023' }),
      ).toHaveFocus();
    });
    await expect(
      canvas.getByRole('gridcell', { selected: true }),
    ).toHaveTextContent('15');
  },
};

export const EscapeKeepsTheValue: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-03-15',
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'カレンダーから選ぶ' });
    await userEvent.click(trigger);
    await canvas.findByRole('dialog');

    await userEvent.keyboard('{ArrowRight}{Escape}');

    await waitFor(async () => {
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await expect(canvas.getByLabelText('開催日')).toHaveValue('2023-03-15');
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(trigger).toHaveFocus();
  },
};

export const WithMinAndMax: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-01-10',
    min: '2023-01-05',
    max: '2023-01-20',
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'カレンダーから選ぶ' }),
    );

    await expect(
      await canvas.findByRole('button', {
        name: 'Saturday, January 21, 2023',
      }),
    ).toHaveAttribute('aria-disabled', 'true');
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-01-10',
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('開催日')).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'カレンダーから選ぶ' }),
    ).toBeDisabled();
  },
};

export const ReadOnly: Story = {
  args: {
    'aria-label': '開催日',
    defaultValue: '2023-01-10',
    readOnly: true,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'カレンダーから選ぶ' }),
    ).toBeDisabled();
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

const ControlledRender = () => {
  const [value, setValue] = useState('');
  return (
    <div className="flex flex-col gap-4">
      <DatePicker aria-label="開催日" onChange={setValue} value={value} />
      <p data-testid="value">{value === '' ? '未入力' : value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledRender />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('開催日');

    await userEvent.type(input, '2023-02-14');
    await expect(canvas.getByTestId('value')).toHaveTextContent('2023-02-14');

    await userEvent.click(
      canvas.getByRole('button', { name: 'カレンダーから選ぶ' }),
    );
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Tuesday, February 28, 2023',
      }),
    );
    await expect(canvas.getByTestId('value')).toHaveTextContent('2023-02-28');
    await expect(input).toHaveValue('2023-02-28');
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
        renderInput={(props) => <DatePicker {...props} {...eventDate.input} />}
        required={eventDate.required}
      />
      <p data-testid="dirty">{form.isDirty ? '変更あり' : '変更なし'}</p>
    </form>
  );
};

// カレンダーで選んだ日付も、打ち込んだのと同じくフォームに伝わる
export const WithFormFields: Story = {
  render: () => <EventForm />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText<HTMLInputElement>(/開催日/u);

    await expect(input).toHaveAttribute('name', 'eventDate');
    await expect(input).toBeRequired();

    input.focus();
    await userEvent.tab();
    await expect(
      await canvas.findByText('日付を入力してください'),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole('button', { name: 'カレンダーから選ぶ' }),
    );
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Friday, January 20, 2023' }),
    );

    await expect(input).toHaveValue('2023-01-20');
    await waitFor(async () => {
      await expect(
        canvas.queryByText('日付を入力してください'),
      ).not.toBeInTheDocument();
    });
    await expect(canvas.getByTestId('dirty')).toHaveTextContent('変更あり');
  },
};
