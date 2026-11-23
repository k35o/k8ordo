import { execFileSync } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createBuilder } from 'vite';
import { afterAll, describe, expect, it } from 'vite-plus/test';

// 試すのは配る形のプラグイン。src の vite.ts は engine の runtime を自分の隣の
// runtime/ に探すが、そこへコピーされるのはビルドした dist だけ
import { vercel } from '../dist/vercel.mjs';
import { framework } from '../dist/vite.mjs';
import { importsWaitUntil } from './vercel-wait-until';

const here = fileURLToPath(new URL('..', import.meta.url));

const LAYOUT = `import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;

const PAGE = `export default function HomePage() {
  return <h1>home</h1>;
}
`;

const WAITING_ROUTE = `import { waitUntil } from '@k8ordo/framework/server';

export const GET = (): Response => {
  waitUntil(Promise.resolve('saved'));
  return new Response('answered');
};
`;

const PLAIN_ROUTE = `export const GET = (): Response => new Response('answered');
`;

const roots: string[] = [];

afterAll(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
});

/**
 * An application outside this repository, so only what is linked into its
 * `node_modules` resolves from its root: this package and React always,
 * `@vercel/functions` when `installed`.
 */
const app = async (
  route: string,
  { installed }: { readonly installed: boolean },
): Promise<string> => {
  // Vite は root を実体のパスで持つ。macOS の tmpdir はリンクの先にある
  const root = await realpath(
    await mkdtemp(path.join(tmpdir(), 'k8ordo-vercel-wait-until-')),
  );
  roots.push(root);
  const modules = path.join(root, 'node_modules');
  await mkdir(path.join(modules, '@k8ordo'), { recursive: true });
  await symlink(here, path.join(modules, '@k8ordo', 'framework'));
  for (const name of ['react', 'react-dom']) {
    await symlink(
      path.join(here, 'node_modules', name),
      path.join(modules, name),
    );
  }
  if (installed) {
    await mkdir(path.join(modules, '@vercel'));
    await symlink(
      path.join(here, 'node_modules', '@vercel', 'functions'),
      path.join(modules, '@vercel', 'functions'),
    );
  }
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ type: 'module' }),
  );
  const routes = path.join(root, 'src', 'routes');
  await mkdir(path.join(routes, 'work'), { recursive: true });
  await writeFile(path.join(routes, 'layout.tsx'), LAYOUT);
  await writeFile(path.join(routes, 'page.tsx'), PAGE);
  await writeFile(path.join(routes, 'work', 'route.ts'), route);
  return root;
};

const buildForVercel = async (root: string): Promise<void> => {
  const builder = await createBuilder({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: [framework({ mode: 'server' }), vercel()],
  });
  await builder.buildApp();
};

const functionOf = (root: string): string =>
  path.join(root, '.vercel', 'output', 'functions', 'handler.func');

// Vercel がするように、@vercel/functions が読む場所にリクエストの文脈を置いて
// から関数を呼ぶ。関数は自分のディレクトリしか持たないので、node_modules の
// 届かない場所に写して別のプロセスで呼ぶ
const CALL = `
const kept = [];
globalThis[Symbol.for('@vercel/request-context')] = {
  get: () => ({ waitUntil: (promise) => { kept.push(promise); } }),
};
const { default: fn } = await import('./index.mjs');
const response = await fn.fetch(new Request('https://example.test/work'));
process.stdout.write((await response.text()) + ' ' + String(kept.length));
`;

const callIsolated = async (root: string): Promise<string> => {
  const isolated = await mkdtemp(path.join(tmpdir(), 'k8ordo-vercel-func-'));
  roots.push(isolated);
  await cp(functionOf(root), isolated, { recursive: true });
  return execFileSync(
    process.execPath,
    ['--input-type=module', '--eval', CALL],
    { cwd: isolated, encoding: 'utf8', stdio: 'pipe' },
  );
};

describe('importsWaitUntil', () => {
  it.each([
    ['a named import', "import { waitUntil } from '@k8ordo/framework/server';"],
    [
      'a named import under another name, among others',
      "import { cookies, waitUntil as keep } from '@k8ordo/framework/server';",
    ],
    [
      'a namespace import, which may',
      "import * as server from '@k8ordo/framework/server';",
    ],
    [
      'a re-export by name',
      "export { waitUntil } from '@k8ordo/framework/server';",
    ],
    ['export *, which may', "export * from '@k8ordo/framework/server';"],
  ])('counts %s', (_what, code) => {
    expect(importsWaitUntil(code)).toBe(true);
  });

  it.each([
    [
      'an import of the entry’s other names',
      "import { cookies, redirect } from '@k8ordo/framework/server';",
    ],
    [
      'a waitUntil from another package',
      "import { waitUntil } from '@vercel/functions';\nconst from = '@k8ordo/framework/server';",
    ],
    [
      'an import for its side effects, which a type-only import compiles to',
      "import '@k8ordo/framework/server';",
    ],
    ['a module that never names the entry', 'export const waitUntil = 1;'],
  ])('passes over %s', (_what, code) => {
    expect(importsWaitUntil(code)).toBe(false);
  });
});

describe('a server build for Vercel', () => {
  it('stops, naming the module and the package, when a route.ts imports waitUntil and @vercel/functions is not installed', async () => {
    const root = await app(WAITING_ROUTE, { installed: false });

    await expect(buildForVercel(root)).rejects.toThrow(
      `the build for Vercel cannot keep the function running after its answer — on Vercel waitUntil() goes through @vercel/functions, which is not installed here, and this imports waitUntil from @k8ordo/framework/server:\n  ${path.join('src', 'routes', 'work', 'route.ts')}\ninstall @vercel/functions in this application`,
    );
  }, 120_000);

  it('hands the handler @vercel/functions’ waitUntil, from inside the function, when it is installed', async () => {
    const root = await app(WAITING_ROUTE, { installed: true });

    await buildForVercel(root);

    expect(await readFile(path.join(functionOf(root), 'index.mjs'), 'utf8'))
      .toBe(`import handler from './rsc/index.js';
import { waitUntil } from './wait-until.mjs';

export default { fetch: (request) => handler(request, { waitUntil }) };
`);
    expect(await callIsolated(root)).toBe('answered 1');
  }, 120_000);

  it('writes the function as it always did when nothing imports waitUntil, installed or not', async () => {
    const root = await app(PLAIN_ROUTE, { installed: true });

    await buildForVercel(root);

    expect(await readFile(path.join(functionOf(root), 'index.mjs'), 'utf8'))
      .toBe(`import handler from './rsc/index.js';

export default { fetch: handler };
`);
    expect((await readdir(functionOf(root))).toSorted()).toStrictEqual([
      '.vc-config.json',
      'index.mjs',
      'package.json',
      'rsc',
      'ssr',
    ]);
  }, 120_000);
});
