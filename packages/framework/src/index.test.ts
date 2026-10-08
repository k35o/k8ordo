import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseSync } from 'vite';

/**
 * What the router exports and `@k8ordo/framework` does not, each with the
 * reason an application has none to reach for it.
 */
const WITHHELD: Readonly<Record<string, string>> = {
  Router:
    'the framework renders the table on the server; an application mounts no <Router>',
  Outlet: "a layout receives its page as children; Outlet is <Router>'s",
  useRoute:
    'reads the match a <Router> provides, and under the framework the browser holds no table',
  useParams:
    'reads the match a <Router> provides; a framework page receives its params as a prop',
  PathnameProvider: "the framework's runtimes supply the pathname themselves",
  NavigationGeneration: "a seam the framework's client runtime is built from",
  useInterceptedNavigation:
    "a seam the framework's client runtime is built from",
  NavigationHandler: "the handler of useInterceptedNavigation, the runtime's",
  withoutBase:
    'the framework takes the base off a request before anything reads the pathname',
  defineRoutes:
    'the generated table calls it, through @k8ordo/framework/generated',
  ErrorComponent:
    'what the generated table checks error.tsx against; the component itself takes ErrorProps',
  ParamsOf:
    'what the generated table types layouts and guards by; a route file reads PageProps or LayoutProps, and a layout with no page at its pattern spells its params inline',
  ParamsSchemaFor:
    'what the generated table checks a paramsSchema export against',
  ParsedParams: 'what the generated table types pages by',
  ParsedParamsMap: 'what the generated Register types links by',
  Register:
    'the generated register.gen.ts merges into it, through @k8ordo/framework/generated',
  Match: 'the match of a hand-written table',
  RouteComponent: 'a node of a hand-written table',
  RouteNode: 'a node of a hand-written table',
  Routes: 'a hand-written table, as defineRoutes returns it',
  RoutesRecord: 'a hand-written table, as defineRoutes takes it',
  PatternOf:
    "the patterns of a hand-written table; RegisteredPattern is the generated table's",
  NavigablePatternOf:
    "the linkable patterns of a hand-written table; RegisteredNavigablePattern is the generated table's",
  NavigablePath:
    'checks a path against a table type a framework application never holds',
  PathFor:
    'the path type a pattern spells; a link is written through href, against RegisteredNavigablePattern',
  ParamValue:
    'a building block of BoundParams and RegisteredParams, which are re-exported',
  SchemaOutput: 'a building block of ParsedParams',
  StandardSchemaLike:
    'the shape a paramsSchema export is checked against; the schema library provides it',
};

/** The names a module exports, types included, by the module they come from. */
const exportsOf = async (
  file: string,
): Promise<ReadonlyArray<{ readonly name: string; readonly from: string }>> => {
  const { errors, module } = parseSync(file, await readFile(file, 'utf8'), {
    sourceType: 'module',
  });
  expect(errors).toStrictEqual([]);
  return module.staticExports.flatMap((statement) =>
    statement.entries.map((entry) => ({
      name: entry.exportName.name ?? 'default',
      from: entry.moduleRequest?.value ?? '',
    })),
  );
};

const routerIndex = path.join(
  path.dirname(
    fileURLToPath(import.meta.resolve('@k8ordo/router/package.json')),
  ),
  'src/index.ts',
);

describe('the root entry', () => {
  it('re-exports or withholds, with a reason, every name the router exports', async () => {
    const router = (await exportsOf(routerIndex)).map(({ name }) => name);
    const reexported = (
      await exportsOf(fileURLToPath(new URL('index.ts', import.meta.url)))
    )
      .filter(({ from }) => from === '@k8ordo/router')
      .map(({ name }) => name);
    const decided = new Set([...reexported, ...Object.keys(WITHHELD)]);
    expect(router.filter((name) => !decided.has(name))).toStrictEqual([]);
    // 出さないと決めたものを出していない。一覧が古い名前を抱えてもいない
    expect(reexported.filter((name) => name in WITHHELD)).toStrictEqual([]);
    expect(
      Object.keys(WITHHELD).filter((name) => !router.includes(name)),
    ).toStrictEqual([]);
  });

  it('exports nothing of its own, so the router stays the one copy', async () => {
    const own = (
      await exportsOf(fileURLToPath(new URL('index.ts', import.meta.url)))
    ).filter(({ from }) => from !== '@k8ordo/router');
    expect(own).toStrictEqual([]);
  });
});
