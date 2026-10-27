import { execFile } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vite-plus/test';

// 利用者が叩くのは組み上がった bin なので、dist のものを走らせる
const cli = fileURLToPath(new URL('../dist/cli.mjs', import.meta.url));
const framework = fileURLToPath(new URL('..', import.meta.url));

const ROUTE = 'export default function Route() { return null; }\n';

type Ran = {
  readonly code: number;
  readonly stderr: string;
};

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

/**
 * An application with `vite.config.ts` saying `config` and the files under
 * it, `@k8ordo/framework` installed as a link to this package.
 */
const app = async (
  config: string,
  files: Readonly<Record<string, string>>,
): Promise<string> => {
  const root = await mkdtemp(path.join(tmpdir(), 'k8ordo-generate-'));
  roots.push(root);
  await mkdir(path.join(root, 'node_modules/@k8ordo'), { recursive: true });
  await symlink(framework, path.join(root, 'node_modules/@k8ordo/framework'));
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ type: 'module' }),
  );
  await writeFile(path.join(root, 'vite.config.ts'), config);
  for (const [file, source] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), source);
  }
  return root;
};

const k8ordo = (root: string, ...args: string[]): Promise<Ran> =>
  new Promise((resolve) => {
    execFile(
      process.execPath,
      [cli, ...args],
      { cwd: root },
      (error, _stdout, stderr) => {
        resolve({ code: error === null ? 0 : Number(error.code), stderr });
      },
    );
  });

const generated = (root: string, file: string): Promise<string> =>
  readFile(path.join(root, '.k8ordo', file), 'utf8');

describe('k8ordo generate', { timeout: 30_000 }, () => {
  it('writes .k8ordo/ from the routes directory vite.config.ts names, never calling paths or building', async () => {
    const root = await app(
      `import { framework } from '@k8ordo/framework/vite';

export default {
  plugins: [
    framework({
      mode: 'static',
      routesDir: 'app/routes',
      paths: () => {
        throw new Error('paths was called');
      },
    }),
  ],
};
`,
      {
        'app/routes/layout.tsx': ROUTE,
        'app/routes/page.tsx': ROUTE,
        'app/routes/posts/[id]/page.tsx': ROUTE,
      },
    );

    const { code } = await k8ordo(root, 'generate');

    expect(code).toBe(0);
    expect((await readdir(root)).toSorted()).toStrictEqual([
      '.k8ordo',
      'app',
      'node_modules',
      'package.json',
      'vite.config.ts',
    ]);
    expect(await generated(root, 'routes.gen.ts')).toContain(
      "'../app/routes/posts/[id]/page'",
    );
    expect(await generated(root, 'register.gen.ts')).not.toContain(
      'request: RouteRequest',
    );
  });

  it("registers the request a page receives when vite.config.ts says mode: 'server'", async () => {
    const root = await app(
      `import { framework } from '@k8ordo/framework/vite';

export default { plugins: [framework({ mode: 'server' })] };
`,
      { 'src/routes/layout.tsx': ROUTE, 'src/routes/page.tsx': ROUTE },
    );

    const { code } = await k8ordo(root, 'generate');

    expect(code).toBe(0);
    expect(await generated(root, 'register.gen.ts')).toContain(
      '    request: RouteRequest;\n',
    );
  });

  it('fails naming every problem in routes/, as the build does, and writes nothing', async () => {
    const root = await app(
      `import { framework } from '@k8ordo/framework/vite';

export default { plugins: [framework({ mode: 'static' })] };
`,
      {
        'src/routes/page.tsx': ROUTE,
        'src/routes/button.tsx': ROUTE,
        'src/routes/about/helpers.ts': ROUTE,
      },
    );

    const { code, stderr } = await k8ordo(root, 'generate');

    expect(code).toBe(1);
    expect(stderr).toMatch(/^routes\/ is not a valid pathname space:\n/u);
    expect(stderr).toMatch(/\n {2}routes\/button\.tsx: /u);
    expect(stderr).toMatch(/\n {2}routes\/about\/helpers\.ts: /u);
    expect(await readdir(root)).not.toContain('.k8ordo');
  });

  it('fails on a vite.config.ts without framework(), which has nothing to generate', async () => {
    const root = await app('export default { plugins: [] };\n', {
      'src/routes/page.tsx': ROUTE,
    });

    const { code, stderr } = await k8ordo(root, 'generate');

    expect(code).toBe(1);
    expect(stderr).toMatch(
      /^the Vite config in \S+ does not use framework\(\) from @k8ordo\/framework\/vite, so there is nothing to generate\n$/u,
    );
  });

  it.each([[[]], [['build']], [['generate', 'extra']]])(
    'answers %j with its usage and fails',
    async (args) => {
      const root = await app('export default {};\n', {});

      const { code, stderr } = await k8ordo(root, ...args);

      expect(code).toBe(1);
      expect(stderr).toMatch(/^usage: k8ordo generate\n/u);
    },
  );
});
