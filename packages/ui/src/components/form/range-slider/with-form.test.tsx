import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { z } from 'zod';

import { FormControl } from '../form-control';
import { RangeSlider } from './range-slider';

const fields = formFields(
  z.object({
    priceMin: z.coerce.number().int().min(0).max(100),
    priceMax: z.coerce.number().int().min(0).max(100),
  }),
);

const PriceForm = () => {
  const form = useForm(fields);
  const priceMin = form.field('priceMin');
  const priceMax = form.field('priceMax');

  return (
    <form {...form.props}>
      <FormControl
        label="価格"
        renderInput={(props) => (
          <RangeSlider
            {...props}
            defaultValue={[20, 80]}
            max={Number(priceMax.input.max)}
            min={Number(priceMin.input.min)}
            name={[priceMin.input.name, priceMax.input.name]}
          />
        )}
        required
      />
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

const formOf = () => document.querySelector('form')!;
const thumbs = () => [
  ...document.querySelectorAll<HTMLInputElement>('input[type="range"]'),
];

// つまみを動かす。ドラッグと同じく値を入れて input イベントを出す
const slide = (thumb: HTMLInputElement, value: number) => {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set?.call(thumb, String(value));
  thumb.dispatchEvent(new Event('input', { bubbles: true }));
};

describe('RangeSlider と formFields', () => {
  it('2 つの欄を name の組で受け、それぞれ本物の input として送る', async () => {
    await render(<PriceForm />);

    expect(Object.fromEntries(new FormData(formOf()).entries())).toStrictEqual({
      priceMin: '20',
      priceMax: '80',
    });
  });

  it('FormControl の required は、グループではなく両方のつまみに届く', async () => {
    await render(<PriceForm />);

    expect(thumbs().map((thumb) => thumb.required)).toStrictEqual([true, true]);
    expect(page.getByRole('group').element()).not.toHaveAttribute('required');
  });

  it('つまみを動かすと変更ありになり、reset で値も塗りも戻る', async () => {
    await render(<PriceForm />);
    const [start] = thumbs();

    slide(start!, 21);
    await expect.element(page.getByTestId('dirty')).toHaveTextContent('true');
    expect(new FormData(formOf()).get('priceMin')).toBe('21');

    formOf().reset();

    await expect.element(page.getByTestId('dirty')).toHaveTextContent('false');
    expect(start).toHaveValue('20');
    await expect
      .poll(() =>
        page
          .getByRole('group')
          .element()
          .style.getPropertyValue('--range-start'),
      )
      .toBe('20%');
  });
});
