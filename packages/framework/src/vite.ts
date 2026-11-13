import { fileURLToPath } from 'node:url';

import { engine } from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { PluginOption } from 'vite';

import { headersPlugin, headersRefusal } from './headers';
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

/** `site` and `csp` describe files, so only `mode: 'static'` takes them. */
export type FrameworkOptions = StaticOptions | ServerOptions;

export type { ContentSecurityPolicy } from './documents';
export type { StaticOptions } from './static';

// The engine is bundled into this package, and its runtime entries ship
// beside this file — `dist/runtime/` — which is where Vite is pointed.
const RUNTIME_DIR = fileURLToPath(new URL('./runtime/', import.meta.url));

const STATIC_ONLY = ['site', 'csp'] as const;

const shown = (value: unknown): string =>
  typeof value === 'string' ? `'${value}'` : String(value);

/**
 * What the type already says, said again when the config is loaded: a
 * `vite.config.js`, or a `vite.config.ts` outside the tsconfig, is never
 * type-checked, and the options the type refuses do not fail on their own —
 * a mode that is not `'static'` builds no files, and a `csp` under
 * `mode: 'server'` is a policy the application believes it has.
 */
const checked = (options: unknown): FrameworkOptions => {
  const given = (options ?? {}) as Partial<Record<string, unknown>>;
  const { mode } = given;
  if (mode !== 'static' && mode !== 'server') {
    throw new Error(
      `framework() needs mode: 'static' or 'server', and got ${shown(mode)}`,
    );
  }
  // 型の無い設定では、消えたオプションは黙って無視され、値のあるページが 1 つも書かれない
  if (given.paths !== undefined) {
    throw new Error(
      "framework() takes no paths — a parameter's values come from a paths.ts in its directory under routes/",
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
    ...(valid.mode === 'static' ? staticMode(valid) : [serverMode()]),
  ];
};
