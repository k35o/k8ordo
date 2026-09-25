import type { output } from 'zod/v4/core';

import { createStoredCodec } from './entry/codec';
import type { StoredCodec } from './entry/codec';
import type { StateSchema, StateValues } from './schema/object';

/**
 * App-scope state that lives in a cookie: device-persistent and shared across
 * tabs like local state, and — unlike it — sent with every request, so a
 * server that reads the request's cookies renders the real values instead of
 * the defaults. The browser writes it, so it can never be `HttpOnly`: a
 * preference, never a secret.
 */
export type CookieState<Schema extends StateSchema = StateSchema> = {
  kind: 'cookie';
  /** Identity of this state: the cookie name and the store registry slot. */
  key: string;
  /** The schema as passed. */
  schema: Schema;
  /** The cookie the values are written under: `k8ordo-state.<key>`. */
  cookieName: string;
  /**
   * Reads the values out of a request's cookies on the server —
   * `request.cookies` under `@k8ordo/server`, whose values arrive
   * percent-decoded. Absent, corrupt, or rejected fields get their defaults.
   */
  parseCookies: (cookies: ReadonlyMap<string, string>) => output<Schema>;
  /**
   * The cookie value the browser store would write for these values, for a
   * server that writes the same cookie. Unspecified fields mean their default,
   * and the values pass the schema first, as `update()` does.
   */
  cookieValue: (values?: Readonly<Partial<output<Schema>>>) => string;
};

// localStorage の行と同じ名前空間だが、区切りは `.`。Cookie の名前は HTTP の
// token で、`:` は token に入らない
const COOKIE_NAME_PREFIX = 'k8ordo-state.';

const TOKEN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/u;

// JSON は Cookie の値に書けない `"` や `,` だらけなので、encodeURIComponent に
// 通して書ける文字だけにする。サーバーの Cookie パーサーが戻すのもこの符号化
export const encodeCookie = (values: Readonly<StateValues>): string =>
  encodeURIComponent(JSON.stringify(values));

export const parseCookieText = (text: string | undefined): unknown => {
  if (text === undefined) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    // 壊れた JSON もほかの古いデータと同じく、既定値から始める
    return undefined;
  }
};

const codecs = new WeakMap<CookieState, StoredCodec>();

export const cookieCodecOf = (def: CookieState): StoredCodec => {
  const codec = codecs.get(def);
  if (codec === undefined) {
    throw new TypeError(
      `"${def.key}" was not created by defineCookieState of this module instance`,
    );
  }
  return codec;
};

export const defineCookieState = <Schema extends StateSchema>(
  key: string,
  schema: Schema,
): CookieState<Schema> => {
  const cookieName = `${COOKIE_NAME_PREFIX}${key}`;
  if (!TOKEN.test(cookieName)) {
    throw new TypeError(
      `"${key}" cannot name a cookie — use letters, digits and !#$%&'*+-.^_\`|~`,
    );
  }
  const codec = createStoredCodec(schema, 'cookie');
  const def: CookieState<Schema> = {
    kind: 'cookie',
    key,
    schema,
    cookieName,
    parseCookies: (cookies) =>
      codec.parse(parseCookieText(cookies.get(cookieName))) as output<Schema>,
    cookieValue: (values) => encodeCookie(codec.salvage(values ?? {})),
  };
  codecs.set(def, codec);
  return def;
};
