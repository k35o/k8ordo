import { describe, expectTypeOf, it } from 'vite-plus/test';

import type { ParsedParams, StandardSchemaLike } from './paths';

type LocaleLayout = StandardSchemaLike<{
  locale: 'en' | 'ja';
  year: number;
}>;
type ArchivePage = StandardSchemaLike<{ year: Date }>;

type Archive = ParsedParams<
  '/:locale/:year/:slug',
  [LocaleLayout, ArchivePage]
>;

describe('ParsedParams', () => {
  it('types a param two schemas name by the later one, which runs last', () => {
    expectTypeOf<Archive['year']>().toEqualTypeOf<Date>();
  });

  it('keeps the type of a param only an outer schema names', () => {
    expectTypeOf<Archive['locale']>().toEqualTypeOf<'en' | 'ja'>();
  });

  it('leaves a param no schema names a string', () => {
    expectTypeOf<Archive['slug']>().toEqualTypeOf<string>();
    expectTypeOf<keyof Archive>().toEqualTypeOf<'locale' | 'year' | 'slug'>();
  });
});
