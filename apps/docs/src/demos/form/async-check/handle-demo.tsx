'use client';

import { useAsyncCheck, useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Button, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../messages';

type Props = {
  /** ページの Server Component が `formFields(handleSchema)` で導いたもの。 */
  fields: FormFields<'handle', never>;
};

const TAKEN = new Set(['admin', 'k8o', 'ordo']);

// 静的なサイトに Server Action は無いので、問い合わせ先をブラウザの中の
// 関数で置き換える。待ち時間は、返事を待つ間の表示を見せるため
const checkHandle = async (value: string): Promise<string | undefined> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });
  return TAKEN.has(value) ? m.formAsyncCheck.demoTaken() : undefined;
};

export function HandleDemo({ fields }: Props) {
  const form = useForm(fields);
  const handle = form.field('handle');
  const taken = useAsyncCheck(checkHandle);
  const [sent, setSent] = useState(false);

  return (
    <form
      {...form.props}
      className="flex flex-col gap-5"
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
        helpText={
          taken.isChecking ? m.formAsyncCheck.demoChecking() : undefined
        }
        invalid={handle.invalid}
        label={m.formAsyncCheck.demoLabelHandle()}
        renderInput={(props) => (
          <TextField
            {...props}
            {...handle.input}
            {...taken.props}
            autoComplete="off"
          />
        )}
        required={handle.required}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button disabled={taken.isChecking} type="submit" variant="solid">
          {m.formAsyncCheck.demoSubmit()}
        </Button>
        <p aria-live="polite" className="text-fg-success text-sm">
          {sent ? m.formAsyncCheck.demoSent() : ''}
        </p>
      </div>
    </form>
  );
}
