import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  clientDepsHeader,
  serverStylesheetsHeader,
} from '@k8ordo/framework-engine';
import type { ClientDeps } from '@k8ordo/framework-engine';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import type { StaticOptions, StaticOutput } from './static';
import { staticMode } from './static';

// プラグインのフックを Vite の代わりに呼ぶ。ビルドの全体は examples/static-basic
// の build.test.ts が見ていて、ここではそこから見えない呼ばれ方だけを扱う
type ResolveId = (
  this: { environment: { mode: 'build' | 'dev' } },
  source: string,
  importer: string | undefined,
) => null;
type Builder = {
  config: {
    plugins: readonly unknown[];
    base?: string;
    publicDir?: string;
    logger?: Logger;
  };
  environments?: Record<
    string,
    { config: { build: { outDir: string; copyPublicDir?: boolean } } }
  >;
};
type BuildApp = (builder: Builder) => Promise<void>;
type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};
type Request = {
  method: string;
  url: string;
  originalUrl?: string;
};
type Middleware = (
  request: Request,
  response: unknown,
  next: (error?: unknown) => void,
) => void;

type PreviewMiddleware = (
  request: { method: string; url: string },
  response: {
    writeHead: (status: number, headers?: Record<string, string>) => unknown;
    end: (body?: Buffer) => void;
  },
  next: (error?: unknown) => void,
) => void;
/** What the preview middleware did: answered itself, or passed on a URL to Vite. */
type Previewed =
  | {
      readonly answered: {
        status: number;
        headers: Record<string, string>;
        body: string;
      };
    }
  | { readonly passed: string };

let root: string;

beforeEach(async () => {
  listed = {};
  asked = 0;
  root = await mkdtemp(path.join(tmpdir(), 'k8ordo-static-'));
  await mkdir(path.join(root, 'src', 'routes'), { recursive: true });
  await writeFile(
    path.join(root, 'src', 'routes', 'page.tsx'),
    'export default function Page() { return null; }\n',
  );
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

/** What each paths.ts of the test's application returns, or throws. */
let listed: Record<string, readonly string[] | Error> = {};
/** How many times `vite dev` asked a paths.ts for its values. */
let asked = 0;

/**
 * Gives the application paths.ts files returning these values: the files
 * themselves, for the grammar to find, and what they return — read by the
 * handler the build imports (`pathValues`) and by `vite dev`'s runner.
 */
const listing = async (
  values: Record<string, readonly string[] | Error>,
): Promise<void> => {
  listed = values;
  await routeFiles(Object.keys(values));
  await writeFile(
    path.join(root, 'listed.json'),
    JSON.stringify(
      Object.fromEntries(
        Object.entries(values).filter(([, value]) => Array.isArray(value)),
      ),
    ),
  );
};

/** The one paths.ts most tests need: `/posts/1`. */
const POST_1 = { 'posts/[id]/paths.ts': ['1'] };

const routeFiles = async (files: readonly string[]): Promise<void> => {
  await Promise.all(
    files.map(async (file) => {
      const at = path.join(root, 'src', 'routes', file);
      await mkdir(path.dirname(at), { recursive: true });
      await writeFile(at, 'export default function Route() { return null; }\n');
    }),
  );
};

const recordingLogger = () => {
  const said = {
    info: [] as string[],
    warn: [] as string[],
    error: [] as string[],
  };
  const logger: Logger = {
    info: (message) => {
      said.info.push(message);
    },
    warn: (message) => {
      said.warn.push(message);
    },
    error: (message) => {
      said.error.push(message);
    },
  };
  return { logger, said };
};

const hooks = (
  options: Omit<StaticOptions, 'mode'> = {},
  resolvedBase = '/',
) => {
  const plugin = staticMode({ mode: 'static', ...options }).find(
    ({ name }) => name === 'k8ordo:static',
  );
  if (plugin === undefined) throw new Error('no k8ordo:static plugin');
  const { logger, said } = recordingLogger();
  (
    plugin.configResolved as unknown as (config: {
      root: string;
      plugins: [];
      base: string;
      logger: Logger;
    }) => void
  )({ root, plugins: [], base: resolvedBase, logger });
  const resolveId = (plugin.resolveId as unknown as { handler: ResolveId })
    .handler;
  const buildApp = (plugin.buildApp as unknown as { handler: BuildApp })
    .handler;
  const configureServer = (
    plugin.configureServer as unknown as {
      handler: (server: {
        middlewares: { use: (middleware: Middleware) => void };
        environments: {
          rsc: { runner: { import: (file: string) => Promise<unknown> } };
        };
      }) => () => void;
    }
  ).handler;
  const watchChange = plugin.watchChange as unknown as (file: string) => void;
  const configurePreviewServer =
    plugin.configurePreviewServer as unknown as (server: {
      config: {
        root: string;
        base: string;
        environments: Record<string, { build: { outDir: string } }>;
      };
      middlewares: { use: (middleware: PreviewMiddleware) => void };
    }) => Promise<void>;
  return {
    said,
    resolveFrom: (importer: string) =>
      resolveId.call(
        { environment: { mode: 'build' } },
        '@k8ordo/framework/server',
        importer,
      ),
    build: (plugins: readonly unknown[] = []) =>
      buildApp({
        config: {
          plugins,
          base: '/',
          publicDir: path.join(root, 'public'),
          logger,
        },
        environments: {
          rsc: { config: { build: { outDir: 'dist/rsc' } } },
          client: {
            config: { build: { outDir: 'dist/client', copyPublicDir: true } },
          },
        },
      }),
    serve: () => {
      let installed: Middleware | undefined;
      const install = configureServer({
        middlewares: {
          use: (middleware) => {
            installed = middleware;
          },
        },
        // RSC の環境の runner の代わり。paths.ts を読むと、テストが決めた値を返す
        environments: {
          rsc: {
            runner: {
              import: (file) => {
                const values =
                  listed[
                    path
                      .relative(path.join(root, 'src', 'routes'), file)
                      .split(path.sep)
                      .join('/')
                  ];
                return Promise.resolve({
                  default: () => {
                    asked += 1;
                    if (values instanceof Error) throw values;
                    return values;
                  },
                });
              },
            },
          },
        },
      });
      install();
      if (installed === undefined) throw new Error('no middleware installed');
      const middleware = installed;
      return (url: string): Promise<string> =>
        new Promise((resolve, reject) => {
          const request: Request = { method: 'GET', url, originalUrl: url };
          let status = 0;
          const response = {
            writeHead(code: number) {
              status = code;
              return response;
            },
            end() {
              resolve(`answered ${String(status)}`);
            },
          };
          middleware(request, response, (error) => {
            if (error === undefined) resolve(request.originalUrl ?? '');
            else
              reject(
                error instanceof Error
                  ? error
                  : new Error('the middleware passed on a non-error'),
              );
          });
        });
    },
    watchChange: (file: string) => {
      watchChange(path.join(root, 'src', 'routes', file));
    },
    preview: async (base = '/') => {
      let installed: PreviewMiddleware | undefined;
      await configurePreviewServer({
        config: {
          root,
          base,
          environments: { client: { build: { outDir: 'dist/client' } } },
        },
        middlewares: {
          use: (middleware) => {
            installed = middleware;
          },
        },
      });
      if (installed === undefined) throw new Error('no middleware installed');
      const middleware = installed;
      return (url: string, method = 'GET'): Promise<Previewed> =>
        new Promise((resolve, reject) => {
          const request = { method, url };
          let status = 0;
          let headers: Record<string, string> = {};
          const response = {
            writeHead(code: number, given: Record<string, string> = {}) {
              status = code;
              headers = given;
              return response;
            },
            end(body?: Buffer) {
              resolve({
                answered: { status, headers, body: body?.toString() ?? '' },
              });
            },
          };
          middleware(request, response, (error) => {
            if (error === undefined) resolve({ passed: request.url });
            else
              reject(
                error instanceof Error
                  ? error
                  : new Error('the middleware passed on a non-error'),
              );
          });
        });
    },
  };
};

describe('the build’s refusal of the request API', () => {
  it('names the module that imports it, and not the index.html the RSC plugin resolves an installed package from again', async () => {
    const { resolveFrom, build: finish } = hooks();
    resolveFrom(path.join(root, 'src', 'routes', 'page.tsx'));
    // @vitejs/plugin-rsc は node_modules に解決した bare import を、
    // <root>/index.html からもう一度解決して同じパッケージかを確かめる
    resolveFrom(path.join(root, 'index.html'));

    // paths.ts を読むために、断る前にビルドされたハンドラを読む
    await handlerAnswering({});

    await expect(finish()).rejects.toThrow(
      "static build cannot answer a request — a file is written once for every visitor, and these import @k8ordo/framework/server:\n  src/routes/page.tsx\nthis application wants mode: 'server'",
    );
  });
});

type Answer = {
  readonly status?: number;
  readonly headers?: Record<string, string>;
  readonly body?: string;
};

/**
 * The handler a build would have compiled, written as the module the static
 * build imports: it answers each pathname as told, and anything else as
 * `'*'` is told, or 404.
 */
const handlerAnswering = async (
  answers: Record<string, Answer>,
): Promise<void> => {
  const dir = path.join(root, 'dist', 'rsc');
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, 'index.js'),
    `const answers = ${JSON.stringify(answers)};
export const pathValues = async (file) =>
  JSON.parse(
    await (await import('node:fs/promises')).readFile(
      new URL('../../listed.json', import.meta.url),
      'utf8',
    ),
  )[file];
export default async function handler(request) {
  const { pathname } = new URL(request.url);
  const answer = answers[pathname] ?? answers['*'];
  if (answer === undefined) return new Response('not found', { status: 404 });
  return new Response(answer.body ?? null, {
    status: answer.status ?? 200,
    headers: answer.headers ?? {},
  });
}
`,
  );
  await mkdir(path.join(root, 'dist', 'client'), { recursive: true });
};

const SHELL_HEADER = { 'x-k8ordo-shell': '/posts/:id' };

const POSTS = ['posts/[id]/page.tsx', 'posts/[id]/fallback.tsx'];

const site = (extra: Record<string, Answer> = {}): Record<string, Answer> => ({
  '/': { body: '<p>home</p>' },
  '/index.rsc': { body: 'home payload' },
  '/posts/1': { body: '<p>post 1</p>' },
  '/posts/1/index.rsc': { body: 'post 1 payload' },
  '/posts/!fallback': { headers: SHELL_HEADER, body: '<p>shell</p>' },
  '/posts/!fallback/index.rsc': {
    headers: SHELL_HEADER,
    body: 'shell payload',
  },
  ...extra,
});

const clientFile = (file: string): Promise<string> =>
  readFile(path.join(root, 'dist', 'client', file), 'utf8');

const TAKEN =
  'static build writes a route.ts as the file its GET answers, and these cannot be written — remove the route.ts, or what else is written there:';

describe('the shells a build writes', () => {
  it('writes each shell’s HTML and payload under its shell pathname, and leaves it out of the sitemap', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(site());
    await listing(POST_1);
    const { build, said } = hooks({ site: 'https://example.com' });

    await build();

    expect(await clientFile('posts/!fallback/index.html')).toBe('<p>shell</p>');
    expect(await clientFile('posts/!fallback/index.rsc')).toBe('shell payload');
    expect(await clientFile('sitemap.xml')).not.toContain('fallback');
    expect(said.info).toStrictEqual([
      'k8ordo: wrote 2 routes, 1 shell (/posts/:id) and sitemap.xml and _redirects',
    ]);
  });

  it('refuses a shell a params schema refused', async () => {
    await routeFiles(POSTS);
    const answers = site();
    delete answers['/posts/!fallback'];
    await handlerAnswering(answers);

    await expect(hooks().build()).rejects.toThrow(
      'the shells stand where a params schema refuses the values above them: /posts/:id',
    );
  });

  it('refuses a shell that called notFound() while it rendered', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({
        '/posts/!fallback': {
          status: 404,
          headers: { 'x-k8ordo-not-found': 'page' },
        },
      }),
    );

    await expect(hooks().build()).rejects.toThrow(
      'the shell for /posts/:id called notFound() while it rendered, and a shell has no value to disown — call notFound() from the client component that reads the value in the browser',
    );
  });

  it('stops the build naming a shell that failed to render, and writes nothing for it', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({ '/posts/!fallback': { status: 500, body: 'the shell threw' } }),
    );
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {
      // 描けなかったことは throw の文言で確かめる
    });

    await expect(hooks().build()).rejects.toThrow(
      'static build could not render /posts/:id — see the error above',
    );
    expect(logged).toHaveBeenCalledWith(
      'k8ordo: http://k8ordo.localhost/posts/!fallback — the shell threw',
    );
    await expect(clientFile('posts/!fallback/index.html')).rejects.toThrow(
      /ENOENT/u,
    );
  });

  it('stops the build naming a page and a shell whose payload failed to render, which the HTML did not', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({
        '/posts/1/index.rsc': { status: 500, body: 'the payload threw' },
        '/posts/!fallback/index.rsc': {
          status: 500,
          headers: SHELL_HEADER,
          body: 'the shell’s payload threw',
        },
      }),
    );
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {
      // 描けなかったことは throw の文言で確かめる
    });

    await listing(POST_1);
    await expect(hooks().build()).rejects.toThrow(
      'static build could not render /posts/1, /posts/:id — see the error above',
    );
    expect(logged).toHaveBeenCalledWith(
      'k8ordo: http://k8ordo.localhost/posts/1/index.rsc — the payload threw',
    );
  });

  it('refuses a shell another route answered, and writes nothing for it', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({ '/posts/!fallback': { body: '<p>page</p>' } }),
    );

    await expect(hooks().build()).rejects.toThrow(
      'the shell for /posts/:id (posts/[id]/fallback.tsx) was answered by another route, which took "!fallback" as a value',
    );
    await expect(clientFile('posts/!fallback/index.html')).rejects.toThrow(
      /ENOENT/u,
    );
  });

  it('refuses a shell another pattern’s fallback.tsx answered, naming it', async () => {
    await routeFiles([...POSTS, '[a]/[b]/page.tsx', '[a]/[b]/fallback.tsx']);
    await handlerAnswering(
      site({
        '/posts/!fallback': {
          headers: { 'x-k8ordo-shell': '/:a/:b' },
          body: '<p>other</p>',
        },
        '/!fallback/!fallback': {
          headers: { 'x-k8ordo-shell': '/:a/:b' },
          body: '<p>ab</p>',
        },
        '/!fallback/!fallback/index.rsc': {
          headers: { 'x-k8ordo-shell': '/:a/:b' },
        },
      }),
    );

    await expect(hooks().build()).rejects.toThrow(
      'the shell for /posts/:id (posts/[id]/fallback.tsx) was answered by [a]/[b]/fallback.tsx, which the table tries first — put the shell where that pattern cannot match, with a paths.ts above it',
    );
  });

  it('refuses a route.ts whose file a shell would be written below', async () => {
    await routeFiles([...POSTS, 'posts/route.ts']);
    await handlerAnswering(site());

    await expect(hooks().build()).rejects.toThrow(
      `${TAKEN}\n  posts: src/routes/posts/route.ts, and /posts/!fallback is written below it`,
    );
  });

  it('warns about a shell whose HTML outside its scripts holds the shell pathname', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({
        '/posts/!fallback': {
          headers: SHELL_HEADER,
          body: '<link rel="canonical" href="/posts/!fallback"><script>"/posts/!fallback"</script>',
        },
      }),
    );
    const { build, said } = hooks();

    await build();

    expect(said.warn).toContain(
      'k8ordo: the shell for /posts/:id has "!fallback" in its HTML — a layout wrote the shell\'s pathname into the page (a link, a canonical URL); derive what depends on the URL in a client component',
    );
  });

  it('says nothing of the shell pathname inside a script, where the payload carries it', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({
        '/posts/!fallback': {
          headers: SHELL_HEADER,
          body: '<p>shell</p><script>self.__FLIGHT_DATA.push("/posts/!fallback")</script>',
        },
      }),
    );
    const { build, said } = hooks();

    await build();

    expect(said.warn).toStrictEqual([]);
  });

  it('says nothing of the shell pathname inside a script tagged in another case, with whitespace before its end tag’s `>`', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({
        '/posts/!fallback': {
          headers: SHELL_HEADER,
          body: '<SCRIPT>"/posts/!fallback"</Script\n><p>shell</p>',
        },
      }),
    );
    const { build, said } = hooks();

    await build();

    expect(said.warn).toStrictEqual([]);
  });

  it('warns about the shell pathname between two scripts, after an end tag spelled `</script >`', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({
        '/posts/!fallback': {
          headers: SHELL_HEADER,
          body: '<script>a</script ><a href="/posts/!fallback">post</a><script>b</script>',
        },
      }),
    );
    const { build, said } = hooks();

    await build();

    expect(said.warn).toStrictEqual([
      'k8ordo: the shell for /posts/:id has "!fallback" in its HTML — a layout wrote the shell\'s pathname into the page (a link, a canonical URL); derive what depends on the URL in a client component',
    ]);
  });
});

const home = (extra: Record<string, Answer> = {}): Record<string, Answer> => ({
  '/': { body: '<p>home</p>' },
  '/index.rsc': { body: 'home payload' },
  ...extra,
});

describe('a route.ts at a file the build writes itself', () => {
  describe('異常系', () => {
    it('stops before writing anything, naming the route.ts and the "site" option, when both write sitemap.xml', async () => {
      await routeFiles(['sitemap.xml/route.ts']);
      await handlerAnswering(
        home({ '/sitemap.xml': { body: '<urlset>own</urlset>' } }),
      );

      await expect(
        hooks({ site: 'https://example.com' }).build(),
      ).rejects.toThrow(
        `${TAKEN}\n  sitemap.xml: src/routes/sitemap.xml/route.ts, and the "site" option writes it`,
      );
      await expect(clientFile('sitemap.xml')).rejects.toThrow(/ENOENT/u);
      await expect(clientFile('index.html')).rejects.toThrow(/ENOENT/u);
    });

    it('names a route.ts paths gave 404.html beside a not-found.tsx, and one at _redirects beside a fallback.tsx, in one error', async () => {
      await routeFiles([
        ...POSTS,
        'not-found.tsx',
        '[file]/route.ts',
        '_redirects/route.ts',
      ]);
      await handlerAnswering(site());

      await listing({ ...POST_1, '[file]/paths.ts': ['404.html'] });
      await expect(hooks().build()).rejects.toThrow(
        `${TAKEN}\n  404.html: src/routes/[file]/route.ts, and src/routes/not-found.tsx is written there\n  _redirects: src/routes/_redirects/route.ts, and the shells of src/routes/posts/[id]/fallback.tsx are reached through it — rules of your own go in public/_redirects, which the build adds to its own`,
      );
    });

    it('names in one error a route.ts at /, one with a page below it and one at a file the build writes', async () => {
      await rm(path.join(root, 'src', 'routes', 'page.tsx'));
      await routeFiles([
        'route.ts',
        'feed/route.ts',
        'feed/latest/page.tsx',
        'sitemap.xml/route.ts',
      ]);
      await handlerAnswering({});

      await expect(
        hooks({ site: 'https://example.com' }).build(),
      ).rejects.toThrow(
        `${TAKEN}\n  /: src/routes/route.ts, and a static host serves / from index.html\n  feed: src/routes/feed/route.ts, and /feed/latest is written below it\n  sitemap.xml: src/routes/sitemap.xml/route.ts, and the "site" option writes it`,
      );
    });

    it('names a route.ts at a page’s HTML or payload, or at a redirect’s HTML, with the page or the redirect', async () => {
      await routeFiles([
        'index.html/route.ts',
        'about/page.tsx',
        'about/index.rsc/route.ts',
        'old/redirect.ts',
        'old/index.html/route.ts',
      ]);
      await handlerAnswering(home());

      await expect(hooks().build()).rejects.toThrow(
        `${TAKEN}\n  about/index.rsc: src/routes/about/index.rsc/route.ts, and src/routes/about/page.tsx is written there\n  index.html: src/routes/index.html/route.ts, and src/routes/page.tsx is written there\n  old/index.html: src/routes/old/index.html/route.ts, and src/routes/old/redirect.ts is written there`,
      );
    });

    it('names a route.ts at client-files.json, where the build lists what each page loads beyond its payload', async () => {
      await routeFiles(['client-files.json/route.ts']);
      await handlerAnswering(home({ '/client-files.json': { body: '{}' } }));

      await expect(hooks().build()).rejects.toThrow(
        `${TAKEN}\n  client-files.json: src/routes/client-files.json/route.ts, and the build lists there what each page loads beyond its payload`,
      );
    });
  });

  describe('正常系', () => {
    it('writes a route.ts at sitemap.xml as its own file when no "site" is given', async () => {
      await routeFiles(['sitemap.xml/route.ts']);
      await handlerAnswering(
        home({ '/sitemap.xml': { body: '<urlset>own</urlset>' } }),
      );
      const { build, said } = hooks();

      await build();

      expect(await clientFile('sitemap.xml')).toBe('<urlset>own</urlset>');
      expect(said.info).toStrictEqual(['k8ordo: wrote 2 routes']);
    });

    it('writes its sitemap beside a route.ts that writes another file', async () => {
      await routeFiles(['feed.xml/route.ts']);
      await handlerAnswering(home({ '/feed.xml': { body: '<rss/>' } }));
      const { build, said } = hooks({ site: 'https://example.com' });

      await build();

      expect(await clientFile('sitemap.xml')).toBe(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.com/</loc></url>\n</urlset>\n',
      );
      expect(await clientFile('feed.xml')).toBe('<rss/>');
      expect(said.info).toStrictEqual([
        'k8ordo: wrote 2 routes and sitemap.xml',
      ]);
    });
  });
});

const ICON = {
  js: ['/assets/icon-A1.js'],
  css: [],
};
const CARD = {
  js: ['/assets/card-B2.js'],
  css: ['/assets/card-C3.css'],
};

/** A page's HTML as the handler answers it, saying what its payload names. */
const htmlNaming = (
  named: readonly ClientDeps[],
  links: readonly string[],
  extra: Answer = {},
): Answer => ({
  status: extra.status,
  headers: {
    'x-k8ordo-nonce': 'bm9uY2U=',
    'x-k8ordo-client-deps': clientDepsHeader(named),
    ...extra.headers,
  },
  body: `<!DOCTYPE html><html><head>${links.map((href) => (href.endsWith('.css') ? `<link rel="stylesheet" href="${href}"/>` : `<link rel="modulepreload" href="${href}"/>`)).join('')}</head><body></body></html>`,
});

describe('the client files a build lists', () => {
  it('lists what each page’s client components need beyond what every document links, by the payload’s path as a browser spells it', async () => {
    await routeFiles(['über/page.tsx', 'not-found.tsx']);
    await handlerAnswering({
      '/': htmlNaming([ICON], ['/assets/icon-A1.js']),
      '/index.rsc': { body: 'home payload' },
      '/%C3%BCber': htmlNaming(
        [ICON, CARD],
        ['/assets/icon-A1.js', '/assets/card-B2.js', '/assets/card-C3.css'],
      ),
      '/%C3%BCber/index.rsc': { body: 'über payload' },
      '*': htmlNaming([ICON], ['/assets/icon-A1.js'], { status: 404 }),
    });

    await hooks().build();

    expect(JSON.parse(await clientFile('client-files.json'))).toStrictEqual({
      files: ['/assets/card-B2.js', '/assets/card-C3.css'],
      pages: { '/%C3%BCber/index.rsc': [0, 1] },
    });
  });

  it('lists the stylesheets a page’s Server Components link beside its client components’ files, leaving out what every document links', async () => {
    const linking = (stylesheets: readonly string[]): Answer => ({
      headers: {
        'x-k8ordo-server-stylesheets': serverStylesheetsHeader(stylesheets),
      },
    });
    await routeFiles(['about/page.tsx']);
    await handlerAnswering({
      '/': htmlNaming(
        [ICON],
        ['/assets/icon-A1.js'],
        linking(['/assets/layout-D4.css']),
      ),
      '/index.rsc': { body: 'home payload' },
      '/about': htmlNaming(
        [CARD],
        ['/assets/card-B2.js', '/assets/card-C3.css'],
        linking(['/assets/layout-D4.css', '/assets/about-E5.css']),
      ),
      '/about/index.rsc': { body: 'about payload' },
    });

    await hooks().build();

    expect(JSON.parse(await clientFile('client-files.json'))).toStrictEqual({
      files: [
        '/assets/about-E5.css',
        '/assets/card-B2.js',
        '/assets/card-C3.css',
        '/assets/icon-A1.js',
      ],
      pages: { '/about/index.rsc': [0, 1, 2], '/index.rsc': [3] },
    });
  });

  it('lists each page under the base', async () => {
    await handlerAnswering({
      '/site/': htmlNaming(
        [CARD],
        ['/assets/card-B2.js', '/assets/card-C3.css'],
      ),
      '/site/index.rsc': { body: 'home payload' },
      '/site/about': htmlNaming([ICON], ['/assets/icon-A1.js']),
      '/site/about/index.rsc': { body: 'about payload' },
    });
    await routeFiles(['about/page.tsx']);

    await hooks({}, '/site/').build();

    expect(
      Object.keys(
        (
          JSON.parse(await clientFile('client-files.json')) as {
            pages: Record<string, unknown>;
          }
        ).pages,
      ),
    ).toStrictEqual(['/site/about/index.rsc', '/site/index.rsc']);
  });
});

describe('the _headers a build writes', () => {
  const HEADERS = { 'X-Content-Type-Options': 'nosniff' };

  it('puts the declared headers ahead of the application’s own rules from public/, once however often the build runs', async () => {
    await routeFiles(['page.tsx']);
    await handlerAnswering(site());
    await mkdir(path.join(root, 'public'), { recursive: true });
    await writeFile(
      path.join(root, 'public', '_headers'),
      '/feed\n  Cache-Control: max-age=600\n',
    );
    const { build } = hooks({ headers: HEADERS });

    await build();
    // emptyOutDir: false のビルドは、前のビルドが重ねたファイルを残している
    await build();

    expect(await clientFile('_headers')).toBe(
      [
        '# @k8ordo/framework: the headers framework() declared for every response',
        '/*',
        '  X-Content-Type-Options: nosniff',
        '',
        '/feed',
        '  Cache-Control: max-age=600',
        '',
      ].join('\n'),
    );
  });

  it('writes none where no header is declared, leaving public/_headers as Vite copied it', async () => {
    await routeFiles(['page.tsx']);
    await handlerAnswering(site());

    await hooks().build();

    await expect(clientFile('_headers')).rejects.toThrow('ENOENT');
  });
});

describe('the _redirects a build writes', () => {
  it('merges the application’s own rules from public/, once however often the build runs', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(site());
    await mkdir(path.join(root, 'public'), { recursive: true });
    await writeFile(path.join(root, 'public', '_redirects'), '/old /new 301\n');
    // Vite が public/ を client/ に写すのと同じ
    await writeFile(
      path.join(root, 'dist', 'client', '_redirects'),
      '/old /new 301\n',
    );
    await listing(POST_1);
    const { build } = hooks();

    await build();
    // emptyOutDir: false のビルドは、前のビルドが重ねたファイルを残している
    await build();

    expect(await clientFile('_redirects')).toBe(
      [
        '# @k8ordo/framework: built URLs the rules below would also catch',
        '/posts/1 /posts/1 200',
        '/posts/1/index.rsc /posts/1/index.rsc 200',
        '/old /new 301',
        "# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell",
        '/posts/:p1 /posts/!fallback/ 200',
        '/posts/:p1/index.rsc /posts/!fallback/index.rsc 200',
        '',
      ].join('\n'),
    );
  });

  it('stops when public/_redirects is there and cannot be read, rather than writing one without its rules', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(site());
    await mkdir(path.join(root, 'public', '_redirects'), { recursive: true });
    await listing(POST_1);
    const { build } = hooks();

    await expect(build()).rejects.toThrow(/EISDIR/u);
  });

  it('warns about a rule of the application’s own that hides a shell', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(site());
    await mkdir(path.join(root, 'public'), { recursive: true });
    await writeFile(
      path.join(root, 'public', '_redirects'),
      '/* /index.html 200\n',
    );
    const { build, said } = hooks();

    await build();

    expect(said.warn).toContain(
      'k8ordo: public/_redirects line "/* /index.html 200" matches /posts/:id before its shell\'s rule, so that shell is never served',
    );
  });

  it('warns about a built value _redirects cannot list, which a shell answers on Cloudflare', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(
      site({
        '/posts/a%3Ab': { body: '<p>a:b</p>' },
        '/posts/a%3Ab/index.rsc': { body: 'a:b payload' },
        '/posts/a%2Ab': { body: '<p>a*b</p>' },
        '/posts/a%2Ab/index.rsc': { body: 'a*b payload' },
      }),
    );
    await listing({ 'posts/[id]/paths.ts': ['a:b', 'a*b'] });
    const { build, said } = hooks();

    await build();

    expect(said.warn).toStrictEqual([
      'k8ordo: _redirects cannot list /posts/a*b — Cloudflare and Netlify read "*" as a splat, so on Cloudflare a shell answers it',
      'k8ordo: _redirects cannot list /posts/a*b/index.rsc — Cloudflare and Netlify read "*" as a splat, so on Cloudflare a shell answers it',
      'k8ordo: _redirects cannot list /posts/a:b — Cloudflare and Netlify read ":b" as a placeholder, so on Cloudflare a shell answers it',
      'k8ordo: _redirects cannot list /posts/a:b/index.rsc — Cloudflare and Netlify read ":b" as a placeholder, so on Cloudflare a shell answers it',
    ]);
  });

  it('warns once _redirects holds more rules than Cloudflare reads, and not at its limits', async () => {
    // 書き出したページの 2 行と殻の 2 行に、アプリの規則を足して数をそろえる
    const ownRules = async (fixed: number, placeholders: number) => {
      await mkdir(path.join(root, 'public'), { recursive: true });
      await writeFile(
        path.join(root, 'public', '_redirects'),
        [
          ...Array.from(
            { length: fixed },
            (_, at) => `/old/${String(at)} /new 301`,
          ),
          ...Array.from(
            { length: placeholders },
            (_, at) => `/old/:slug/${String(at)} /new/:slug 301`,
          ),
          '',
        ].join('\n'),
      );
    };
    await routeFiles(POSTS);
    await handlerAnswering(site());
    await listing(POST_1);
    const { build, said } = hooks();

    await ownRules(1998, 98);
    await build();
    expect(said.warn).toStrictEqual([]);

    await ownRules(1999, 99);
    await build();
    expect(said.warn).toStrictEqual([
      'k8ordo: _redirects has 2001 rules Cloudflare counts as static; it reads 2,000 and skips the rest, so a built page past them is answered by its shell there',
      'k8ordo: _redirects has 101 rules Cloudflare counts as dynamic; it reads 100 and ignores the rest of the file — the shell payload rules go first (navigations to those values become document loads), then document rules (those values 404)',
    ]);
  });

  it('writes none for a site without shells', async () => {
    await routeFiles(['posts/[id]/page.tsx']);
    await handlerAnswering(site());
    await listing(POST_1);
    const { build, said } = hooks();

    await build();

    await expect(clientFile('_redirects')).rejects.toThrow(/ENOENT/u);
    expect(said.info).toStrictEqual(['k8ordo: wrote 2 routes']);
  });
});

/** A host adapter's plugin, keeping what the build handed it. */
const adapter = () => {
  const handed: StaticOutput[] = [];
  return {
    handed,
    plugin: {
      name: 'adapter',
      api: {
        writeStatic: (output: StaticOutput) => {
          handed.push(output);
        },
      },
    },
  };
};

describe('a build with a host adapter', () => {
  it('hands it the rewrites after the files and whether 404.html was written, and says nothing of how Cloudflare reads _redirects', async () => {
    await routeFiles([...POSTS, 'posts/old/redirect.ts']);
    await handlerAnswering(
      site({
        '/posts/old': { status: 308, headers: { location: '/posts/1' } },
        '/posts/a%3Ab': { body: '<p>a:b</p>' },
        '/posts/a%3Ab/index.rsc': { body: 'a:b payload' },
      }),
    );
    const { handed, plugin } = adapter();
    await listing({ 'posts/[id]/paths.ts': ['1', 'a:b'] });
    const { build, said } = hooks();

    await build([plugin]);

    expect(handed).toStrictEqual([
      {
        rewrites: [
          { from: '/posts/old/index.rsc', to: '/posts/!fallback/' },
          { from: '/posts/:p1', to: '/posts/!fallback/' },
          { from: '/posts/:p1/index.rsc', to: '/posts/!fallback/index.rsc' },
        ],
        notFound: false,
        types: new Map(),
      },
    ]);
    expect(await clientFile('_redirects')).toContain('/posts/:p1');
    expect(said.warn).toStrictEqual([]);
  });

  it('hands it the type each route.ts’s GET answered, by the file it wrote', async () => {
    await routeFiles([
      'feed/route.ts',
      'notes.txt/route.ts',
      'raw/route.ts',
      'docs/[slug]/article.md/route.ts',
    ]);
    await handlerAnswering({
      '/': { body: '<p>home</p>' },
      '/index.rsc': { body: 'home payload' },
      '/feed': {
        headers: { 'content-type': 'application/rss+xml;charset=utf-8' },
        body: '<rss/>',
      },
      // 文字列の本文には Response が text/plain を付ける
      '/notes.txt': { body: 'notes' },
      // 本文の無い Response は型を持たない
      '/raw': {},
      '/docs/a%20b/article.md': {
        headers: { 'content-type': 'text/markdown; charset=utf-8' },
        body: '# a b',
      },
    });
    const { handed, plugin } = adapter();
    await listing({ 'docs/[slug]/paths.ts': ['a b'] });
    const { build } = hooks();

    await build([plugin]);

    expect(handed.map((output) => output.types)).toStrictEqual([
      new Map([
        ['feed', 'application/rss+xml;charset=utf-8'],
        ['notes.txt', 'text/plain;charset=UTF-8'],
        ['docs/a b/article.md', 'text/markdown; charset=utf-8'],
      ]),
    ]);
  });
});

describe('vite dev', () => {
  it('asks no paths.ts for a URL no parameter could answer', async () => {
    await routeFiles([...POSTS, 'about/page.tsx']);
    await listing(POST_1);
    const request = hooks().serve();

    expect(await request('/favicon.ico')).toBe('/favicon.ico');
    expect(await request('/about')).toBe('/about');
    expect(asked).toBe(0);
  });

  it('leaves a URL a literal declared first answers to its page', async () => {
    await routeFiles(['posts/[id]/page.tsx', 'posts/new/page.tsx']);
    await listing(POST_1);
    const request = hooks().serve();

    expect(await request('/posts/new')).toBe('/posts/new');
    expect(asked).toBe(0);
  });

  it('answers a value no paths.ts returns with its shell, and one returned with the page', async () => {
    await routeFiles(POSTS);
    await listing(POST_1);
    const { serve, said } = hooks();
    const request = serve();

    expect(await request('/posts/3?from=x')).toBe('/posts/!fallback?from=x');
    expect(await request('/posts/3/index.rsc')).toBe(
      '/posts/!fallback/index.rsc',
    );
    expect(await request('/posts/1')).toBe('/posts/1');
    expect(await request('/posts/!fallback')).toBe('/posts/!fallback');
    expect(said.info).toStrictEqual([
      "k8ordo: no paths.ts returns /posts/3, so vite dev answers it with posts/[id]/fallback.tsx's shell, as the build's host will",
    ]);
  });

  it('answers under the base, and hands on the shell’s URL with the base put back', async () => {
    await routeFiles(POSTS);
    await listing(POST_1);
    const { serve } = hooks({}, '/site/');
    const request = serve();

    expect(await request('/site/posts/3?from=x')).toBe(
      '/site/posts/!fallback?from=x',
    );
    expect(await request('/site/posts/3/index.rsc')).toBe(
      '/site/posts/!fallback/index.rsc',
    );
    expect(await request('/site/posts/1')).toBe('/site/posts/1');
    expect(await request('/posts/3')).toBe('/posts/3');
  });

  it('answers a value no paths.ts returns, of a page with no fallback.tsx, as a host without the file would: the not-found for a document, a 404 for a payload', async () => {
    await routeFiles(['posts/[id]/page.tsx', 'not-found.tsx']);
    await listing(POST_1);
    const { serve, said } = hooks();
    const request = serve();

    expect(await request('/posts/3?from=x')).toBe(
      '/__k8ordo-not-found__/__k8ordo-not-found__/__k8ordo-not-found__?from=x',
    );
    expect(await request('/posts/3/index.rsc')).toBe('answered 404');
    expect(await request('/posts/1')).toBe('/posts/1');
    expect(said.info).toStrictEqual([
      "k8ordo: no paths.ts returns /posts/3, so vite dev answers it with the not-found, as the build's host will — return its value from the paths.ts of /posts/:id to render it",
    ]);
  });

  it('answers such a document with a bare 404 where the application has no not-found.tsx', async () => {
    await routeFiles(['posts/[id]/page.tsx']);
    await listing(POST_1);
    const request = hooks().serve();

    expect(await request('/posts/3')).toBe('answered 404');
  });

  it('asks again for a value it was not given, so one the data gained since is rendered', async () => {
    await routeFiles(['posts/[id]/page.tsx']);
    await listing(POST_1);
    const request = hooks().serve();
    expect(await request('/posts/3')).toBe('answered 404');

    await listing({ 'posts/[id]/paths.ts': ['1', '3'] });

    expect(await request('/posts/3')).toBe('/posts/3');
  });

  it('says once that a paths.ts failed, and renders every value with its page', async () => {
    await routeFiles(POSTS);
    await listing({ 'posts/[id]/paths.ts': new Error('the CMS is down') });
    const { serve, said } = hooks();
    const request = serve();

    expect(await request('/posts/3')).toBe('/posts/3');
    expect(await request('/posts/4')).toBe('/posts/4');
    expect(said.error).toStrictEqual([
      'k8ordo: a paths.ts failed, so vite dev renders every value with page.tsx: the CMS is down',
    ]);
  });

  it('warns once of what the build will refuse, and goes on', async () => {
    await routeFiles([...POSTS, 'tags/[tag]/page.tsx']);
    const { serve, said } = hooks();
    const request = serve();

    expect(await request('/posts/3')).toBe('/posts/!fallback');
    expect(await request('/posts/4')).toBe('/posts/!fallback');
    expect(said.warn).toStrictEqual([
      "k8ordo: the build will refuse this: static build needs the values of /tags/:tag — a paths.ts in each parameter's directory returns them, and a fallback.tsx beside a page answers the ones the build does not write",
    ]);
  });

  it('reads the routes again after one changed', async () => {
    await routeFiles(['posts/[id]/page.tsx']);
    await listing(POST_1);
    const { serve, watchChange } = hooks();
    const request = serve();
    expect(await request('/posts/3')).toBe('answered 404');

    await routeFiles(['posts/[id]/fallback.tsx']);
    watchChange('posts/[id]/fallback.tsx');

    expect(await request('/posts/3')).toBe('/posts/!fallback');
  });
});

describe('vite preview', () => {
  const written = async (files: Record<string, string>): Promise<void> => {
    await Promise.all(
      Object.entries(files).map(async ([file, body]) => {
        const at = path.join(root, 'dist', 'client', file);
        await mkdir(path.dirname(at), { recursive: true });
        await writeFile(at, body);
      }),
    );
  };

  const BUILT = {
    'index.html': '<p>home</p>',
    'feed.xml': '<rss></rss>',
    'posts/1/index.html': '<p>post 1</p>',
    'posts/1/index.rsc': 'post 1 payload',
    'posts/!fallback/index.html': '<p>shell</p>',
    'posts/!fallback/index.rsc': 'shell payload',
    '404.html': '<p>not found</p>',
    _redirects: [
      '/posts/:p1 /posts/!fallback/ 200',
      '/posts/:p1/index.rsc /posts/!fallback/index.rsc 200',
      '',
    ].join('\n'),
  };

  it('hands Vite the shell’s file for a value the build did not write, the search kept', async () => {
    await written(BUILT);
    const request = await hooks().preview();

    expect(await request('/posts/3?from=x')).toStrictEqual({
      passed: '/posts/!fallback/index.html?from=x',
    });
    expect(await request('/posts/3/index.rsc')).toStrictEqual({
      passed: '/posts/!fallback/index.rsc',
    });
  });

  it('hands Vite a built page’s own file rather than leaving it to the handler', async () => {
    await written(BUILT);
    const request = await hooks().preview();

    expect(await request('/posts/1')).toStrictEqual({
      passed: '/posts/1/index.html',
    });
    expect(await request('/')).toStrictEqual({ passed: '/index.html' });
    expect(await request('/feed.xml')).toStrictEqual({ passed: '/feed.xml' });
  });

  it('answers a built file whose name Vite cannot be handed itself, and hands on the rest', async () => {
    await written({
      ...BUILT,
      'posts/a?b/index.html': '<p>a?b</p>',
      'posts/a#b/index.rsc': 'a#b payload',
      'posts/a@b+c/index.html': '<p>a@b+c</p>',
    });
    const request = await hooks().preview();

    expect(await request('/posts/a%3Fb')).toStrictEqual({
      answered: {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
        body: '<p>a?b</p>',
      },
    });
    expect(await request('/posts/a%23b/index.rsc')).toStrictEqual({
      answered: {
        status: 200,
        headers: { 'content-type': 'application/octet-stream' },
        body: 'a#b payload',
      },
    });
    // Vite は decodeURI で戻すので、encodeURI が残す文字は綴りのまま渡す
    expect(await request('/posts/a%40b%2Bc')).toStrictEqual({
      passed: '/posts/a@b+c/index.html',
    });
  });

  it('answers what no file or rule does with 404.html under 404', async () => {
    await written(BUILT);
    const request = await hooks().preview();

    expect(await request('/nope')).toStrictEqual({
      answered: {
        status: 404,
        headers: { 'content-type': 'text/html; charset=utf-8' },
        body: '<p>not found</p>',
      },
    });
  });

  it('refuses a method a file cannot answer with 405', async () => {
    await written(BUILT);
    const request = await hooks().preview();

    expect(await request('/', 'POST')).toStrictEqual({
      answered: { status: 405, headers: { allow: 'GET, HEAD' }, body: '' },
    });
  });

  it('serves the files alone for a build without _redirects', async () => {
    const { _redirects: _, ...files } = BUILT;
    await written(files);
    const request = await hooks().preview();

    expect(await request('/posts/1')).toStrictEqual({
      passed: '/posts/1/index.html',
    });
    expect(await request('/posts/3')).toMatchObject({
      answered: { status: 404, body: '<p>not found</p>' },
    });
  });

  it('serves the build at its base, and leaves a URL outside it to Vite', async () => {
    await written({
      ...BUILT,
      _redirects: '/site/posts/:p1 /site/posts/!fallback/ 200\n',
    });
    const request = await hooks().preview('/site/');

    expect(await request('/site/posts/3')).toStrictEqual({
      passed: '/site/posts/!fallback/index.html',
    });
    expect(await request('/posts/3')).toStrictEqual({ passed: '/posts/3' });
  });
});
