import { z } from 'zod';
import * as zm from 'zod/mini';

import { definePageState } from './page-state';

const listState = definePageState('list', {
  url: z.object({
    q: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
    tags: z.array(z.string()).default([]),
    sort: z.enum(['new', 'old']).optional(),
  }),
});

describe('parseUrl', () => {
  it('fills every absent param with its default', () => {
    expect(listState.parseUrl(new URLSearchParams())).toStrictEqual({
      q: '',
      page: 1,
      tags: [],
      sort: undefined,
    });
  });

  it('coerces the string the URL carries into the schema type', () => {
    const parsed = listState.parseUrl(new URLSearchParams('q=shoes&page=3'));
    expect(parsed.q).toBe('shoes');
    expect(parsed.page).toBe(3);
  });

  it('salvages one broken param to its own default without dropping the rest', () => {
    const parsed = listState.parseUrl(new URLSearchParams('page=zero&q=shoes'));
    expect(parsed.page).toBe(1);
    expect(parsed.q).toBe('shoes');
  });

  it('treats a constraint violation like any other broken param', () => {
    expect(listState.parseUrl(new URLSearchParams('page=0')).page).toBe(1);
  });

  it('collects repeated params into an array field', () => {
    expect(
      listState.parseUrl(new URLSearchParams('tags=a&tags=b')).tags,
    ).toStrictEqual(['a', 'b']);
  });

  it('reads the record shape frameworks hand to a page', () => {
    const parsed = listState.parseUrl({
      q: 'x',
      tags: ['a', 'b'],
      page: undefined,
    });
    expect(parsed).toStrictEqual({
      q: 'x',
      page: 1,
      tags: ['a', 'b'],
      sort: undefined,
    });
  });

  it('ignores params the schema does not declare', () => {
    expect(listState.parseUrl(new URLSearchParams('other=1')).q).toBe('');
  });

  it('leaves an optional field undefined until the URL provides it', () => {
    expect(listState.parseUrl(new URLSearchParams()).sort).toBeUndefined();
    expect(listState.parseUrl(new URLSearchParams('sort=new')).sort).toBe(
      'new',
    );
  });
});

describe('definePageState', () => {
  it('salvage cannot smuggle a combination an object-level refine forbids', () => {
    const range = definePageState('range', {
      url: z
        .object({
          min: z.coerce.number().default(0),
          max: z.coerce.number().default(10),
        })
        .refine((value) => value.min <= value.max),
    });
    // max が壊れて default の 10 に落ちると min=20 が refine に反するので、
    // 全体が defaults へ落ちる。組み合わせが保てるなら salvage は生きる。
    expect(range.parseUrl(new URLSearchParams('min=20&max=abc'))).toStrictEqual(
      { min: 0, max: 10 },
    );
    expect(range.parseUrl(new URLSearchParams('min=5&max=abc'))).toStrictEqual({
      min: 5,
      max: 10,
    });
  });

  it('names the real problem when a refine rejects the defaults', () => {
    expect(() =>
      definePageState('bad-refine', {
        url: z.object({ a: z.string().default('x') }).refine(() => false),
      }),
    ).toThrow(/rejects its own defaults/u);
  });

  it('rejects a url field that cannot parse from absence, naming it', () => {
    expect(() =>
      definePageState('broken', { url: z.object({ q: z.string() }) }),
    ).toThrow(/absence.*q/u);
  });
});

describe('href and search', () => {
  it('omits every field that sits at its default', () => {
    expect(listState.href('/products', { page: 2 })).toBe('/products?page=2');
    expect(listState.href('/products', { page: 1 })).toBe('/products');
    expect(listState.href('/products')).toBe('/products');
  });

  it('serializes an array field as repeated params', () => {
    expect(listState.search({ tags: ['a', 'b'] })).toBe('tags=a&tags=b');
  });

  it('round-trips through parseUrl', () => {
    const query = listState.search({ q: 'x', page: 3 });
    const parsed = listState.parseUrl(new URLSearchParams(query));
    expect(parsed.q).toBe('x');
    expect(parsed.page).toBe(3);
  });

  it('refuses a value with no URL serialization instead of writing garbage', () => {
    const dated = definePageState('dated', {
      url: z.object({ since: z.date().optional() }),
    });
    expect(() => dated.search({ since: new Date(0) })).toThrow(
      /no URL serialization/u,
    );
  });

  it('keeps the path literal in the type for typed-route checks', () => {
    expectTypeOf(listState.href('/products', { page: 2 })).toEqualTypeOf<
      '/products' | `/products?${string}`
    >();
    // @ts-expect-error a path must start with '/'
    listState.href('products');
  });
});

describe('the entry slot', () => {
  it('rejects a field declared in both url and entry, naming it', () => {
    expect(() =>
      definePageState('twice', {
        url: z.object({ q: z.string().default('') }),
        // @ts-expect-error q is already a url field
        entry: z.object({ q: z.string().default('') }),
      }),
    ).toThrow(/both url and entry.*q/u);
  });

  it('rejects a definition with neither slot', () => {
    // @ts-expect-error at least one slot is required
    expect(() => definePageState('empty', {})).toThrow(/neither/u);
  });

  it('applies the absence rule to entry fields too', () => {
    expect(() =>
      definePageState('strict-entry', {
        entry: z.object({ step: z.number() }),
      }),
    ).toThrow(/entry fields.*step/u);
  });

  it('an entry-only definition still builds plain links', () => {
    const wizard = definePageState('wizard', {
      entry: z.object({ step: z.number().default(1) }),
    });
    expect(wizard.href('/signup')).toBe('/signup');
    expect(wizard.search()).toBe('');
  });
});

describe('a schema written with zod/mini', () => {
  /* oxlint-disable no-underscore-dangle -- `_default` is zod/mini's own
     spelling of `.default()` */
  const miniState = definePageState('mini', {
    url: zm.object({
      q: zm._default(zm.string(), ''),
      page: zm._default(zm.coerce.number().check(zm.int(), zm.gte(1)), 1),
    }),
  });
  /* oxlint-enable no-underscore-dangle */

  it('parses and serializes the same way', () => {
    expect(miniState.parseUrl(new URLSearchParams('page=4'))).toStrictEqual({
      q: '',
      page: 4,
    });
    expect(miniState.href('/items', { page: 4, q: '' })).toBe('/items?page=4');
  });
});

describe('parseUrl type', () => {
  it('derives the output type from the schema', () => {
    const parsed = listState.parseUrl(new URLSearchParams());
    expectTypeOf(parsed.q).toEqualTypeOf<string>();
    expectTypeOf(parsed.page).toEqualTypeOf<number>();
    expectTypeOf(parsed.tags).toEqualTypeOf<string[]>();
    expectTypeOf(parsed.sort).toEqualTypeOf<'new' | 'old' | undefined>();
  });
});
