/**
 * What the generated `.k8ordo/` files import, and nothing an application
 * writes by hand: the table's constructor, the shapes it is checked against,
 * and the `Register` the generated types are merged into. Through the
 * framework so the generated files never name the router, which the
 * application installs only because the framework needs it.
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
