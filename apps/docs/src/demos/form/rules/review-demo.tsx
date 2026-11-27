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
import type { reviewDefinition } from './review-definition';

import styles from './review-demo.module.css';

type Props = {
  /** ページの Server Component が `formFields(reviewDefinition)` で導いたもの。 */
  fields: FormFields<typeof reviewDefinition>;
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
      className={styles.form}
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
        label={m.formRules.demoLabelDecision()}
        renderInput={(props) => (
          <Select
            {...props}
            {...decision.input}
            options={[
              { value: 'accept', label: m.formRules.demoAccept() },
              { value: 'reject', label: m.formRules.demoReject() },
            ]}
            placeholder={m.formRules.demoChoose()}
          />
        )}
        required={decision.required}
      />
      <FormControl
        errorText={reason.error}
        label={m.formRules.demoLabelReason()}
        renderInput={(props) => <Textarea {...props} {...reason.input} />}
      />
      <FormControl
        errorText={aspects.error}
        label={m.formRules.demoLabelAspects()}
        labelAs="group"
        renderInput={(props) => (
          <CheckboxCard
            {...props}
            {...aspects.input}
            options={[
              { value: 'content', label: m.formRules.demoAspectContent() },
              { value: 'structure', label: m.formRules.demoAspectStructure() },
              { value: 'timing', label: m.formRules.demoAspectTiming() },
            ]}
          />
        )}
        required={aspects.required}
      />
      <div className={styles.actions}>
        <Button type="submit" variant="solid">
          {m.formRules.demoSubmit()}
        </Button>
        <p aria-live="polite" className={styles.sent}>
          {sent ? m.formRules.demoSent() : ''}
        </p>
      </div>
    </form>
  );
}
