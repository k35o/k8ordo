'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Button, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../messages';

type Props = {
  /** ページの Server Component が `formFields(talkSchema)` で導いたもの。 */
  fields: FormFields<'title' | 'eventUrl' | 'minutes', never>;
};

export function TalkDemo({ fields }: Props) {
  // 静的なサイトで送信先が無いので、送れる値になったところで止めて知らせる
  const form = useForm(fields);
  const [sent, setSent] = useState(false);
  const title = form.field('title');
  const eventUrl = form.field('eventUrl');
  const minutes = form.field('minutes');

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
        errorText={title.error}
        invalid={title.invalid}
        label={m.formGetStarted.tryLabelTitle()}
        renderInput={(props) => (
          <TextField {...props} {...title.input} autoComplete="off" />
        )}
        required={title.required}
      />
      <FormControl
        errorText={eventUrl.error}
        invalid={eventUrl.invalid}
        label={m.formGetStarted.tryLabelEventUrl()}
        renderInput={(props) => (
          <TextField {...props} {...eventUrl.input} autoComplete="off" />
        )}
        required={eventUrl.required}
      />
      <FormControl
        errorText={minutes.error}
        invalid={minutes.invalid}
        label={m.formGetStarted.tryLabelMinutes()}
        renderInput={(props) => <TextField {...props} {...minutes.input} />}
        required={minutes.required}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="solid">
          {m.formGetStarted.trySubmit()}
        </Button>
        <p aria-live="polite" className="text-fg-success text-sm">
          {sent ? m.formGetStarted.trySent() : ''}
        </p>
      </div>
    </form>
  );
}
