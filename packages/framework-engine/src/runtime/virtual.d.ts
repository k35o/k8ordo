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
   * Per full pattern, the schemas along its stack — layouts first. Spelled
   * out rather than imported from `./params`: a relative import inside an
   * ambient module declaration resolves loosely, and the handler wants the
   * real shape.
   */
  export const paramSchemas: SchemaStacks;
  /**
   * Per catch-all pattern, the schemas of the layouts above its not-found —
   * run for what they write, never to refuse it.
   */
  export const catchAllSchemas: SchemaStacks;
  /**
   * Per pattern, the `guard.ts` default exports that run before it answers,
   * outer first; `/*` carries the root's.
   */
  /** Per pattern, the `route.ts` module that answers it, whole. */
  export const routeModules: Readonly<
    Record<string, Readonly<Record<string, unknown>> | undefined>
  >;
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

  type SchemaStacks = Readonly<
    Record<
      string,
      ReadonlyArray<{
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
      }>
    >
  >;
}

type ImportMetaEnv = {
  /** The mode package the application installed. */
  readonly K8ORDO_MODE: '@k8ordo/static' | '@k8ordo/server';
};
