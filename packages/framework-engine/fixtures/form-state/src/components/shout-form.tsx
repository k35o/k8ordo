'use client';

import { useActionState } from 'react';

import { shout } from '../lib/shout';

export function ShoutForm() {
  const [shouted, formAction] = useActionState(shout, null);
  return (
    <form action={formAction} data-testid="shout-form">
      <input aria-label="name" name="name" />
      <button type="submit">shout</button>
      {shouted}
    </form>
  );
}
