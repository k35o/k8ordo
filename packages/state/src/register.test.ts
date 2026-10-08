import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const tsc = path.join(
  path.dirname(require.resolve('typescript/package.json')),
  'bin/tsc',
);
const stateIndex = fileURLToPath(new URL('index.ts', import.meta.url));
const routerIndex = path.join(
  path.dirname(require.resolve('@k8ordo/router/package.json')),
  'src/index.ts',
);
const zodTypes = path.join(
  path.dirname(require.resolve('zod/package.json')),
  'index.d.ts',
);

// 型の検査が何と言うかは、型の等しさでは確かめられない。表に無いパスを
// 渡したアプリを tsc にかけ、エラー文に何が並ぶかを見る
/** What `tsc` reports about the application's own file. */
const diagnosticsOf = async (source: string): Promise<string> => {
  const dir = await mkdtemp(path.join(tmpdir(), 'state-register-'));
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
            '@k8ordo/state': [stateIndex],
            '@k8ordo/router': [routerIndex],
            zod: [zodTypes],
          },
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
    // パッケージのソースが読む import.meta.env の型はここに無い。アプリの行だけ見る
    return stdout
      .split('\n')
      .filter((line) => line.includes('app.ts('))
      .join('\n');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

const ROUTES = `
import { defineRoutes, href } from '@k8ordo/router';
import { definePageState } from '@k8ordo/state';
import { z } from 'zod';

const Page = () => null;
const routes = defineRoutes({
  '/': { layout: Page, children: { '/': Page, '/members': Page, '/posts/:id': Page, '/files/*': Page } },
});

declare module '@k8ordo/router' {
  interface Register { routes: typeof routes }
}
declare module '@k8ordo/state' {
  interface Register { routes: typeof routes }
}

const listState = definePageState('list', { url: z.object({ page: z.number().default(1) }) });
`;

describe('a path the registered router does not accept', () => {
  it('is reported against the linkable patterns, as the router reports a pattern', async () => {
    const output = await diagnosticsOf(`${ROUTES}
listState.href('/membrs');
href('/membrs');
`);
    const union = `'"/" | "/members" | "/posts/:id"'`;
    const lines = output.split('\n');
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line).toContain(
        `Argument of type '"/membrs"' is not assignable to parameter of type ${union}`,
      );
    }
  }, 60_000);

  it('still refuses every path no pattern matches, the pattern spellings aside', async () => {
    const output = await diagnosticsOf(`${ROUTES}
listState.href('/posts/:id');
listState.href('/posts/42');
listState.href(\`/posts/\${String(42)}\`);
listState.href('/files/*');
listState.href('/posts/42/comments');
listState.href('/posts/');
listState.href('members');
listState.href(String('/members'));
`);
    const refused = output
      .split('\n')
      .map((line) => /Argument of type '(.+?)' is not/u.exec(line)?.[1]);
    expect(refused).toStrictEqual([
      '"/files/*"',
      '"/posts/42/comments"',
      '"/posts/"',
      '"members"',
      'string',
    ]);
  }, 60_000);

  it('is reported against the registered union under path, and any /-path without either', async () => {
    const output = await diagnosticsOf(`
import { definePageState } from '@k8ordo/state';
import { z } from 'zod';

type Route = '/a' | \`/b/\${string}\`;
declare module '@k8ordo/state' {
  interface Register { path: Route }
}

const listState = definePageState('list', { url: z.object({ page: z.number().default(1) }) });
listState.href('/c');
`);
    expect(output).toContain(
      `Argument of type '"/c"' is not assignable to parameter of type 'Route'`,
    );
    const bare = await diagnosticsOf(`
import { definePageState } from '@k8ordo/state';
import { z } from 'zod';

const listState = definePageState('list', { url: z.object({ page: z.number().default(1) }) });
listState.href('nowhere');
`);
    expect(bare).toContain(
      `Argument of type '"nowhere"' is not assignable to parameter of type '\`/\${string}\`'`,
    );
  }, 60_000);
});
