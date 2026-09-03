import { sameValue } from './object';

describe('sameValue', () => {
  it('treats structurally equal plain objects and arrays as unchanged', () => {
    expect(sameValue({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(sameValue({ a: 1 }, { a: 2 })).toBe(false);
    expect(sameValue([1, 2], [1, 2, 3])).toBe(false);
  });

  it('stays conservative for objects whose state hides in internal slots', () => {
    // 二つの Date は enumerable キーが空で構造的には区別できないので、
    // 参照が違えば「変化した」に倒す。
    expect(sameValue(new Date(0), new Date(0))).toBe(false);
  });
});
