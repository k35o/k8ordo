/**
 * The app-side hook for typed route paths. An application augments this once:
 *
 * ```ts
 * import type { Route } from 'next';
 * declare module '@k8ordo/state' {
 *   interface Register { path: Route }
 * }
 * ```
 *
 * and every `href()` in the app is constrained to its router's route type.
 * Declared as an interface — the one exception to the repository's type-only
 * rule — because declaration merging is the entire mechanism.
 */
// oxlint-disable-next-line typescript/consistent-type-definitions, typescript/no-empty-object-type -- augmentation needs a merge-open interface
export interface Register {}

/** `href()`'s path constraint: the registered route type, or any `/`-path. */
export type RegisteredPath = Register extends { path: infer P extends string }
  ? P
  : `/${string}`;
