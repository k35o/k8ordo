'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import {
  Button,
  Code,
  FormControl,
  PasswordInput,
  TextField,
} from '@k8ordo/ui';

import * as m from '../../../../../messages';

type Props = {
  /** ページの Server Component が `formFields(signupDefinition())` で導いたもの。 */
  fields: FormFields<'handle' | 'password' | 'confirm', never>;
};

// Server Action の無い静的サイトなので送信先が無い。送信ボタンを置かず、
// ブラウザ側の半分（メッセージ・ルール・isDirty・リセット）だけを見せる。
export function SignupDemo({ fields }: Props) {
  const form = useForm(fields);
  const handle = form.field('handle');
  const password = form.field('password');
  const confirm = form.field('confirm');

  // TextField と PasswordInput は type を自分で決める（PasswordInput は表示切替
  // のために書き換える）ので、導かれた type は外して残りを広げる
  const { type: _handleType, ...handleInput } = handle.input;
  const { type: _passwordType, ...passwordInput } = password.input;
  const { type: _confirmType, ...confirmInput } = confirm.input;

  return (
    <form
      className="border-border-mute flex flex-col gap-4 rounded-lg border p-6"
      {...form.props}
    >
      <FormControl
        errorText={handle.error}
        invalid={handle.invalid}
        label={m.formValidation.demoLabelHandle()}
        renderInput={(props) => (
          <TextField {...props} {...handleInput} autoComplete="off" />
        )}
        required={handle.required}
      />
      <FormControl
        errorText={password.error}
        invalid={password.invalid}
        label={m.formValidation.demoLabelPassword()}
        renderInput={(props) => (
          <PasswordInput
            {...props}
            {...passwordInput}
            autoComplete="new-password"
          />
        )}
        required={password.required}
      />
      <FormControl
        errorText={confirm.error}
        invalid={confirm.invalid}
        label={m.formValidation.demoLabelConfirm()}
        renderInput={(props) => (
          <PasswordInput
            {...props}
            {...confirmInput}
            autoComplete="new-password"
          />
        )}
        required={confirm.required}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="text-fg-mute text-sm">
          <Code>{`isDirty: ${String(form.isDirty)}`}</Code>
        </p>
        <Button
          color="base"
          onClick={(event) => {
            event.currentTarget.form?.reset();
          }}
          size="sm"
          variant="outline"
        >
          {m.formValidation.demoReset()}
        </Button>
      </div>
    </form>
  );
}
