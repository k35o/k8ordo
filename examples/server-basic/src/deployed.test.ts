import { execFileSync, spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import {
  cp,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { framework } from '@k8ordo/framework/vite';
import { createBuilder } from 'vite';

import { formDataOf } from './form-data';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');

// dist/base と dist/vercel は別のテストが同じ dist の下に組んだビルド。
// vercel.test.ts はこのテストと並んで dist/vercel を書いている
const OTHER_BUILDS = new Set(
  ['base', 'vercel'].map((name) => path.join(dist, name)),
);

/** 起動したサーバーが標準エラーに書く、待ち受けている URL */
const listeningOn = (child: ChildProcess): Promise<string> =>
  new Promise((resolve, reject) => {
    let said = '';
    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk: string) => {
      said += chunk;
      const url = / on (http:\/\/\S+)/u.exec(said)?.[1];
      if (url !== undefined) resolve(url);
    });
    child.once('exit', (code) => {
      reject(new Error(`node server.js exited with ${String(code)}:\n${said}`));
    });
  });

// dist だけを、アプリの package.json も node_modules も無い場所に写す。
// 束ねきれていない依存があれば、そこで解決に失敗する
const copyAlone = async (from: string): Promise<string> => {
  const to = await mkdtemp(path.join(tmpdir(), 'k8ordo-deployed-'));
  await cp(from, to, {
    recursive: true,
    filter: (source) => !OTHER_BUILDS.has(source),
  });
  return to;
};

const start = (cwd: string): ChildProcess =>
  spawn(process.execPath, ['server.js'], {
    cwd,
    env: { PORT: '0', HOST: '127.0.0.1' },
    stdio: ['ignore', 'ignore', 'pipe'],
  });

// beforeAll が起動前に落ちたときは child が無い
const stop = async (child: ChildProcess | undefined): Promise<void> => {
  if (child === undefined) return;
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill();
  await once(child, 'exit');
};

// ページの HTML が読み込むクライアントのスクリプトの URL
const scriptOf = (html: string): string =>
  /src="(\/assets\/[^"]+\.js)"/u.exec(html)?.[1] ?? '';

// 組み上がったハンドラを Deno で呼び、答えを JSON で書き出す。読むのは
// ファイルだけで、ネットワークも環境変数も許さない
const UNDER_DENO = `
const { default: handler } = await import('./rsc/index.js');
const answers = [];
for (const pathname of ['/', '/products/2', '/products/index.rsc', '/products/shoes', '/old']) {
  const response = await handler(new Request('https://example.test' + pathname));
  answers.push({
    pathname,
    status: response.status,
    type: response.headers.get('content-type'),
    location: response.headers.get('location'),
    body: await response.text(),
  });
}
console.log(JSON.stringify(answers));
`;

type Answer = {
  pathname: string;
  status: number;
  type: string | null;
  location: string | null;
  body: string;
};

describe('the build, copied alone to where nothing is installed', () => {
  let deployed: string;
  let server: ChildProcess;
  let origin: string;

  beforeAll(async () => {
    deployed = await copyAlone(dist);
    server = start(deployed);
    origin = await listeningOn(server);
  });

  afterAll(async () => {
    await stop(server);
    await rm(deployed, { recursive: true, force: true });
  });

  it('starts with node on the port and host it is given', () => {
    expect(origin).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/u);
  });

  it('answers a page rendered for the request', async () => {
    const response = await fetch(`${origin}/products/2`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('second product');
  });

  it('answers the payload a client navigation asks for', async () => {
    const response = await fetch(`${origin}/products/index.rsc`);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/x-component');
  });

  it('runs a Server Action posted without JavaScript', async () => {
    const html = await (await fetch(`${origin}/`)).text();
    const response = await fetch(`${origin}/`, {
      method: 'POST',
      headers: { origin },
      body: formDataOf(html, 'leave-form'),
      redirect: 'manual',
    });
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/products');
  });

  it('runs the guards, and answers what one ends', async () => {
    const response = await fetch(`${origin}/members`);
    expect(response.status).toBe(401);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('answers a URL it does not have with the not-found page, under a 404', async () => {
    const response = await fetch(`${origin}/nowhere`);
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('not found');
  });

  it('answers a redirect.ts with the status and location it declares', async () => {
    const response = await fetch(`${origin}/old`, { redirect: 'manual' });
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/products');
  });

  it('compresses a page as it streams', async () => {
    const response = await fetch(`${origin}/`, {
      headers: { 'accept-encoding': 'gzip' },
    });
    expect(response.headers.get('content-encoding')).toBe('gzip');
    expect(await response.text()).toContain('rendered on the server');
  });

  it('serves a script compressed at build time, revalidated by its ETag', async () => {
    const html = await (await fetch(`${origin}/`)).text();
    const script = scriptOf(html);
    const headers = { 'accept-encoding': 'br' };

    const response = await fetch(`${origin}${script}`, { headers });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-encoding')).toBe('br');
    expect(response.headers.get('cache-control')).toContain('immutable');
    const etag = String(response.headers.get('etag'));
    expect(etag).toMatch(/^"[\w-]+"$/u);

    // 条件つきの fetch は、自分で書かないと Cache-Control: no-cache を足す。
    // それは再検証でなく取り直しの指示なので、ブラウザの再検証と同じ値を書く
    const again = await fetch(`${origin}${script}`, {
      headers: {
        ...headers,
        'cache-control': 'max-age=0',
        'if-none-match': etag,
      },
    });
    expect(again.status).toBe(304);
  });

  it('hands Deno a handler that answers as it does under Node', () => {
    const answers = JSON.parse(
      execFileSync('deno', ['run', '--allow-read', '--no-lock', '-'], {
        cwd: deployed,
        encoding: 'utf8',
        input: UNDER_DENO,
        stdio: 'pipe',
      }),
    ) as Answer[];
    expect(
      answers.map(({ pathname, status, type, location }) => ({
        pathname,
        status,
        type,
        location,
      })),
    ).toStrictEqual([
      {
        pathname: '/',
        status: 200,
        type: 'text/html;charset=utf-8',
        location: null,
      },
      {
        pathname: '/products/2',
        status: 200,
        type: 'text/html;charset=utf-8',
        location: null,
      },
      {
        pathname: '/products/index.rsc',
        status: 200,
        type: 'text/x-component;charset=utf-8',
        location: null,
      },
      {
        pathname: '/products/shoes',
        status: 404,
        type: 'text/html;charset=utf-8',
        location: null,
      },
      { pathname: '/old', status: 307, type: null, location: '/products' },
    ]);
    const [home, product, payload] = answers;
    expect(home?.body).toContain('rendered on the server');
    // スキーマが AsyncLocalStorage の文脈の中で走り、id を数にしてから描いた
    expect(product?.body).toContain('number:2');
    expect(payload?.body).toContain('second product');
  });
});

describe('the started build, told to stop', () => {
  let deployed: string;
  let server: ChildProcess | undefined;

  beforeAll(async () => {
    deployed = await copyAlone(dist);
  });

  afterAll(async () => {
    await stop(server);
    await rm(deployed, { recursive: true, force: true });
  });

  // コンテナの PID 1 の Node は、ハンドラの無い SIGTERM を無視する。
  // シグナルで死ぬ（signal が SIGTERM）のでなく、自分で閉じて 0 で終わること
  it.each(['SIGTERM', 'SIGINT'] as const)(
    'closes and exits with 0 on %s, though a client keeps its connection open',
    async (signal) => {
      server = start(deployed);
      const origin = await listeningOn(server);
      // fetch は接続を keep-alive で残す。close はそれを待たずに閉じる
      expect((await fetch(`${origin}/`)).status).toBe(200);

      const exited = once(server, 'exit');
      server.kill(signal);
      expect(await exited).toStrictEqual([0, null]);
    },
  );
});

describe('an application whose package.json does not say type: module', () => {
  let deployed: string;
  let server: ChildProcess | undefined;
  let origin: string;

  // type の無い package.json を Node は CommonJS と読み、Vite は入口を
  // .mjs で書く。アプリを type だけ消した package.json ごと一時ディレクトリに
  // 写してそこで組む
  beforeAll(async () => {
    const app = await mkdtemp(path.join(tmpdir(), 'k8ordo-commonjs-'));
    const { type: _type, ...manifest } = JSON.parse(
      await readFile(path.join(root, 'package.json'), 'utf8'),
    ) as Record<string, unknown>;
    await writeFile(path.join(app, 'package.json'), JSON.stringify(manifest));
    await cp(path.join(root, 'src'), path.join(app, 'src'), {
      recursive: true,
      filter: (source) => !source.endsWith('.test.ts'),
    });
    await symlink(
      path.join(root, 'node_modules'),
      path.join(app, 'node_modules'),
    );
    try {
      const builder = await createBuilder({
        root: app,
        configFile: false,
        logLevel: 'warn',
        plugins: [framework({ mode: 'server' })],
      });
      await builder.buildApp();
      deployed = await copyAlone(path.join(app, 'dist'));
    } finally {
      await rm(app, { recursive: true, force: true });
    }
    server = start(deployed);
    origin = await listeningOn(server);
  }, 60_000);

  afterAll(async () => {
    await stop(server);
    await rm(deployed, { recursive: true, force: true });
  });

  it('builds a dist/ that starts on its own and renders a page', async () => {
    const response = await fetch(`${origin}/products/2`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('second product');
  });
});
