import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { vercel } from '@k8ordo/server/vercel';
import { createBuilder } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, '.vercel', 'output');

// Vercel の関数が持つのは .func の中身だけ。node_modules の届かない場所に
// 写してから呼ぶので、束ねきれていない依存があればここで解決に失敗する
const CALL = `
const { default: fn } = await import('./index.mjs');
const response = await fn.fetch(new Request('https://example.test/products/2'));
process.stdout.write(String(response.status) + '\\n' + (await response.text()));
`;

const scriptsIn = async (dir: string): Promise<string[]> =>
  (await readdir(dir)).filter((name) => name.endsWith('.js')).toSorted();

// 主張の対象は Vercel 向けに組み上げたアプリ。global-setup が組んだ dist を
// ほかのテストが読んでいるので、出力先を分けてもう一度組む
beforeAll(async () => {
  const builder = await createBuilder({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    logLevel: 'warn',
    plugins: [vercel()],
    environments: {
      client: { build: { outDir: 'dist/vercel/client' } },
      rsc: { build: { outDir: 'dist/vercel/rsc' } },
      ssr: { build: { outDir: 'dist/vercel/ssr' } },
    },
  });
  await builder.buildApp();
}, 60_000);

describe('the application built for Vercel', () => {
  it('answers from a function that holds everything it imports', async () => {
    const isolated = await mkdtemp(path.join(tmpdir(), 'k8ordo-vercel-'));
    try {
      await cp(path.join(output, 'functions', 'handler.func'), isolated, {
        recursive: true,
      });
      const [status, ...body] = execFileSync(
        process.execPath,
        ['--input-type=module', '--eval', CALL],
        { cwd: isolated, encoding: 'utf8', stdio: 'pipe' },
      ).split('\n');
      expect(status).toBe('200');
      expect(body.join('\n')).toContain('second product');
    } finally {
      await rm(isolated, { recursive: true, force: true });
    }
  });

  it('puts every script of the client build on the CDN', async () => {
    expect(
      await scriptsIn(path.join(output, 'static', 'assets')),
    ).toStrictEqual(
      await scriptsIn(path.join(root, 'dist', 'vercel', 'client', 'assets')),
    );
  });
});
