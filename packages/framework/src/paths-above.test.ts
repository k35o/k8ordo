import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ViteDevServer } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { devServer, failedBuild, staticBuild } from '../fixtures/build';

describe('the params a paths.ts below another receives', () => {
  it('are read by the layouts above its directory and not by the page beside it, under the build', async () => {
    const client = await staticBuild('paths-above');

    expect(existsSync(path.join(client, '2024', 'number', 'index.html'))).toBe(
      true,
    );
  }, 120_000);

  it('are never handed to it when a layout above refuses them, and the build names where it stands', async () => {
    const { said } = await failedBuild('paths-above-refused');

    expect(said).toContain(
      'the paths.ts files stand where a params schema refuses the values above them, so they were not asked: /last/:slug ([year]/[slug]/paths.ts)',
    );
    expect(said).not.toContain('was asked under');
  }, 120_000);

  describe('under vite dev', () => {
    let server: ViteDevServer;
    let origin = '';

    beforeAll(async () => {
      server = await devServer('paths-above');
      await server.listen();
      origin = server.resolvedUrls?.local[0] ?? '';
    }, 60_000);

    afterAll(async () => {
      await server.close();
    });

    it('are read the same way, and a value no paths.ts lists is not found', async () => {
      const listed = await fetch(new URL('/2024/number', origin));
      const unlisted = await fetch(new URL('/2024/string-2024', origin));

      expect(listed.status).toBe(200);
      expect(unlisted.status).toBe(404);
    }, 30_000);
  });
});

const tsc = path.join(
  path.dirname(
    createRequire(import.meta.url).resolve('typescript/package.json'),
  ),
  'bin/tsc',
);

// Register を広げると、このパッケージの型検査のすべてが変わる。広げたアプリを
// 別に tsc にかけ、エラー文を見る
const diagnosticsOf = async (source: string): Promise<string> => {
  const dir = await mkdtemp(path.join(tmpdir(), 'framework-paths-'));
  try {
    await writeFile(path.join(dir, 'app.ts'), source);
    await writeFile(
      path.join(dir, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'esnext',
          module: 'esnext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
          paths: {
            '@k8ordo/router': [
              fileURLToPath(
                new URL('../../router/src/index.ts', import.meta.url),
              ),
            ],
          },
        },
        files: ['app.ts'],
      }),
    );
    const stdout = await new Promise<string>((resolve) => {
      execFile(
        process.execPath,
        [tsc, '-p', dir, '--pretty', 'false'],
        (_error, output) => {
          resolve(output);
        },
      );
    });
    return stdout
      .split('\n')
      .filter((line) => line.includes('app.ts('))
      .join('\n');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

describe('Paths', () => {
  it('types the params above as the layouts above its directory read them whatever the page beside it reads, as strings where none reads them, and the values of a directory with no page as anything with a spelling', async () => {
    const pathsType = fileURLToPath(new URL('paths-type.ts', import.meta.url));
    const diagnostics = await diagnosticsOf(`
import type { Paths } from ${JSON.stringify(pathsType)};

declare module '@k8ordo/router' {
  interface Register {
    params: {
      '/:year/:slug': { readonly year: string; readonly slug: string };
    };
    pathsParams: {
      '/:year/:slug': { readonly year: number; readonly slug: string };
    };
  }
}

export const years: Paths<'/:year'> = () => ['2024'];
export const slugs: Paths<'/:year/:slug'> = ({ year }) => [\`after-\${year + 1}\`];
export const misread: Paths<'/:year/:slug'> = ({ year }) => [year.toUpperCase()];
export const unread: Paths<'/:locale/posts/:id'> = ({ locale }) => [locale.toUpperCase()];
`);

    expect(diagnostics.split('\n')).toHaveLength(1);
    expect(diagnostics).toContain(
      "Property 'toUpperCase' does not exist on type 'number'.",
    );
  }, 60_000);

  it('types the params above, where paths.ts files under different layouts share a pattern, as what every one of them receives', async () => {
    const pathsType = fileURLToPath(new URL('paths-type.ts', import.meta.url));
    const diagnostics = await diagnosticsOf(`
import type { ParsedParamsMap, StandardSchemaLike } from '@k8ordo/router';
import type { Paths } from ${JSON.stringify(pathsType)};

declare const locale_layout_params: StandardSchemaLike<{ readonly locale: 'ja' | 'en' }>;
declare const year_layout_params: StandardSchemaLike<{ readonly year: number }>;

declare module '@k8ordo/router' {
  interface Register {
    pathsParams: ParsedParamsMap<{
      '/:locale/:id': [typeof locale_layout_params] | [];
      '/:year/:slug': [typeof year_layout_params] | [];
    }>;
  }
}

export const ids: Paths<'/:locale/:id'> = ({ locale }) => [locale.toUpperCase()];
export const localized: Paths<'/:locale/:id'> = ({ locale }) => {
  const read: 'ja' = locale;
  return [read];
};
export const slugs: Paths<'/:year/:slug'> = ({ year }) => [String(year)];
export const counted: Paths<'/:year/:slug'> = ({ year }) => [year.toFixed()];
`);

    expect(diagnostics.split('\n')).toHaveLength(2);
    expect(diagnostics).toContain(
      `Type 'string' is not assignable to type '"ja"'.`,
    );
    expect(diagnostics).toContain(
      "Property 'toFixed' does not exist on type 'string | number'.",
    );
  }, 60_000);
});
