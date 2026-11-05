import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { z } from 'zod';

import { ActionForm, fill } from '../../../../.storybook/action-form';
import { FormControl } from '../form-control';
import { DateField } from './date-field';

import styles from './date-field.stories.module.css';

const meta: Meta<typeof DateField> = {
  title: 'components/form/date-field',
  component: DateField,
  decorators: [
    (Story) => (
      <div className={styles.frame}>
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

const meeting = z.object({ eventDate: z.iso.date('日付を入力してください') });
const meetingFields = formFields(meeting);

const MeetingForm = () => (
  <ActionForm fields={meetingFields} serve={(data) => parseForm(meeting, data)}>
    {(form) => {
      const eventDate = form.field('eventDate');
      return (
        <FormControl
          errorText={eventDate.error}
          invalid={eventDate.invalid}
          label="開催日"
          renderInput={(props) => <DateField {...props} {...eventDate.input} />}
          required={eventDate.required}
        />
      );
    }}
  </ActionForm>
);

// @k8ordo/form の formFields を広げるだけでつながる
export const WithForm: Story = {
  render: () => <MeetingForm />,
  play: async ({ canvas, userEvent }) => {
    const input = () => canvas.getByLabelText('開催日', { exact: false });

    // z.iso.date() から導いた属性を、type を抜かずにそのまま受ける
    await expect(input()).toHaveAttribute('name', 'eventDate');
    await expect(input()).toHaveAttribute('type', 'date');
    await expect(input()).toBeRequired();

    // 触れて離れると zod の文言でエラーを出し、日付を入れると消す
    await userEvent.click(input());
    await userEvent.tab();
    await expect(
      await canvas.findByText('日付を入力してください'),
    ).toBeVisible();
    await expect(input()).toHaveAttribute('aria-invalid', 'true');

    await fill(userEvent, input(), '2023-01-20');
    await expect(input()).toHaveValue('2023-01-20');
    await waitFor(() =>
      expect(
        canvas.queryByText('日付を入力してください'),
      ).not.toBeInTheDocument(),
    );
  },
};
