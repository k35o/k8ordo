import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';
import { pathToFileURL } from 'node:url';

import { safeJoin } from './static-file';

export type ServeOptions = {
  /** Build output directory, the one holding `rsc/` and `client/`. */
  readonly dist?: string;
  readonly port?: number;
  readonly host?: string;
};

type Handler = (request: Request) => Promise<Response>;

const TYPES: Readonly<Record<string, string>> = {
  '.css': 'text/css;charset=utf-8',
  '.html': 'text/html;charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript;charset=utf-8',
  '.json': 'application/json;charset=utf-8',
  '.map': 'application/json;charset=utf-8',
  '.png': 'image/png',
  '.rsc': 'text/x-component;charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain;charset=utf-8',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

/**
 * Vite writes the hash of the contents into the name of everything under
 * `assets/`, so those files can never change under a URL — anything else
 * might, and says so.
 */
const cacheFor = (pathname: string): string =>
  pathname.startsWith('/assets/')
    ? 'public, max-age=31536000, immutable'
    : 'no-cache';

/**
 * The incoming message as the request the handler expects. A Server Action is
 * a POST with a body and a header naming it, so dropping any of the three
 * would quietly turn every action into a page load.
 */
const asRequest = (incoming: IncomingMessage, url: URL): Request => {
  const headers = new Headers();
  for (const [name, value] of Object.entries(incoming.headers)) {
    if (value === undefined) continue;
    for (const one of Array.isArray(value) ? value : [value]) {
      headers.append(name, one);
    }
  }
  const method = incoming.method ?? 'GET';
  const hasBody = method !== 'GET' && method !== 'HEAD';
  return new Request(url.href, {
    method,
    headers,
    body: hasBody
      ? (Readable.toWeb(incoming) as unknown as ReadableStream<Uint8Array>)
      : undefined,
    // Node requires this to send a request body as a stream.
    duplex: 'half',
  } as RequestInit);
};

const fileFor = async (
  root: string,
  pathname: string,
): Promise<string | null> => {
  const resolved = safeJoin(root, pathname);
  if (resolved === null) return null;
  try {
    return (await stat(resolved)).isFile() ? resolved : null;
  } catch {
    return null;
  }
};

/**
 * Serves a built application: the client build's files as they are, and
 * everything else through the RSC handler.
 */
export const serve = async (options: ServeOptions = {}): Promise<void> => {
  const dist = path.resolve(process.cwd(), options.dist ?? 'dist');
  const clientDir = path.join(dist, 'client');
  const entry = pathToFileURL(path.join(dist, 'rsc', 'index.js')).href;
  const { default: handler } = (await import(entry)) as { default: Handler };

  const server = createServer(
    (incoming: IncomingMessage, response: ServerResponse) => {
      void (async () => {
        const url = new URL(
          incoming.url ?? '/',
          `http://${incoming.headers.host ?? 'localhost'}`,
        );
        // Only a read can be answered from a file; a POST is always the
        // application's to handle.
        const file =
          incoming.method === 'GET' || incoming.method === 'HEAD'
            ? await fileFor(clientDir, url.pathname)
            : null;
        if (file !== null) {
          response.writeHead(200, {
            'content-type':
              TYPES[path.extname(file)] ?? 'application/octet-stream',
            'cache-control': cacheFor(url.pathname),
          });
          const stream = createReadStream(file);
          // 送信開始後に読み取りが失敗しても writeHead は打ち直せない。
          // 中途半端な本文で繋いだままにするより、接続を切って知らせる。
          stream.on('error', () => {
            response.destroy();
          });
          stream.pipe(response);
          return;
        }
        const result = await handler(asRequest(incoming, url));
        // getSetCookie は同名ヘッダを潰さない唯一の読み方。Object.fromEntries
        // だと Set-Cookie が最後の 1 つに畳まれる。
        const headers: Array<[string, string | string[]]> = [];
        for (const [name, value] of result.headers.entries()) {
          if (name === 'set-cookie') continue;
          headers.push([name, value]);
        }
        const cookies = result.headers.getSetCookie();
        if (cookies.length > 0) headers.push(['set-cookie', cookies]);
        response.writeHead(result.status, Object.fromEntries(headers));
        if (result.body === null) {
          response.end();
          return;
        }
        // lib.dom と node:stream/web の ReadableStream は同じものの別宣言
        Readable.fromWeb(result.body as unknown as NodeReadableStream).pipe(
          response,
        );
      })().catch((error: unknown) => {
        response.writeHead(500, { 'content-type': 'text/plain' });
        response.end(String(error));
      });
    },
  );

  await new Promise<void>((resolve) => {
    server.listen(options.port ?? 3000, options.host ?? 'localhost', resolve);
  });
  console.warn(
    `k8ordo: serving ${dist} on http://${options.host ?? 'localhost'}:${String(options.port ?? 3000)}`,
  );
};
