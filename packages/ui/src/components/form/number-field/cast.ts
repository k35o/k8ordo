import { toPrecision } from '../../../internal/to-precision';

const FLOATING_POINT_REGEX = /^[Ee0-9+\-.]$/u;

const isInvalidCharacter = (value: string): boolean =>
  FLOATING_POINT_REGEX.test(value);

const sanitize = (value: string): string =>
  value
    .split('')
    .filter((char) => isInvalidCharacter(char))
    .join('');

const parse = (value: string | number): number =>
  // eslint-disable-next-line unicorn/prefer-number-coercion -- 入力途中の "1.1.1" や "1e" を NaN にせず先頭の数値として解釈する（下の test が保証する仕様）
  Number.parseFloat(value.toString().replaceAll(/[^\w.-]+/gu, ''));

export const cast = (
  value: string,
  precision: number | undefined,
): number | null => {
  const parsedValue = parse(sanitize(value));
  if (Number.isNaN(parsedValue)) return null;
  return toPrecision(parsedValue, precision);
};

if (import.meta.vitest) {
  it('文字を数値に変換する', () => {
    expect(cast('1', 0)).toBe(1);
    expect(cast('1.1', 1)).toBe(1.1);
    expect(cast('1.1.1', 1)).toBe(1.1);
    expect(cast('1e4', 0)).toBe(10_000);
    expect(cast('-19', 0)).toBe(-19);
  });

  it('数値として読めない文字は null にする', () => {
    expect(cast('', 0)).toBeNull();
    expect(cast('abc', 0)).toBeNull();
    expect(cast('-', 0)).toBeNull();
  });

  it('precision の桁数に丸める', () => {
    expect(cast('2.5', 0)).toBe(3);
    expect(cast('2.4', 0)).toBe(2);
    expect(cast('1.55', 1)).toBe(1.6);
    expect(cast('1.1', 2)).toBe(1.1);
  });
}
