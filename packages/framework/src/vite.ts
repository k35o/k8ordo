import { fileURLToPath } from 'node:url';

import { engine } from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { PluginOption } from 'vite';

import { headersPlugin, headersRefusal } from './headers';
import { STATIC_ONLY, TAKEN } from './options';
import { serverMode } from './server-mode';
import { staticMode } from './static';
import type { StaticOptions } from './static';

export type ServerOptions = EngineOptions & {
  /**
   * Every route rendered per request: a page may read the request, and
   * Server Actions, guards and the request API have somewhere to run.
   */
  readonly mode: 'server';
};

/**
 * `site` and `csp` describe files, so only `mode: 'static'` takes them, and
 * it needs `site`.
 */
export type FrameworkOptions = StaticOptions | ServerOptions;

export type { ContentSecurityPolicy } from './documents';
export type { StaticOptions } from './static';

// The engine is bundled into this package, and its runtime entries ship
// beside this file — `dist/runtime/` — which is where Vite is pointed.
const RUNTIME_DIR = fileURLToPath(new URL('./runtime/', import.meta.url));

const shown = (value: unknown): string =>
  typeof value === 'string' ? `'${value}'` : String(value);

const kindOf = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'an array';
  if (typeof value === 'object') return 'an object';
  return `a ${typeof value}`;
};

// 文字列として origin と比べない。https://Example.com、https://example.com:443、
// https://例え.jp は、URL が別の綴りにする origin
const notAnOrigin = (value: unknown): string | null => {
  if (value === undefined) return 'and got none';
  if (typeof value !== 'string') {
    return `and the value is not a string but ${kindOf(value)}`;
  }
  // 値をエラー文に書くほかの検査より先に、URL として読む前の綴りで調べる。
  // URL が userinfo と読まない綴り（スキームの無い user:secret@example.com、
  // 読めない URL）でも @ の前は資格情報でありうるので、値もその一部も書かない
  if (value.includes('@')) {
    return 'and the site has an @, which no origin has (a username or a password comes before one, so the value is left out)';
  }
  if (!URL.canParse(value)) return `and ${shown(value)} is not a URL`;
  const url = new URL(value);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return `and ${shown(value)} is served over ${url.protocol}, not http: or https:`;
  }
  if (url.pathname !== '/') {
    return `and ${shown(value)} has a path, ${url.pathname} — where under the origin the site sits is Vite's base`;
  }
  if (url.search !== '') {
    return `and ${shown(value)} has a query, ${url.search}`;
  }
  if (url.hash !== '') {
    return `and ${shown(value)} has a fragment, ${url.hash}`;
  }
  return null;
};

/**
 * What the type already says, said again when the config is loaded: a
 * `vite.config.js`, or a `vite.config.ts` outside the tsconfig, is never
 * type-checked, and the options the type refuses do not fail on their own —
 * a mode that is not `'static'` builds no files, a `csp` under
 * `mode: 'server'` is a policy the application believes it has, and a key
 * spelt wrong is an option that silently does nothing.
 */
const checked = (options: unknown): FrameworkOptions => {
  const given = (options ?? {}) as Partial<Record<string, unknown>>;
  const { mode } = given;
  if (mode !== 'static' && mode !== 'server') {
    throw new Error(
      `framework() needs mode: 'static' or 'server', and got ${shown(mode)}`,
    );
  }
  const taken: readonly string[] = TAKEN[mode];
  const unknown = Object.keys(given).filter(
    (name) =>
      given[name] !== undefined &&
      !taken.includes(name) &&
      !(STATIC_ONLY as readonly string[]).includes(name),
  );
  if (unknown.length > 0) {
    throw new Error(
      `framework() takes no ${unknown.join(', ')} — under mode: '${mode}' it takes ${taken.join(', ')}`,
    );
  }
  const notOrigin = mode === 'static' ? notAnOrigin(given.site) : null;
  if (notOrigin !== null) {
    throw new Error(
      `mode: 'static' needs site, the origin the site is served from, like 'https://example.com' — ${notOrigin}`,
    );
  }
  const refused = headersRefusal(given.headers);
  if (refused !== null) throw new Error(refused);
  const staticOnly = STATIC_ONLY.filter((name) => given[name] !== undefined);
  if (mode === 'server' && staticOnly.length > 0) {
    throw new Error(
      `mode: 'server' takes no ${staticOnly.join(', ')} — only mode: 'static' writes files for ${staticOnly.length === 1 ? 'it' : 'them'} to describe${
        staticOnly.includes('csp')
          ? "; under mode: 'server', a guard.ts writes the Content-Security-Policy header, with nonce()"
          : ''
      }`,
    );
  }
  return options as FrameworkOptions;
};

/**
 * The application: `routes/` compiled into a route table and a request
 * handler, and the mode deciding when that handler runs — at build time for
 * every route, written to files (`'static'`), or per request (`'server'`).
 */
export const framework = (options: FrameworkOptions): PluginOption[] => {
  const valid = checked(options);
  return [
    // どの middleware より先に並べる。答えるものが何であれ、ヘッダーは付いている
    headersPlugin(valid.headers ?? {}),
    ...engine(valid, { mode: valid.mode, runtimeDir: RUNTIME_DIR }),
    ...(valid.mode === 'static'
      ? staticMode(valid, { runtimeDir: RUNTIME_DIR })
      : [serverMode()]),
  ];
};
