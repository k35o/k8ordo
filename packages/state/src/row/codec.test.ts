import { z } from 'zod';

import { defineCookieState } from '../cookie-state';
import { defineLocalState } from '../storage-state';
import type { Versioning } from './codec';

// v1 は { layout: 'list' | 'cards' } を書いていた。v2 で view に改名した
const viewSchema = z.object({
  view: z.enum(['grid', 'table']).default('grid'),
  pageSize: z.number().default(20),
});

const migrateView = vi.fn<Versioning<typeof viewSchema>['migrate']>((old) => ({
  view: old['layout'] === 'list' ? 'table' : 'grid',
  pageSize: old['pageSize'],
}));

const viewCookie = defineCookieState('view', viewSchema, {
  version: 2,
  migrate: migrateView,
});

const cookiesWith = (row: unknown): ReadonlyMap<string, string> =>
  new Map([[viewCookie.cookieName, JSON.stringify(row)]]);

beforeEach(() => {
  migrateView.mockClear();
});

describe('version and migrate', () => {
  it('reads a row of the current version as it is', () => {
    const values = viewCookie.parseCookies(
      cookiesWith([2, { view: 'table', pageSize: 50 }]),
    );

    expect(values).toStrictEqual({ view: 'table', pageSize: 50 });
    expect(migrateView).not.toHaveBeenCalled();
  });

  it('migrates a row an older version wrote before the schema reads it', () => {
    const values = viewCookie.parseCookies(
      cookiesWith([1, { layout: 'list', pageSize: 50 }]),
    );

    expect(values).toStrictEqual({ view: 'table', pageSize: 50 });
    expect(migrateView).toHaveBeenCalledWith(
      { layout: 'list', pageSize: 50 },
      1,
    );
  });

  it('reads a row written before the definition had a version as version 0', () => {
    const values = viewCookie.parseCookies(cookiesWith({ layout: 'list' }));

    expect(values).toStrictEqual({ view: 'table', pageSize: 20 });
    expect(migrateView).toHaveBeenCalledWith({ layout: 'list' }, 0);
  });

  it('passes what migrate returns through the schema, field by field', () => {
    const values = viewCookie.parseCookies(
      cookiesWith([1, { layout: 'list', pageSize: 'many' }]),
    );

    expect(values).toStrictEqual({ view: 'table', pageSize: 20 });
  });

  it('reads a row a failing migrate cannot turn as nothing stored', () => {
    const failing = defineCookieState('failing', viewSchema, {
      version: 2,
      migrate: () => {
        throw new Error('unexpected shape');
      },
    });

    const values = failing.parseCookies(
      new Map([[failing.cookieName, '[1,{"layout":"list"}]']]),
    );

    expect(values).toStrictEqual({ view: 'grid', pageSize: 20 });
  });

  it('salvages a row a newer version wrote without migrating it', () => {
    const values = viewCookie.parseCookies(
      cookiesWith([3, { view: 'table', pageSize: 'all', sort: 'new' }]),
    );

    expect(values).toStrictEqual({ view: 'table', pageSize: 20 });
    expect(migrateView).not.toHaveBeenCalled();
  });

  it('writes the version together with the values', () => {
    expect(decodeURIComponent(viewCookie.cookieValue({ view: 'table' }))).toBe(
      '[2,{"view":"table","pageSize":20}]',
    );
  });

  it('refuses a version that is not a positive integer', () => {
    for (const version of [0, -1, 1.5, Number.NaN]) {
      expect(() =>
        defineLocalState('bad-version', viewSchema, {
          version,
          migrate: () => ({}),
        }),
      ).toThrow(/version must be a positive integer/u);
    }
  });

  it('keeps the keys migrate returns to the schema’s', () => {
    expect(MigrateKeysCheckedByTypes).toBeInstanceOf(Function);
  });
});

// 型検査だけが目的で、呼ばない
const MigrateKeysCheckedByTypes = (): void => {
  defineLocalState('typed', viewSchema, {
    version: 2,
    // @ts-expect-error `layout` is not a key of the schema any more
    migrate: (old) => ({ layout: old['layout'] }),
  });
};

describe('inlineRead of a versioned local state', () => {
  const theme = defineLocalState(
    'theme',
    z.object({ mode: z.enum(['light', 'dark']).optional() }),
    { version: 2, migrate: () => ({}) },
  );

  const evaluateWith = (text: string | null): unknown => {
    const storage: Pick<Storage, 'getItem'> = { getItem: () => text };
    // oxlint-disable-next-line no-new-func, no-implied-eval -- the expression under test is generated source; evaluating it is the test
    const read = new Function(
      'localStorage',
      `return ${theme.inlineRead()};`,
    ) as (storage: Pick<Storage, 'getItem'>) => unknown;
    return read(storage);
  };

  it('evaluates to the values of a row of the current version', () => {
    expect(evaluateWith('[2,{"mode":"dark"}]')).toStrictEqual({ mode: 'dark' });
  });

  it('evaluates to null for a row of another version, which only migrate can read', () => {
    expect(evaluateWith('[1,{"mode":"dark"}]')).toBeNull();
    expect(evaluateWith('{"mode":"dark"}')).toBeNull();
    expect(evaluateWith('[2,"dark"]')).toBeNull();
    expect(evaluateWith('[2,{"mode":"dark"},"extra"]')).toBeNull();
  });
});
