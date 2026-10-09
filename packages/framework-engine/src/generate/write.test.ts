import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { Problem } from '../grammar/tree';
import {
  declaresParams,
  exportsOf,
  generate,
  pagesReadingSearch,
  REEXPORTS_ALL,
  silentRoutes,
} from './write';

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

describe('exportsOf', () => {
  it('lists the names a route.ts answers by, and nothing it only mentions', () => {
    expect([
      ...exportsOf(
        [
          'export async function GET() { return new Response(); }',
          'export const POST = () => new Response();',
          'const handler = () => new Response();',
          'export { handler as DELETE };',
          'export type PUT = string;',
          '// export function PATCH() {}',
        ].join('\n'),
      ),
    ]).toStrictEqual(['GET', 'POST', 'DELETE']);
  });

  it('names a default export default', () => {
    expect(exportsOf('export default function Page() {}').has('default')).toBe(
      true,
    );
  });

  it('says that export * brings names it cannot list, rather than a default', () => {
    expect([
      ...exportsOf(
        [
          'export function GET() { return new Response(); }',
          "export * from './more';",
          "export * as helpers from './helpers';",
        ].join('\n'),
      ),
    ]).toStrictEqual(['GET', REEXPORTS_ALL, 'helpers']);
  });
});

// search は @k8ordo/state の urlReader で読むので、アプリの依存が要る
const generateWith = async (
  dependencies: Record<string, string>,
): Promise<readonly Problem[]> => {
  const root = await mkdtemp(path.join(tmpdir(), 'k8ordo-search-'));
  try {
    const routesDir = path.join(root, 'src/routes');
    await mkdir(path.join(routesDir, 'products'), { recursive: true });
    await writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({ dependencies }),
    );
    await writeFile(
      path.join(routesDir, 'products/page.tsx'),
      'export const search = listState.url;\nexport default function Page() { return null; }\n',
    );
    const { problems } = await generate({
      root,
      routesDir,
      outDir: path.join(root, '.k8ordo'),
      mode: 'server',
    });
    return problems;
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};

describe('generate, for a page that exports search', () => {
  it('refuses it by name in an application that does not depend on @k8ordo/state', async () => {
    expect(await generateWith({ '@k8ordo/framework': '*' })).toStrictEqual([
      {
        path: 'products/page.tsx',
        message:
          'exports search, which is read through @k8ordo/state — add it to the application’s dependencies',
      },
    ]);
  });

  it('accepts it once the application depends on @k8ordo/state', async () => {
    expect(
      await generateWith({ '@k8ordo/framework': '*', '@k8ordo/state': '*' }),
    ).toStrictEqual([]);
  });
});

describe('silentRoutes', () => {
  it('names a route.ts that exports no method, which would answer only 405', () => {
    expect(
      silentRoutes(
        new Map([
          ['feed.xml/route.ts', new Set(['GET'])],
          ['api/route.ts', new Set(['paramsSchema', 'handler'])],
          ['page.tsx', new Set(['default'])],
        ]),
      ),
    ).toStrictEqual([
      {
        path: 'api/route.ts',
        message:
          'exports none of GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS — a route.ts answers the methods it exports',
      },
    ]);
  });
});

describe('pagesReadingSearch', () => {
  it('names the pages that export search, and nothing else that does', () => {
    expect([
      ...pagesReadingSearch(
        new Map([
          ['products/page.tsx', new Set(['default', 'search'])],
          ['page.tsx', new Set(['default'])],
          ['products/layout.tsx', new Set(['default', 'search'])],
        ]),
      ),
    ]).toStrictEqual(['products/page.tsx']);
  });
});

// fallback.tsx は static でだけ表に載る。server のビルドには何も入らない
const generatedTableIn = async (mode: 'static' | 'server'): Promise<string> => {
  const root = await mkdtemp(path.join(tmpdir(), 'k8ordo-fallback-'));
  try {
    const routesDir = path.join(root, 'src/routes');
    await mkdir(path.join(routesDir, 'posts/[id]'), { recursive: true });
    await writeFile(path.join(root, 'package.json'), '{}');
    await writeFile(
      path.join(routesDir, 'page.tsx'),
      'export default function Page() { return null; }\n',
    );
    await writeFile(
      path.join(routesDir, 'posts/[id]/page.tsx'),
      'export default function Page() { return null; }\n',
    );
    await writeFile(
      path.join(routesDir, 'posts/[id]/fallback.tsx'),
      'export default function Shell() { return null; }\n',
    );
    const outDir = path.join(root, '.k8ordo');
    const { problems } = await generate({ root, routesDir, outDir, mode });
    expect(problems).toStrictEqual([]);
    return await readFile(path.join(outDir, 'routes.gen.ts'), 'utf8');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};

describe('generate, for a page with a fallback.tsx', () => {
  it('writes its shell into the table under a build into files', async () => {
    const source = await generatedTableIn('static');
    expect(source).toContain(
      "import posts_id_fallback from '../src/routes/posts/[id]/fallback';",
    );
    expect(source).toContain("  '/posts/:id': {");
  });

  it('writes no shell, and imports nothing of it, under a running server', async () => {
    const source = await generatedTableIn('server');
    expect(source).toContain('export const fallbacks = {} as const;');
    expect(source).not.toContain('posts/[id]/fallback');
  });
});
