import { isOurs } from './navigation';
import type { NavigationFacts } from './navigation';

const facts = (overrides: Partial<NavigationFacts> = {}): NavigationFacts => ({
  canIntercept: true,
  hashChange: false,
  downloadRequest: null,
  navigationType: 'push',
  formData: null,
  ...overrides,
});

describe('isOurs', () => {
  it('takes an ordinary same-origin navigation', () => {
    expect(isOurs(facts())).toBe(true);
    expect(isOurs(facts({ navigationType: 'traverse' }))).toBe(true);
    expect(isOurs(facts({ navigationType: 'replace' }))).toBe(true);
  });

  it('leaves a reload to the browser', () => {
    // 握り潰すと F5 が何も起こさないページになる
    expect(isOurs(facts({ navigationType: 'reload' }))).toBe(false);
  });

  it('leaves a form submission to the server', () => {
    // クライアントで描き直せば POST の本文は捨てられる
    expect(isOurs(facts({ formData: new FormData() }))).toBe(false);
  });

  it('leaves what the platform says it cannot have', () => {
    expect(isOurs(facts({ canIntercept: false }))).toBe(false);
    expect(isOurs(facts({ hashChange: true }))).toBe(false);
    expect(isOurs(facts({ downloadRequest: '' }))).toBe(false);
  });
});
