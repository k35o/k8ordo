import { cp, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { sharedDir } from '@k8ordo/framework-engine';
import { withBase } from '@k8ordo/router';

import type { Rewrite } from './rewrites';
import type { StaticOutput } from './static';

/** Where the build writes the environments, all absolute. */
export type BuildDirs = {
  readonly client: string;
  readonly rsc: string;
  readonly ssr: string;
};

/** The function every request that names no file is rewritten to. */
const FUNCTION = 'handler';

/**
 * The hashed assets are marked immutable in the `hit` phase — only once a
 * file answered — so a missing one is never cached for a year.
 */
const immutableAssets = (base: string) => ({
  src: `^${RegExp.escape(`${base}assets/`)}`,
  headers: { 'cache-control': 'public, max-age=31536000, immutable' },
  continue: true,
});

/** Files first, and whatever names none goes to the handler. */
const configFor = (base: string) => ({
  version: 3,
  routes: [
    { handle: 'filesystem' },
    { src: '^/.*$', dest: `/${FUNCTION}` },
    { handle: 'hit' },
    immutableAssets(base),
  ],
});

/** A `from` placeholder of `_redirects`: one segment. */
const PLACEHOLDER = /^:[A-Za-z]\w*$/u;

/**
 * A `_redirects` rule as a route of Vercel's: `from` as an anchored regex —
 * a placeholder one segment, every literal run escaped whole, so it starts
 * with `/` rather than with a letter `RegExp.escape` would spell in hex — and
 * a directory target as its `index.html`, since Vercel serves a rewrite's
 * `dest` as the file it names. A page's URL takes a trailing slash, as a
 * directory does; a payload URL does not. Case-sensitive, as the table's
 * matching is.
 */
const routeOf = (rule: Rewrite) => {
  let source = '';
  let literal = '';
  for (const [index, segment] of rule.from.split('/').entries()) {
    const run = index === 0 ? segment : `/${segment}`;
    if (index > 0 && PLACEHOLDER.test(segment)) {
      source += `${RegExp.escape(`${literal}/`)}[^/]+`;
      literal = '';
    } else {
      literal += run;
    }
  }
  source += RegExp.escape(literal);
  const page = !rule.from.endsWith('/index.rsc');
  return {
    src: `^${source}${page ? '/?' : ''}$`,
    dest: rule.to.endsWith('/') ? `${rule.to}index.html` : rule.to,
    caseSensitive: true,
  };
};

/**
 * Files first; only what names none is rewritten — a value the build did
 * not write to its shell, the payload URL of a built URL that is not a page
 * to HTML — and what nothing rewrote is the build's `404.html`.
 */
const staticConfigFor = ({ base, rewrites, notFound }: StaticOutput) => ({
  version: 3,
  routes: [
    { handle: 'filesystem' },
    ...rewrites.map((rule) => routeOf(rule)),
    ...(notFound
      ? [{ src: '^/.*$', dest: withBase('/404.html', base), status: 404 }]
      : []),
    { handle: 'hit' },
    immutableAssets(base),
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
  const shared = sharedDir(dirs.rsc, dirs.ssr);
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

/**
 * A static build laid out as Vercel's Build Output API (v3) reads it: the
 * client build as static files at Vite's `base`, and the rewrites a host
 * applies once no file answered as routes — no function. `_redirects` stays
 * behind: Vercel never reads it, and would serve it as a file.
 */
export const writeStaticVercelOutput = async (
  output: StaticOutput,
): Promise<void> => {
  const dir = path.join(output.root, '.vercel', 'output');
  await rm(dir, { recursive: true, force: true });
  const redirects = path.join(output.client, '_redirects');
  await cp(output.client, path.join(dir, 'static', output.base), {
    recursive: true,
    filter: (source) => source !== redirects,
  });
  await writeFile(path.join(dir, 'config.json'), json(staticConfigFor(output)));
};
