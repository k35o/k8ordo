import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vite-plus/test';

const tsc = path.join(
  path.dirname(
    createRequire(import.meta.url).resolve('typescript/package.json'),
  ),
  'bin/tsc',
);
const routerIndex = fileURLToPath(new URL('index.ts', import.meta.url));

// 型の検査が何と言うかは、型の等しさでは確かめられない。表に無いパターンを
// 渡したアプリを tsc にかけ、エラー文に何が並ぶかを見る
/** What `tsc` reports about the application's own file. */
const diagnosticsOf = async (source: string): Promise<string> => {
  const dir = await mkdtemp(path.join(tmpdir(), 'router-register-'));
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
          paths: { '@k8ordo/router': [routerIndex] },
        },
        files: ['app.ts'],
      }),
    );
    // 型エラーがあると tsc は 0 以外で終わる。見たいのはその出力
    const stdout = await new Promise<string>((resolve) => {
      execFile(
        process.execPath,
        [tsc, '-p', dir, '--pretty', 'false'],
        (_error, output) => {
          resolve(output);
        },
      );
    });
    // ルーターのソースが読む import.meta.env の型はここに無い。アプリの行だけ見る
    return stdout
      .split('\n')
      .filter((line) => line.includes('app.ts('))
      .join('\n');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

describe('a pattern the registered table does not have', () => {
  it('is reported against the patterns the table has', async () => {
    const output = await diagnosticsOf(`
import { defineRoutes, href } from '@k8ordo/router';
import type { PageProps } from '@k8ordo/router';

const Page = () => null;
const routes = defineRoutes({
  '/': { layout: Page, children: { '/': Page, '/members': Page, '/posts/:id': Page } },
});

declare module '@k8ordo/router' {
  interface Register { routes: typeof routes }
}

href('/membrs');
export type Props = PageProps<'/membrs'>;
`);
    const union = `'"/" | "/members" | "/posts/:id"'`;
    expect(output).toContain(
      `Argument of type '"/membrs"' is not assignable to parameter of type ${union}`,
    );
    expect(output).toContain(
      `Type '"/membrs"' does not satisfy the constraint ${union}`,
    );
  }, 60_000);
});

describe('a rest param in the registered table', () => {
  it('reaches a page, a route.ts and useMatch as an array, and a link takes one', async () => {
    const output = await diagnosticsOf(`
import { defineRoutes, href, matchPath } from '@k8ordo/router';
import type { PageProps, RouteContext } from '@k8ordo/router';

const Page = () => null;
const routes = defineRoutes({ '/files': Page, '/files/:path+': Page });

declare module '@k8ordo/router' {
  interface Register { routes: typeof routes }
}

const segments: readonly string[] = ['a', 'b'];
href('/files/:path+', { path: segments });
href('/files/:path+', { path: ['a', 1] });
export const page: readonly string[] = ({} as PageProps<'/files/:path+'>).params.path;
export const route: readonly string[] = ({} as RouteContext<'/files/:path+'>).params.path;
export const matched: readonly string[] | undefined = matchPath('/files/:path+', '/files/a')?.path;

href('/files/:path+', { path: 'a/b' });
export const one: string = ({} as PageProps<'/files/:path+'>).params.path;
`);
    expect(output.split('\n')).toHaveLength(2);
    expect(output).toContain(
      `app.ts(19,25): error TS2322: Type 'string' is not assignable to type 'readonly ParamValue[]'.`,
    );
    expect(output).toContain(
      `app.ts(20,14): error TS2322: Type 'readonly string[]' is not assignable to type 'string'.`,
    );
  }, 60_000);
});

describe('LayoutProps', () => {
  it('takes the pattern of a layout with no page of its own, where PageProps does not', async () => {
    const output = await diagnosticsOf(`
import { defineRoutes } from '@k8ordo/router';
import type { LayoutProps, PageProps } from '@k8ordo/router';

const Page = () => null;
const routes = defineRoutes({ '/blog/:slug/comments': Page });

declare module '@k8ordo/router' {
  interface Register { routes: typeof routes }
}

export const slug: string = ({} as LayoutProps<'/blog/:slug'>).params.slug;
export type Props = PageProps<'/blog/:slug'>;
`);
    expect(output.split('\n')).toHaveLength(1);
    expect(output).toContain(
      `Type '"/blog/:slug"' does not satisfy the constraint '"/blog/:slug/comments"'`,
    );
  }, 60_000);
});
