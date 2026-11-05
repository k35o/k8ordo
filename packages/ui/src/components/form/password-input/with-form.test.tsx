import { useForm } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { FormControl } from '../form-control';
import { PasswordInput } from './password-input';

const fields = formFields(
  z.object({
    password: z
      .string()
      .min(8, '8文字以上で入力してください')
      .meta({ input: 'password' }),
  }),
);

const LoginForm = () => {
  const form = useForm(fields);
  const password = form.field('password');

  return (
    <form {...form.props}>
      <FormControl
        errorText={password.error}
        invalid={password.invalid}
        label="パスワード"
        renderInput={(props) => (
          <PasswordInput {...props} {...password.input} />
        )}
        required={password.required}
      />
    </form>
  );
};

// ほかの組み合わせは password-input.stories.tsx の WithForm で確かめる。
// minLength の検査（tooShort）は利用者が編集した値にしか掛からず、ストーリーの
// play の入力はスクリプトからの代入なので、ここだけ本物の入力で打つ
describe('PasswordInput と formFields', () => {
  it('短いまま離れると zod の文言を出す', async () => {
    await render(<LoginForm />);

    await userEvent.fill(
      page.getByLabelText('パスワード', { exact: false }),
      'abc',
    );
    await userEvent.tab();

    await expect
      .element(page.getByText('8文字以上で入力してください'))
      .toBeVisible();
  });
});
