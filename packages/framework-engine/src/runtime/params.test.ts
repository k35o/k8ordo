import { AsyncLocalStorage } from 'node:async_hooks';

import { parseCatchAllParams, parseParams } from './params';
import type { ParamsSchema } from './params';

// zod を持ち込まずに Standard Schema の最小形を演じる
const schema = (
  validate: (value: Record<string, unknown>) => Record<string, unknown> | null,
): ParamsSchema => ({
  '~standard': {
    validate: (value) => {
      const out = validate(value as Record<string, unknown>);
      return out === null ? { issues: [{ message: 'no' }] } : { value: out };
    },
  },
});

const numericId = schema((value) =>
  /^\d+$/u.test(String(value['id'])) ? { id: Number(value['id']) } : null,
);
const knownLocale = schema((value) =>
  value['locale'] === 'ja' || value['locale'] === 'en'
    ? { locale: value['locale'] }
    : null,
);

describe('parseParams', () => {
  it('replaces the strings a schema names with what it produced', () => {
    expect(
      parseParams([numericId], { id: '42', locale: 'ja' })?.params,
    ).toStrictEqual({ id: 42, locale: 'ja' });
  });

  it('runs the stack outer-first and lets each schema keep what it did not name', () => {
    expect(
      parseParams([knownLocale, numericId], { locale: 'en', id: '7' })?.params,
    ).toStrictEqual({ locale: 'en', id: 7 });
  });

  it('answers null the moment a schema refuses', () => {
    expect(
      parseParams([knownLocale, numericId], { locale: 'fr', id: '7' }),
    ).toBeNull();
    expect(parseParams([numericId], { id: 'shoes' })).toBeNull();
  });

  it('leaves params untouched when there is no schema', () => {
    expect(parseParams([], { id: '42' })?.params).toStrictEqual({ id: '42' });
  });

  it('refuses an asynchronous schema, because matching cannot wait', () => {
    const slow: ParamsSchema = {
      '~standard': { validate: () => Promise.resolve({ value: {} }) },
    };
    expect(() => parseParams([slow], {})).toThrow(/synchronously/u);
  });

  it('keeps what the schemas write to the async context for the render of the stack that answered, and from the caller', async () => {
    const store = new AsyncLocalStorage<string>();
    const recordsLocale = schema((value) => {
      store.enterWith(String(value['locale']));
      return { locale: value['locale'] };
    });

    expect(
      parseParams([recordsLocale, numericId], { locale: 'en', id: 'shoes' }),
    ).toBeNull();
    expect(store.getStore()).toBeUndefined();

    const accepted = parseParams([recordsLocale, numericId], {
      locale: 'en',
      id: '7',
    });
    expect(store.getStore()).toBeUndefined();
    const rendered = accepted?.enter(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1);
      });
      return store.getStore();
    });
    expect(store.getStore()).toBeUndefined();
    expect(await rendered).toBe('en');
  });
});

describe('parseCatchAllParams', () => {
  it('keeps the strings the pathname carried, whether the schemas accept or refuse', () => {
    expect(
      parseCatchAllParams([knownLocale, numericId], {
        locale: 'en',
        id: '7',
        '*': 'missing',
      }).params,
    ).toStrictEqual({ locale: 'en', id: '7', '*': 'missing' });
    expect(
      parseCatchAllParams([knownLocale], { locale: 'fr', '*': 'missing' })
        .params,
    ).toStrictEqual({ locale: 'fr', '*': 'missing' });
  });

  it('renders in what the schemas wrote when they all accept, and in nothing when one refuses', async () => {
    const store = new AsyncLocalStorage<string>();
    const recordsLocale = schema((value) => {
      store.enterWith(String(value['locale']));
      return { locale: value['locale'] };
    });
    const readLater = async (): Promise<string | undefined> => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1);
      });
      return store.getStore();
    };

    const accepted = parseCatchAllParams([recordsLocale], {
      locale: 'en',
      '*': 'missing',
    });
    const refused = parseCatchAllParams([recordsLocale, numericId], {
      locale: 'en',
      id: 'shoes',
    });

    expect(store.getStore()).toBeUndefined();
    expect(await accepted.enter(readLater)).toBe('en');
    expect(await refused.enter(readLater)).toBeUndefined();
  });
});
