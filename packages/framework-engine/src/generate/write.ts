import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { parseSync } from 'vite';

import { parseRouteTree } from '../grammar/tree';
import type { Problem } from '../grammar/tree';
import {
  emitRegisterModule,
  emitRoutesModule,
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
  /** The mode package the application installed; the generated files name it. */
  readonly via: string;
};

export type GenerateResult = {
  readonly problems: readonly Problem[];
  /** Absolute path of the generated route table. */
  readonly routesModule: string;
};

/**
 * Whether a route file exports a `paramsSchema`. Read from the module's
 * syntax rather than by importing it — the generator runs before anything
 * is compiled, and an import would evaluate the page. Vite's own parser
 * lists a module's exports the way a person reads the file: `export const
 * paramsSchema`, `export { paramsSchema }`, and a destructured `export
 * const { paramsSchema } = locales` are all the export; the same words
 * inside a string or a comment are not, and `export type paramsSchema` is
 * a type. Named so rather than `params` because the page's own prop is
 * `params`, and a module-level binding of the same name is a shadow every
 * linter flags.
 */
export const declaresParams = (source: string): boolean => {
  // A file that does not parse declares nothing; the build reports the
  // syntax error itself, where it can name the line.
  const { errors, module } = parseSync('route.tsx', source, {
    sourceType: 'module',
  });
  if (errors.length > 0) return false;
  return module.staticExports.some((statement) =>
    statement.entries.some(
      (entry) => !entry.isType && entry.exportName.name === 'paramsSchema',
    ),
  );
};

const filesDeclaringParams = async (
  routesDir: string,
  files: readonly string[],
): Promise<Set<string>> => {
  const found = new Set<string>();
  await Promise.all(
    files
      .filter((file) => /(?:^|\/)(?:page|layout)\.tsx$/u.test(file))
      .map(async (file) => {
        try {
          const source = await readFile(path.join(routesDir, file), 'utf8');
          if (declaresParams(source)) found.add(file);
        } catch {
          // 読めないファイルはスキーマを持たないものとして扱う
        }
      }),
  );
  return found;
};

const dependsOnState = async (root: string): Promise<boolean> => {
  try {
    const manifest = JSON.parse(
      await readFile(path.join(root, 'package.json'), 'utf8'),
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    // どちらに置くかはアプリの流儀で、意味は変わらない
    return (
      '@k8ordo/state' in (manifest.dependencies ?? {}) ||
      '@k8ordo/state' in (manifest.devDependencies ?? {})
    );
  } catch {
    return false;
  }
};

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
  const problems = [
    ...parsed.problems,
    ...(parsed.problems.length > 0 ? [] : unreachableRoutes(parsed.tree)),
  ];
  const { tree } = parsed;
  // 壊れた木から作った表を置いていくと、次のビルドがそれを読んで別の失敗を
  // する。報告するものがあるうちは何も書かない。
  if (problems.length > 0) {
    return {
      problems,
      routesModule: path.join(options.outDir, 'routes.gen.ts'),
    };
  }

  const toRoutes = path
    .relative(options.outDir, options.routesDir)
    .replaceAll(path.sep, '/');
  const routesSource = emitRoutesModule(tree, {
    importPrefix: toRoutes.startsWith('.') ? toRoutes : `./${toRoutes}`,
    via: options.via,
    withParams: await filesDeclaringParams(options.routesDir, files),
  });
  const registerSource = emitRegisterModule({
    routesModule: './routes.gen',
    stateModule: (await dependsOnState(options.root)) ? '@k8ordo/state' : null,
    via: options.via,
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
    `# Generated by ${options.via}.\n*\n`,
  );

  return { problems, routesModule };
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
