/**
 * What the generated `.k8ordo/` files import: the table's constructor, the
 * shapes it is checked against, and the `Register` the generated types are
 * merged into. Through the framework so the generated files never name the
 * router, which the application installs only because the framework needs
 * it. A guard is checked against the type `@k8ordo/framework/server` hands
 * the application, and a redirect against the root's.
 */
export { defineRoutes } from '@k8ordo/router';
export type {
  ErrorComponent,
  ParamsOf,
  ParamsSchemaFor,
  ParsedParams,
  ParsedParamsMap,
  Register,
} from '@k8ordo/router';
export type { Guard } from '@k8ordo/framework-engine/server';
export type { RedirectTarget } from '@k8ordo/framework-engine/redirect';
export type { Paths } from './paths-type';
