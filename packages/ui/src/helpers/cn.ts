import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

if (import.meta.vitest) {
  describe('cn', () => {
    it('複数のクラス名を空白区切りで結合する', () => {
      expect(cn('flex', 'items-center')).toBe('flex items-center');
    });

    it('falsyな値と条件付きクラスを除外する', () => {
      expect(
        cn('flex', undefined, null, false, { hidden: false, grow: true }),
      ).toBe('flex grow');
    });

    it('ネストした配列を展開する', () => {
      expect(cn(['flex', ['items-center']])).toBe('flex items-center');
    });

    it('競合するTailwindクラスは後勝ちで解決する', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    });

    it('競合しないクラスはどちらも残す', () => {
      expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
    });
  });
}
