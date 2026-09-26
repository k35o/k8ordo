import { useForm } from '@k8ordo/form';
import type { FormState } from '@k8ordo/form';
import { formFields, parseForm } from '@k8ordo/form/server';
import { useActionState } from 'react';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { FormControl } from '../form-control';
import { Combobox } from './combobox';

const schema = z.object({
  prefecture: z.enum(['tokyo', 'osaka', 'kyoto'], '都道府県を選んでください'),
});
const fields = formFields(schema);

const OPTIONS = [
  { value: 'tokyo', label: '東京都' },
  { value: 'osaka', label: '大阪府' },
  { value: 'kyoto', label: '京都府' },
];

// サーバーが最後に受け取った値。成功したときだけ入る
let received: unknown;

const AddressForm = ({ defaultValue }: { defaultValue?: string }) => {
  const [state, action] = useActionState(
    (_previous: FormState, formData: FormData): Promise<FormState> => {
      const parsed = parseForm(schema, formData);
      received = parsed.success ? parsed.data : undefined;
      return Promise.resolve(parsed.state);
    },
    {},
  );
  const form = useForm(fields, state);
  const prefecture = form.field('prefecture');

  return (
    <form {...form.props} action={action}>
      <FormControl
        errorText={prefecture.error}
        invalid={prefecture.invalid}
        label="都道府県"
        renderInput={(props) => (
          <Combobox
            {...props}
            {...prefecture.input}
            defaultValue={prefecture.input.defaultValue ?? defaultValue}
            options={OPTIONS}
          />
        )}
        required={prefecture.required}
      />
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

const combobox = () => page.getByRole('combobox').element() as HTMLInputElement;

const choose = async (label: string) => {
  await userEvent.click(combobox());
  await userEvent.click(page.getByRole('option', { name: label }));
};

const submit = () => {
  combobox().form?.requestSubmit();
};

const isDirty = () =>
  document.querySelector('[data-testid="dirty"]')?.textContent;

beforeEach(() => {
  received = undefined;
});

describe('Combobox と formFields', () => {
  it('導かれた属性を、type を抜かずにそのまま受け、選んだ値を name で送る', async () => {
    await render(<AddressForm />);

    await choose('大阪府');
    submit();

    await expect.poll(() => received).toStrictEqual({ prefecture: 'osaka' });
    // 名前を持つのは送るための要素で、見えている欄ではない
    expect(combobox()).not.toHaveAttribute('name');
  });

  it('選ばずに送ると zod の文言を出し、見えている欄へフォーカスを移す', async () => {
    await render(<AddressForm />);

    submit();

    await expect
      .element(page.getByText('都道府県を選んでください'))
      .toBeVisible();
    await expect.element(page.getByRole('combobox')).toHaveFocus();
  });

  it('選択の変化をフォームが知り、reset で既定の値と表示名に戻る', async () => {
    await render(<AddressForm defaultValue="kyoto" />);
    expect(combobox()).toHaveValue('京都府');
    expect(isDirty()).toBe('false');

    await choose('東京都');
    await expect.poll(isDirty).toBe('true');

    combobox().form?.reset();

    await expect.poll(isDirty).toBe('false');
    await expect.poll(() => combobox().value).toBe('京都府');
  });
});
