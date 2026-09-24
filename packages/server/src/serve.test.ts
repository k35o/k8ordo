import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
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
});
