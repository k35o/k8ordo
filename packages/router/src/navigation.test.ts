import { isOurs, scrollPlanFor, transitionTypesFor } from './navigation';
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

describe('scrollPlanFor', () => {
  it('starts a new page at the top, the way a document load does', () => {
    expect(scrollPlanFor('push', '')).toStrictEqual({ kind: 'top' });
    expect(scrollPlanFor('replace', '')).toStrictEqual({ kind: 'top' });
  });

  it('scrolls to the fragment when the URL names one', () => {
    expect(scrollPlanFor('push', '#install')).toStrictEqual({
      kind: 'fragment',
      id: 'install',
    });
    expect(scrollPlanFor('push', '#%E5%B0%8E%E5%85%A5')).toStrictEqual({
      kind: 'fragment',
      id: '導入',
    });
  });

  it('leaves a traversal to the browser, which restores the position', () => {
    expect(scrollPlanFor('traverse', '')).toBeNull();
    expect(scrollPlanFor('traverse', '#x')).toBeNull();
  });
});

describe('transitionTypesFor', () => {
  it('names any page change, and the kind the platform reported', () => {
    expect(transitionTypesFor('push')).toStrictEqual([
      'navigation',
      'navigation-push',
    ]);
    expect(transitionTypesFor('replace')).toStrictEqual([
      'navigation',
      'navigation-replace',
    ]);
    expect(transitionTypesFor('traverse')).toStrictEqual([
      'navigation',
      'navigation-traverse',
    ]);
  });
});
