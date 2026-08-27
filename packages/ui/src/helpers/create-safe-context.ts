import { createContext, use } from 'react';
import type { Context } from 'react';

type CreateSafeContextReturn<T> = readonly [Context<T | null>, () => T];

export const createSafeContext = <T>(
  errorMessage: string,
): CreateSafeContextReturn<T> => {
  const Context = createContext<T | null>(null);

  const useSafeContext = (): T => {
    const value = use(Context);
    if (value === null) {
      throw new Error(errorMessage);
    }
    return value;
  };

  return [Context, useSafeContext] as const;
};

if (import.meta.vitest) {
  describe('createSafeContext', () => {
    it('Provider配下ではコンテキストの値を返す', async () => {
      const { createElement } = await import('react');
      const { renderToString } = await import('react-dom/server');
      const [Context, useValue] = createSafeContext<string>('missing provider');
      const Consumer = () => createElement('span', null, useValue());

      const html = renderToString(
        createElement(Context, { value: 'hello' }, createElement(Consumer)),
      );

      expect(html).toContain('hello');
    });

    it('Provider外では指定したエラーメッセージでthrowする', async () => {
      const { createElement } = await import('react');
      const { renderToString } = await import('react-dom/server');
      const [, useValue] = createSafeContext<string>(
        'useValue must be used within a Provider',
      );
      const Consumer = () => createElement('span', null, useValue());

      expect(() => renderToString(createElement(Consumer))).toThrow(
        'useValue must be used within a Provider',
      );
    });
  });
}
