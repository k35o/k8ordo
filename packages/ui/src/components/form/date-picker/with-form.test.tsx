import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { FormControl } from '../form-control';
import { DatePicker } from './date-picker';

const fields = formFields(
  z.object({ checkIn: z.iso.date('日付を入力してください') }),
);

const BookingForm = () => {
  const form = useForm(fields);
  const checkIn = form.field('checkIn');

  return (
    <form {...form.props}>
      <FormControl
        errorText={checkIn.error}
        invalid={checkIn.invalid}
        label="チェックイン"
        renderInput={(props) => <DatePicker {...props} {...checkIn.input} />}
        required={checkIn.required}
      />
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

const input = () =>
  page
    .getByLabelText('チェックイン', { exact: false })
    .element() as HTMLInputElement;

describe('DatePicker と formFields', () => {
  it('z.iso.date() から導いた属性を、そのまま内側の日付入力が受ける', async () => {
    await render(<BookingForm />);

    expect(input()).toHaveAttribute('name', 'checkIn');
    expect(input()).toHaveAttribute('type', 'date');
    expect(input()).toBeRequired();
  });

  it('カレンダーで選んだ日付も、打ち込んだのと同じくエラーを消し、変更ありにする', async () => {
    await render(<BookingForm />);

    // 日付入力の中では Tab が年・月・日の区画を移るので、前へ抜けて離れる
    input().focus();
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await expect
      .element(page.getByText('日付を入力してください'))
      .toBeVisible();

    // このプロジェクトはロケール集合を定義しないので、組み込みの文言は英語になる
    await userEvent.click(
      page.getByRole('button', { name: 'Choose from calendar' }),
    );
    // 開くと、未入力なら今日にフォーカスがある。そのまま選ぶ
    await expect
      .poll(() => document.activeElement?.getAttribute('aria-current'))
      .toBe('date');
    await userEvent.keyboard('{Enter}');

    expect(input().value).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
    await expect
      .element(page.getByText('日付を入力してください'))
      .not.toBeInTheDocument();
    await expect.element(page.getByTestId('dirty')).toHaveTextContent('true');
  });
});
