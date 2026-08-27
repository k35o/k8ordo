export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

if (import.meta.vitest) {
  describe('clamp', () => {
    it('minとmaxの間の値の場合はそのまま返す', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('minより小さい場合はminを返す', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('maxより大きい場合はmaxを返す', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });
}
