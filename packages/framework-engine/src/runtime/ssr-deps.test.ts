import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import type { Plugin } from 'vite';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vite-plus/test';

import { buildFixture, serveFixture } from '../../fixtures/build';
import type { BuiltFixture, ServedFixture } from '../../fixtures/build';
import type { Mode } from '../host';

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

type Deps = { readonly js: readonly string[]; readonly css: readonly string[] };

type Manifest = {
  readonly clientReferenceDeps: Readonly<Record<string, Deps>>;
};

/** The payload the HTML carries, by row. */
const rowsIn = (html: string): Map<string, string> => {
  const flight = [
    ...html.matchAll(/__FLIGHT_DATA\|\|=\[\]\)\.push\(("(?:[^"\\]|\\.)*")\)/gu),
  ]
    .map(([, chunk]) => JSON.parse(chunk ?? '""') as string)
    .join('');
  return new Map(
    flight
      .split('\n')
      .map((line) => /^([0-9a-f]+):(.*)$/u.exec(line))
      .filter((row) => row !== null)
      .map(([, id, value]) => [id ?? '', value ?? '']),
  );
};

/**
 * The client references the payload written into the HTML names (its `I`
 * rows), by the id the build's manifest keys them with. The payload may
 * write an id as a row of its own and name that row instead.
 */
const referencesIn = (html: string): string[] => {
  const rows = rowsIn(html);
  const ids = [...rows.values()]
    .filter((value) => value.startsWith('I['))
    .map((value) => {
      const [named] = JSON.parse(value.slice(1)) as [string];
      return named.startsWith('$')
        ? (JSON.parse(rows.get(named.slice(1)) ?? '""') as string)
        : named;
    });
  return [...new Set(ids)];
};

/** What the payload's client references need, stylesheets and scripts. */
const needed = (manifest: Manifest, html: string): Deps => {
  const css: string[] = [];
  const js: string[] = [];
  for (const id of referencesIn(html)) {
    const deps = manifest.clientReferenceDeps[id];
    css.push(...(deps?.css ?? []));
    js.push(...(deps?.js ?? []));
  }
  return { css, js };
};

/** What a `<link rel=…>` in this part of the HTML names. */
const linked = (part: string, ...rels: readonly string[]): Set<string> =>
  new Set(
    [...part.matchAll(/<link\b[^>]*>/gu)]
      .map(([link]) => link)
      .filter((link) => rels.some((rel) => link.includes(`rel="${rel}"`)))
      .map((link) => /\bhref="([^"]+)"/u.exec(link)?.[1] ?? ''),
  );

const headOf = (html: string): string =>
  html.slice(0, Math.max(0, html.indexOf('</head>')));

/**
 * The deps of the payload's client references the head neither links as a
 * stylesheet nor preloads as a module.
 */
const unlinkedInHead = (manifest: Manifest, html: string): string[] => {
  const head = headOf(html);
  const stylesheets = linked(head, 'stylesheet');
  const modules = linked(head, 'modulepreload');
  const { css, js } = needed(manifest, html);
  return [
    ...css.filter((href) => !stylesheets.has(href)),
    ...js.filter((href) => !modules.has(href)),
  ];
};

/**
 * The stylesheets the head links, in order, each as what needs it: a client
 * reference the payload names, or the page itself.
 */
const stylesheetsInHead = (
  manifest: Manifest,
  html: string,
): Array<'client' | 'page'> => {
  const client = new Set(needed(manifest, html).css);
  return [...linked(headOf(html), 'stylesheet')].map((href) =>
    client.has(href) ? 'client' : 'page',
  );
};

/** The stylesheets of each client reference the payload names, by reference. */
const sheetsByReference = (
  manifest: Manifest,
  html: string,
): Array<readonly string[]> =>
  referencesIn(html).map((id) => manifest.clientReferenceDeps[id]?.css ?? []);

/** Which of these built stylesheets hold `text`. */
const sheetsHolding = async (
  out: string,
  sheets: readonly string[],
  text: string,
): Promise<string[]> => {
  const held: string[] = [];
  for (const href of new Set(sheets)) {
    const sheet = await readFile(path.join(out, 'client', href), 'utf8');
    if (sheet.includes(text)) held.push(href);
  }
  return held;
};

/**
 * Has the page answer every URL with this HTML, as a host serves
 * `404.html`, and `/assets/` from the build.
 */
const serveAsFiles = async (
  page: Page,
  html: string,
  out: string,
): Promise<void> => {
  await page.route('https://k8ordo.test/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    if (!pathname.startsWith('/assets/')) {
      await route.fulfill({ contentType: 'text/html', body: html });
      return;
    }
    try {
      await route.fulfill({
        contentType: pathname.endsWith('.css') ? 'text/css' : 'text/javascript',
        body: await readFile(path.join(out, 'client', pathname)),
      });
    } catch {
      await route.fulfill({ status: 404 });
    }
  });
};

/** What the response has sent once `text` arrives, or all of it. */
const readUntil = async (response: Response, text: string): Promise<string> => {
  const reader = (response.body as ReadableStream<Uint8Array>).getReader();
  const decoder = new TextDecoder();
  let read = '';
  while (!read.includes(text)) {
    const { done, value } = await reader.read();
    if (done) break;
    read += decoder.decode(value, { stream: true });
  }
  await reader.cancel();
  return read;
};

/**
 * The fixture built under `mode`. `twice` renders a page twice by the same
 * handler the first time it is asked for it, and hands both renders back
 * from then on: the first with the modules of the client components only
 * that page names cold, the second with them loaded, whichever test asks
 * first and whatever runs.
 */
const usingBuild = (
  mode: Mode,
): {
  readonly answer: (pathname: string) => Promise<Response>;
  readonly twice: (pathname: string) => Promise<readonly string[]>;
  readonly manifest: () => Manifest;
  readonly out: () => string;
} => {
  let built: BuiltFixture | undefined;
  let manifest: Manifest | undefined;
  const rendered = new Map<string, Promise<readonly string[]>>();
  beforeAll(async () => {
    // vitest が置く NODE_ENV=test のビルドでは、RSC プラグインが参照の id に
    // 描画ごとの印を付け、SSR は描くたびに参照のモジュールを読み直す。その
    // プロセスで先に読んだ部品の抜けが現れないので、本番と同じビルドで確かめる
    vi.stubEnv('NODE_ENV', 'production');
    try {
      built = await buildFixture('ssr-deps', { mode });
    } finally {
      vi.unstubAllEnvs();
    }
    ({ default: manifest } = (await import(
      pathToFileURL(
        path.join(built.out, 'rsc', '__vite_rsc_assets_manifest.js'),
      ).href
    )) as { default: Manifest });
  }, 120_000);
  afterAll(async () => {
    await built?.dispose();
  });
  const answer = (pathname: string): Promise<Response> => {
    if (built === undefined) throw new Error('the fixture was not built');
    return built.handler(new Request(`https://k8ordo.test${pathname}`));
  };
  return {
    answer,
    twice: (pathname) => {
      let both = rendered.get(pathname);
      if (both === undefined) {
        both = (async () => [
          await (await answer(pathname)).text(),
          await (await answer(pathname)).text(),
        ])();
        rendered.set(pathname, both);
      }
      return both;
    },
    manifest: () => {
      if (manifest === undefined) throw new Error('the fixture was not built');
      return manifest;
    },
    out: () => {
      if (built === undefined) throw new Error('the fixture was not built');
      return built.out;
    },
  };
};

describe('the HTML of a file', () => {
  const { answer, twice, manifest, out } = usingBuild('static');

  it.each([
    '/',
    '/nowhere',
    '/lazy',
    '/streamed',
    '/held',
    '/held-late',
    '/held-value',
  ])(
    'links in the head everything the client components %s names need, whether they had loaded or not',
    async (pathname) => {
      for (const html of await twice(pathname)) {
        const { css, js } = needed(manifest(), html);

        expect(css.length).toBeGreaterThan(0);
        expect(js.length).toBeGreaterThan(0);
        expect(unlinkedInHead(manifest(), html)).toStrictEqual([]);
      }
    },
  );

  // /held が描く Holder の CSS が、渡すだけの部品のものと同じなら、上の試験は
  // 渡すだけの部品の分を見ていない
  it('names, on /held, a stylesheet the component it renders does not need', async () => {
    const html = await (await answer('/held')).text();
    const sheets = sheetsByReference(manifest(), html);
    const [held = ''] = await sheetsHolding(
      out(),
      sheets.flat(),
      'mark-held-element',
    );

    expect(new Set(sheets.map((each) => each.includes(held)))).toStrictEqual(
      new Set([false, true]),
    );
  });

  // static は描く前にすべてを歩くので、client コンポーネントの CSS の組が先に
  // 並ぶ。server ではデータを待つ部分が後に並ぶことがあり、遷移で初めて読む
  // CSS は head の末尾に足されるので、上書きは詳細度か @layer で決めてもらう
  it('links, on /styled, the client components’ stylesheets before the page’s own', async () => {
    for (const html of await twice('/styled')) {
      expect(stylesheetsInHead(manifest(), html)).toStrictEqual([
        'client',
        'page',
      ]);
    }
  });

  describe.each(browserTypes)(
    'opened without JavaScript in $name',
    ({ type }) => {
      let browser: Browser;

      beforeAll(async () => {
        browser = await type.launch();
      });

      afterAll(async () => {
        await browser.close();
      });

      it('styles the not-found before any script runs', async () => {
        for (const html of await twice('/nowhere')) {
          const context = await browser.newContext({
            javaScriptEnabled: false,
          });
          const page = await context.newPage();
          await serveAsFiles(page, html, out());

          await page.goto('https://k8ordo.test/missing', { waitUntil: 'load' });

          expect(
            await page
              .getByText('MARK_CLIENT_N')
              .evaluate((element) =>
                getComputedStyle(element).getPropertyValue('--mark').trim(),
              ),
          ).toBe('mark-client-n');
          await context.close();
        }
      }, 30_000);
    },
  );
});

describe('the HTML of a streamed document', () => {
  const { answer, twice, manifest } = usingBuild('server');

  it.each(['/', '/nowhere', '/lazy', '/held', '/held-value'])(
    'links in the head everything the client components %s names need, whether they had loaded or not',
    async (pathname) => {
      for (const html of await twice(pathname)) {
        const { css, js } = needed(manifest(), html);

        expect(css.length).toBeGreaterThan(0);
        expect(js.length).toBeGreaterThan(0);
        expect(unlinkedInHead(manifest(), html)).toStrictEqual([]);
      }
    },
  );

  // 殻はもう送ってあるので、head には足せない。境界の中身より前に、読み込みの
  // 先触れとして出る。/held-late の境界は props で渡すだけの要素を返す
  it.each([
    ['/streamed', 'MARK_STREAMED_CLIENT'],
    ['/held-late', 'MARK_HOLDER'],
  ])(
    'preloads, before the boundary, what a boundary of %s streamed after the shell names',
    async (pathname, content) => {
      for (const html of await twice(pathname)) {
        const before = linked(
          html.slice(0, html.indexOf(content)),
          'stylesheet',
          'preload',
          'modulepreload',
        );
        const { css, js } = needed(manifest(), html);

        expect(css.length).toBeGreaterThan(0);
        expect(js.length).toBeGreaterThan(0);
        expect(
          [...css, ...js].filter((href) => !before.has(href)),
        ).toStrictEqual([]);
      }
    },
  );

  it('sends the shell before a boundary of the page completes', async () => {
    const shells = [
      await readUntil(await answer('/streamed'), 'MARK_LATE_FALLBACK'),
      await readUntil(await answer('/streamed'), 'MARK_LATE_FALLBACK'),
    ];

    for (const shell of shells) {
      expect(shell).toContain('MARK_LATE_FALLBACK');
      expect(shell).not.toContain('MARK_STREAMED_CLIENT');
    }
  });
});

// dev の参照には JS の deps が無く、CSS は Flight が読み込み終えた部品の
// export を取るときにだけ出る。読み込みに間がかかる部品でも、殻がその CSS を
// 待つことを見るために、/held が渡すだけの部品の変換を遅らせる
const slowHeldElement: Plugin = {
  name: 'slow-held-element',
  async transform(_code, id) {
    if (this.environment.name === 'ssr' && id.endsWith('/held-element.tsx')) {
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    }
  },
};

// 殻を出したあとで解ける境界の中身は、server では head に載らない
describe.each([
  {
    mode: 'static',
    pages: [
      ['/nowhere', 'client-n.module.css'],
      ['/lazy', 'lazy-client.module.css'],
      ['/held', 'held-element.module.css'],
      ['/streamed', 'streamed-client.module.css'],
    ],
  },
  {
    mode: 'server',
    pages: [
      ['/nowhere', 'client-n.module.css'],
      ['/lazy', 'lazy-client.module.css'],
      ['/held', 'held-element.module.css'],
    ],
  },
] as const)('the HTML vite dev renders under $mode mode', ({ mode, pages }) => {
  let served: ServedFixture | undefined;
  beforeAll(async () => {
    served = await serveFixture('ssr-deps', {
      mode,
      plugins: [slowHeldElement],
    });
  }, 120_000);
  afterAll(async () => {
    await served?.close();
  });

  // 新しく立てたサーバーなので、ページの最初の要求でその部品を初めて読む
  const first = async (pathname: string): Promise<string> => {
    if (served === undefined) throw new Error('the fixture is not served');
    return (await fetch(`${served.origin}${pathname}`)).text();
  };

  it.each(pages)(
    'links in the head, on the first request for %s, the stylesheet of the client component it names',
    async (pathname, sheet) => {
      const head = headOf(await first(pathname));

      expect(
        [...linked(head, 'stylesheet')].filter((href) =>
          href.endsWith(`/${sheet}`),
        ),
      ).toHaveLength(1);
    },
    30_000,
  );
});
