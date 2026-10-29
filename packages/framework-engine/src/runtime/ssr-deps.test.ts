import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import type { Plugin, Rolldown } from 'vite';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vite-plus/test';

import { buildFixture, serveFixture } from '../../fixtures/build';
import type { BuiltFixture, ServedFixture } from '../../fixtures/build';
import type { Mode } from '../host';
import {
  CLIENT_DEPS_HEADER,
  readClientDeps,
  STYLESHEET_ORDER_HREF,
} from './payload';
import type { ClientDeps } from './payload';

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
  readonly clientEntryUrl: string;
  readonly clientEntryDeps?: Deps;
  readonly clientReferenceDeps: Readonly<Record<string, Deps>>;
};

/**
 * The payload the HTML carries, by row — read only as far as a fixture's
 * payload needs: a chunk holding `<!--` or `</script`, which the HTML spells
 * otherwise, and a row given by its length rather than ended by a line break
 * would be misread, so no fixture writes either.
 */
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
 * rows): the id the build's manifest keys them with, and the export's name.
 * The payload may write an id as a row of its own and name that row instead.
 */
const namedIn = (
  html: string,
): Array<{ readonly id: string; readonly name: string }> => {
  const rows = rowsIn(html);
  return [...rows.values()]
    .filter((value) => value.startsWith('I['))
    .map((value) => {
      const [id, , name] = JSON.parse(value.slice(1)) as [
        string,
        unknown,
        string,
      ];
      return {
        id: id.startsWith('$')
          ? (JSON.parse(rows.get(id.slice(1)) ?? '""') as string)
          : id,
        name,
      };
    });
};

const referencesIn = (html: string): string[] => [
  ...new Set(namedIn(html).map(({ id }) => id)),
];

/** Each client reference the payload names, with its files in the manifest. */
const namedWithDeps = (manifest: Manifest, html: string): ClientDeps[] =>
  namedIn(html).map(({ id, name }) => ({
    id,
    name,
    js: manifest.clientReferenceDeps[id]?.js ?? [],
    css: manifest.clientReferenceDeps[id]?.css ?? [],
  }));

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

/** The `<link>`s the head holds, as written but for the render's nonce. */
const linksInHead = (html: string): string[] =>
  [...headOf(html).matchAll(/<link\b[^>]*>/gu)].map(([link]) =>
    link.replace(/ nonce="[^"]*"/u, ''),
  );

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

/** The `<style>` the HTML render writes to order the stylesheets. */
const orderStyleIn = (html: string): string | undefined =>
  new RegExp(
    `<style\\b[^>]*\\sdata-href="${STYLESHEET_ORDER_HREF}"[^>]*>(?:</style>)?`,
    'u',
  ).exec(headOf(html))?.[0];

/** The nonce a tag carries, if any. */
const nonceOf = (tag: string | undefined): string | undefined =>
  / nonce="([^"]+)"/u.exec(tag ?? '')?.[1];

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
 * Client components, each as one entry of its module, name and files, in an
 * order of their own: two equal only if they say the same components, each
 * with its own files, as many times. None said is none.
 */
const entriesOf = (named: readonly ClientDeps[] | null): string[] =>
  (named ?? [])
    .map(({ id, name, js, css }) =>
      JSON.stringify({ id, name, js: js.toSorted(), css: css.toSorted() }),
    )
    .toSorted();

/** A page's HTML, and what the handler said of its client components. */
type Rendered = {
  readonly html: string;
  readonly said: readonly ClientDeps[] | null;
};

/** A page rendered with its client components' modules cold, then loaded. */
type Twice = readonly [cold: Rendered, loaded: Rendered];

const renderedIn = async (response: Response): Promise<Rendered> => {
  const said = response.headers.get(CLIENT_DEPS_HEADER);
  return {
    html: await response.text(),
    said: said === null ? null : readClientDeps(said),
  };
};

// React を入口とは別のチャンクにする。入口が自分の 1 ファイルしか読まないと、
// 入口の読むファイルかどうかで分かれる頼み方が、どの head にも現れない
const REACT_APART: Rolldown.CodeSplittingOptions = {
  groups: [
    {
      name: 'react',
      test: /\/node_modules\/(?:react|react-dom|scheduler)\//u,
    },
  ],
};

/**
 * The fixture built under `mode`, React in a chunk of its own. `twice`
 * renders a page twice by the same handler the first time it is asked for
 * it, and hands both renders back from then on: the first with the modules
 * of the client components only that page names cold, the second with them
 * loaded, whichever test asks first and whatever runs.
 */
const usingBuild = (
  mode: Mode,
): {
  readonly answer: (pathname: string) => Promise<Response>;
  readonly twice: (pathname: string) => Promise<Twice>;
  readonly manifest: () => Manifest;
  readonly out: () => string;
} => {
  let built: BuiltFixture | undefined;
  let manifest: Manifest | undefined;
  const rendered = new Map<string, Promise<Twice>>();
  beforeAll(async () => {
    // vitest が置く NODE_ENV=test のビルドでは、RSC プラグインが参照の id に
    // 描画ごとの印を付け、SSR は描くたびに参照のモジュールを読み直す。その
    // プロセスで先に読んだ部品の抜けが現れないので、本番と同じビルドで確かめる
    vi.stubEnv('NODE_ENV', 'production');
    try {
      built = await buildFixture('ssr-deps', {
        mode,
        clientChunks: REACT_APART,
      });
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
        both = (async (): Promise<Twice> => [
          await renderedIn(await answer(pathname)),
          await renderedIn(await answer(pathname)),
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

// どちらの SSR も、client 参照を読む関数を同じ globalThis に置き、あとから
// 読み込んだほうがそれを取る。static の describe を先に置き、server の
// describe は static の描画をこの順で済んだものとして読む
const asFiles = usingBuild('static');
const asDocuments = usingBuild('server');

/** The modules the client entry loads besides itself. */
const entryChunks = (manifest: Manifest): string[] =>
  (manifest.clientEntryDeps?.js ?? []).filter(
    (href) => href !== manifest.clientEntryUrl,
  );

/** What the head preloads as a module at the default priority. */
const preloadedAtDefault = (html: string): Set<string> =>
  linked(
    linksInHead(html)
      .filter((link) => !link.includes('fetchPriority'))
      .join(''),
    'modulepreload',
  );

/** The client components only passed in a prop's containers on /contained. */
const CONTAINED = [
  'InMap',
  'InSet',
  'InPromise',
  'InIterator',
  'InAsyncIterable',
  'InStream',
];

/** The stylesheets of each client component the payload names, by name. */
const sheetsByName = (manifest: Manifest, html: string): Map<string, string> =>
  new Map(
    namedIn(html).map(({ id, name }) => [
      name,
      JSON.stringify(manifest.clientReferenceDeps[id]?.css ?? []),
    ]),
  );

/** The stylesheets the components /contained holds in containers need. */
const containedSheets = (manifest: Manifest, html: string): string[] =>
  namedIn(html)
    .filter(({ name }) => CONTAINED.includes(name))
    .flatMap(({ id }) => manifest.clientReferenceDeps[id]?.css ?? []);

describe('the HTML of a file', () => {
  const { answer, twice, manifest, out } = asFiles;

  // /contained は props の Map・Set・Promise・iterator・async iterable・
  // stream に入れただけの要素を、/promised/x の not-found は HTML の描画の
  // あとで解ける Promise の中の要素を名指す。どちらもモジュールを読み終えた
  // 2 度目の描画では、HTML の描画が読むことはない。/promised/x は描くたびに
  // 1 秒待ち、最初に頼んだ試験が 2 回分を待つので、時間切れを延ばす
  it.each([
    '/',
    '/nowhere',
    '/lazy',
    '/streamed',
    '/held',
    '/held-late',
    '/held-value',
    '/contained',
    '/promised/x',
  ])(
    'links in the head everything the client components %s names need, whether they had loaded or not',
    async (pathname) => {
      for (const { html } of await twice(pathname)) {
        const { css, js } = needed(manifest(), html);

        expect(css.length).toBeGreaterThan(0);
        expect(js.length).toBeGreaterThan(0);
        expect(unlinkedInHead(manifest(), html)).toStrictEqual([]);
      }
    },
    30_000,
  );

  it.each(['/contained', '/promised/x'])(
    'writes the same links in the head of %s whether its client components had loaded or not',
    async (pathname) => {
      const [cold, loaded] = (await twice(pathname)).map(({ html }) =>
        linksInHead(html),
      );

      expect(loaded).toStrictEqual(cold);
    },
    30_000,
  );

  // /defaults は、別々のファイルの 2 つの部品を、どちらも default という
  // export 名で名指す
  it.each([
    '/',
    '/nowhere',
    '/lazy',
    '/streamed',
    '/held',
    '/held-late',
    '/held-value',
    '/contained',
    '/promised/x',
    '/defaults',
  ])(
    'says, with the HTML of %s, every client component its payload names and what each needs, whether they had loaded or not',
    async (pathname) => {
      for (const { html, said } of await twice(pathname)) {
        const { css, js } = needed(manifest(), html);

        expect(css.length).toBeGreaterThan(0);
        expect(js.length).toBeGreaterThan(0);
        expect(entriesOf(said)).toStrictEqual(
          entriesOf(namedWithDeps(manifest(), html)),
        );
      }
    },
    30_000,
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

  // /contained の部品が同じ CSS を持てば、上の試験はどれか 1 つの入れ物の分
  // しか見ていない
  it('names, on /contained, a stylesheet of its own for the component in each container', async () => {
    const [{ html }] = await twice('/contained');
    const sheets = sheetsByName(manifest(), html);
    const contained = CONTAINED.map((name) => sheets.get(name));

    expect(contained).not.toContain(undefined);
    expect(new Set(contained).size).toBe(CONTAINED.length);
  });

  // 入口が自分のほかに読むファイルが無いと、入口のものとほかのものとで
  // 分かれる頼み方を、下の server との比べが見ていない
  it('preloads, on /, what the client entry loads besides itself at the default priority', async () => {
    const [{ html }] = await twice('/');
    const preloaded = preloadedAtDefault(html);
    const chunks = entryChunks(manifest());

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.filter((href) => !preloaded.has(href))).toStrictEqual([]);
  });

  // static は描く前にすべての client 参照を頼むので、何もしなければ client
  // コンポーネントの CSS の組が先に並ぶ。遷移で読むものと同じく後ろに並べる
  it('links, on /styled, the page’s own stylesheets before the client components’', async () => {
    for (const { html } of await twice('/styled')) {
      expect(stylesheetsInHead(manifest(), html)).toStrictEqual([
        'page',
        'client',
      ]);
    }
  });

  // React は style の nonce を渡されると、nonce の無いアプリの
  // <style precedence> を書かなくなる。ビルドはこの style をハッシュで名指す
  it('writes the style that orders the stylesheets empty and unsigned, while its scripts are signed', async () => {
    const [{ html }] = await twice('/styled');
    const style = orderStyleIn(html);

    expect(style).toMatch(/><\/style>$/u);
    expect(nonceOf(style)).toBeUndefined();
    expect(nonceOf(/<script\b[^>]*>/u.exec(html)?.[0])).toBeDefined();
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
        for (const { html } of await twice('/nowhere')) {
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
  const { answer, twice, manifest } = asDocuments;

  it.each(['/', '/nowhere', '/lazy', '/held', '/held-value'])(
    'links in the head everything the client components %s names need, whether they had loaded or not',
    async (pathname) => {
      for (const { html } of await twice(pathname)) {
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
      for (const { html } of await twice(pathname)) {
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

  // static は RSC プラグインの頼み方を写して自分で頼む。server では
  // プラグインだけが頼むので、それを正解にする。並びは mode で違う。static の
  // 描画は上の describe が済ませたもの
  it.each(['/', '/held', '/styled'])(
    'links in the head of %s what its client components need as the file does, whether they had loaded or not',
    async (pathname) => {
      const files = await asFiles.twice(pathname);
      const documents = await twice(pathname);

      for (const { html } of [...files, ...documents]) {
        expect(linksInHead(html).toSorted()).toStrictEqual(
          linksInHead(files[0].html).toSorted(),
        );
      }
    },
  );

  // server は props の入れ物の中を歩かないので、その中にしかない部品は、
  // プロセスで初めてそのモジュールを読む要求の HTML にしか link されない。
  // docs の「保証しないこと」に書いた範囲
  it('links, on /contained, what only a prop’s containers hold where its process first loads it, and nowhere after', async () => {
    const [cold, loaded] = await twice('/contained');
    const sheets = containedSheets(manifest(), loaded.html);
    const linkedIn = ({ html }: Rendered): string[] => {
      const links = linked(html, 'stylesheet', 'preload');
      return sheets.filter((href) => links.has(href));
    };

    expect(sheets).toHaveLength(CONTAINED.length);
    expect(linkedIn(cold).length).toBeGreaterThan(0);
    expect(linkedIn(loaded)).toStrictEqual([]);
  });

  it('links, on /styled, the page’s own stylesheets before the client components’', async () => {
    for (const { html } of await twice('/styled')) {
      expect(stylesheetsInHead(manifest(), html)).toStrictEqual([
        'page',
        'client',
      ]);
    }
  });

  it('signs the style that orders the stylesheets with the nonce its scripts carry', async () => {
    for (const { html } of await twice('/styled')) {
      const script = nonceOf(/<script\b[^>]*>/u.exec(html)?.[0]);

      expect(script).toBeDefined();
      expect(nonceOf(orderStyleIn(html))).toBe(script);
    }
  });

  it('says nothing of its client components with the HTML', async () => {
    for (const { said } of await twice('/')) {
      expect(said).toBeNull();
    }
  });

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
