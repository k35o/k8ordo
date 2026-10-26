/// <reference types="vite/client" />
/// <reference types="@vitejs/plugin-rsc/types" />

declare module 'virtual:k8ordo/routes' {
  import type { Routes } from '@k8ordo/router';

  export const routes: Routes;
  /** Per pattern, where a `redirect.ts` sends the visitor. */
  export const redirects: Readonly<
    Record<
      string,
      string | { readonly to: string; readonly permanent?: boolean }
    >
  >;
  /**
   * A route file read when a request reaches it — a page, a not-found, a
   * `route.ts`, a `fallback.tsx` — as its module: whatever it exports.
   */
  export type Leaf = Readonly<Record<string, unknown>>;
  type Load = () => Promise<Leaf>;
  /**
   * Per page pattern, the schemas along its stack — layouts first, then the
   * page's own, read off the module of the file that answers it. Spelled
   * out rather than imported from `./params`: a relative import inside an
   * ambient module declaration resolves loosely, and the handler wants the
   * real shape.
   */
  export const paramSchemas: Readonly<
    Record<string, ((leaf: Leaf) => Schemas) | undefined>
  >;
  /**
   * Per catch-all pattern, the schemas of the layouts above its not-found —
   * run for what they write, never to refuse it.
   */
  export const catchAllSchemas: Readonly<Record<string, Schemas | undefined>>;
  /**
   * Per page pattern, what reads the search a page declared it reads, made
   * from the page's module.
   */
  export const searchReaders: Readonly<
    Record<
      string,
      ((leaf: Leaf) => (input: URLSearchParams) => unknown) | undefined
    >
  >;
  /** Per pattern, what reads the page or the not-found that answers it. */
  export const pageModules: Readonly<Record<string, Load | undefined>>;
  /** Per pattern, what reads the `route.ts` module that answers it. */
  export const routeModules: Readonly<Record<string, Load | undefined>>;
  /**
   * Per pattern, the `guard.ts` default exports that run before it answers,
   * outer first; `/*` carries the root's.
   */
  export const guards: Readonly<
    Record<
      string,
      ReadonlyArray<
        (context: {
          readonly request: Request;
          readonly params: Readonly<Record<string, string>>;
        }) => unknown
      >
    >
  >;

  /**
   * Per page pattern with a `fallback.tsx`, under a build into files: what
   * reads its shell, the params a shell may leave to the browser, and the
   * schemas of the layouts above it. Empty under a running server.
   */
  export const fallbacks: Readonly<
    Record<
      string,
      | {
          readonly load: Load;
          readonly open: readonly string[];
          readonly schemas: Schemas;
        }
      | undefined
    >
  >;

  type Schemas = ReadonlyArray<{
    readonly '~standard': {
      readonly validate: (
        value: unknown,
      ) =>
        | { readonly value: unknown; readonly issues?: undefined }
        | { readonly issues: readonly unknown[] }
        | Promise<
            | { readonly value: unknown; readonly issues?: undefined }
            | { readonly issues: readonly unknown[] }
          >;
    };
  }>;
}

type ImportMetaEnv = {
  /** The mode the application chose in `framework({ mode })`. */
  readonly K8ORDO_MODE: 'static' | 'server';
};
