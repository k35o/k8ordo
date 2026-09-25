import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { connect } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { serve } from './serve';
import type { Server } from './serve';

// 本物のビルドは要らない: serve が読むのは client/ のファイルと rsc/index.js の
// default export だけなので、その 2 つを演じる dist を一時ディレクトリに置く
let dist: string;
let server: Server;

beforeAll(async () => {
  dist = await mkdtemp(path.join(tmpdir(), 'k8ordo-serve-'));
  await mkdir(path.join(dist, 'client', 'assets'), { recursive: true });
  await mkdir(path.join(dist, 'rsc'), { recursive: true });
  await writeFile(path.join(dist, 'client', 'index.html'), '<p>static</p>');
  await writeFile(
    path.join(dist, 'client', 'assets', 'app-abc123.js'),
    'export {};',
  );
  await writeFile(path.join(dist, 'client', 'site.webmanifest'), '{}');
  await writeFile(path.join(dist, 'client', 'notes.k8ordo'), 'k8ordo');
  await writeFile(
    path.join(dist, 'rsc', 'index.js'),
    `export default async (request) => {
      const url = new URL(request.url);
      if (url.pathname === '/throws') {
        throw new Error('postgres://admin:hunter2@db refused the connection');
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
      const headers = new Headers({ 'content-type': 'application/json' });
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
// 送られていないことは線上のバイトでしか確かめられない
const exchange = (method: string, pathname: string): Promise<string> =>
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
    socket.write(
      `${method} ${pathname} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`,
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
