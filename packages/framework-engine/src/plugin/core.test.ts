import {
  glob,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { createFilter, parseSync } from 'vite';
import type {
  ConfigEnv,
  FilterPattern,
  Plugin,
  ResolvedConfig,
  UserConfig,
} from 'vite';

import { engine } from './core';

const enginePlugin = (): Plugin | undefined =>
  engine({}, { mode: 'static', runtimeDir: '/runtime' })
    .flat()
    .find(
      (each): each is Plugin =>
        typeof each === 'object' &&
        each !== null &&
        'name' in each &&
        each.name === 'k8ordo:engine',
    );

// Vite が解いた設定を、エンジンのプラグインにそのまま渡す
const resolveWith = (base: string): void => {
  const hook = enginePlugin()?.configResolved as
    | ((config: ResolvedConfig) => void)
    | undefined;
  hook?.({ base, root: '/app' } as ResolvedConfig);
};

type Watching = {
  /** Tells the plugin that `file` changed, as vite dev does. */
  readonly changed: (file: string) => Promise<void>;
  /** What the plugin has warned so far. */
  readonly warnings: readonly string[];
};

// vite dev と同じく、root を解いたプラグインにファイルの変更を知らせる
const watching = (root: string): Watching => {
  const plugin = enginePlugin();
  const warnings: string[] = [];
  const configResolved = plugin?.configResolved as
    | ((config: ResolvedConfig) => void)
    | undefined;
  configResolved?.({
    base: '/',
    root,
    logger: {
      error: () => undefined,
      warnOnce: (message: string) => {
        warnings.push(message);
      },
    },
  } as unknown as ResolvedConfig);
  const watchChange = plugin?.watchChange as
    | ((file: string) => Promise<void>)
    | undefined;
  return {
    changed: async (file) => {
      await watchChange?.(file);
    },
    warnings,
  };
};

// routes/ にページが 1 枚あり、@k8ordo/i18n に依存していて root から解決できるアプリ
const appWithI18n = async (): Promise<string> => {
  const root = await mkdtemp(path.join(tmpdir(), 'k8ordo-watch-'));
  await mkdir(path.join(root, 'src/routes'), { recursive: true });
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ dependencies: { '@k8ordo/i18n': '*' } }),
  );
  await writeFile(
    path.join(root, 'src/routes/page.tsx'),
    'export default function Page() { return null; }\n',
  );
  const i18n = path.join(root, 'node_modules/@k8ordo/i18n');
  await mkdir(i18n, { recursive: true });
  await writeFile(
    path.join(i18n, 'package.json'),
    JSON.stringify({ name: '@k8ordo/i18n' }),
  );
  return root;
};

// vite dev のときに、エンジンが client 環境の事前バンドルへ渡す設定
const clientOptimizeDeps = (): { include: string[]; exclude: string[] } => {
  const hook = enginePlugin()?.config as
    | ((config: UserConfig, env: ConfigEnv) => UserConfig)
    | undefined;
  const optimizeDeps = hook?.({}, { command: 'serve', mode: 'development' })
    .environments?.client?.optimizeDeps;
  return {
    include: optimizeDeps?.include ?? [],
    exclude: optimizeDeps?.exclude ?? [],
  };
};

// rsc と ssr で外部に残さないパッケージの指定
const serverNoExternal = (name: 'rsc' | 'ssr'): FilterPattern => {
  const hook = enginePlugin()?.config as
    | ((config: UserConfig, env: ConfigEnv) => UserConfig)
    | undefined;
  return hook?.({}, { command: 'serve', mode: 'development' }).environments?.[
    name
  ]?.resolve?.noExternal as FilterPattern;
};

const packagesDir = path.resolve(import.meta.dirname, '../../..');

// 公開している @k8ordo/* の名前
const publishedPackages = async (): Promise<string[]> => {
  const names: string[] = [];
  for await (const manifest of glob('*/package.json', { cwd: packagesDir })) {
    const { name, private: unpublished } = JSON.parse(
      await readFile(path.join(packagesDir, manifest), 'utf8'),
    ) as { name: string; private?: boolean };
    if (unpublished !== true) names.push(name);
  }
  return names;
};

// RSC プラグインと同じく、先頭の指令で見る。文字列やコメントの中は数えない。
// 型でない再 export の先も拾う。'use client' のモジュールを再 export する入口は、
// 事前バンドルに入るとそのモジュールのコピーをもう 1 つ作る
const readModule = (
  file: string,
  source: string,
): { client: boolean; reexported: string[] } => {
  const { program, module } = parseSync(file, source, {
    sourceType: 'module',
  });
  return {
    client: program.body.some(
      (statement) =>
        statement.type === 'ExpressionStatement' &&
        statement.directive === 'use client',
    ),
    reexported: module.staticExports.flatMap((statement) =>
      statement.entries.flatMap((entry) =>
        entry.isType || entry.moduleRequest === null
          ? []
          : [entry.moduleRequest.value],
      ),
    ),
  };
};

// 公開している @k8ordo/* のうち、'use client' のモジュールを出荷するものと、
// それを再 export するもの
const packagesShippingClientModules = async (): Promise<string[]> => {
  const shipping = new Set<string>();
  const reexportedFrom = new Map<string, ReadonlySet<string>>();
  for await (const manifest of glob('*/package.json', { cwd: packagesDir })) {
    const { name, private: unpublished } = JSON.parse(
      await readFile(path.join(packagesDir, manifest), 'utf8'),
    ) as { name: string; private?: boolean };
    if (unpublished === true) continue;
    const dir = path.join(packagesDir, path.dirname(manifest));
    const from = new Set<string>();
    for await (const file of glob('src/**/*.{ts,tsx}', { cwd: dir })) {
      if (/\.(?:test|stories)\.tsx?$/u.test(file)) continue;
      const { client, reexported } = readModule(
        file,
        await readFile(path.join(dir, file), 'utf8'),
      );
      if (client) shipping.add(name);
      for (const specifier of reexported) from.add(specifier);
    }
    reexportedFrom.set(name, from);
  }
  // 再 export の再 export も同じなので、増えなくなるまで辿る
  for (let grew = true; grew;) {
    grew = false;
    for (const [name, from] of reexportedFrom) {
      if (shipping.has(name)) continue;
      if ([...shipping].some((each) => from.has(each))) {
        shipping.add(name);
        grew = true;
      }
    }
  }
  return [...shipping];
};

describe('the engine plugin', () => {
  it('takes a base that is a path from the root', () => {
    expect(() => {
      resolveWith('/docs/');
    }).not.toThrow();
  });

  it.each(['./', 'https://cdn.example.com/app/', '//cdn.example.com/app/'])(
    'refuses base %s, under which no URL says which page it is',
    (base) => {
      expect(() => {
        resolveWith(base);
      }).toThrow(/base has to be a path from the root/u);
    },
  );

  it('keeps every published package that ships or re-exports a client module out of the browser prebundle', async () => {
    const shipping = await packagesShippingClientModules();
    const { include, exclude } = clientOptimizeDeps();
    expect(exclude.toSorted()).toStrictEqual(shipping.toSorted());
    expect(include.filter((name) => shipping.includes(name))).toStrictEqual([]);
  });

  // router はフレームワークの peer としてだけアプリに入ることがある
  it.each(['rsc', 'ssr'] as const)(
    'bundles every published package into %s, even one the application does not list',
    async (name) => {
      // Vite と同じく、noExternal に当たる名前は外部に残らない
      const external = createFilter(undefined, serverNoExternal(name), {
        resolve: false,
      });
      const kept = (await publishedPackages()).filter((pkg) => external(pkg));
      expect(kept).toStrictEqual([]);
    },
  );
});

describe('the engine plugin under vite dev', () => {
  it('regenerates the register as src/i18n.ts gains and loses its locale set', async () => {
    const root = await appWithI18n();
    try {
      const { changed } = watching(root);
      const i18n = path.join(root, 'src/i18n.ts');
      const register = (): Promise<string> =>
        readFile(path.join(root, '.k8ordo/register.gen.ts'), 'utf8');

      await writeFile(
        i18n,
        "export const locales = defineLocales({ en: { timeZone: 'UTC', dir: 'ltr' } });\n",
      );
      await changed(i18n);
      expect(await register()).toContain("declare module '@k8ordo/i18n' {");

      await writeFile(i18n, 'export const other = 1;\n');
      await changed(i18n);
      expect(await register()).not.toContain('@k8ordo/i18n');

      await writeFile(i18n, "export { locales } from './locales';\n");
      await changed(i18n);
      expect(await register()).toContain("declare module '@k8ordo/i18n' {");

      await rm(i18n);
      await changed(i18n);
      expect(await register()).not.toContain('@k8ordo/i18n');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('warns when src/i18n.ts exports no locale set by name', async () => {
    const root = await appWithI18n();
    try {
      const { changed, warnings } = watching(root);
      const i18n = path.join(root, 'src/i18n.ts');
      await writeFile(i18n, "export * from './locales';\n");
      await changed(i18n);
      expect(warnings).toStrictEqual([
        expect.stringMatching(
          /^k8ordo: src\/i18n\.ts does not export `locales` by name/u,
        ),
      ]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('generates nothing for a change outside routes/ and src/i18n.ts', async () => {
    const root = await appWithI18n();
    try {
      await watching(root).changed(path.join(root, 'src/lib/i18n.ts'));
      await expect(stat(path.join(root, '.k8ordo'))).rejects.toThrow(/ENOENT/u);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
