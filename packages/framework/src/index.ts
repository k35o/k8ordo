/**
 * What an application's own code imports: the router's links, matching and
 * page types, named here so a framework application reads everything from
 * one package. Listed by name rather than `export *`, because the router also
 * exports what only a hand-written table or the framework's own runtime uses
 * (`index.test.ts` keeps the two lists honest). The router stays a peer and
 * is never bundled in, so a page and the framework share its one copy.
 */
export {
  bindParams,
  href,
  isNotFound,
  matchPath,
  navigateTo,
  normalizePathname,
  notFound,
  useMatch,
  usePathname,
  usePendingPathname,
  withBase,
} from '@k8ordo/router';
export type {
  BoundLinks,
  BoundParams,
  ErrorProps,
  LayoutProps,
  MatchablePattern,
  MatchOptions,
  NavigateToOptions,
  PageProps,
  RegisteredNavigablePattern,
  RegisteredPageParams,
  RegisteredParams,
  RegisteredPattern,
  RouteContext,
} from '@k8ordo/router';
