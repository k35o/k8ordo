type AnyFunction = (...args: never[]) => unknown;

export const chain =
  <T extends AnyFunction>(...callbacks: Array<T | undefined>) =>
  (...args: Parameters<T>): void => {
    for (const callback of callbacks) {
      callback?.(...args);
    }
  };

if (import.meta.vitest) {
  describe('chain', () => {
    it('渡されたコールバックを順番に呼び出す', () => {
      const calls: number[] = [];
      const handler = chain(
        () => calls.push(1),
        () => calls.push(2),
        () => calls.push(3),
      );

      handler();

      expect(calls).toEqual([1, 2, 3]);
    });

    it('引数を全てのコールバックに渡す', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const handler = chain(fn1, fn2);

      handler('a', 1);

      expect(fn1).toHaveBeenCalledWith('a', 1);
      expect(fn2).toHaveBeenCalledWith('a', 1);
    });

    it('undefinedのコールバックはスキップする', () => {
      const fn = vi.fn();
      const handler = chain(undefined, fn, undefined);

      handler();

      expect(fn).toHaveBeenCalledOnce();
    });
  });
}
