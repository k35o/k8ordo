import type { NavigablePath } from '@k8ordo/router';

/**
 * The app-side hook for typed route paths. An application augments this once,
 * with the same line its `@k8ordo/router` augmentation uses:
 *
 * ```ts
 * import type { routes } from './routes';
 * declare module '@k8ordo/state' {
 *   interface Register { routes: typeof routes }
 * }
 * ```
 *
 * and every `href()` in the app is checked against the table's linkable
 * patterns. A router that is not `@k8ordo/router` registers its path union
 * directly — `interface Register { path: Route }` with `Route` from `next` —
 * which is also what the framework's generator emitted before `routes`
 * existed. Declared as an interface — the one exception to the repository's
 * type-only rule — because declaration merging is the entire mechanism.
 */
// oxlint-disable-next-line typescript/consistent-type-definitions, typescript/no-empty-object-type -- augmentation needs a merge-open interface
export interface Register {}

/**
 * `Path` when the router a `Register` shape describes accepts it, `never`
 * when it does not: matched against the table's linkable patterns segment by
 * segment when it carries `routes`, against the union as given when it
 * carries `path`, and any `/`-path when it carries neither. `NavigablePath`
 * is imported as a type only, so `@k8ordo/router` is never loaded at runtime
 * and stays an optional peer.
 */
export type AcceptedPath<R, Path extends string> = R extends {
  routes: infer Routes;
}
  ? NavigablePath<Routes, Path>
  : R extends { path: infer P extends string }
    ? Path extends P
      ? Path
      : never
    : Path extends `/${string}`
      ? Path
      : never;

/** `href()`'s path check: `Path` when the registered router accepts it. */
export type RegisteredPath<Path extends string> = AcceptedPath<Register, Path>;
