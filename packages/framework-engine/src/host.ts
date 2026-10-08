/** Which of the two an application is: built into files, or run per request. */
export type Mode = 'static' | 'server';

// plugin/core.ts でなくここに置く。@k8ordo/framework の d.ts はこの型と Guard を
// 1 つのチャンクに束ねるので、vite を読むモジュールに置くと ./server の型まで
// vite（とその Node の型）を読み込む
/** What `framework()` takes whatever the mode. */
export type EngineOptions = {
  /** Where the route files live, relative to the project root. */
  readonly routesDir?: string;
};

/**
 * The package the application actually installed. This engine is bundled
 * into it rather than published on its own, so it is the only name
 * resolvable from the project root: anything the optimizer is asked to
 * prebundle is addressed through it, and the generated files name it.
 */
export const FRAMEWORK = '@k8ordo/framework';
