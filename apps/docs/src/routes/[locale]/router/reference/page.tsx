import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../components/api-entry';
import { DocPage } from '../../../../components/doc-page';
import * as m from '../../../../messages';

// `${string}` を JSX の属性に直接書くと、整形で普通の文字列に戻されて lint に当たる
const ROUTES_RECORD = `type RoutesRecord = Record<\`/\${string}\`, RouteNode>;`;

const t = m.routerReference;
const FROM = '@k8ordo/router';

const DEFINE_ROUTES_EXAMPLE = `export const routes = defineRoutes({
  '/': Home,
  '/products': {
    layout: ProductsLayout,
    children: { '/': ProductList, '/:id': ProductPage },
  },
  '/*': NotFound,
});`;

const HREF_EXAMPLE = `href('/products'); // '/products'
href('/products/:id', { id: 42 }); // '/products/42'`;

const NAVIGATE_TO_EXAMPLE = `await navigateTo('/products/:id', { id: '42' }).finished;
navigateTo('/products', { history: 'replace' });`;

const MATCH_PATH_EXAMPLE = `matchPath('/products/:id', '/products/42'); // { id: '42' }
matchPath('/products/*', '/products'); // null
matchPath('/products/*', '/products', { inclusive: true }); // {}`;

const NORMALIZE_EXAMPLE = `normalizePathname('/products/'); // '/products'
normalizePathname('/'); // '/'`;

const BASE_EXAMPLE = `withBase('/products', '/docs/'); // '/docs/products'
withoutBase('/docs/products', '/docs/'); // '/products'
withoutBase('/elsewhere', '/docs/'); // null`;

const PARAMS_OF_EXAMPLE = `type Params = ParamsOf<'/:locale/products/:id'>;
// { locale: string; id: string }`;

const PATH_FOR_EXAMPLE = `type Path = PathFor<'/:locale/products/:id'>;
// \`/\${string}/products/\${string}\``;

const NAVIGABLE_PATH_EXAMPLE = `type A = NavigablePath<typeof routes, '/products/42'>;
// '/products/42'
type B = NavigablePath<typeof routes, '/products/42/reviews'>;
// never`;

export default function RouterReferencePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/reference">
      <ApiEntry
        caveats={t.defineRoutesCaveats}
        from={FROM}
        id="define-routes"
        name="defineRoutes"
        params={[
          {
            name: 'record',
            type: 'RoutesRecord',
            description: t.defineRoutesRecord,
          },
        ]}
        returns={{ type: 'Routes<R>', description: t.defineRoutesReturns }}
        signature="defineRoutes<R extends RoutesRecord>(record: R): Routes<R>"
        summary={t.defineRoutesSummary}
      >
        <CodeBlock code={DEFINE_ROUTES_EXAMPLE} lang="ts" title="routes.ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.routerCaveats}
        from={FROM}
        id="router"
        name="Router"
        params={[
          { name: 'routes', type: 'Routes', description: t.routerRoutes },
        ]}
        signature="<Router routes={Routes} />"
        summary={t.routerSummary}
      />

      <ApiEntry
        caveats={t.outletCaveats}
        from={FROM}
        id="outlet"
        name="Outlet"
        signature="<Outlet />"
        summary={t.outletSummary}
      />

      <ApiEntry
        caveats={t.hrefCaveats}
        from={FROM}
        id="href"
        name="href"
        params={[
          { name: 'pattern', type: 'P', description: t.hrefPattern },
          {
            name: 'params',
            type: 'RegisteredParams<P>',
            description: t.hrefParams,
          },
        ]}
        returns={{ type: 'string', description: t.hrefReturns }}
        signature={`href<P extends RegisteredNavigablePattern>(
  pattern: P,
  params?: RegisteredParams<P>,
): string`}
        summary={t.hrefSummary}
      >
        <CodeBlock code={HREF_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.navigateToCaveats}
        from={FROM}
        id="navigate-to"
        name="navigateTo"
        params={[
          { name: 'pattern', type: 'P', description: t.hrefPattern },
          {
            name: 'params',
            type: 'RegisteredParams<P>',
            description: t.hrefParams,
          },
          {
            name: 'options',
            type: 'NavigateToOptions',
            description: t.navigateToOptions,
          },
        ]}
        returns={{
          type: 'NavigationResult',
          description: t.navigateToReturns,
        }}
        signature={`navigateTo<P extends RegisteredNavigablePattern>(
  pattern: P,
  params?: RegisteredParams<P>,
  options?: NavigateToOptions,
): NavigationResult`}
        summary={t.navigateToSummary}
      >
        <CodeBlock code={NAVIGATE_TO_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.bindParamsCaveats}
        from={FROM}
        id="bind-params"
        name="bindParams"
        params={[
          {
            name: 'source',
            type: '() => Bound',
            description: t.bindParamsSource,
          },
        ]}
        returns={{
          type: 'BoundLinks<Bound>',
          description: t.bindParamsReturns,
        }}
        signature={`bindParams<const Bound extends BoundParams>(
  source: () => Bound,
): BoundLinks<Bound>`}
        summary={t.bindParamsSummary}
      />

      <ApiEntry
        caveats={t.pathnameHookCaveats}
        from={FROM}
        id="use-pathname"
        name="usePathname"
        returns={{ type: 'string', description: t.pathnameHookReturns }}
        signature="usePathname(): string"
        summary={t.pathnameHookSummary}
      />

      <ApiEntry
        caveats={t.matchHookCaveats}
        from={FROM}
        id="use-match"
        name="useMatch"
        params={[
          { name: 'pattern', type: 'P', description: t.matchHookPattern },
          {
            name: 'options',
            type: 'MatchOptions',
            description: t.matchHookOptions,
          },
        ]}
        returns={{
          type: 'ParamsOf<P> | null',
          description: t.matchHookReturns,
        }}
        signature={`useMatch<P extends MatchablePattern>(
  pattern: P,
  options?: MatchOptions,
): ParamsOf<P> | null`}
        summary={t.matchHookSummary}
      />

      <ApiEntry
        from={FROM}
        id="match-path"
        name="matchPath"
        params={[
          { name: 'pattern', type: 'P', description: t.matchHookPattern },
          {
            name: 'pathname',
            type: 'string',
            description: t.matchPathPathname,
          },
          {
            name: 'options',
            type: 'MatchOptions',
            description: t.matchHookOptions,
          },
        ]}
        returns={{
          type: 'ParamsOf<P> | null',
          description: t.matchHookReturns,
        }}
        signature={`matchPath<P extends MatchablePattern>(
  pattern: P,
  pathname: string,
  options?: MatchOptions,
): ParamsOf<P> | null`}
        summary={t.matchPathSummary}
      >
        <CodeBlock code={MATCH_PATH_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.pendingHookCaveats}
        from={FROM}
        id="use-pending-pathname"
        name="usePendingPathname"
        returns={{ type: 'string | null', description: t.pendingHookReturns }}
        signature="usePendingPathname(): string | null"
        summary={t.pendingHookSummary}
      />

      <ApiEntry
        caveats={t.paramsHookCaveats}
        from={FROM}
        id="use-params"
        name="useParams"
        params={[
          { name: 'pattern', type: 'P', description: t.paramsHookPattern },
        ]}
        returns={{ type: 'ParamsOf<P>', description: t.paramsHookReturns }}
        signature="useParams<P extends RegisteredPattern>(pattern: P): ParamsOf<P>"
        summary={t.paramsHookSummary}
      />

      <ApiEntry
        caveats={t.routeHookCaveats}
        from={FROM}
        id="use-route"
        name="useRoute"
        returns={{
          type: "Pick<Match, 'pattern' | 'params'>",
          description: t.routeHookReturns,
        }}
        signature={`useRoute(): {
  pattern: string;
  params: Readonly<Record<string, string>>;
}`}
        summary={t.routeHookSummary}
      />

      <ApiEntry
        caveats={t.normalizeCaveats}
        from={FROM}
        id="normalize-pathname"
        name="normalizePathname"
        params={[
          {
            name: 'pathname',
            type: 'string',
            description: t.normalizePathname,
          },
        ]}
        signature="normalizePathname(pathname: string): string"
        summary={t.normalizeSummary}
      >
        <CodeBlock code={NORMALIZE_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.baseCaveats}
        from={FROM}
        id="with-base"
        name="withBase"
        params={[
          {
            name: 'pathname',
            type: 'string',
            description: t.withBasePathname,
          },
          { name: 'base', type: 'string', description: t.withBaseBase },
        ]}
        returns={{ type: 'string', description: t.withBaseReturns }}
        signature="withBase(pathname: string, base?: string): string"
        summary={t.withBaseSummary}
      />

      <ApiEntry
        caveats={t.baseCaveats}
        from={FROM}
        id="without-base"
        name="withoutBase"
        params={[
          {
            name: 'pathname',
            type: 'string',
            description: t.withoutBasePathname,
          },
          { name: 'base', type: 'string', description: t.withBaseBase },
        ]}
        returns={{
          type: 'string | null',
          description: t.withoutBaseReturns,
        }}
        signature="withoutBase(pathname: string, base?: string): string | null"
        summary={t.withoutBaseSummary}
      >
        <CodeBlock code={BASE_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.notFoundCaveats}
        from={FROM}
        id="not-found"
        name="notFound"
        signature="notFound(): never"
        summary={t.notFoundSummary}
      />

      <ApiEntry
        caveats={t.isNotFoundCaveats}
        from={FROM}
        id="is-not-found"
        name="isNotFound"
        params={[
          { name: 'value', type: 'unknown', description: t.isNotFoundValue },
        ]}
        signature="isNotFound(value: unknown): boolean"
        summary={t.isNotFoundSummary}
      />

      <ApiEntry
        caveats={t.pathnameProviderCaveats}
        from={FROM}
        id="pathname-provider"
        name="PathnameProvider"
        params={[
          {
            name: 'pathname',
            type: 'string',
            description: t.pathnameProviderPathname,
          },
        ]}
        signature="<PathnameProvider pathname={string}>{children}</PathnameProvider>"
        summary={t.pathnameProviderSummary}
      />

      <ApiEntry
        caveats={t.browserPathnameCaveats}
        from={FROM}
        id="browser-pathname"
        name="BrowserPathname"
        signature="<BrowserPathname>{children}</BrowserPathname>"
        summary={t.browserPathnameSummary}
      />

      <ApiEntry
        caveats={t.generationCaveats}
        from={FROM}
        id="navigation-generation"
        name="NavigationGeneration"
        params={[
          { name: 'value', type: 'number', description: t.generationValue },
        ]}
        signature={`<NavigationGeneration value={number}>
  {children}
</NavigationGeneration>`}
        summary={t.generationSummary}
      />

      <ApiEntry
        caveats={t.interceptHookCaveats}
        from={FROM}
        id="use-intercepted-navigation"
        name="useInterceptedNavigation"
        params={[
          {
            name: 'handler',
            type: 'NavigationHandler<T>',
            description: t.interceptHookHandler,
          },
        ]}
        returns={{
          type: '{ readonly generation: number }',
          description: t.interceptHookReturns,
        }}
        signature={`useInterceptedNavigation<T>(
  handler: NavigationHandler<T>,
): { readonly generation: number }`}
        summary={t.interceptHookSummary}
      />

      <ApiEntry
        fields={[
          { name: 'kind', type: "'routes'", description: t.routesKind },
          { name: 'record', type: 'R', description: t.routesRecord },
          {
            name: 'match',
            type: '(pathname, accept?) => Match | null',
            description: t.routesMatch,
          },
        ]}
        from={FROM}
        id="routes"
        name="Routes"
        signature={`type Routes<R extends RoutesRecord = RoutesRecord> = {
  kind: 'routes';
  record: R;
  match: (
    pathname: string,
    accept?: (match: Match) => boolean,
  ) => Match | null;
};`}
        summary={t.routesSummary}
      />

      <ApiEntry
        from={FROM}
        id="routes-record"
        name="RoutesRecord"
        signature={ROUTES_RECORD}
        summary={t.routesRecordTypeSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'layout',
            type: 'RouteComponent',
            description: t.routeNodeLayout,
          },
          {
            name: 'error',
            type: 'ErrorComponent',
            description: t.routeNodeError,
          },
          {
            name: 'loading',
            type: 'ComponentType',
            description: t.routeNodeLoading,
          },
          {
            name: 'children',
            type: 'RoutesRecord',
            description: t.routeNodeChildren,
          },
        ]}
        from={FROM}
        id="route-node"
        name="RouteNode"
        signature={`type RouteNode =
  | RouteComponent
  | {
      layout?: RouteComponent;
      error?: ErrorComponent;
      loading?: ComponentType;
      children: RoutesRecord;
    };`}
        summary={t.routeNodeSummary}
      />

      <ApiEntry
        caveats={t.routeComponentCaveats}
        from={FROM}
        id="route-component"
        name="RouteComponent"
        signature="type RouteComponent = ComponentType<never>;"
        summary={t.routeComponentSummary}
      />

      <ApiEntry
        fields={[
          { name: 'pattern', type: 'string', description: t.matchTypePattern },
          {
            name: 'params',
            type: 'Readonly<Record<string, string>>',
            description: t.matchTypeParams,
          },
          {
            name: 'stack',
            type: 'readonly RouteComponent[]',
            description: t.matchTypeStack,
          },
        ]}
        from={FROM}
        id="match"
        name="Match"
        signature={`type Match = {
  pattern: string;
  params: Readonly<Record<string, string>>;
  stack: readonly RouteComponent[];
};`}
        summary={t.matchTypeSummary}
      />

      <ApiEntry
        fields={[
          { name: 'error', type: 'unknown', description: t.errorPropsError },
          {
            name: 'reset',
            type: '() => void',
            description: t.errorPropsReset,
          },
        ]}
        from={FROM}
        id="error-props"
        name="ErrorProps"
        signature={`type ErrorProps = {
  readonly error: unknown;
  readonly reset: () => void;
};`}
        summary={t.errorPropsSummary}
      />

      <ApiEntry
        from={FROM}
        id="error-component"
        name="ErrorComponent"
        signature="type ErrorComponent = ComponentType<ErrorProps>;"
        summary={t.errorComponentSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'history',
            type: "'push' | 'replace'",
            description: t.navigateToOptionsHistory,
          },
        ]}
        from={FROM}
        id="navigate-to-options"
        name="NavigateToOptions"
        signature={`type NavigateToOptions = {
  history?: 'push' | 'replace';
};`}
        summary={t.navigateToOptionsSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'inclusive',
            type: 'boolean',
            description: t.matchOptionsInclusive,
          },
        ]}
        from={FROM}
        id="match-options"
        name="MatchOptions"
        signature={`type MatchOptions = {
  readonly inclusive?: boolean;
};`}
        summary={t.matchOptionsSummary}
      />

      <ApiEntry
        from={FROM}
        id="matchable-pattern"
        name="MatchablePattern"
        signature={`type MatchablePattern =
  | RegisteredPattern
  | \`\${RegisteredNavigablePattern}/*\`;`}
        summary={t.matchablePatternSummary}
      />

      <ApiEntry
        from={FROM}
        id="bound-params"
        name="BoundParams"
        signature="type BoundParams = Readonly<Record<string, ParamValue>>;"
        summary={t.boundParamsSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'href',
            type: '(pattern, params?) => string',
            description: t.boundLinksHref,
          },
          {
            name: 'navigateTo',
            type: '(pattern, params?, options?) => NavigationResult',
            description: t.boundLinksNavigateTo,
          },
        ]}
        from={FROM}
        id="bound-links"
        name="BoundLinks"
        signature={`type BoundLinks<Bound extends BoundParams> = {
  readonly href: (pattern, params?) => string;
  readonly navigateTo: (
    pattern,
    params?,
    options?: NavigateToOptions,
  ) => NavigationResult;
};`}
        summary={t.boundLinksSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'claim',
            type: '(url: URL) => boolean',
            description: t.handlerClaim,
          },
          {
            name: 'load',
            type: '(url: URL, signal: AbortSignal) => T | Promise<T>',
            description: t.handlerLoad,
          },
          {
            name: 'apply',
            type: '(value: T) => void',
            description: t.handlerApply,
          },
          {
            name: 'refresh',
            type: '(url: URL) => boolean',
            description: t.handlerRefresh,
          },
        ]}
        from={FROM}
        id="navigation-handler"
        name="NavigationHandler"
        signature={`type NavigationHandler<T> = {
  claim: (url: URL) => boolean;
  load: (url: URL, signal: AbortSignal) => T | Promise<T>;
  apply: (value: T) => void;
  refresh?: (url: URL) => boolean;
};`}
        summary={t.navigationHandlerSummary}
      />

      <ApiEntry
        caveats={t.registerCaveats}
        from={FROM}
        id="register"
        name="Register"
        signature={`declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}`}
        summary={t.registerSummary}
      />

      <ApiEntry
        from={FROM}
        id="registered-pattern"
        name="RegisteredPattern"
        signature={`type RegisteredPattern = Register extends {
  routes: Routes<infer R>;
}
  ? PatternOf<R>
  : \`/\${string}\`;`}
        summary={t.registeredPatternSummary}
      />

      <ApiEntry
        from={FROM}
        id="registered-navigable-pattern"
        name="RegisteredNavigablePattern"
        signature={`type RegisteredNavigablePattern = Register extends {
  routes: Routes<infer R>;
}
  ? NavigablePatternOf<R>
  : \`/\${string}\`;`}
        summary={t.registeredNavigablePatternSummary}
      />

      <ApiEntry
        from={FROM}
        id="registered-params"
        name="RegisteredParams"
        signature="type RegisteredParams<P extends string>"
        summary={t.registeredParamsSummary}
      />

      <ApiEntry
        from={FROM}
        id="registered-page-params"
        name="RegisteredPageParams"
        signature="type RegisteredPageParams<P extends string>"
        summary={t.registeredPageParamsSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'params',
            type: 'RegisteredPageParams<P>',
            description: t.pagePropsParams,
          },
          {
            name: 'pathname',
            type: 'string',
            description: t.pagePropsPathname,
          },
          { name: 'request', type: 'Request', description: t.pagePropsRequest },
          { name: 'search', type: 'unknown', description: t.pagePropsSearch },
        ]}
        from={FROM}
        id="page-props"
        name="PageProps"
        signature={`type PageProps<P extends RegisteredPattern> = {
  readonly params: RegisteredPageParams<P>;
  readonly pathname: string;
} & RequestProps &
  SearchProps<P>;`}
        summary={t.pagePropsSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'params',
            type: 'ParamsOf<P>',
            description: t.layoutPropsParams,
          },
          {
            name: 'pathname',
            type: 'string',
            description: t.pagePropsPathname,
          },
          {
            name: 'children',
            type: 'ReactNode',
            description: t.layoutPropsChildren,
          },
          { name: 'request', type: 'Request', description: t.pagePropsRequest },
        ]}
        from={FROM}
        id="layout-props"
        name="LayoutProps"
        signature={`type LayoutProps<P extends RegisteredPattern> = {
  readonly params: ParamsOf<P>;
  readonly pathname: string;
  readonly children: ReactNode;
} & RequestProps;`}
        summary={t.layoutPropsSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'request',
            type: 'Request',
            description: t.routeContextRequest,
          },
          {
            name: 'params',
            type: 'RegisteredPageParams<P>',
            description: t.routeContextParams,
          },
        ]}
        from={FROM}
        id="route-context"
        name="RouteContext"
        signature={`type RouteContext<P extends RegisteredPattern> = {
  readonly request: Request;
  readonly params: RegisteredPageParams<P>;
};`}
        summary={t.routeContextSummary}
      />

      <ApiEntry
        from={FROM}
        id="pattern-of"
        name="PatternOf"
        signature="type PatternOf<R extends RoutesRecord>"
        summary={t.patternOfSummary}
      />

      <ApiEntry
        from={FROM}
        id="navigable-pattern-of"
        name="NavigablePatternOf"
        signature="type NavigablePatternOf<R extends RoutesRecord>"
        summary={t.navigablePatternOfSummary}
      />

      <ApiEntry
        caveats={t.navigablePathCaveats}
        from={FROM}
        id="navigable-path"
        name="NavigablePath"
        signature="type NavigablePath<D, Path extends string>"
        summary={t.navigablePathSummary}
      >
        <CodeBlock code={NAVIGABLE_PATH_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        from={FROM}
        id="params-of"
        name="ParamsOf"
        signature="type ParamsOf<Pattern extends string>"
        summary={t.paramsOfSummary}
      >
        <CodeBlock code={PARAMS_OF_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        from={FROM}
        id="path-for"
        name="PathFor"
        signature="type PathFor<Pattern extends string>"
        summary={t.pathForSummary}
      >
        <CodeBlock code={PATH_FOR_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        from={FROM}
        id="param-value"
        name="ParamValue"
        signature="type ParamValue = string | number | bigint | boolean;"
        summary={t.paramValueSummary}
      />

      <ApiEntry
        from={FROM}
        id="standard-schema-like"
        name="StandardSchemaLike"
        signature={`type StandardSchemaLike<Output = unknown> = {
  readonly '~standard': {
    readonly types?: { readonly output: Output } | undefined;
  };
};`}
        summary={t.standardSchemaLikeSummary}
      />

      <ApiEntry
        from={FROM}
        id="schema-output"
        name="SchemaOutput"
        signature={`type SchemaOutput<Schema> =
  Schema extends StandardSchemaLike<infer Output> ? Output : never;`}
        summary={t.schemaOutputSummary}
      />

      <ApiEntry
        from={FROM}
        id="params-schema-for"
        name="ParamsSchemaFor"
        signature={`type ParamsSchemaFor<Pattern extends string> = StandardSchemaLike<
  Partial<Record<keyof ParamsOf<Pattern> & string, unknown>>
>;`}
        summary={t.paramsSchemaForSummary}
      />

      <ApiEntry
        from={FROM}
        id="parsed-params"
        name="ParsedParams"
        signature={`type ParsedParams<
  Pattern extends string,
  Schemas extends readonly unknown[],
>`}
        summary={t.parsedParamsSummary}
      />

      <ApiEntry
        caveats={[t.generatedTypesNote]}
        from={FROM}
        id="parsed-params-map"
        name="ParsedParamsMap"
        signature={`type ParsedParamsMap<
  Schemas extends Record<string, readonly unknown[]>,
>`}
        summary={t.parsedParamsMapSummary}
      />
    </DocPage>
  );
}
