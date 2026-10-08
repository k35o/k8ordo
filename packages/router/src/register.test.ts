import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
