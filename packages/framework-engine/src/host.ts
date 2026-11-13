/** Which of the two an application is: built into files, or run per request. */
export type Mode = 'static' | 'server';

// plugin/core.ts でなくここに置く。@k8ordo/framework の d.ts はこの型と Guard を
// 1 つのチャンクに束ねるので、vite を読むモジュールに置くと ./server の型まで
// vite（とその Node の型）を読み込む
/** What `framework()` takes whatever the mode. */
export type EngineOptions = {
  /** Where the route files live, relative to the project root. */
  readonly routesDir?: string;
  /**
   * Compiles the client components with React Compiler — the Rust one,
   * through `@vitejs/plugin-react`'s `compiler`, which needs
   * `oxc-transform-react` installed. Server components are left as they are.
   */
  readonly reactCompiler?: boolean;
  /**
   * Headers every response carries, whatever answered — a page, a file of
   * the build, a `404`, a redirect. Sent by `vite dev`, `vite preview` and
   * `serve`, added by the request handler to its own answers under
   * `mode: 'server'`, and written for the hosts that read them from the
   * build. A header the answer already has under the same name — one a
   * `guard.ts` or a `route.ts` set — is left as it is.
   */
  readonly headers?: Readonly<Record<string, string>>;
};

/**
 * The package the application actually installed. This engine is bundled
 * into it rather than published on its own, so it is the only name
 * resolvable from the project root: anything the optimizer is asked to
 * prebundle is addressed through it, and the generated files name it.
 */
export const FRAMEWORK = '@k8ordo/framework';
