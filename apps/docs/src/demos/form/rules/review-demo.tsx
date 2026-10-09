'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import {
  Button,
  CheckboxCard,
  FormControl,
  Select,
  Textarea,
} from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../messages';

type Props = {
  /** ページの Server Component が `formFields(reviewDefinition)` で導いたもの。 */
  fields: FormFields<'decision' | 'reason' | 'aspects', never>;
};

// 静的なサイトで送信先が無いので、送れる値になったところで止めて知らせる
export function ReviewDemo({ fields }: Props) {
  const form = useForm(fields);
  const [sent, setSent] = useState(false);
  const decision = form.field('decision');
  const reason = form.field('reason');
  const aspects = form.field('aspects');

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
        errorText={decision.error}
        invalid={decision.invalid}
        label={m.formRules.demoLabelDecision()}
        renderInput={(props) => (
          <Select
            {...props}
            {...decision.input}
            options={[
              { value: '', label: m.formRules.demoChoose() },
              { value: 'accept', label: m.formRules.demoAccept() },
              { value: 'reject', label: m.formRules.demoReject() },
            ]}
          />
        )}
        required={decision.required}
      />
      <FormControl
        errorText={reason.error}
        invalid={reason.invalid}
        label={m.formRules.demoLabelReason()}
        renderInput={(props) => <Textarea {...props} {...reason.input} />}
      />
      <FormControl
        errorText={aspects.error}
        invalid={aspects.invalid}
        label={m.formRules.demoLabelAspects()}
        labelAs="legend"
        renderInput={(props) => (
          <CheckboxCard
            {...props}
            {...aspects.input}
            defaultValue={[]}
            options={[
              { value: 'content', label: m.formRules.demoAspectContent() },
              { value: 'structure', label: m.formRules.demoAspectStructure() },
              { value: 'timing', label: m.formRules.demoAspectTiming() },
            ]}
          />
        )}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="solid">
          {m.formRules.demoSubmit()}
        </Button>
        <p aria-live="polite" className="text-fg-success text-sm">
          {sent ? m.formRules.demoSent() : ''}
        </p>
      </div>
    </form>
  );
}
