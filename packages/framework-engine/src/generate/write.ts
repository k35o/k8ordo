import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { findPackageJSON } from 'node:module';
import path from 'node:path';

import { parseSync } from 'vite';

import { parseRouteTree, slotOf } from '../grammar/tree';
import type { Problem } from '../grammar/tree';
import { FRAMEWORK } from '../host';
import type { Mode } from '../host';
import { ROUTE_METHODS } from '../runtime/route';
import {
  emitRegisterModule,
  emitRoutesModule,
  LOCALES_MODULE,
  unreachableRoutes,
} from './emit';

/** The filesystem edge: everything below it is a pure function of this list. */
export const scanRoutes = async (dir: string): Promise<string[]> => {
  const walk = async (relative: string): Promise<string[]> => {
    const entries = await readdir(path.join(dir, relative), {
      withFileTypes: true,
    });
    const found = await Promise.all(
      entries.map((entry) => {
        const next = relative === '' ? entry.name : `${relative}/${entry.name}`;
        return entry.isDirectory() ? walk(next) : Promise.resolve([next]);
      }),
    );
    return found.flat();
  };
  try {
    return (await walk('')).toSorted();
  } catch {
    return [];
  }
};

export type GenerateOptions = {
  /** Project root. */
  readonly root: string;
  /** Absolute path of the routes directory. */
  readonly routesDir: string;
  /** Absolute path of the directory the generated files go in. */
  readonly outDir: string;
  /** Whether a page receives the request, which the generated types say. */
  readonly mode: Mode;
};

export type GenerateResult = {
  readonly problems: readonly Problem[];
  /** What the build goes on without, said rather than refused. */
  readonly warnings: readonly string[];
  /** Absolute path of the generated route table. */
  readonly routesModule: string;
};

/**
 * What `exportsOf` lists for `export * from`: the names it brings are another
 * module's, which the syntax of this one cannot say.
 */
export const REEXPORTS_ALL = '*';

/**
 * The names a module exports, read from its syntax rather than by importing
 * it — the generator runs before anything is compiled, and an import would
 * evaluate the page. Vite's own parser lists a module's exports the way a
 * person reads the file: `export const paramsSchema`, `export {
 * paramsSchema }`, and a destructured `export const { paramsSchema } =
 * locales` are all an export; the same words inside a string or a comment
 * are not, and `export type paramsSchema` is a type. `file` is the module's
 * name, whose extension says whether it is TSX. A file that does not parse
 * exports nothing; the build reports the syntax error itself, where it can
 * name the line.
 */
export const exportsOf = (
  source: string,
  file: string,
): ReadonlySet<string> => {
  const { errors, module } = parseSync(file, source, {
    sourceType: 'module',
  });
  if (errors.length > 0) return new Set();
  return new Set(
    module.staticExports.flatMap((statement) =>
      statement.entries
        .filter((entry) => !entry.isType)
        .map((entry) =>
          entry.exportName.kind === 'None'
            ? REEXPORTS_ALL
            : (entry.exportName.name ?? 'default'),
        ),
    ),
  );
};

/**
 * Whether a route file exports a `paramsSchema` — named so rather than
 * `params` because the page's own prop is `params`, and a module-level
 * binding of the same name is a shadow every linter flags.
 */
export const declaresParams = (source: string): boolean =>
  exportsOf(source, 'page.tsx').has('paramsSchema');

/** The route files whose exports say something: pages, layouts, route.ts. */
const READS_EXPORTS = new Set(['page', 'layout', 'route']);

/**
 * What each page, layout and route.ts exports, by file. A file that cannot be
 * read exports nothing.
 */
export const readExports = async (
  routesDir: string,
  files: readonly string[],
): Promise<ReadonlyMap<string, ReadonlySet<string>>> =>
  new Map(
    await Promise.all(
      files
        .filter((file) => READS_EXPORTS.has(slotOf(file) ?? ''))
        .map(async (file): Promise<[string, ReadonlySet<string>]> => {
          try {
            return [
              file,
              exportsOf(
                await readFile(path.join(routesDir, file), 'utf8'),
                file,
              ),
            ];
          } catch {
            // 読めないファイルは何も export しないものとして扱う
            return [file, new Set()];
          }
        }),
    ),
  );

/**
 * The pages that export `search` — a url schema of `@k8ordo/state` saying
 * what of the search they read. Only a page: a layout renders under pages
 * that read different searches, or none.
 */
export const pagesReadingSearch = (
  exported: ReadonlyMap<string, ReadonlySet<string>>,
): ReadonlySet<string> =>
  new Set(
    [...exported]
      .filter(([file, names]) => slotOf(file) === 'page' && names.has('search'))
      .map(([file]) => file),
  );

/**
 * The search is read through `@k8ordo/state`'s `urlReader`, which the table
 * imports; an application that does not depend on it cannot build that.
 */
const searchWithoutState = (pages: ReadonlySet<string>): Problem[] =>
  [...pages].map((file) => ({
    path: file,
    message:
      'exports search, which is read through @k8ordo/state — add it to the application’s dependencies',
  }));

/** A route.ts that exports no method answers every request with a 405. */
export const silentRoutes = (
  exported: ReadonlyMap<string, ReadonlySet<string>>,
): Problem[] =>
  [...exported]
    .filter(
      ([file, names]) =>
        slotOf(file) === 'route' &&
        !ROUTE_METHODS.some((method) => names.has(method)),
    )
    .map(([file]) => ({
      path: file,
      message: `exports none of ${ROUTE_METHODS.join(', ')} — a route.ts answers the methods it exports`,
    }));

/** Whether the application's manifest lists `name`. */
const dependsOn = async (root: string, name: string): Promise<boolean> => {
  try {
    const manifest = JSON.parse(
      await readFile(path.join(root, 'package.json'), 'utf8'),
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    // どちらに置くかはアプリの流儀で、意味は変わらない
    return (
      name in (manifest.dependencies ?? {}) ||
      name in (manifest.devDependencies ?? {})
    );
  } catch {
    return false;
  }
};

/** {@link LOCALES_MODULE} of an application that uses `@k8ordo/i18n`. */
export type LocaleSet = {
  /** Absolute path of the module. */
  readonly module: string;
  /**
   * Whether it exports `locales`, read from its syntax as a route file's
   * exports are — what `@k8ordo/i18n`'s `Register` is generated from.
   */
  readonly exportsLocales: boolean;
};

/**
 * Where the application declares its locale set: `null` when it does not
 * depend on `@k8ordo/i18n`, the package does not resolve from the root, or
 * there is no {@link LOCALES_MODULE}.
 */
export const localeSetOf = async (root: string): Promise<LocaleSet | null> => {
  // @k8ordo/ui の peer として hoist された @k8ordo/i18n は、アプリが使って
  // いなくてもルートから解決できる。解決だけでは決めない
  if (!(await dependsOn(root, '@k8ordo/i18n'))) return null;
  const module = path.join(root, LOCALES_MODULE);
  let source: string;
  try {
    // 生成する augmentation はこのパッケージを名指しするので、依存に挙げて
    // いても入っていなければ型チェックがそれ自体をエラーにする。解決できな
    // ければ投げる
    findPackageJSON('@k8ordo/i18n', module);
    source = await readFile(module, 'utf8');
  } catch {
    return null;
  }
  return { module, exportsLocales: exportsOf(source, module).has('locales') };
};

/**
 * Without the generated `Register`, `@k8ordo/i18n` holds a message to no
 * locale set, and nothing else would say so.
 */
const LOCALES_UNEXPORTED = `${LOCALES_MODULE} does not export \`locales\` by name (\`export *\` and a type-only export do not count), so @k8ordo/i18n's Register is not generated and a message missing a locale compiles — export the locale set from it as \`locales\``;

/**
 * Writes what the application would otherwise hand-write: the route table
 * and the type wiring. Nothing here decides anything the grammar has not
 * already decided — problems come back for the caller to report.
 */
export const generate = async (
  options: GenerateOptions,
): Promise<GenerateResult> => {
  const files = await scanRoutes(options.routesDir);
  const parsed = parseRouteTree(files);
  // 文法として正しくても、順序で救えない重なりは残る。ただし文法が拒んだ名前
  // (`(foo` など)は URLPattern にならないので、壊れた木の上で走らせると報告
  // ではなく例外になる。だから文法が通ってからだけ見る。
  const exported = await readExports(options.routesDir, files);
  const withState = await dependsOn(options.root, '@k8ordo/state');
  const withSearch = pagesReadingSearch(exported);
  const problems = [
    ...parsed.problems,
    ...(parsed.problems.length > 0 ? [] : unreachableRoutes(parsed.tree)),
    ...silentRoutes(exported),
    ...(withState ? [] : searchWithoutState(withSearch)),
  ];
  const { tree } = parsed;
  // 壊れた木から作った表を置いていくと、次のビルドがそれを読んで別の失敗を
  // する。報告するものがあるうちは何も書かない。
  if (problems.length > 0) {
    return {
      problems,
      warnings: [],
      routesModule: path.join(options.outDir, 'routes.gen.ts'),
    };
  }

  const toRoutes = importPath(options.outDir, options.routesDir);
  const localeSet = await localeSetOf(options.root);
  const routesSource = emitRoutesModule(tree, {
    importPrefix: toRoutes,
    mode: options.mode,
    withParams: new Set(
      [...exported]
        .filter(([, names]) => names.has('paramsSchema'))
        .map(([file]) => file),
    ),
    withSearch,
  });
  const registerSource = emitRegisterModule({
    routesModule: './routes.gen',
    stateModule: withState ? '@k8ordo/state' : null,
    localesModule:
      localeSet?.exportsLocales === true
        ? importPath(options.outDir, localeSet.module.replace(/\.ts$/u, ''))
        : null,
    mode: options.mode,
  });

  await mkdir(options.outDir, { recursive: true });
  const routesModule = path.join(options.outDir, 'routes.gen.ts');
  await writeIfChanged(routesModule, routesSource);
  // `.ts`, not `.d.ts`: a declaration file's errors are suppressed by
  // `skipLibCheck`, so an application that also hand-wrote the augmentation
  // would silently keep whichever one it liked. This is ordinary source.
  await writeIfChanged(
    path.join(options.outDir, 'register.gen.ts'),
    registerSource,
  );
  await writeIfChanged(
    path.join(options.outDir, '.gitignore'),
    `# Generated by ${FRAMEWORK}.\n*\n`,
  );

  return {
    problems,
    warnings: localeSet?.exportsLocales === false ? [LOCALES_UNEXPORTED] : [],
    routesModule,
  };
};

/** The relative specifier the generated files import `to` by, from `from`. */
const importPath = (from: string, to: string): string => {
  const relative = path.relative(from, to).replaceAll(path.sep, '/');
  return relative.startsWith('.') ? relative : `./${relative}`;
};

/** Rewriting an unchanged file would restart HMR for no reason. */
const writeIfChanged = async (file: string, content: string): Promise<void> => {
  try {
    if ((await readFile(file, 'utf8')) === content) return;
  } catch {
    // 未作成なら書く
  }
  await writeFile(file, content, 'utf8');
};
