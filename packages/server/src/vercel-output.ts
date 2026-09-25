import { cp, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

/** Where the build writes the environments, all absolute. */
export type BuildDirs = {
  readonly client: string;
  readonly rsc: string;
  readonly ssr: string;
};

/** The function every request that names no file is rewritten to. */
const FUNCTION = 'handler';

/**
 * Files first, and whatever names none goes to the handler. The hashed
 * assets are marked immutable in the `hit` phase — only once a file answered —
 * so a missing one is the handler's 404 and never cached for a year.
 */
const configFor = (base: string) => ({
  version: 3,
  routes: [
    { handle: 'filesystem' },
    { src: '^/.*$', dest: `/${FUNCTION}` },
    { handle: 'hit' },
    {
      src: `^${RegExp.escape(`${base}assets/`)}`,
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      continue: true,
    },
  ],
});

/**
 * A Node.js function that hands Vercel the handler as it is: the launcher
 * calls `fetch` with a `Request` and streams the `Response` back.
 */
const FUNCTION_CONFIG = {
  runtime: 'nodejs24.x',
  handler: 'index.mjs',
  launcherType: 'Nodejs',
  shouldAddHelpers: false,
  supportsResponseStreaming: true,
};

/**
 * `app.js.br` beside `app.js` is a copy compressed for `serve`. Vercel
 * compresses on its own, and every file is one more to upload.
 */
const isCompressedCopy = async (file: string): Promise<boolean> => {
  const original = file.replace(/\.(?:br|gz)$/u, '');
  if (original === file) return false;
  try {
    return (await stat(original)).isFile();
  } catch {
    return false;
  }
};

/** The nearest directory holding both. */
const commonDir = (a: string, b: string): string => {
  let dir = a;
  while (path.relative(dir, b).startsWith('..')) dir = path.dirname(dir);
  return dir;
};

const json = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

/**
 * The build laid out as Vercel's Build Output API (v3) reads it, under
 * `<root>/.vercel/output`: the client build as static files at Vite's `base`,
 * and the request handler as the one function behind them. Only `output/` is
 * replaced — `vercel pull` keeps the project's link and settings beside it.
 */
export const writeVercelOutput = async (
  root: string,
  dirs: BuildDirs,
  base: string,
): Promise<void> => {
  const output = path.join(root, '.vercel', 'output');
  await rm(output, { recursive: true, force: true });

  await cp(dirs.client, path.join(output, 'static', base), {
    recursive: true,
    filter: async (source) => !(await isCompressedCopy(source)),
  });

  // rsc は ssr を相対パスで import するので、2 つの位置関係ごと写す
  const func = path.join(output, 'functions', `${FUNCTION}.func`);
  const shared = commonDir(dirs.rsc, dirs.ssr);
  await Promise.all(
    [dirs.rsc, dirs.ssr].map((dir) =>
      cp(dir, path.join(func, path.relative(shared, dir)), { recursive: true }),
    ),
  );
  const entry = path
    .relative(shared, path.join(dirs.rsc, 'index.js'))
    .split(path.sep)
    .join('/');
  await writeFile(
    path.join(func, 'index.mjs'),
    `import handler from './${entry}';\n\nexport default { fetch: handler };\n`,
  );
  await writeFile(path.join(func, 'package.json'), json({ type: 'module' }));
  await writeFile(path.join(func, '.vc-config.json'), json(FUNCTION_CONFIG));
  await writeFile(path.join(output, 'config.json'), json(configFor(base)));
};
