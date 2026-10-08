import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

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
  root = await mkdtemp(path.join(tmpdir(), 'k8ordo-static-'));
  await mkdir(path.join(root, 'src', 'routes'), { recursive: true });
  await writeFile(
    path.join(root, 'src', 'routes', 'page.tsx'),
    'export default function Page() { return null; }\n',
  );
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await rm(root, { recursive: true, force: true });
});

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
    finish: () => buildApp({ config: { plugins: [] } }),
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
      });
      install();
      if (installed === undefined) throw new Error('no middleware installed');
      const middleware = installed;
      return (url: string): Promise<string> =>
        new Promise((resolve, reject) => {
          const request: Request = { method: 'GET', url, originalUrl: url };
          middleware(request, {}, (error) => {
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
    const { resolveFrom, finish } = hooks();
    resolveFrom(path.join(root, 'src', 'routes', 'page.tsx'));
    // @vitejs/plugin-rsc は node_modules に解決した bare import を、
    // <root>/index.html からもう一度解決して同じパッケージかを確かめる
    resolveFrom(path.join(root, 'index.html'));

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
 * build imports: it answers each pathname as told, and anything else 404.
 */
const handlerAnswering = async (
  answers: Record<string, Answer>,
): Promise<void> => {
  const dir = path.join(root, 'dist', 'rsc');
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, 'index.js'),
    `const answers = ${JSON.stringify(answers)};
export default async function handler(request) {
  const { pathname } = new URL(request.url);
  const answer = answers[pathname];
  if (answer === undefined) return new Response('not found', { status: 404 });
  return new Response(answer.body ?? '', {
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

describe('the shells a build writes', () => {
  it('writes each shell’s HTML and payload under its shell pathname, and leaves it out of the sitemap', async () => {
    await routeFiles(POSTS);
    await handlerAnswering(site());
    const { build, said } = hooks({
      paths: () => ['/posts/1'],
      site: 'https://example.com',
    });

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
      'the "paths" option supplied shell locations a params schema refused: /posts/:id',
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
      'the shell for /posts/:id (posts/[id]/fallback.tsx) was answered by [a]/[b]/fallback.tsx, which the table tries first — supply shell locations that pattern cannot match',
    );
  });

  it('refuses a route.ts whose file a shell would be written below', async () => {
    await routeFiles([...POSTS, 'posts/route.ts']);
    await handlerAnswering(site());

    await expect(hooks().build()).rejects.toThrow(
      'static build cannot write a route.ts as a file at /posts — /posts/!fallback is written below it, as a directory',
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
    const { build } = hooks({ paths: () => ['/posts/1'] });

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
        '/posts/a:b': { body: '<p>a:b</p>' },
        '/posts/a:b/index.rsc': { body: 'a:b payload' },
        '/posts/a%2Ab': { body: '<p>a*b</p>' },
        '/posts/a%2Ab/index.rsc': { body: 'a*b payload' },
      }),
    );
    const { build, said } = hooks({
      paths: () => ['/posts/a:b', '/posts/a%2Ab'],
    });

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
    const { build, said } = hooks({ paths: () => ['/posts/1'] });

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
    const { build, said } = hooks({ paths: () => ['/posts/1'] });

    await build();

    await expect(clientFile('_redirects')).rejects.toThrow(/ENOENT/u);
    expect(said.info).toStrictEqual(['k8ordo: wrote 2 routes']);
  });
});

describe('a build for Vercel', () => {
  it('warns that Vercel never reads _redirects when no vercel() is there to write its routes', async () => {
    vi.stubEnv('VERCEL', '1');
    await routeFiles(POSTS);
    await handlerAnswering(site());
    const { build, said } = hooks();

    await build();

    expect(said.warn).toContain(
      'k8ordo: this build runs on Vercel, which does not read _redirects — add vercel() from @k8ordo/framework/vercel, or the shells are never served',
    );
  });

  it('hands vercel() what it writes its routes from, once the files are in place', async () => {
    vi.stubEnv('VERCEL', '1');
    await routeFiles([...POSTS, 'posts/old/redirect.ts']);
    await handlerAnswering(
      site({
        '/posts/old': { status: 308, headers: { location: '/posts/1' } },
      }),
    );
    const written: StaticOutput[] = [];
    const { build, said } = hooks({ paths: () => ['/posts/1'] });

    await build([
      {
        name: 'k8ordo:vercel',
        api: {
          writeStatic: (output: StaticOutput) => {
            written.push(output);
          },
        },
      },
    ]);

    expect(written).toStrictEqual([
      {
        root,
        client: path.join(root, 'dist', 'client'),
        base: '/',
        rewrites: [
          { from: '/posts/old/index.rsc', to: '/posts/!fallback/' },
          { from: '/posts/:p1', to: '/posts/!fallback/' },
          { from: '/posts/:p1/index.rsc', to: '/posts/!fallback/index.rsc' },
        ],
        notFound: false,
      },
    ]);
    expect(said.warn).toStrictEqual([]);
  });
});

describe('vite dev', () => {
  it('never asks paths for anything in an application without a fallback.tsx', async () => {
    await routeFiles(['posts/[id]/page.tsx']);
    const paths = vi.fn<() => string[]>(() => ['/posts/1']);
    const { serve } = hooks({ paths });
    const request = serve();

    expect(await request('/posts/3')).toBe('/posts/3');
    expect(paths).not.toHaveBeenCalled();
  });

  it('answers a value paths does not list with its shell, and one it lists with the page', async () => {
    await routeFiles(POSTS);
    const paths = vi.fn<() => string[]>(() => ['/posts/1']);
    const { serve, said } = hooks({ paths });
    const request = serve();

    expect(await request('/posts/3?from=x')).toBe('/posts/!fallback?from=x');
    expect(await request('/posts/3/index.rsc')).toBe(
      '/posts/!fallback/index.rsc',
    );
    expect(await request('/posts/1')).toBe('/posts/1');
    expect(await request('/posts/!fallback')).toBe('/posts/!fallback');
    expect(paths).toHaveBeenCalledTimes(1);
    expect(said.info).toStrictEqual([
      'k8ordo: /posts/3 is not in "paths", so vite dev answers it with posts/[id]/fallback.tsx\'s shell — list it in "paths" to render page.tsx',
    ]);
  });

  it('answers under the base, and hands on the shell’s URL with the base put back', async () => {
    await routeFiles(POSTS);
    const { serve } = hooks({ paths: () => ['/posts/1'] }, '/site/');
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

  it('keeps a URL no shell could answer from waiting on paths', async () => {
    await routeFiles(POSTS);
    // 遅い CMS: 答えが返らない
    const paths = vi.fn<() => Promise<readonly string[]>>(
      () =>
        new Promise(() => {
          // 答えない
        }),
    );
    const { serve } = hooks({ paths });
    const request = serve();

    expect(await request('/favicon.ico')).toBe('/favicon.ico');
  });

  it('says once that paths failed, and renders every value with its page', async () => {
    await routeFiles(POSTS);
    const { serve, said } = hooks({
      paths: () => {
        throw new Error('the CMS is down');
      },
    });
    const request = serve();

    expect(await request('/posts/3')).toBe('/posts/3');
    expect(await request('/posts/4')).toBe('/posts/4');
    expect(said.error).toStrictEqual([
      'k8ordo: the "paths" option failed, so vite dev renders every value with page.tsx: the CMS is down',
    ]);
  });

  it('warns once of what the build will refuse, and goes on', async () => {
    await routeFiles(POSTS);
    const { serve, said } = hooks({ paths: () => ['/produtcs/2'] });
    const request = serve();

    expect(await request('/posts/3')).toBe('/posts/!fallback');
    expect(await request('/posts/4')).toBe('/posts/!fallback');
    expect(said.warn).toStrictEqual([
      'k8ordo: the build will refuse "paths": the "paths" option supplied pathnames no route wants: /produtcs/2',
    ]);
  });

  it('reads the routes again after one changed, and paths only when its patterns did', async () => {
    await routeFiles(POSTS);
    const paths = vi.fn<() => string[]>(() => ['/posts/1']);
    const { serve, watchChange } = hooks({ paths });
    const request = serve();
    expect(await request('/posts/3')).toBe('/posts/!fallback');

    await routeFiles(['about/page.tsx']);
    watchChange('about/page.tsx');
    expect(await request('/posts/3')).toBe('/posts/!fallback');
    expect(paths).toHaveBeenCalledTimes(1);

    await routeFiles(['tags/[tag]/page.tsx']);
    watchChange('tags/[tag]/page.tsx');
    await request('/posts/3');
    expect(paths).toHaveBeenCalledTimes(2);
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
