import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { FormControl } from '../form-control';
import { DateField } from './date-field';

const fields = formFields(
  z.object({ eventDate: z.iso.date('日付を入力してください') }),
);

const EventForm = () => {
  const form = useForm(fields);
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
      <button type="button">次へ</button>
    </form>
  );
};

const input = () =>
  page.getByLabelText('開催日', { exact: false }).element() as HTMLInputElement;

describe('DateField と formFields', () => {
  it('z.iso.date() から導いた属性を、type を抜かずにそのまま受ける', async () => {
    await render(<EventForm />);

    expect(input()).toHaveAttribute('name', 'eventDate');
    expect(input()).toHaveAttribute('type', 'date');
    expect(input()).toBeRequired();
  });

  it('触れて離れると zod の文言でエラーを出し、日付を入れると消す', async () => {
    await render(<EventForm />);

    // 日付入力の中では Tab が年・月・日の区画を移るので、前へ抜けて離れる
    input().focus();
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await expect
      .element(page.getByText('日付を入力してください'))
      .toBeVisible();
    expect(input()).toHaveAttribute('aria-invalid', 'true');

    await userEvent.fill(input(), '2023-01-20');

    expect(input()).toHaveValue('2023-01-20');
    await expect
      .element(page.getByText('日付を入力してください'))
      .not.toBeInTheDocument();
  });
});
