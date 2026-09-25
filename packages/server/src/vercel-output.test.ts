import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { writeVercelOutput } from './vercel-output';

type Entry = {
  readonly default: { readonly fetch: (request: Request) => Promise<Response> };
};

let root: string;
let output: string;

const read = async (file: string): Promise<unknown> =>
  JSON.parse(await readFile(path.join(output, file), 'utf8')) as unknown;

const filesUnder = async (dir: string): Promise<string[]> =>
  (
    await readdir(path.join(output, dir), {
      recursive: true,
      withFileTypes: true,
    })
  )
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path.relative(
        path.join(output, dir),
        path.join(entry.parentPath, entry.name),
      ),
    )
    .toSorted();

// 本物のビルドは要らない: 書き出すのは dist の 3 つのディレクトリの写しと設定だけ
beforeAll(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'k8ordo-vercel-'));
  output = path.join(root, '.vercel', 'output');
  const dist = path.join(root, 'dist');
  await mkdir(path.join(dist, 'client', 'assets'), { recursive: true });
  await mkdir(path.join(dist, 'rsc'), { recursive: true });
  await mkdir(path.join(dist, 'ssr'), { recursive: true });
  await writeFile(
    path.join(dist, 'client', 'assets', 'app-abc123.js'),
    'export {};',
  );
  await writeFile(
    path.join(dist, 'client', 'assets', 'app-abc123.js.br'),
    'br',
  );
  await writeFile(
    path.join(dist, 'client', 'assets', 'app-abc123.js.gz'),
    'gz',
  );
  await writeFile(path.join(dist, 'client', 'archive.tar.gz'), 'a download');
  // ハンドラは隣の ssr を相対パスで読む。組み上がったものと同じ形
  await writeFile(
    path.join(dist, 'rsc', 'index.js'),
    `export default async (request) => {
      const { rendered } = await import('../ssr/index.js');
      return new Response(rendered(new URL(request.url).pathname));
    };`,
  );
  await writeFile(
    path.join(dist, 'ssr', 'index.js'),
    'export const rendered = (pathname) => "<p>" + pathname + "</p>";',
  );
  // vercel pull が書いたもの。出力を書き直しても残す
  await mkdir(output, { recursive: true });
  await writeFile(path.join(root, '.vercel', 'project.json'), '{}');
  await writeFile(path.join(output, 'from-an-earlier-build.txt'), 'stale');

  await writeVercelOutput(root, {
    client: path.join(dist, 'client'),
    rsc: path.join(dist, 'rsc'),
    ssr: path.join(dist, 'ssr'),
  });
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('writeVercelOutput', () => {
  it('sends every request that names no file to the handler, and marks only a hashed file that answered immutable', async () => {
    expect(await read('config.json')).toStrictEqual({
      version: 3,
      routes: [
        { handle: 'filesystem' },
        { src: '^/.*$', dest: '/handler' },
        { handle: 'hit' },
        {
          src: '^/assets/',
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
          continue: true,
        },
      ],
    });
  });

  it('ships the client build as static files, without the copies compressed for serve', async () => {
    expect(await filesUnder('static')).toStrictEqual([
      'archive.tar.gz',
      path.join('assets', 'app-abc123.js'),
    ]);
  });

  it('declares the handler a streaming Node.js function', async () => {
    expect(await read('functions/handler.func/.vc-config.json')).toStrictEqual({
      runtime: 'nodejs24.x',
      handler: 'index.mjs',
      launcherType: 'Nodejs',
      shouldAddHelpers: false,
      supportsResponseStreaming: true,
    });
  });

  it('hands Vercel the handler as fetch, able to reach the ssr build beside it', async () => {
    const entry = path.join(output, 'functions', 'handler.func', 'index.mjs');
    const { default: fn } = (await import(pathToFileURL(entry).href)) as Entry;
    const response = await fn.fetch(
      new Request('https://example.test/products/1'),
    );
    expect(await response.text()).toBe('<p>/products/1</p>');
  });

  it('starts from an empty output, leaving what vercel pull wrote beside it', async () => {
    expect(await readdir(output)).not.toContain('from-an-earlier-build.txt');
    expect(
      await readFile(path.join(root, '.vercel', 'project.json'), 'utf8'),
    ).toBe('{}');
  });
});
