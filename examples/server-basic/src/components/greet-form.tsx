'use client';

import { useActionState } from 'react';

import { greet } from '../lib/greet';

export function GreetForm() {
  const [greeting, formAction] = useActionState(greet, null);
  return (
    <form action={formAction} data-testid="greet-form">
      <input aria-label="your name" name="name" />
      <button type="submit">greet</button>
      {greeting === null ? null : <p data-testid="greeting">{greeting}</p>}
    </form>
  );
}
