import { useRef, useState } from 'react';
import type { FC } from 'react';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

import { FormValue } from './form-value';

const OPTIONS = ['apple', 'banana', 'cherry'];
const NONE: string[] = [];

let inputEvents = 0;

// 見える側の代役。ボタンで選択を切り替え、FormValue が form に値を運ぶ
const Picker: FC<{
  defaultValues?: string[];
  multiple?: boolean;
  required?: boolean;
  // 制御モードの代役。既定値を持たず、reset を聞いても自分の値を戻さない
  controlled?: boolean;
}> = ({
  defaultValues = NONE,
  multiple = true,
  required = false,
  controlled = false,
}) => {
  const [values, setValues] = useState(defaultValues);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <form
      onInput={() => {
        inputEvents += 1;
      }}
    >
      <FormValue
        defaultValues={controlled ? undefined : defaultValues}
        disabled={false}
        focusTarget={trigger}
        multiple={multiple}
        name="fruit"
        onReset={() => {
          if (!controlled) {
            setValues(defaultValues);
          }
        }}
        required={required}
        values={values}
      />
      <button ref={trigger} type="button">
        trigger
      </button>
      {OPTIONS.map((option) => (
        <button
          key={option}
          onClick={() => {
            setValues((current) => {
              if (!multiple) {
                return [option];
              }
              return current.includes(option)
                ? current.filter((value) => value !== option)
                : [...current, option];
            });
          }}
          type="button"
        >
          {option}
        </button>
      ))}
      <button
        onClick={() => {
          setValues([]);
        }}
        type="button"
      >
        clear
      </button>
      <p data-testid="values">{values.join(',')}</p>
      <button type="reset">reset</button>
    </form>
  );
};

const form = () => document.querySelector('form') as HTMLFormElement;
const submitted = () => new FormData(form()).getAll('fruit');
const shown = () =>
  document.querySelector('[data-testid="values"]')?.textContent;
const carrier = () =>
  document.querySelector('select[name="fruit"]') as HTMLSelectElement;

beforeEach(() => {
  inputEvents = 0;
});

describe('FormValue', () => {
  it('選んだ値を、選んだ順に name で送る', async () => {
    const screen = await render(<Picker />);

    await screen.getByRole('button', { name: 'cherry' }).click();
    await screen.getByRole('button', { name: 'apple' }).click();

    expect(submitted()).toStrictEqual(['cherry', 'apple']);
  });

  it('値が変わるたびに input を 1 回だけ知らせる', async () => {
    const screen = await render(<Picker />);

    await screen.getByRole('button', { name: 'banana' }).click();
    expect(inputEvents).toBe(1);

    await screen.getByRole('button', { name: 'banana' }).click();
    expect(inputEvents).toBe(2);
    expect(submitted()).toStrictEqual([]);
  });

  it('reset ボタンで既定値に戻し、そのことを input としては知らせない', async () => {
    const screen = await render(<Picker defaultValues={['apple']} />);

    await screen.getByRole('button', { name: 'banana' }).click();
    await screen.getByRole('button', { name: 'apple' }).click();
    inputEvents = 0;

    await screen.getByRole('button', { name: 'reset' }).click();

    await expect.poll(shown).toBe('apple');
    expect(submitted()).toStrictEqual(['apple']);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(inputEvents).toBe(0);
  });

  it('form.reset() でも既定値に戻る', async () => {
    const screen = await render(<Picker defaultValues={['apple']} />);

    await screen.getByRole('button', { name: 'cherry' }).click();
    form().reset();

    await expect.poll(shown).toBe('apple');
    expect(submitted()).toStrictEqual(['apple']);
  });

  it('既定値との差を option の defaultSelected で持つので、選び直すと元の状態と見分けられる', async () => {
    const screen = await render(<Picker defaultValues={['apple']} />);
    const differs = () =>
      [...carrier().options].some(
        (option) => option.selected !== option.defaultSelected,
      );

    expect(differs()).toBe(false);
    await screen.getByRole('button', { name: 'apple' }).click();
    expect(differs()).toBe(true);
    await screen.getByRole('button', { name: 'apple' }).click();
    expect(differs()).toBe(false);
  });

  it('既定値を持たない（制御された）部品は、マウント時の値を基準にする', async () => {
    const screen = await render(
      <Picker controlled defaultValues={['apple']} />,
    );
    const differs = () =>
      [...carrier().options].some(
        (option) => option.selected !== option.defaultSelected,
      );

    expect(differs()).toBe(false);
    await screen.getByRole('button', { name: 'apple' }).click();
    expect(differs()).toBe(true);
    await screen.getByRole('button', { name: 'apple' }).click();
    expect(differs()).toBe(false);
  });

  it('描き直しで変わった既定値に、次の reset が戻す', async () => {
    const screen = await render(<Picker defaultValues={['apple']} />);
    await screen.rerender(<Picker defaultValues={['banana', 'cherry']} />);

    form().reset();

    await expect.poll(shown).toBe('banana,cherry');
    expect(submitted()).toStrictEqual(['banana', 'cherry']);
  });

  it('reset で値を戻さない（制御された）部品でも、送る値は見えている値に揃う', async () => {
    const screen = await render(
      <Picker controlled defaultValues={['apple']} />,
    );

    await screen.getByRole('button', { name: 'cherry' }).click();
    await screen.getByRole('button', { name: 'reset' }).click();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    await expect.poll(shown).toBe('apple,cherry');
    expect(submitted()).toStrictEqual(['apple', 'cherry']);
  });

  it('required のあいだは、何も選ばないとブラウザの検証に通らない', async () => {
    const screen = await render(<Picker required />);

    expect(carrier().validity.valueMissing).toBe(true);
    await screen.getByRole('button', { name: 'banana' }).click();
    expect(carrier().validity.valid).toBe(true);
    await screen.getByRole('button', { name: 'clear' }).click();
    expect(carrier().validity.valueMissing).toBe(true);
  });

  it('フォーカスを受けたら見える側へ移す', async () => {
    const screen = await render(<Picker />);

    carrier().focus();

    await expect
      .element(screen.getByRole('button', { name: 'trigger' }))
      .toHaveFocus();
  });

  it('単一選択では 1 つだけを送り、空なら required に掛かる', async () => {
    const screen = await render(<Picker multiple={false} required />);

    expect(carrier().validity.valueMissing).toBe(true);
    await screen.getByRole('button', { name: 'banana' }).click();
    await screen.getByRole('button', { name: 'cherry' }).click();

    expect(submitted()).toStrictEqual(['cherry']);
    expect(carrier().validity.valid).toBe(true);
  });

  it('送る値を持つ要素は支援技術に見せず、Tab でも止まらない', async () => {
    const screen = await render(<Picker />);

    expect(carrier().getAttribute('aria-hidden')).toBe('true');
    expect(carrier().tabIndex).toBe(-1);
    await screen.getByRole('button', { name: 'trigger' }).click();
    await userEvent.tab({ shift: true });
    expect(document.activeElement).not.toBe(carrier());
  });
});
