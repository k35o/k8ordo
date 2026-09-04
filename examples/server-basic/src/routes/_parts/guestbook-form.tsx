'use client';

import { useActionState } from 'react';

import { sign } from './guestbook';

export function GuestbookForm() {
  const [error, formAction] = useActionState(sign, null);
  return (
    <form action={formAction} data-testid="guestbook-form">
      <input aria-label="name" name="name" />
      <button type="submit">sign</button>
      {error === null ? null : <p data-testid="error">{error}</p>}
    </form>
  );
}
