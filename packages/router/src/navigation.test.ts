import { describe, expect, it } from 'vite-plus/test';

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
    expect(scrollPlanFor('push', '', undefined)).toStrictEqual({ kind: 'top' });
    expect(scrollPlanFor('replace', '', undefined)).toStrictEqual({
      kind: 'top',
    });
  });

  it('scrolls to the fragment when the URL names one', () => {
    expect(scrollPlanFor('push', '#install', undefined)).toStrictEqual({
      kind: 'fragment',
      id: 'install',
    });
    expect(
      scrollPlanFor('push', '#%E5%B0%8E%E5%85%A5', undefined),
    ).toStrictEqual({
      kind: 'fragment',
      id: '導入',
    });
  });

  it('goes back or forward to where the visitor left that entry, fragment or not', () => {
    const leftAt = { left: 0, top: 1200 };
    expect(scrollPlanFor('traverse', '', leftAt)).toStrictEqual({
      kind: 'position',
      left: 0,
      top: 1200,
    });
    expect(scrollPlanFor('traverse', '#x', leftAt)).toStrictEqual({
      kind: 'position',
      left: 0,
      top: 1200,
    });
  });

  it('starts an entry no page was ever left from as a new page', () => {
    expect(scrollPlanFor('traverse', '', undefined)).toStrictEqual({
      kind: 'top',
    });
    expect(scrollPlanFor('traverse', '#x', undefined)).toStrictEqual({
      kind: 'fragment',
      id: 'x',
    });
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
