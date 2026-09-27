import { useForm } from '@k8ordo/form';
import type { FormState } from '@k8ordo/form';
import { formFields, parseForm } from '@k8ordo/form/server';
import { useActionState } from 'react';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { FormControl } from '../form-control';
import { ColorPicker } from './color-picker';

const schema = z.object({
  accent: z
    .string()
    .regex(/^#[0-9a-f]{6}$/u, '色を #rrggbb で入力してください'),
});
const fields = formFields(schema);

// サーバーが最後に受け取った値。成功したときだけ入る
let received: unknown;

const ThemeForm = () => {
  const [state, action] = useActionState(
    (_previous: FormState, formData: FormData): Promise<FormState> => {
      const parsed = parseForm(schema, formData);
      received = parsed.success ? parsed.data : undefined;
      return Promise.resolve(parsed.state);
    },
    {},
  );
  const form = useForm(fields, state);
  const accent = form.field('accent');

  return (
    <form {...form.props} action={action}>
      <FormControl
        errorText={accent.error}
        invalid={accent.invalid}
        label="テーマの色"
        renderInput={(props) => (
          <ColorPicker
            {...props}
            {...accent.input}
            defaultValue={accent.input.defaultValue ?? '#0d9488'}
            swatches={[
              { value: '#0d9488', label: 'ティール' },
              { value: '#f97316', label: 'オレンジ' },
            ]}
          />
        )}
        required={accent.required}
      />
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

const input = () =>
  page
    .getByLabelText('テーマの色', { exact: false })
    .element() as HTMLInputElement;

const isDirty = () =>
  document.querySelector('[data-testid="dirty"]')?.textContent;

// range の矢印キーは userEvent が扱わないので、ブラウザがつまみを動かしたとき
// と同じく値を置いて input を出す
const slide = (name: string, value: number) => {
  const slider = page
    .getByRole('slider', { name })
    .element() as HTMLInputElement;
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set?.call(slider, String(value));
  slider.dispatchEvent(new Event('input', { bubbles: true }));
};

beforeEach(() => {
  received = undefined;
});

describe('ColorPicker と formFields', () => {
  it('導かれた属性を、type を抜かずにそのまま受ける', async () => {
    await render(<ThemeForm />);

    expect(input()).toHaveAttribute('name', 'accent');
    expect(input()).toHaveAttribute('type', 'text');
    expect(input()).toHaveAttribute('pattern');
    expect(input()).toBeRequired();
  });

  it('見本を押すと値が欄に入り、フォームは変更として受け取る', async () => {
    await render(<ThemeForm />);
    expect(isDirty()).toBe('false');

    await userEvent.click(page.getByRole('button', { name: 'オレンジ' }));

    expect(input()).toHaveValue('#f97316');
    await expect.poll(isDirty).toBe('true');
  });

  it('つまみを動かしてもフォームに届く', async () => {
    await render(<ThemeForm />);

    slide('Hue', 0);

    expect(input()).toHaveValue('#960d0d');
    await expect.poll(isDirty).toBe('true');
  });

  it('reset で描画時の色に戻り、つまみと見本も追いつく', async () => {
    await render(<ThemeForm />);
    await userEvent.click(page.getByRole('button', { name: 'オレンジ' }));
    await expect.poll(isDirty).toBe('true');

    input().form?.reset();

    await expect.poll(() => input().value).toBe('#0d9488');
    await expect.poll(isDirty).toBe('false');
    await expect
      .element(page.getByRole('slider', { name: 'Hue' }))
      .toHaveValue('175');
    await expect
      .element(page.getByRole('button', { name: 'ティール' }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('大文字や # なしで打っても、Enter で送る前に #rrggbb にそろえて届く', async () => {
    await render(<ThemeForm />);

    await userEvent.clear(input());
    await userEvent.type(input(), 'F97316{Enter}');

    await expect.poll(() => received).toStrictEqual({ accent: '#f97316' });
  });

  it('色でないまま離れると zod の文言を出す', async () => {
    await render(<ThemeForm />);

    await userEvent.clear(input());
    await userEvent.type(input(), '#12');
    await userEvent.tab();

    await expect
      .element(page.getByText('色を #rrggbb で入力してください'))
      .toBeVisible();
  });
});
