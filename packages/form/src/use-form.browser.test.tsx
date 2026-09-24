import { useActionState, useEffect, useState } from 'react';
import type { FC } from 'react';
import { render } from 'vitest-browser-react';
import { z } from 'zod';

import { useAsyncCheck } from './async-check';
import { formFields } from './derive/form-fields';
import { HiddenValue } from './hidden-value';
import { parseForm } from './parse/parse-form';
import { defineForm } from './rules/define-form';
import { sameAs } from './rules/rules';
import type { FormState } from './types';
import { useForm } from './use-form';

const signup = defineForm(
  z.object({
    email: z.email('メールアドレスの形式で入力してください'),
    password: z.string().min(8, '8文字以上で入力してください'),
    confirm: z.string(),
  }),
  [sameAs('confirm', 'password', 'パスワードが一致しません')],
);

const derived = formFields(signup);

const NO_STATE: FormState = {};

// Captured after each commit so a test can assert what the spread would put in
// the server-rendered markup.
let signupProps: object = {};

const Signup: FC<{
  state?: FormState;
  formErrorAt?: 'top' | 'bottom';
}> = ({ state = NO_STATE, formErrorAt = 'top' }) => {
  const form = useForm(derived, state);
  useEffect(() => {
    signupProps = form.props;
  });
  const email = form.field('email');
  const password = form.field('password');
  const confirm = form.field('confirm');
  const formError = form.formError.message !== undefined && (
    <p {...form.formError.props}>{form.formError.message}</p>
  );

  return (
    <form {...form.props}>
      {formErrorAt === 'top' && formError}

      <input aria-label="email" {...email.input} />
      <p data-testid="email-error">{email.error ?? ''}</p>

      <input aria-label="password" {...password.input} />
      <p data-testid="password-error">{password.error ?? ''}</p>

      <input aria-label="confirm" {...confirm.input} />
      <p data-testid="confirm-error">{confirm.error ?? ''}</p>

      {formErrorAt === 'bottom' && formError}

      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

const listSchema = z.object({
  items: z
    .array(z.object({ name: z.string().min(1, '品名は必須です') }))
    .max(2),
});
const listFields = formFields(listSchema);

const List: FC = () => {
  const form = useForm(listFields, {});
  const items = form.array('items');

  return (
    <form {...form.props}>
      {items.rows.map((row) => (
        <div key={row.key}>
          <input
            aria-label={`name-${String(row.index)}`}
            {...row.field('name').input}
          />
          <p data-testid={`name-error-${String(row.index)}`}>
            {row.field('name').error ?? ''}
          </p>
          <button onClick={row.remove} type="button">
            {`remove-${String(row.index)}`}
          </button>
        </div>
      ))}
      <button disabled={!items.canAdd} onClick={items.add} type="button">
        add
      </button>
      <p data-testid="count">{String(items.rows.length)}</p>
    </form>
  );
};

/**
 * Hands `useForm` a new state object on every render, which is what a caller
 * writing `useForm(fields, {})` does. Resetting on identity wiped the message
 * the blur had just produced.
 */
const Inline: FC = () => {
  const form = useForm(derived, { errors: {} });
  const email = form.field('email');

  return (
    <form {...form.props}>
      <input aria-label="email" {...email.input} />
      <input aria-label="password" {...form.field('password').input} />
      <p data-testid="email-error">{email.error ?? ''}</p>
    </form>
  );
};

const choiceSchema = z.object({
  color: z.enum(['red', 'blue']),
  agree: z.boolean(),
});
const choiceFields = formFields(choiceSchema);

const Choice: FC<{ state?: FormState }> = ({ state = NO_STATE }) => {
  const form = useForm(choiceFields, state);

  return (
    <form {...form.props}>
      <select aria-label="color" {...form.field('color').input}>
        <option value="red">red</option>
        <option value="blue">blue</option>
      </select>
      <input
        aria-label="agree"
        type="checkbox"
        {...form.field('agree').input}
      />
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

const groupSchema = z.object({ tags: z.array(z.enum(['a', 'b'])) });
const groupFields = formFields(groupSchema);

const Group: FC<{ state: FormState }> = ({ state }) => {
  const form = useForm(groupFields, state);
  const tags = form.field('tags');

  return (
    <form {...form.props}>
      {(['a', 'b'] as const).map((option) => (
        <input
          aria-label={option}
          defaultChecked={
            Array.isArray(state.values?.tags) &&
            state.values.tags.includes(option)
          }
          key={option}
          type="checkbox"
          {...tags.input}
          value={option}
        />
      ))}
      <p data-testid="group-input">{JSON.stringify(tags.input)}</p>
    </form>
  );
};

const asyncSchema = z.object({ slug: z.string() });
const asyncFields = formFields(asyncSchema);

const checkTaken = (value: string): Promise<string | undefined> =>
  Promise.resolve(value === 'taken' ? '使われています' : undefined);

/** A check whose answers the test hands back itself, in any order. */
const checkByHand = () => {
  const answers: Array<PromiseWithResolvers<string | undefined>> = [];
  const check = (): Promise<string | undefined> => {
    const answer = Promise.withResolvers<string | undefined>();
    answers.push(answer);
    return answer.promise;
  };
  return { answers, check };
};

const AsyncSlug: FC<{
  check?: (value: string) => Promise<string | undefined>;
}> = ({ check = checkTaken }) => {
  const form = useForm(asyncFields, NO_STATE);
  const slug = form.field('slug');
  const taken = useAsyncCheck(check);

  return (
    <form {...form.props}>
      <input aria-label="slug" {...slug.input} {...taken.props} />
      <p data-testid="slug-error">{slug.error ?? ''}</p>
      <button type="button">away</button>
    </form>
  );
};

const editorSchema = z.object({ body: z.string() });
const editorFields = formFields(editorSchema);

const Editor: FC = () => {
  const [body, setBody] = useState('初稿');
  const form = useForm(editorFields, NO_STATE);

  return (
    <form {...form.props}>
      <HiddenValue name="body" value={body} />
      <button
        onClick={() => {
          setBody('推敲済み');
        }}
        type="button"
      >
        edit
      </button>
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

// action は毎回同じ内容の state を返す。state の変化では何も戻らないので、
// React が action の後にフォームを戻すことそのものを useForm が聞いているかが
// 問われる
const Submitted: FC = () => {
  const [state, formAction] = useActionState(
    (): Promise<FormState> => Promise.resolve({}),
    {},
  );
  const form = useForm(derived, state);
  const email = form.field('email');

  return (
    <form {...form.props} action={formAction}>
      <input aria-label="email" {...email.input} />
      <p data-testid="email-error">{email.error ?? ''}</p>
      <p data-testid="dirty">{String(form.isDirty)}</p>
      <button type="submit">send</button>
    </form>
  );
};

const draftSchema = z.object({ title: z.string(), body: z.string() });
const draftFields = formFields(draftSchema);

const Draft: FC = () => {
  const [body, setBody] = useState('初稿');
  const form = useForm(draftFields);

  return (
    <form {...form.props}>
      <input aria-label="title" {...form.field('title').input} />
      <HiddenValue name="body" value={body} />
      <button
        onClick={() => {
          setBody('推敲済み');
        }}
        type="button"
      >
        edit
      </button>
      <p data-testid="dirty">{String(form.isDirty)}</p>
    </form>
  );
};

describe('useForm in a browser', () => {
  it('spreads the derived attributes onto the real element', async () => {
    const screen = await render(<Signup />);
    const email = screen.getByLabelText('email');

    await expect.element(email).toHaveAttribute('type', 'email');
    await expect.element(email).toHaveAttribute('required');
    await expect.element(email).toHaveAttribute('name', 'email');
  });

  it("shows zod's own wording once the browser rejects the value", async () => {
    const screen = await render(<Signup />);

    await screen.getByLabelText('email').fill('not-an-email');
    await screen.getByLabelText('password').click();

    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('メールアドレスの形式で入力してください');
  });

  it('does not raise an error mid-word, only refreshes one already shown', async () => {
    const screen = await render(<Signup />);

    // Typing an invalid value without leaving the field stays quiet.
    await screen.getByLabelText('password').fill('short');
    await expect
      .element(screen.getByTestId('password-error'))
      .toHaveTextContent('');

    // After blur it appears, and then clears as soon as it is fixed.
    await screen.getByLabelText('email').click();
    await expect
      .element(screen.getByTestId('password-error'))
      .toHaveTextContent('8文字以上で入力してください');

    await screen.getByLabelText('password').fill('long-enough-password');
    await expect
      .element(screen.getByTestId('password-error'))
      .toHaveTextContent('');
  });

  it('applies a cross-field rule through setCustomValidity', async () => {
    const screen = await render(<Signup />);

    await screen.getByLabelText('password').fill('hunter2hunter2');
    await screen.getByLabelText('confirm').fill('something-else');
    await screen.getByLabelText('email').click();

    await expect
      .element(screen.getByTestId('confirm-error'))
      .toHaveTextContent('パスワードが一致しません');

    await screen.getByLabelText('confirm').fill('hunter2hunter2');
    await screen.getByLabelText('email').click();
    await expect
      .element(screen.getByTestId('confirm-error'))
      .toHaveTextContent('');
  });

  it('shows a server error and clears it once that field is edited', async () => {
    const screen = await render(
      <Signup state={{ errors: { email: 'すでに登録されています' } }} />,
    );

    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('すでに登録されています');

    await screen.getByLabelText('email').fill('other@example.com');
    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('');
  });

  it('keeps a client error when the caller passes a fresh state each render', async () => {
    const screen = await render(<Inline />);
    await screen.getByLabelText('email').fill('not-an-email');
    await screen.getByLabelText('password').click();

    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('メールアドレスの形式で入力してください');
  });

  it('reads isDirty back from the DOM', async () => {
    const screen = await render(<Signup />);

    await expect
      .element(screen.getByTestId('dirty'))
      .toHaveTextContent('false');
    await screen.getByLabelText('email').fill('k8o@example.com');
    await expect.element(screen.getByTestId('dirty')).toHaveTextContent('true');
  });

  it('forgets messages, edits and isDirty when the form is reset', async () => {
    const screen = await render(
      <Signup state={{ errors: { email: 'すでに登録されています' } }} />,
    );

    await screen.getByLabelText('password').fill('short');
    await screen.getByLabelText('email').click();
    await expect
      .element(screen.getByTestId('password-error'))
      .toHaveTextContent('8文字以上で入力してください');
    await screen.getByLabelText('email').fill('other@example.com');
    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('');
    await expect.element(screen.getByTestId('dirty')).toHaveTextContent('true');

    (document.querySelector('form') as HTMLFormElement).reset();

    await expect
      .element(screen.getByTestId('password-error'))
      .toHaveTextContent('');
    await expect
      .element(screen.getByTestId('dirty'))
      .toHaveTextContent('false');
    // The edit that hid the server's answer is gone with the value.
    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('すでに登録されています');
  });

  it('stays dirty after a reset while a HiddenValue holds edited state', async () => {
    const screen = await render(<Draft />);

    await screen.getByLabelText('title').fill('題名');
    await screen.getByRole('button', { name: 'edit' }).click();
    await expect.element(screen.getByTestId('dirty')).toHaveTextContent('true');

    (document.querySelector('form') as HTMLFormElement).reset();

    // The browser restores the input; the hidden value is React's to write
    // back, and it does, so the form is not clean.
    await expect.element(screen.getByLabelText('title')).toHaveValue('');
    await expect.element(screen.getByTestId('dirty')).toHaveTextContent('true');
  });

  it('takes the rows back to the baseline when the form is reset', async () => {
    const screen = await render(<List />);

    await screen.getByRole('button', { name: 'add' }).click();
    await screen.getByRole('button', { name: 'add' }).click();
    await expect.element(screen.getByTestId('count')).toHaveTextContent('2');

    (document.querySelector('form') as HTMLFormElement).reset();

    await expect.element(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it("hears React's own reset after an action and starts clean", async () => {
    const screen = await render(<Submitted />);

    await screen.getByLabelText('email').fill('not-an-email');
    await expect.element(screen.getByTestId('dirty')).toHaveTextContent('true');

    // ボタンをクリックすると blur でメッセージが現れてボタンが下へずれ、
    // クリックが外れる。送信そのものを主張したいので、DOM から送る
    (document.querySelector('form') as HTMLFormElement).requestSubmit();

    await expect.element(screen.getByLabelText('email')).toHaveValue('');
    await expect
      .element(screen.getByTestId('dirty'))
      .toHaveTextContent('false');
    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('');
  });

  it('adds a row, numbers its name, and stops at the schema bound', async () => {
    const screen = await render(<List />);

    await screen.getByRole('button', { name: 'add' }).click();
    await expect
      .element(screen.getByLabelText('name-0'))
      .toHaveAttribute('name', 'items[0].name');

    await screen.getByRole('button', { name: 'add' }).click();
    await expect.element(screen.getByTestId('count')).toHaveTextContent('2');
    await expect
      .element(screen.getByRole('button', { name: 'add' }))
      .toBeDisabled();
  });

  it('keeps the surviving rows values when a row is removed', async () => {
    const screen = await render(<List />);

    await screen.getByRole('button', { name: 'add' }).click();
    await screen.getByRole('button', { name: 'add' }).click();
    await screen.getByLabelText('name-0').fill('ねじ');
    await screen.getByLabelText('name-1').fill('ばね');

    await screen.getByRole('button', { name: 'remove-0' }).click();

    // The second row survives with its value and takes over index 0.
    await expect.element(screen.getByTestId('count')).toHaveTextContent('1');
    await expect.element(screen.getByLabelText('name-0')).toHaveValue('ばね');
  });

  it('keeps an error attached to its row when an earlier row is removed', async () => {
    const screen = await render(<List />);

    await screen.getByRole('button', { name: 'add' }).click();
    await screen.getByRole('button', { name: 'add' }).click();
    await screen.getByLabelText('name-0').fill('ねじ');
    // Blur the empty second row so its error is on screen.
    await screen.getByLabelText('name-1').click();
    await screen.getByLabelText('name-0').click();
    await expect
      .element(screen.getByTestId('name-error-1'))
      .toHaveTextContent('品名は必須です');

    await screen.getByRole('button', { name: 'remove-0' }).click();

    // The invalid row now renders as index 0 and its message came with it.
    await expect
      .element(screen.getByTestId('name-error-0'))
      .toHaveTextContent('品名は必須です');
  });

  it('clears a cross-field message when the other field is the one fixed', async () => {
    const screen = await render(<Signup />);

    await screen.getByLabelText('password').fill('hunter2hunter2');
    await screen.getByLabelText('confirm').fill('something-else');
    await screen.getByLabelText('email').click();
    await expect
      .element(screen.getByTestId('confirm-error'))
      .toHaveTextContent('パスワードが一致しません');

    // Fix the mismatch from the password side; confirm is never touched again.
    await screen.getByLabelText('password').fill('something-else');
    await expect
      .element(screen.getByTestId('confirm-error'))
      .toHaveTextContent('');
  });

  it('re-shows the errors of an identical second failed submit via the token', async () => {
    const screen = await render(
      <Signup
        state={{ errors: { email: 'すでに登録されています' }, token: '1' }}
      />,
    );

    await screen.getByLabelText('email').fill('other@example.com');
    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('');

    // Same content, new token: the server did answer again.
    screen.rerender(
      <Signup
        state={{ errors: { email: 'すでに登録されています' }, token: '2' }}
      />,
    );
    await expect
      .element(screen.getByTestId('email-error'))
      .toHaveTextContent('すでに登録されています');
  });

  it('moves focus to the first failed field on the page, not the first one zod reported', async () => {
    const screen = await render(<Signup />);

    screen.rerender(
      <Signup
        state={{
          errors: {
            confirm: 'パスワードが一致しません',
            email: 'すでに登録されています',
          },
          token: '1',
        }}
      />,
    );

    await expect.element(screen.getByLabelText('email')).toHaveFocus();
  });

  it('moves focus to the form-level message when no field failed', async () => {
    const screen = await render(<Signup />);

    screen.rerender(
      <Signup state={{ formError: '登録を受け付けていません', token: '1' }} />,
    );

    await expect
      .element(screen.getByText('登録を受け付けていません'))
      .toHaveFocus();
  });

  it('moves focus to the form-level message when it comes before the failed fields', async () => {
    const screen = await render(<Signup />);

    screen.rerender(
      <Signup
        state={{
          errors: { email: 'すでに登録されています' },
          formError: '登録を受け付けていません',
          token: '1',
        }}
      />,
    );

    await expect
      .element(screen.getByText('登録を受け付けていません'))
      .toHaveFocus();
  });

  it('moves focus to the first failed field when the form-level message comes after it', async () => {
    const screen = await render(<Signup formErrorAt="bottom" />);

    screen.rerender(
      <Signup
        formErrorAt="bottom"
        state={{
          errors: { email: 'すでに登録されています' },
          formError: '登録を受け付けていません',
          token: '1',
        }}
      />,
    );

    await expect.element(screen.getByLabelText('email')).toHaveFocus();
  });

  it('marks the form dirty when a select changes', async () => {
    const screen = await render(<Choice />);

    await expect
      .element(screen.getByTestId('dirty'))
      .toHaveTextContent('false');
    await screen.getByLabelText('color').selectOptions('blue');
    await expect.element(screen.getByTestId('dirty')).toHaveTextContent('true');
  });

  it('restores a checked box from the echo through defaultChecked', async () => {
    const screen = await render(
      <Choice state={{ values: { color: 'blue', agree: 'on' } }} />,
    );

    await expect.element(screen.getByLabelText('agree')).toBeChecked();
  });

  it('reads a box absent from the echo as unchecked', async () => {
    const screen = await render(
      <Choice state={{ values: { color: 'blue' } }} />,
    );

    await expect.element(screen.getByLabelText('agree')).not.toBeChecked();
  });

  it('restores a one-box group per option, never as a value on every box', async () => {
    const formData = new FormData();
    formData.append('tags', 'a');
    const { state } = parseForm(groupSchema, formData);

    const screen = await render(<Group state={state} />);

    await expect.element(screen.getByLabelText('a')).toBeChecked();
    await expect.element(screen.getByLabelText('b')).not.toBeChecked();
    await expect
      .element(screen.getByTestId('group-input'))
      .toHaveTextContent('{"name":"tags"}');
  });

  it('hears a HiddenValue change for isDirty like any other control', async () => {
    const screen = await render(<Editor />);

    await expect
      .element(screen.getByTestId('dirty'))
      .toHaveTextContent('false');
    await screen.getByRole('button', { name: 'edit' }).click();
    await expect.element(screen.getByTestId('dirty')).toHaveTextContent('true');
  });

  it('turns native validation off with JavaScript, never in the markup', async () => {
    const screen = await render(<Signup />);
    await expect.element(screen.getByLabelText('email')).toBeVisible();

    // Not a rendered prop — the server's HTML carries no novalidate, so a
    // person without JavaScript keeps the browser's own checks. The hook
    // takes over through the ref once mounted.
    expect(Object.keys(signupProps)).not.toContain('noValidate');
    const email = screen.getByLabelText('email').element() as HTMLInputElement;
    expect(email.form?.noValidate).toBe(true);
  });

  // The async checks are last on purpose: their answers land from plain
  // promises, outside act(), and the act bookkeeping they trip must not poison
  // a later render.
  it('keeps the newest answer when an answer about an older value lands after it', async () => {
    const { answers, check } = checkByHand();
    const screen = await render(<AsyncSlug check={check} />);
    const slug = screen.getByLabelText('slug');

    await slug.fill('first');
    await screen.getByRole('button', { name: 'away' }).click();
    await slug.fill('second');
    await screen.getByRole('button', { name: 'away' }).click();

    answers[1]?.resolve('second は使われています');
    await expect
      .element(screen.getByTestId('slug-error'))
      .toHaveTextContent('second は使われています');

    answers[0]?.resolve('first は使われています');
    await answers[0]?.promise;

    expect((slug.element() as HTMLInputElement).validationMessage).toBe(
      'second は使われています',
    );
    await expect
      .element(screen.getByTestId('slug-error'))
      .toHaveTextContent('second は使われています');
  });

  it('keeps the newest answer when an older answer about the same value lands after it', async () => {
    const { answers, check } = checkByHand();
    const screen = await render(<AsyncSlug check={check} />);
    const slug = screen.getByLabelText('slug');

    // Leaving the field again while the first answer is still out asks again.
    await slug.fill('k8o');
    await screen.getByRole('button', { name: 'away' }).click();
    await slug.click();
    await screen.getByRole('button', { name: 'away' }).click();

    answers[1]?.resolve(undefined);
    answers[0]?.resolve('使われています');
    await answers[0]?.promise;

    expect((slug.element() as HTMLInputElement).validationMessage).toBe('');
    await expect
      .element(screen.getByTestId('slug-error'))
      .toHaveTextContent('');
  });

  it('lets an async message go when the field is emptied', async () => {
    const screen = await render(<AsyncSlug />);

    await screen.getByLabelText('slug').fill('taken');
    await screen.getByRole('button', { name: 'away' }).click();
    await expect
      .element(screen.getByTestId('slug-error'))
      .toHaveTextContent('使われています');

    await screen.getByLabelText('slug').fill('');
    await screen.getByRole('button', { name: 'away' }).click();
    await expect
      .element(screen.getByTestId('slug-error'))
      .toHaveTextContent('');
  });
});
