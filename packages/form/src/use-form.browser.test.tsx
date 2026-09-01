import type { FC } from 'react';
import { render } from 'vitest-browser-react';
import { z } from 'zod';

import { formFields } from './derive/form-fields';
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

const Signup: FC<{ state?: FormState }> = ({ state = NO_STATE }) => {
  const form = useForm(derived, state);
  const email = form.field('email');
  const password = form.field('password');
  const confirm = form.field('confirm');

  return (
    <form {...form.props}>
      <input aria-label="email" {...email.input} />
      <p data-testid="email-error">{email.error ?? ''}</p>

      <input aria-label="password" {...password.input} />
      <p data-testid="password-error">{password.error ?? ''}</p>

      <input aria-label="confirm" {...confirm.input} />
      <p data-testid="confirm-error">{confirm.error ?? ''}</p>

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
});
