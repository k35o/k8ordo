'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useActionState } from 'react';

import { sign } from '../lib/guestbook';

// fields は Server Component が formFields(schema) で導いた素の JSON。
// zod は props を越えてこない
export function GuestbookForm({ fields }: { fields: FormFields<'name'> }) {
  const [state, formAction] = useActionState(sign, {});
  const form = useForm(fields, state);
  const name = form.field('name');
  return (
    <form {...form.props} action={formAction} data-testid="guestbook-form">
      {/* required / minLength / maxLength はスキーマから来る属性 */}
      <input aria-label="name" {...name.input} />
      <button type="submit">sign</button>
      {name.error === undefined ? null : (
        <p data-testid="error">{name.error}</p>
      )}
    </form>
  );
}
