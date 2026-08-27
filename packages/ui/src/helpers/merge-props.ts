import type { CSSProperties } from 'react';

import { chain } from './chain';
import { cn } from './cn';

type Props = Record<string, unknown>;

type MergedProps<A, B> = Omit<A, keyof B> & B;

const isEventHandler = (
  key: string,
  value: unknown,
): value is (...args: never[]) => unknown =>
  typeof value === 'function' &&
  key.startsWith('on') &&
  key.length > 2 &&
  key[2] === (key[2]?.toUpperCase() ?? '');

export const mergeProps = <A extends Props, B extends Props>(
  base: A,
  override: B,
): MergedProps<A, B> => {
  const result: Props = { ...base };

  for (const key of Object.keys(override)) {
    const baseValue = base[key];
    const overrideValue = override[key];

    if (key === 'className') {
      result[key] = cn(
        baseValue as string | undefined,
        overrideValue as string | undefined,
      );
    } else if (key === 'style') {
      result[key] = {
        ...(baseValue as CSSProperties | undefined),
        ...(overrideValue as CSSProperties | undefined),
      };
    } else if (
      isEventHandler(key, baseValue) &&
      isEventHandler(key, overrideValue)
    ) {
      result[key] = chain(baseValue, overrideValue);
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }

  return result as MergedProps<A, B>;
};

if (import.meta.vitest) {
  describe('mergeProps', () => {
    it('classNameをcnでマージする', () => {
      const merged = mergeProps(
        { className: 'p-2 text-fg-base' },
        { className: 'text-fg-mute' },
      );

      expect(merged.className).toBe('p-2 text-fg-mute');
    });

    it('styleを浅くマージする', () => {
      const merged = mergeProps(
        { style: { color: 'red', fontSize: 12 } },
        { style: { color: 'blue' } },
      );

      expect(merged.style).toEqual({ color: 'blue', fontSize: 12 });
    });

    it('onClickなどのイベントハンドラを連結する', () => {
      const calls: string[] = [];
      const merged = mergeProps(
        { onClick: () => calls.push('a') },
        { onClick: () => calls.push('b') },
      );

      merged.onClick();

      expect(calls).toEqual(['a', 'b']);
    });

    it('それ以外のpropsは後勝ちで上書きする', () => {
      const merged = mergeProps({ id: 'a', disabled: true }, { id: 'b' });

      expect(merged).toEqual({ id: 'b', disabled: true });
    });

    it('overrideがundefinedの場合はbaseの値を保持する', () => {
      const merged = mergeProps({ id: 'a' }, { id: undefined });

      expect(merged.id).toBe('a');
    });
  });
}
