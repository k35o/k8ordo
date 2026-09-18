import type { ReactNode } from 'react';

import type {
  NavigablePatternOf,
  PatternOf,
  Routes,
  RoutesRecord,
} from './define-routes';
import type { ParamsOf, ParamValue } from './paths';

/**
 * The app-side hook for the route table's type. An application augments this
 * once:
 *
 * ```ts
 * declare module '@k8ordo/router' {
 *   interface Register { routes: typeof routes }
 * }
 * ```
 *
 * and `href` / `navigateTo` / `useParams` verify their pattern against the
 * table everywhere — without any component importing the table's value.
 * Only `<Router>` touches the value; everything else needs just the string
 * pattern, so the routes-module → pages → routes-module import cycle never
 * forms. Declared as an interface — the one exception to the repository's
 * type-only rule — because declaration merging is the entire mechanism.
 */
// oxlint-disable-next-line typescript/consistent-type-definitions, typescript/no-empty-object-type -- augmentation needs a merge-open interface
export interface Register {}

// Applied to the `infer` variable directly rather than through an alias of
// it: under TypeScript 7 `PatternOf<Alias>` stays deferred and never reduces
// to the union, which leaves every pattern rejected where the union is
// compared against (`useMatch`), while `href` only survives through generic
// inference taking another path.

/**
 * Every leaf pattern in the registered table — each page and each `/*`, not a
 * prefix with no page of its own; any `/`-pattern before Register.
 */
export type RegisteredPattern = Register extends {
  routes: Routes<infer R extends RoutesRecord>;
}
  ? PatternOf<R>
  : `/${string}`;

/** Linkable patterns of the registered table (wildcards excluded). */
export type RegisteredNavigablePattern = Register extends {
  routes: Routes<infer R extends RoutesRecord>;
}
  ? NavigablePatternOf<R>
  : `/${string}`;

type RegisteredParamsMap = Register extends { params: infer M } ? M : null;

/** The pattern's params as anything with one spelling, before any schema. */
type LooseParamsOf<P extends string> = {
  [K in keyof ParamsOf<P>]: ParamValue;
};

/**
 * A pattern's params as a link takes them: where the registered `params`
 * map — written by the framework from the schemas the route files declared
 * — says a page receives something, a link takes that same value (a number
 * in, a number's one spelling out), and a param those schemas leave alone is
 * the string the page receives. A pattern no schema covers at all takes
 * anything with one spelling in every param. Before `Register` is augmented
 * — a client application that has not, or the framework's generated file
 * not yet written — the same loose shape applies, so a link written for a
 * schema still compiles.
 */
export type RegisteredParams<P extends string> =
  RegisteredParamsMap extends null
    ? LooseParamsOf<P>
    : P extends keyof RegisteredParamsMap
      ? Omit<LooseParamsOf<P>, keyof RegisteredParamsMap[P]> &
          RegisteredParamsMap[P]
      : LooseParamsOf<P>;

/**
 * What a page under this pattern receives as `params`: the schemas' output
 * where the framework ran one (the registered `params` map, written by the
 * generator), and the strings the URL carried elsewhere.
 */
export type RegisteredPageParams<P extends string> = Register extends {
  params: infer M;
}
  ? P extends keyof M
    ? M[P]
    : ParamsOf<P>
  : ParamsOf<P>;

/**
 * The request a route file receives — under `@k8ordo/server` only, where the
 * generated `Register` says so. A build into files has none, and a page that
 * reads it fails to type-check there rather than at run time.
 */
type RequestProps = Register extends { request: infer R }
  ? { readonly request: R }
  : Record<never, never>;

/**
 * The props a `page.tsx` receives under the framework, by the pattern its
 * directory puts it under: `params` typed by the schemas along its stack,
 * the `pathname` this render is for, and — under `@k8ordo/server` — the
 * `request`. The generated table checks the same thing at the import, so a
 * page may equally declare its props inline; this is the spelling that names
 * the pattern once and lets the schema say the rest.
 */
export type PageProps<P extends RegisteredPattern> = {
  readonly params: RegisteredPageParams<P>;
  readonly pathname: string;
} & RequestProps;

/**
 * The props a `layout.tsx` receives, by the prefix every route below it
 * shares — only where the table also has a page at that prefix, since the
 * constraint is a page pattern; a layout with no page of its own declares
 * its props inline. Its params are strings whatever it declared: under
 * `not-found.tsx` nothing is validated, and a typed value there would be a
 * lie.
 */
export type LayoutProps<P extends RegisteredPattern> = {
  readonly params: ParamsOf<P>;
  readonly pathname: string;
  readonly children: ReactNode;
} & RequestProps;
