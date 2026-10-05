'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Button, FormControl, PasswordInput, TextField } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../../../messages';

type Props = {
  /** ページの Server Component が `formFields(signupDefinition)` で導いたもの。 */
  fields: FormFields<'handle' | 'password' | 'confirm', never>;
};

// 静的なサイトで送信先が無いので、送れる値になったところで止めて知らせる。
// ブラウザ側の半分（文言・ルール・失敗した欄へのフォーカス）を見せる
export function SignupDemo({ fields }: Props) {
  const form = useForm(fields);
  const [sent, setSent] = useState(false);
  const handle = form.field('handle');
  const password = form.field('password');
  const confirm = form.field('confirm');

  return (
    <form
      {...form.props}
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        form.props.onSubmit(event);
        if (event.defaultPrevented) {
          setSent(false);
          return;
        }
        event.preventDefault();
        setSent(true);
      }}
    >
      <FormControl
        errorText={handle.error}
        invalid={handle.invalid}
        label={m.formErrors.demoLabelHandle()}
        renderInput={(props) => (
          <TextField {...props} {...handle.input} autoComplete="off" />
        )}
        required={handle.required}
      />
      <FormControl
        errorText={password.error}
        invalid={password.invalid}
        label={m.formErrors.demoLabelPassword()}
        renderInput={(props) => (
          <PasswordInput
            {...props}
            {...password.input}
            autoComplete="new-password"
          />
        )}
        required={password.required}
      />
      <FormControl
        errorText={confirm.error}
        invalid={confirm.invalid}
        label={m.formErrors.demoLabelConfirm()}
        renderInput={(props) => (
          <PasswordInput
            {...props}
            {...confirm.input}
            autoComplete="new-password"
          />
        )}
        required={confirm.required}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="solid">
          {m.formErrors.demoSubmit()}
        </Button>
        <p aria-live="polite" className="text-fg-success text-sm">
          {sent ? m.formErrors.demoSent() : ''}
        </p>
      </div>
    </form>
  );
}
