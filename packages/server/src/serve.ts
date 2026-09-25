import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import type {
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeaders,
  ServerResponse,
} from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';
import { pathToFileURL } from 'node:url';

import { withoutBase } from '@k8ordo/router';
import fresh from 'fresh';
import { contentType } from 'mime-types';
import parseRange from 'range-parser';

import {
  ENCODINGS,
  isCompressible,
  negotiateEncoding,
  streamingCompressor,
  SUFFIX,
} from './encoding';
import type { Encoding } from './encoding';
import { safeJoin } from './static-file';

export type ServeOptions = {
  /** Build output directory, the one holding `rsc/` and `client/`. */
  readonly dist?: string;
  /** `0` asks the system for a free port; `port` on the handle says which. */
  readonly port?: number;
  readonly host?: string;
};

/** What `serve` hands back: where it listens, and how to stop it. */
export type Server = {
  readonly port: number;
  readonly url: string;
  readonly close: () => Promise<void>;
};

type Handler = (request: Request) => Promise<Response>;

/** What `dist/rsc/index.js` exports: the handler, and the base it was built for. */
type Entry = { readonly default: Handler; readonly base: string };

/**
 * Vite writes the hash of the contents into the name of everything under
 * `assets/`, so those files can never change under a URL — anything else
 * might, and says so. The pathname is the one below the base, where the
 * client build's own layout starts.
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

const isFile = async (candidate: string): Promise<boolean> => {
  try {
    return (await stat(candidate)).isFile();
  } catch {
    return false;
  }
};

const fileFor = async (
  root: string,
  pathname: string,
): Promise<string | null> => {
  const resolved = safeJoin(root, pathname);
  if (resolved === null) return null;
  return (await isFile(resolved)) ? resolved : null;
};

/** The copies the build compressed ahead of time, by coding. */
const variantsOf = async (
  file: string,
): Promise<ReadonlyMap<Encoding, string>> => {
  const variants = new Map<Encoding, string>();
  await Promise.all(
    ENCODINGS.map(async (encoding) => {
      const variant = `${file}${SUFFIX[encoding]}`;
      if (await isFile(variant)) variants.set(encoding, variant);
    }),
  );
  return variants;
};

const digest = async (file: string): Promise<string> => {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) {
    hash.update(chunk as Buffer);
  }
  return hash.digest('base64url');
};

type ByteRange = { readonly start: number; readonly end: number };

/**
 * The part of a file a GET asked for: the whole, one byte range, or a range
 * that starts past the end. Only the single range a media element asks for
 * is honoured — several at once would be a `multipart/byteranges` body that
 * no browser requests — and a `Range` that cannot be read, or an `If-Range`
 * naming another version of the file, gets the whole of it, as HTTP says.
 */
const rangeOf = (
  headers: IncomingHttpHeaders,
  size: number,
  etag: string,
): ByteRange | 'whole' | 'unsatisfiable' => {
  const { range, 'if-range': ifRange } = headers;
  if (range === undefined) return 'whole';
  if (ifRange !== undefined && ifRange !== etag) return 'whole';
  const ranges = parseRange(size, range, { combine: true });
  if (ranges === -1) return 'unsatisfiable';
  if (ranges === -2 || ranges.type !== 'bytes' || ranges.length !== 1) {
    return 'whole';
  }
  return ranges[0] ?? 'whole';
};

/**
 * The handler's answer, written out — compressed on the way when its type is
 * worth it and nothing has encoded it yet.
 */
const sendAnswer = async (
  incoming: IncomingMessage,
  response: ServerResponse,
  result: Response,
): Promise<void> => {
  // getSetCookie は同名ヘッダを潰さない唯一の読み方。Object.fromEntries
  // だと Set-Cookie が最後の 1 つに畳まれる。
  const headers: OutgoingHttpHeaders = {};
  for (const [name, value] of result.headers.entries()) {
    if (name === 'set-cookie') continue;
    headers[name] = value;
  }
  const cookies = result.headers.getSetCookie();
  if (cookies.length > 0) headers['set-cookie'] = cookies;

  const type = result.headers.get('content-type');
  const compressible =
    type !== null &&
    isCompressible(type) &&
    !result.headers.has('content-encoding') &&
    !/\bno-transform\b/iu.test(result.headers.get('cache-control') ?? '');
  const encoding = compressible
    ? negotiateEncoding(incoming.headers['accept-encoding'], ENCODINGS)
    : null;
  if (compressible) {
    const vary = result.headers.get('vary');
    headers['vary'] =
      vary === null ? 'Accept-Encoding' : `${vary}, Accept-Encoding`;
  }
  if (encoding !== null) {
    headers['content-encoding'] = encoding;
    delete headers['content-length'];
  }
  response.writeHead(result.status, headers);
  if (result.body === null) {
    response.end();
    return;
  }
  // lib.dom と node:stream/web の ReadableStream は同じものの別宣言
  const body = Readable.fromWeb(result.body as unknown as NodeReadableStream);
  // 静的ファイルと同じ理由。送信開始後の失敗は writeHead を打ち直せない
  await (
    encoding === null
      ? pipeline(body, response)
      : pipeline(body, streamingCompressor(encoding), response)
  ).catch(() => undefined);
};

/**
 * Serves a built application: the client build's files as they are, and
 * everything else through the RSC handler.
 */
export const serve = async (options: ServeOptions = {}): Promise<Server> => {
  const dist = path.resolve(process.cwd(), options.dist ?? 'dist');
  const clientDir = path.join(dist, 'client');
  const entry = pathToFileURL(path.join(dist, 'rsc', 'index.js')).href;
  const { default: handler, base } = (await import(entry)) as Entry;

  // ETag は更新時刻ではなく中身から作る。別々にビルドしたサーバーどうしでも、
  // 何も変えなかったデプロイの前後でも同じ値になり、再検証が 304 で終わる。
  // 中身を読むのは 1 ファイル 1 回。大きさか時刻が変わったら読み直して、
  // そのファイルの記録を置き換える
  const etags = new Map<
    string,
    {
      readonly size: number;
      readonly mtimeMs: number;
      readonly etag: Promise<string>;
    }
  >();
  const etagOf = (
    file: string,
    { size, mtimeMs }: { size: number; mtimeMs: number },
  ): Promise<string> => {
    const known = etags.get(file);
    if (known?.size === size && known.mtimeMs === mtimeMs) return known.etag;
    const etag = digest(file).then((hash) => `"${hash}"`);
    etags.set(file, { size, mtimeMs, etag });
    return etag;
  };

  const sendFile = async (
    incoming: IncomingMessage,
    response: ServerResponse,
    file: string,
    pathname: string,
  ): Promise<void> => {
    const variants = await variantsOf(file);
    const encoding = negotiateEncoding(incoming.headers['accept-encoding'], [
      ...variants.keys(),
    ]);
    const sent =
      (encoding === null ? undefined : variants.get(encoding)) ?? file;
    const stats = await stat(sent);
    const { size } = stats;
    const etag = await etagOf(sent, stats);
    // 304 にも、200 なら付けたキャッシュのヘッダーを付ける。キャッシュは
    // 304 を受けて持っているコピーのヘッダーをこれで更新する
    const cache: OutgoingHttpHeaders = {
      'cache-control': cacheFor(pathname),
      etag,
      ...(variants.size > 0 ? { vary: 'Accept-Encoding' } : {}),
    };
    if (fresh(incoming.headers, { etag })) {
      response.writeHead(304, cache);
      response.end();
      return;
    }
    const type = contentType(path.extname(file));
    const headers: OutgoingHttpHeaders = {
      ...cache,
      'content-type': type === false ? 'application/octet-stream' : type,
      'accept-ranges': 'bytes',
      ...(encoding === null ? {} : { 'content-encoding': encoding }),
    };
    // Range を定義しているのは GET だけ。HEAD には全体の長さを答える
    const range =
      incoming.method === 'GET'
        ? rangeOf(incoming.headers, size, etag)
        : 'whole';
    if (range === 'unsatisfiable') {
      response.writeHead(416, {
        ...headers,
        'content-range': `bytes */${String(size)}`,
      });
      response.end();
      return;
    }
    const { start, end } =
      range === 'whole' ? { start: 0, end: size - 1 } : range;
    response.writeHead(range === 'whole' ? 200 : 206, {
      ...headers,
      'content-length': end - start + 1,
      ...(range === 'whole'
        ? {}
        : {
            'content-range': `bytes ${String(start)}-${String(end)}/${String(size)}`,
          }),
    });
    if (incoming.method === 'HEAD' || size === 0) {
      response.end();
      return;
    }
    // 送信開始後に読み取りが失敗しても writeHead は打ち直せない。
    // 中途半端な本文で繋いだままにするより、接続を切って知らせる
    // （pipeline は失敗した側から全部を destroy する）
    await pipeline(createReadStream(sent, { start, end }), response).catch(
      () => undefined,
    );
  };

  const server = createServer(
    (incoming: IncomingMessage, response: ServerResponse) => {
      void (async () => {
        const url = new URL(
          incoming.url ?? '/',
          `http://${incoming.headers.host ?? 'localhost'}`,
        );
        // ファイルで答えるのは読み取りだけ。ほかのメソッドは handler が答える
        // （POST は action、残りは 405）。先にファイルが答えると、そのパスで
        // だけ 405 が 200 に化ける。client/ はビルドの base に置かれる
        const own = withoutBase(url.pathname, base);
        const file =
          own !== null &&
          (incoming.method === 'GET' || incoming.method === 'HEAD')
            ? await fileFor(clientDir, own)
            : null;
        if (own !== null && file !== null) {
          await sendFile(incoming, response, file, own);
          return;
        }
        await sendAnswer(
          incoming,
          response,
          await handler(asRequest(incoming, url)),
        );
      })().catch((error: unknown) => {
        // 例外の中身は運用者のもので、訪問者のものではない。パスやスタックが
        // そのまま本文に出ると、答えられなかった理由まで外に漏れる。
        // メソッドと URL は引数として渡す。第 1 引数はフォーマット文字列
        // なので、`%s` を含む URL を投げられると後ろの引数が食われる
        console.error(
          'k8ordo: %s %s failed',
          incoming.method ?? 'GET',
          incoming.url ?? '/',
          error,
        );
        response.writeHead(500, { 'content-type': 'text/plain;charset=utf-8' });
        response.end('internal error');
      });
    },
  );

  const host = options.host ?? 'localhost';
  await new Promise<void>((resolve) => {
    server.listen(options.port ?? 3000, host, resolve);
  });
  const { port } = server.address() as AddressInfo;
  const url = `http://${host}:${String(port)}`;
  console.warn(`k8ordo: serving ${dist} on ${url}`);
  return {
    port,
    url,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error === undefined) resolve();
          else reject(error);
        });
      }),
  };
};
