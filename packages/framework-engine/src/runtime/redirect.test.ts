import { isRedirect, redirect } from './redirect';

describe('redirect', () => {
  it('throws something the handler can tell apart from any other error', () => {
    let caught: unknown;
    try {
      redirect('/talks');
    } catch (error) {
      caught = error;
    }
    expect(isRedirect(caught)).toBe(true);
    expect(caught).toMatchObject({ to: '/talks' });
    expect(isRedirect(new Error('/talks'))).toBe(false);
    expect(isRedirect(null)).toBe(false);
  });
});
