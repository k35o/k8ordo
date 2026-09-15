import { declaresParams } from './write';

describe('declaresParams', () => {
  it('sees the spellings a person writes', () => {
    expect(declaresParams('export const paramsSchema = z.object({});')).toBe(
      true,
    );
    expect(declaresParams('export let paramsSchema = z.object({});')).toBe(
      true,
    );
    expect(
      declaresParams('const paramsSchema = 1;\nexport { paramsSchema };'),
    ).toBe(true);
    expect(
      declaresParams('const schema = 1;\nexport { schema as paramsSchema };'),
    ).toBe(true);
  });

  it('sees a destructured export, which a lint autofix writes', () => {
    expect(declaresParams('export const { paramsSchema } = locales;')).toBe(
      true,
    );
    expect(
      declaresParams('export const { paramsSchema, other } = locales;'),
    ).toBe(true);
  });

  it('reads TSX with types, since that is what a route file is', () => {
    expect(
      declaresParams(
        [
          "import type { FC } from 'react';",
          'export const paramsSchema: Schema<{ id: number }> = z.object({});',
          'const Page: FC<{ params: { id: number } }> = ({ params }) => <h1>{params.id}</h1>;',
          'export default Page;',
        ].join('\n'),
      ),
    ).toBe(true);
  });

  it('is not fooled by the word elsewhere', () => {
    expect(declaresParams('export default function Page({ params }) {}')).toBe(
      false,
    );
    expect(
      declaresParams(
        'const paramsSchema = 1; export const other = paramsSchema;',
      ),
    ).toBe(false);
    expect(declaresParams('export const params = 1;')).toBe(false);
    // The words inside a string — a code sample on a docs page — are not
    // an export.
    expect(
      declaresParams(
        'export const EXAMPLE = `export const paramsSchema = locales.paramsSchema;`;',
      ),
    ).toBe(false);
    expect(declaresParams('// export const paramsSchema = 1;')).toBe(false);
    expect(declaresParams('export type paramsSchema = string;')).toBe(false);
  });

  it('declares nothing for a file that does not parse', () => {
    expect(declaresParams('export const paramsSchema = ;')).toBe(false);
  });
});
