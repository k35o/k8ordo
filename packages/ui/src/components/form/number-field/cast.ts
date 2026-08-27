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

const countDecimalPlaces = (value: number): number => {
  if (!Number.isFinite(value)) return 0;

  let e = 1;
  let p = 0;
  while (Math.round(value * e) / e !== value) {
    e *= 10;
    p += 1;
  }
  return p;
};

export const cast = (
  value: string,
  step: number,
  precision?: number,
): number => {
  const parsedValue = parse(sanitize(value));
  if (Number.isNaN(parsedValue)) return 0;
  const decimalPlaces = Math.max(
    countDecimalPlaces(step),
    countDecimalPlaces(parsedValue),
  );
  return toPrecision(parsedValue, precision ?? decimalPlaces);
};

if (import.meta.vitest) {
  it('文字を数値に変換する', () => {
    expect(cast('1', 1)).toBe(1);
    expect(cast('1.1', 1)).toBe(1.1);
    expect(cast('1.1.1', 1)).toBe(1.1);
    expect(cast('1.1.1', 2)).toBe(1.1);
    expect(cast('1e4', 3)).toBe(10_000);
    expect(cast('-19', 3)).toBe(-19);
  });
}
