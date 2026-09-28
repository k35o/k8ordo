import { mkdtemp, mkdir, rm, utimes, writeFile } from 'node:fs/promises';
import { connect } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

import { serve } from './serve';
import type { Server } from './serve';

// 本物のビルドは要らない: serve が読むのは client/ のファイルと rsc/index.js の
// default export だけなので、その 2 つを演じる dist を一時ディレクトリに置く
let dist: string;
let server: Server;

const SCRIPT = 'export {};';

// ストリームの途中で止まっている handler を、テストが先へ進める合図
type Gate = { k8ordoRelease?: Promise<undefined> };

/** 本文を、届いた塊ごとの文字列として読むストリーム */
const textOf = (response: Response): ReadableStream<string> => {
  if (response.body === null) throw new Error('the answer has no body');
  return response.body.pipeThrough(new TextDecoderStream());
};

beforeAll(async () => {
  dist = await mkdtemp(path.join(tmpdir(), 'k8ordo-serve-'));
  await mkdir(path.join(dist, 'client', 'assets'), { recursive: true });
  await mkdir(path.join(dist, 'rsc'), { recursive: true });
  await writeFile(path.join(dist, 'client', 'index.html'), '<p>static</p>');
  const script = path.join(dist, 'client', 'assets', 'app-abc123.js');
  await writeFile(script, SCRIPT);
  await writeFile(`${script}.br`, brotliCompressSync(SCRIPT));
  await writeFile(`${script}.gz`, gzipSync(SCRIPT));
  await writeFile(path.join(dist, 'client', 'site.webmanifest'), '{}');
  await writeFile(path.join(dist, 'client', 'notes.k8ordo'), 'k8ordo');
  await writeFile(path.join(dist, 'client', 'clip.mp4'), '0123456789');
  await writeFile(path.join(dist, 'client', 'stable.txt'), 'stable');
  await writeFile(path.join(dist, 'client', 'edited.txt'), 'first');
  await writeFile(
    path.join(dist, 'rsc', 'index.js'),
    `export const base = '/';
    export default async (request) => {
      const url = new URL(request.url);
      if (url.pathname === '/throws') {
        throw new Error('postgres://admin:hunter2@db refused the connection');
      }
      if (url.pathname === '/streams') {
        const encoder = new TextEncoder();
        return new Response(new ReadableStream({
          async start(controller) {
            controller.enqueue(encoder.encode('<p>shell</p>'));
            await globalThis.k8ordoRelease;
            controller.enqueue(encoder.encode('<p>rest</p>'));
            controller.close();
          },
        }), { headers: { 'content-type': 'text/html;charset=utf-8' } });
      }
      if (url.pathname === '/image') {
        return new Response(new Uint8Array([137, 80, 78, 71]), {
          headers: { 'content-type': 'image/png' },
        });
      }
      if (url.pathname === '/breaks-midway') {
        let sent = false;
        return new Response(new ReadableStream({
          pull(controller) {
            if (sent) {
              controller.error(new Error('the render died'));
              return;
            }
            sent = true;
            controller.enqueue(new TextEncoder().encode('<p>half a page'));
          },
        }));
      }
      const body = request.method === 'POST' ? await request.text() : '';
      const headers = new Headers({ 'content-type': 'application/json', vary: 'cookie' });
      headers.append('set-cookie', 'a=1');
      headers.append('set-cookie', 'b=2');
      return new Response(
        JSON.stringify({ method: request.method, pathname: url.pathname, body, host: url.host }),
        { status: url.pathname === '/missing' ? 404 : 200, headers },
      );
    };`,
  );
  server = await serve({ dist, port: 0 });
});

afterAll(async () => {
  await server.close();
  await rm(dist, { recursive: true, force: true });
});

// fetch は HEAD の答えに本文が付いていても読まずに捨てるので、本文が
// 送られていないことは線上のバイトでしか確かめられない。条件付きの GET に
// Cache-Control: no-cache を足して 304 を封じるのも fetch なので、それもここで送る
const exchange = (
  method: string,
  pathname: string,
  headers: Readonly<Record<string, string>> = {},
): Promise<string> =>
  new Promise((resolve, reject) => {
    const socket = connect(server.port, 'localhost');
    let received = '';
    socket.setEncoding('utf8');
    socket.on('data', (chunk: string) => {
      received += chunk;
    });
    socket.on('end', () => {
      resolve(received);
    });
    socket.on('error', reject);
    const lines = Object.entries(headers).map(
      ([name, value]) => `${name}: ${value}\r\n`,
    );
    socket.write(
      `${method} ${pathname} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n${lines.join('')}\r\n`,
    );
  });

describe('serve', () => {
  it('listens on the port the system gave it and says so', () => {
    expect(server.port).toBeGreaterThan(0);
    expect(server.url).toBe(`http://localhost:${String(server.port)}`);
  });

  it('answers a file from the client build as it is, with its type', async () => {
    const response = await fetch(`${server.url}/index.html`);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/html; charset=utf-8',
    );
    expect(response.headers.get('cache-control')).toBe('no-cache');
    expect(await response.text()).toBe('<p>static</p>');
  });

  it('marks a hashed asset immutable', async () => {
    const response = await fetch(`${server.url}/assets/app-abc123.js`);
    expect(response.headers.get('cache-control')).toContain('immutable');
    expect(response.headers.get('content-type')).toContain('javascript');
  });

  it('types a file by the registered type of its extension', async () => {
    const response = await fetch(`${server.url}/site.webmanifest`);
    expect(response.headers.get('content-type')).toBe(
      'application/manifest+json; charset=utf-8',
    );
  });

  it('sends a file whose extension has no registered type as bytes', async () => {
    const response = await fetch(`${server.url}/notes.k8ordo`);
    expect(response.headers.get('content-type')).toBe(
      'application/octet-stream',
    );
  });

  it.each([
    ['a file', '/index.html', 'text/html; charset=utf-8'],
    // この handler は HEAD にも本文を返す。それでも線には載らない
    ['the handler', '/products/1', 'application/json'],
  ])(
    'answers HEAD for %s with the headers alone',
    async (_answerer, pathname, type) => {
      const received = await exchange('HEAD', pathname);
      const [head = '', ...rest] = received.split('\r\n\r\n');
      expect(head).toMatch(/^HTTP\/1\.1 200 OK\r\n/u);
      expect(head).toContain(`content-type: ${type}\r\n`);
      expect(rest.join('\r\n\r\n')).toBe('');
    },
  );

  it('hands everything else to the handler, with the request intact', async () => {
    const response = await fetch(`${server.url}/products/1`, {
      method: 'POST',
      body: 'hello',
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({
      method: 'POST',
      pathname: '/products/1',
      body: 'hello',
      host: `localhost:${String(server.port)}`,
    });
  });

  it("passes the handler's status and every Set-Cookie through", async () => {
    const response = await fetch(`${server.url}/missing`, {
      redirect: 'manual',
    });
    expect(response.status).toBe(404);
    expect(response.headers.getSetCookie()).toStrictEqual(['a=1', 'b=2']);
  });

  it('never serves a file outside the client build, however the path is spelled', async () => {
    // rsc/index.js は client/ の外にある。読めたら secret が漏れる
    const response = await fetch(`${server.url}/..%2Frsc%2Findex.js`);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it.each(['POST', 'PUT', 'DELETE'])(
    'answers a %s from the handler, never from a file',
    async (method) => {
      const response = await fetch(`${server.url}/index.html`, { method });
      expect(await response.json()).toMatchObject({ method });
    },
  );

  it('sends the precompressed copy the client accepts best', async () => {
    const both = await fetch(`${server.url}/assets/app-abc123.js`, {
      headers: { 'accept-encoding': 'gzip, br' },
    });
    expect(both.headers.get('content-encoding')).toBe('br');
    expect(both.headers.get('vary')).toBe('Accept-Encoding');
    expect(await both.text()).toBe(SCRIPT);

    const gzipOnly = await fetch(`${server.url}/assets/app-abc123.js`, {
      headers: { 'accept-encoding': 'gzip' },
    });
    expect(gzipOnly.headers.get('content-encoding')).toBe('gzip');
    expect(await gzipOnly.text()).toBe(SCRIPT);
  });

  it('sends the file itself to a client that accepts no coding, saying it could have', async () => {
    const response = await fetch(`${server.url}/assets/app-abc123.js`, {
      headers: { 'accept-encoding': 'identity' },
    });
    expect(response.headers.get('content-encoding')).toBeNull();
    expect(response.headers.get('vary')).toBe('Accept-Encoding');
    expect(await response.text()).toBe(SCRIPT);
  });

  it('answers a request for the copy the client already holds with 304 and no body', async () => {
    const first = await fetch(`${server.url}/index.html`);
    const etag = String(first.headers.get('etag'));
    expect(etag).toMatch(/^"[\w-]+"$/u);

    const received = await exchange('GET', '/index.html', {
      'if-none-match': etag,
    });
    const [head = '', ...body] = received.split('\r\n\r\n');
    expect(head).toMatch(/^HTTP\/1\.1 304 Not Modified\r\n/u);
    expect(head).toContain(`etag: ${etag}\r\n`);
    expect(head).toContain('cache-control: no-cache\r\n');
    expect(body.join('\r\n\r\n')).toBe('');
  });

  it('tags each coding of a file apart, since they are different bytes', async () => {
    const tagOf = async (encoding: string): Promise<string | null> =>
      (
        await fetch(`${server.url}/assets/app-abc123.js`, {
          headers: { 'accept-encoding': encoding },
        })
      ).headers.get('etag');
    const tags = new Set([
      await tagOf('br'),
      await tagOf('gzip'),
      await tagOf('identity'),
    ]);
    expect(tags.size).toBe(3);
  });

  it('tags a file by what it holds, not by when it was written', async () => {
    const tagOf = async (): Promise<string | null> =>
      (await fetch(`${server.url}/stable.txt`)).headers.get('etag');
    const before = await tagOf();
    // 別のマシンでビルドし直したのと同じ状況: 中身は同じで、時刻だけが違う
    await utimes(path.join(dist, 'client', 'stable.txt'), 0, 0);
    expect(await tagOf()).toBe(before);
  });

  it('tags a file anew once what it holds changes', async () => {
    const tagOf = async (): Promise<string | null> =>
      (await fetch(`${server.url}/edited.txt`)).headers.get('etag');
    const before = await tagOf();
    await writeFile(path.join(dist, 'client', 'edited.txt'), 'second, longer');
    expect(await tagOf()).not.toBe(before);
  });

  it('answers the byte range a video player asks for', async () => {
    const whole = await fetch(`${server.url}/clip.mp4`);
    expect(whole.headers.get('accept-ranges')).toBe('bytes');
    await whole.arrayBuffer();

    const part = await fetch(`${server.url}/clip.mp4`, {
      headers: { range: 'bytes=2-5' },
    });
    expect(part.status).toBe(206);
    expect(part.headers.get('content-range')).toBe('bytes 2-5/10');
    expect(part.headers.get('content-length')).toBe('4');
    expect(await part.text()).toBe('2345');
  });

  it('answers a range that starts past the end with 416 and the length', async () => {
    const response = await fetch(`${server.url}/clip.mp4`, {
      headers: { range: 'bytes=10-' },
    });
    expect(response.status).toBe(416);
    expect(response.headers.get('content-range')).toBe('bytes */10');
  });

  it.each([
    [
      'names another version of the file',
      { range: 'bytes=2-5', 'if-range': '"stale"' },
    ],
    ['asks for several ranges at once', { range: 'bytes=0-1,5-6' }],
    ['cannot be read', { range: 'bytes=five-' }],
  ])('sends the whole file when the range %s', async (_case, headers) => {
    const response = await fetch(`${server.url}/clip.mp4`, { headers });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('0123456789');
  });

  it("compresses the handler's answer as the client accepts, keeping its own Vary", async () => {
    const response = await fetch(`${server.url}/products/1`, {
      headers: { 'accept-encoding': 'gzip' },
    });
    expect(response.headers.get('content-encoding')).toBe('gzip');
    expect(response.headers.get('vary')).toBe('cookie, Accept-Encoding');
    expect(await response.json()).toMatchObject({ pathname: '/products/1' });
  });

  it("leaves the handler's answer as it is for a client that accepts no coding", async () => {
    const response = await fetch(`${server.url}/products/1`, {
      headers: { 'accept-encoding': 'identity' },
    });
    expect(response.headers.get('content-encoding')).toBeNull();
    expect(response.headers.get('vary')).toBe('cookie, Accept-Encoding');
  });

  it('never compresses an answer in a format that is compressed already', async () => {
    const response = await fetch(`${server.url}/image`, {
      headers: { 'accept-encoding': 'br' },
    });
    expect(response.headers.get('content-encoding')).toBeNull();
    expect(response.headers.get('vary')).toBeNull();
    expect(new Uint8Array(await response.arrayBuffer())).toStrictEqual(
      new Uint8Array([137, 80, 78, 71]),
    );
  });

  it.each(['br', 'gzip'])(
    'sends each part of a streamed page as soon as it is rendered, compressed with %s',
    async (encoding) => {
      const gate = Promise.withResolvers<undefined>();
      (globalThis as Gate).k8ordoRelease = gate.promise;
      const response = await fetch(`${server.url}/streams`, {
        headers: { 'accept-encoding': encoding },
      });
      expect(response.headers.get('content-encoding')).toBe(encoding);
      const text = textOf(response);
      const reader = text.getReader();
      // 残りはまだ描かれていない。先頭がここで届かなければ、圧縮が溜め込んでいる
      expect((await reader.read()).value).toBe('<p>shell</p>');
      gate.resolve(undefined);
      reader.releaseLock();
      const rest = (await Array.fromAsync(text)).join('');
      expect(rest).toBe('<p>rest</p>');
    },
  );

  it('cuts the connection when the body fails partway, rather than leaving it open', async () => {
    // 繋いだままなら読み取りは終わらずテストが時間切れになる。切れたときは
    // fetch の仕様どおりネットワークエラー（TypeError）で落ちる
    const body = fetch(`${server.url}/breaks-midway`).then((response) =>
      response.text(),
    );
    await expect(body).rejects.toThrow(TypeError);
  });

  it('answers a handler that threw with a bare 500, keeping the error from the visitor', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const response = await fetch(`${server.url}/throws`);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe('internal error');
    } finally {
      log.mockRestore();
    }
  });

  it('logs what the handler threw, for the operator', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      await (await fetch(`${server.url}/throws`)).text();
      expect(log).toHaveBeenCalledWith(
        'k8ordo: %s %s failed',
        'GET',
        '/throws',
        new Error('postgres://admin:hunter2@db refused the connection'),
      );
    } finally {
      log.mockRestore();
    }
  });
});

describe('serve under a base', () => {
  let under: string;
  let served: Server;

  // base を '/site/' にしたビルド。client/ の中身はその下で配られる
  beforeAll(async () => {
    under = await mkdtemp(path.join(tmpdir(), 'k8ordo-serve-base-'));
    await mkdir(path.join(under, 'client', 'assets'), { recursive: true });
    await mkdir(path.join(under, 'rsc'), { recursive: true });
    await writeFile(path.join(under, 'client', 'index.html'), '<p>static</p>');
    await writeFile(
      path.join(under, 'client', 'assets', 'app-abc123.js'),
      'export {};',
    );
    await writeFile(
      path.join(under, 'rsc', 'index.js'),
      `export const base = '/site/';
      export default async (request) =>
        new Response(new URL(request.url).pathname, {
          headers: { 'content-type': 'text/plain' },
        });`,
    );
    served = await serve({ dist: under, port: 0 });
  });

  afterAll(async () => {
    await served.close();
    await rm(under, { recursive: true, force: true });
  });

  it('answers a file of the client build at its URL under the base', async () => {
    const response = await fetch(`${served.url}/site/index.html`);
    expect(await response.text()).toBe('<p>static</p>');
  });

  it('marks a hashed asset under the base immutable', async () => {
    const response = await fetch(`${served.url}/site/assets/app-abc123.js`);
    expect(response.headers.get('cache-control')).toContain('immutable');
  });

  it('answers no file outside the base, leaving the URL to the handler', async () => {
    const response = await fetch(`${served.url}/index.html`);
    expect(await response.text()).toBe('/index.html');
  });

  it('hands a page under the base to the handler with the URL as asked', async () => {
    const response = await fetch(`${served.url}/site/products/1`);
    expect(await response.text()).toBe('/site/products/1');
  });
});
