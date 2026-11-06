import { describe, expect, it } from 'vite-plus/test';

import { Redirect, redirect } from './redirect';

describe('redirect', () => {
  it('throws a Redirect carrying where it sends the visitor', () => {
    let caught: unknown;
    try {
      redirect('/talks');
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(Redirect);
    expect(caught).toMatchObject({ to: '/talks' });
  });
});
