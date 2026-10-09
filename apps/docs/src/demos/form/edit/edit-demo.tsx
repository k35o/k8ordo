'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Badge, Button, Checkbox, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../messages';

type Props = {
  /** ページの Server Component が `formFields(talkSchema)` で導いたもの。 */
  fields: FormFields<'title' | 'public', never>;
};

// 編集する前の値。実際のアプリならデータベースから読んだ 1 件にあたる
const TALK = { title: 'Navigation API入門', public: true };

export function EditDemo({ fields }: Props) {
  const form = useForm(fields);
  const [saved, setSaved] = useState(false);
  const title = form.field('title');
  const isPublic = form.field('public');

  return (
    <form
      {...form.props}
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        form.props.onSubmit(event);
        if (event.defaultPrevented) {
          setSaved(false);
          return;
        }
        event.preventDefault();
        setSaved(true);
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-fg-mute text-sm">{m.formEdit.demoState()}</span>
        {form.isDirty ? (
          <Badge label={m.formEdit.demoDirty()} tone="warning" />
        ) : (
          <Badge label={m.formEdit.demoClean()} tone="neutral" />
        )}
      </div>
      <FormControl
        errorText={title.error}
        invalid={title.invalid}
        label={m.formEdit.demoLabelTitle()}
        renderInput={(props) => (
          <TextField {...props} defaultValue={TALK.title} {...title.input} />
        )}
        required={title.required}
      />
      <Checkbox
        defaultChecked={TALK.public}
        {...isPublic.input}
        label={m.formEdit.demoLabelPublic()}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="solid">
          {m.formEdit.demoSave()}
        </Button>
        {/* Button の type は button と submit だけなので、reset は要素ごと差し替える */}
        <Button
          color="base"
          renderItem={({ children, className }) => (
            <button className={className} type="reset">
              {children}
            </button>
          )}
          variant="outline"
        >
          {m.formEdit.demoReset()}
        </Button>
        <p aria-live="polite" className="text-fg-success text-sm">
          {saved ? m.formEdit.demoSaved() : ''}
        </p>
      </div>
    </form>
  );
}
