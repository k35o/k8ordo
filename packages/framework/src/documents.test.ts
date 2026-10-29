import { STYLESHEET_ORDER_HREF } from '@k8ordo/framework-engine';
import { describe, expect, it } from 'vite-plus/test';

import {
  asFile,
  policyProblems,
  redirectPage,
  sitemap,
  unlinkedDeps,
  unlinkedMessage,
} from './documents';

describe('sitemap', () => {
  it('escapes every character XML reserves, so a pathname cannot break the document', () => {
    expect(
      sitemap('https://example.test', ['/a&b', "/it's", '/"q"', '/<b>']),
    ).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url><loc>https://example.test/&quot;q&quot;</loc></url>',
        '  <url><loc>https://example.test/&lt;b&gt;</loc></url>',
        '  <url><loc>https://example.test/a&amp;b</loc></url>',
        '  <url><loc>https://example.test/it&apos;s</loc></url>',
        '</urlset>',
        '',
      ].join('\n'),
    );
  });

  it('escapes an escape the pathname already spells, rather than reading it as one', () => {
    expect(sitemap('https://example.test', ['/a&amp;b'])).toContain(
      '<loc>https://example.test/a&amp;amp;b</loc>',
    );
  });
});

describe('redirectPage', () => {
  it('escapes the target in every place it is written, so the browser reads back the same URL', () => {
    expect(redirectPage('/search?a=1&b="2"')).toBe(
      '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/search?a=1&amp;b=&quot;2&quot;"><link rel="canonical" href="/search?a=1&amp;b=&quot;2&quot;"><title>Redirecting</title></head><body><a href="/search?a=1&amp;b=&quot;2&quot;">/search?a=1&amp;b=&quot;2&quot;</a></body></html>\n',
    );
  });

  it('writes a target holding markup as the link’s text, not as markup', () => {
    const html = redirectPage('/tags/<b>');

    expect(html).toContain('>/tags/&lt;b&gt;</a>');
    expect(html).not.toContain('<b>');
  });
});

const NONCE = 'bm9uY2Vub25jZW5vbmNlMQ==';

const page = (body: string): string =>
  `<!DOCTYPE html><html><head><title>t</title></head><body>${body}</body></html>`;

const policyOf = (html: string): string | undefined =>
  /<meta http-equiv="Content-Security-Policy" content="([^"]*)">/u.exec(
    html,
  )?.[1];

describe('asFile', () => {
  it('names the hash of every inline script signed with the page’s nonce, and of nothing else', () => {
    const html = page(
      [
        `<script nonce="${NONCE}">console.log(1)</script>`,
        '<script>injected()</script>',
        `<script nonce="another">forged()</script>`,
        `<script type="module" src="/assets/index.js" nonce="${NONCE}" async=""></script>`,
      ].join(''),
    );
    expect(policyOf(asFile(html, NONCE, { 'script-src': ["'self'"] }))).toBe(
      'script-src &apos;self&apos; &apos;sha256-CihokcEcBW4atb/CW/XWsvWwbTjqwQlE9nj9ii5ww5M=&apos;',
    );
  });

  it('reads where a script ends as a browser does, so one closed oddly does not swallow the next', () => {
    const html = page(
      `<script>content()</SCRIPT ><script nonce="${NONCE}">console.log(1)</script>`,
    );
    expect(policyOf(asFile(html, NONCE, { 'script-src': [] }))).toBe(
      'script-src &apos;sha256-CihokcEcBW4atb/CW/XWsvWwbTjqwQlE9nj9ii5ww5M=&apos;',
    );
  });

  it('puts the policy first in <head>, ahead of anything it governs', () => {
    const html = asFile(page(''), NONCE, { 'object-src': ["'none'"] });
    expect(html).toBe(
      `<!DOCTYPE html><html><head><meta http-equiv="Content-Security-Policy" content="object-src &apos;none&apos;"><title>t</title></head><body></body></html>`,
    );
  });

  it('takes the nonce off, which a file everyone reads cannot keep', () => {
    const html = page(
      `<script nonce="${NONCE}">console.log(1)</script><script type="module" src="/assets/index.js" nonce="${NONCE}" async=""></script>`,
    );
    expect(asFile(html, NONCE)).toBe(
      page(
        '<script>console.log(1)</script><script type="module" src="/assets/index.js" async=""></script>',
      ),
    );
    expect(asFile(html, NONCE, { 'script-src': ["'self'"] })).not.toContain(
      NONCE,
    );
  });

  it('hashes a script as the browser reads it, with its line breaks made LF', () => {
    const html = page(`<script nonce="${NONCE}">a\r\nb</script>`);
    expect(policyOf(asFile(html, NONCE, { 'script-src': [] }))).toBe(
      'script-src &apos;sha256-fhj3NzEbLcOy8mndeDlrA1HxT7Zu+oefdoyyMYGIPHg=&apos;',
    );
  });

  it('makes script-src from default-src rather than adding hashes to it', () => {
    const html = page(`<script nonce="${NONCE}">signed()</script>`);
    expect(
      policyOf(
        asFile(html, NONCE, {
          'default-src': ["'self'"],
          'style-src': ["'self'", "'unsafe-inline'"],
        }),
      ),
    ).toBe(
      'default-src &apos;self&apos;; style-src &apos;self&apos; &apos;unsafe-inline&apos;; script-src &apos;self&apos; &apos;sha256-VXPk1QxJVho+2mU5aKk+EJTW7+XzGtVTcsOkesUPCMY=&apos;',
    );
  });

  it('adds the hashes to script-src-elem too, which overrides script-src for elements', () => {
    const html = page(`<script nonce="${NONCE}">signed()</script>`);
    expect(
      policyOf(
        asFile(html, NONCE, {
          'script-src': ["'self'"],
          'script-src-elem': ["'self'"],
        }),
      ),
    ).toBe(
      'script-src &apos;self&apos; &apos;sha256-VXPk1QxJVho+2mU5aKk+EJTW7+XzGtVTcsOkesUPCMY=&apos;; script-src-elem &apos;self&apos; &apos;sha256-VXPk1QxJVho+2mU5aKk+EJTW7+XzGtVTcsOkesUPCMY=&apos;',
    );
  });

  it('adds the hashes to script-src-elem when it alone decides script elements', () => {
    const html = page(`<script nonce="${NONCE}">signed()</script>`);
    expect(
      policyOf(asFile(html, NONCE, { 'script-src-elem': ["'self'"] })),
    ).toBe(
      'script-src-elem &apos;self&apos; &apos;sha256-VXPk1QxJVho+2mU5aKk+EJTW7+XzGtVTcsOkesUPCMY=&apos;',
    );
  });

  it('leaves scripts unrestricted when the policy does not restrict them', () => {
    const html = page(`<script nonce="${NONCE}">signed()</script>`);
    expect(policyOf(asFile(html, NONCE, { 'img-src': ["'self'"] }))).toBe(
      'img-src &apos;self&apos;',
    );
  });

  // エンジンの SSR が head に書く、Server Component の CSS を先に並べる style
  const ordered = `<!DOCTYPE html><html><head><link rel="stylesheet" href="/assets/page.css" data-precedence="vite-rsc/importer-resources"><style data-precedence="vite-rsc/importer-resources" data-href="${STYLESHEET_ORDER_HREF}"></style><title>t</title></head><body></body></html>`;
  const EMPTY =
    '&apos;sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=&apos;';

  it.each([
    [{ 'style-src': ["'self'"] }, `style-src &apos;self&apos; ${EMPTY}`],
    [
      { 'default-src': ["'self'"] },
      `default-src &apos;self&apos;; style-src &apos;self&apos; ${EMPTY}`,
    ],
    [
      { 'style-src': ["'self'"], 'style-src-elem': ["'self'"] },
      `style-src &apos;self&apos;; style-src-elem &apos;self&apos; ${EMPTY}`,
    ],
    [
      { 'style-src': ["'self'", "'unsafe-inline'", "'sha256-abc='"] },
      `style-src &apos;self&apos; &apos;unsafe-inline&apos; &apos;sha256-abc=&apos; ${EMPTY}`,
    ],
  ])(
    'names the framework’s empty style by hash where %o decides a style element and would refuse it',
    (policy, expected) => {
      expect(policyOf(asFile(ordered, NONCE, policy))).toBe(expected);
    },
  );

  it.each([
    [
      { 'style-src': ["'self'", "'unsafe-inline'"] },
      'style-src &apos;self&apos; &apos;unsafe-inline&apos;',
    ],
    [{ 'img-src': ["'self'"] }, 'img-src &apos;self&apos;'],
  ])(
    'adds no hash where %o lets the style in already, a hash beside an unsafe-inline turning it off',
    (policy, expected) => {
      expect(policyOf(asFile(ordered, NONCE, policy))).toBe(expected);
    },
  );

  it('adds no style hash to a page without the framework’s style', () => {
    expect(policyOf(asFile(page(''), NONCE, { 'style-src': ["'self'"] }))).toBe(
      'style-src &apos;self&apos;',
    );
  });

  it('refuses a page with no <head> to put the policy in', () => {
    expect(() =>
      asFile('<p>no document</p>', NONCE, { 'script-src': [] }),
    ).toThrow('the "csp" option needs a <head> to put its <meta> in');
  });
});

describe('policyProblems', () => {
  it('accepts a policy a <meta> can carry', () => {
    expect(
      policyProblems({
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://cdn.example.test'],
        'object-src': ["'none'"],
      }),
    ).toStrictEqual([]);
  });

  it('names every directive a <meta> ignores', () => {
    expect(
      policyProblems({
        'frame-ancestors': ["'none'"],
        'report-uri': ['/csp'],
        sandbox: [],
      }),
    ).toStrictEqual([
      'frame-ancestors is ignored in a <meta> — set it as a header at the host',
      'report-uri is ignored in a <meta> — set it as a header at the host',
      'sandbox is ignored in a <meta> — set it as a header at the host',
    ]);
  });

  it('refuses report-to, whose endpoint only a response header can define', () => {
    expect(policyProblems({ 'report-to': ['csp-endpoint'] })).toStrictEqual([
      'report-to names an endpoint only a Reporting-Endpoints response header defines — set the policy as a header at the host',
    ]);
  });

  it('names a source that is several, or none', () => {
    expect(
      policyProblems({ 'img-src': ["'self' data:", '', 'a;b'] }),
    ).toStrictEqual([
      `"'self' data:" in img-src is not one source — give each its own entry`,
      '"" in img-src is not one source — give each its own entry',
      '"a;b" in img-src is not one source — give each its own entry',
    ]);
  });

  it('refuses strict-dynamic, under which the module script a file cannot sign never loads', () => {
    expect(
      policyProblems({ 'default-src': ["'self'", "'strict-dynamic'"] }),
    ).toStrictEqual([
      `'strict-dynamic' in default-src would block the framework's module script, which a file allows by where it comes from ('self'), not by a hash`,
    ]);
  });

  it('refuses strict-dynamic in script-src-elem, which decides the module script too', () => {
    expect(
      policyProblems({
        'script-src': ["'self'"],
        'script-src-elem': ["'self'", "'strict-dynamic'"],
      }),
    ).toStrictEqual([
      `'strict-dynamic' in script-src-elem would block the framework's module script, which a file allows by where it comes from ('self'), not by a hash`,
    ]);
  });

  it('names a directive name that is not one', () => {
    expect(policyProblems({ 'Script-Src': [] })).toStrictEqual([
      '"Script-Src" is not a directive name',
    ]);
  });
});

const BUTTON = {
  id: 'button',
  name: 'Button',
  js: ['/assets/button-B1.js'],
  css: ['/assets/button-C2.css'],
};

// React が書く形の文書
const documentOf = (head: string, body = ''): string =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"/>${head}</head><body>${body}</body></html>`;

describe('unlinkedDeps', () => {
  it('takes a stylesheet linked in <head>, and a script preloaded there or loaded by a <script>', () => {
    const html = documentOf(
      '<link rel="stylesheet" href="/assets/button-C2.css" data-precedence="vite-rsc/client-reference"/><link rel="modulepreload" href="/assets/button-B1.js"/>',
      '<script type="module" src="/assets/index-D3.js" async=""></script>',
    );

    expect(
      unlinkedDeps(html, [
        BUTTON,
        { id: 'root', name: 'Root', js: ['/assets/index-D3.js'], css: [] },
      ]),
    ).toStrictEqual([]);
  });

  it('names, of each component missing something, only what it misses', () => {
    const html = documentOf(
      '<link rel="modulepreload" href="/assets/button-B1.js"/><link rel="modulepreload" href="/assets/icon-E4.js"/>',
    );

    expect(
      unlinkedDeps(html, [
        BUTTON,
        { id: 'icon', name: 'Icon', js: ['/assets/icon-E4.js'], css: [] },
        { id: 'card', name: 'Card', js: ['/assets/card-F5.js'], css: [] },
      ]),
    ).toStrictEqual([
      { id: 'button', name: 'Button', js: [], css: ['/assets/button-C2.css'] },
      { id: 'card', name: 'Card', js: ['/assets/card-F5.js'], css: [] },
    ]);
  });

  it('does not take a stylesheet that is only preloaded, which applies once a script says so', () => {
    const html = documentOf(
      '<link rel="preload" href="/assets/button-C2.css" as="style"/><link rel="modulepreload" href="/assets/button-B1.js"/>',
    );

    expect(unlinkedDeps(html, [BUTTON])).toStrictEqual([
      { id: 'button', name: 'Button', js: [], css: ['/assets/button-C2.css'] },
    ]);
  });

  it('does not take a <link> in <body>, which the page reaches only once it has started', () => {
    const html = documentOf(
      '<link rel="stylesheet" href="/assets/button-C2.css"/>',
      '<link rel="modulepreload" href="/assets/button-B1.js"/>',
    );

    expect(unlinkedDeps(html, [BUTTON])).toStrictEqual([
      { id: 'button', name: 'Button', js: ['/assets/button-B1.js'], css: [] },
    ]);
  });

  it('does not take a <link> written in a script’s text', () => {
    const html = documentOf(
      `<script>document.write('<link rel="stylesheet" href="/assets/button-C2.css"><link rel="modulepreload" href="/assets/button-B1.js">')</script>`,
    );

    expect(unlinkedDeps(html, [BUTTON])).toStrictEqual([BUTTON]);
  });

  it('reads on after a script whose end tag is written as `</SCRIPT >`', () => {
    const html = documentOf(
      `<script>document.write('<link rel="stylesheet" href="/assets/button-C2.css">')</SCRIPT ><link rel="modulepreload" href="/assets/button-B1.js"/>`,
    );

    expect(unlinkedDeps(html, [BUTTON])).toStrictEqual([
      { id: 'button', name: 'Button', js: [], css: ['/assets/button-C2.css'] },
    ]);
  });

  it('reads a URL as the browser does, its query’s `&` written as `&amp;`', () => {
    const html = documentOf(
      '<link rel="stylesheet" href="https://cdn.example.test/button-C2.css?v=1&amp;w=2"/><link rel="modulepreload" href="https://cdn.example.test/button-B1.js?v=1&amp;w=2"/>',
      '<script type="module" src="https://cdn.example.test/index-D3.js?v=1&amp;w=2" async=""></script>',
    );

    expect(
      unlinkedDeps(html, [
        {
          id: 'button',
          name: 'Button',
          js: ['https://cdn.example.test/button-B1.js?v=1&w=2'],
          css: ['https://cdn.example.test/button-C2.css?v=1&w=2'],
        },
        {
          id: 'root',
          name: 'Root',
          js: ['https://cdn.example.test/index-D3.js?v=1&w=2'],
          css: [],
        },
      ]),
    ).toStrictEqual([]);
  });

  it('reads a document with no </head> as its head', () => {
    const html =
      '<link rel="stylesheet" href="/assets/button-C2.css"/><p>body</p><link rel="modulepreload" href="/assets/button-B1.js"/>';

    expect(unlinkedDeps(html, [BUTTON])).toStrictEqual([]);
  });
});

describe('unlinkedMessage', () => {
  const REPORT = 'This is a bug: report it with this message';

  it('names each file once, the pages that miss it and a component that needs it, the files most pages miss first', () => {
    expect(
      unlinkedMessage(
        new Map([
          [
            '/',
            [
              {
                id: 'button',
                name: 'Button',
                js: ['/assets/entry-A1.js', '/assets/button-B2.js'],
                css: [],
              },
            ],
          ],
          [
            '/about',
            [
              {
                id: 'card',
                name: 'Card',
                js: ['/assets/entry-A1.js'],
                css: ['/assets/card-C3.css'],
              },
            ],
          ],
          [
            '/blog',
            [
              {
                id: 'button',
                name: 'Button',
                js: ['/assets/entry-A1.js'],
                css: [],
              },
            ],
          ],
          [
            '404.html',
            [
              {
                id: 'card',
                name: 'Card',
                js: ['/assets/entry-A1.js'],
                css: [],
              },
            ],
          ],
        ]),
        REPORT,
      ),
    ).toBe(
      [
        'static build wrote HTML that does not link everything the client components its payload names need: 4 HTML files miss 3 files of 2 components',
        REPORT,
        '  /assets/entry-A1.js — 4 pages (/, /about, /blog, …), for Button and 1 more',
        '  /assets/button-B2.js — 1 page (/), for Button',
        '  /assets/card-C3.css — 1 page (/about), for Card',
      ].join('\n'),
    );
  });

  it('names the pages whose handler did not say what their payload names', () => {
    expect(
      unlinkedMessage(
        new Map([
          ['/', null],
          [
            '/about',
            [{ id: 'card', name: 'Card', js: ['/assets/card-B2.js'], css: [] }],
          ],
        ]),
        REPORT,
      ),
    ).toBe(
      [
        'static build wrote HTML that does not link everything the client components its payload names need: 1 HTML file misses 1 file of 1 component, and the handler did not say what the payload of 1 HTML file names',
        REPORT,
        '  1 page (/) — the handler did not say what its payload names',
        '  /assets/card-B2.js — 1 page (/about), for Card',
      ].join('\n'),
    );
  });

  it('counts two default exports as two components', () => {
    expect(
      unlinkedMessage(
        new Map([
          [
            '/',
            [
              {
                id: 'first',
                name: 'default',
                js: ['/assets/entry-A1.js'],
                css: [],
              },
              {
                id: 'second',
                name: 'default',
                js: ['/assets/entry-A1.js'],
                css: [],
              },
            ],
          ],
        ]),
        REPORT,
      ),
    ).toBe(
      [
        'static build wrote HTML that does not link everything the client components its payload names need: 1 HTML file misses 1 file of 2 components',
        REPORT,
        '  /assets/entry-A1.js — 1 page (/), for default and 1 more',
      ].join('\n'),
    );
  });

  it('counts exports of the same name from two modules as two components', () => {
    expect(
      unlinkedMessage(
        new Map([
          [
            '/',
            [
              {
                id: 'menu',
                name: 'Item',
                js: ['/assets/entry-A1.js'],
                css: [],
              },
            ],
          ],
          [
            '/about',
            [
              {
                id: 'list',
                name: 'Item',
                js: ['/assets/entry-A1.js'],
                css: [],
              },
            ],
          ],
        ]),
        REPORT,
      ),
    ).toBe(
      [
        'static build wrote HTML that does not link everything the client components its payload names need: 2 HTML files miss 1 file of 2 components',
        REPORT,
        '  /assets/entry-A1.js — 2 pages (/, /about), for Item and 1 more',
      ].join('\n'),
    );
  });

  // 落ちるのがサイト全体なら、すべてのページのすべての部品が、client entry の
  // 読むファイルを同じように欠く
  it('stays short enough to paste into a report when every page misses what every component needs', () => {
    const message = unlinkedMessage(
      new Map(
        Array.from({ length: 400 }, (_, post) => [
          `/posts/${String(post)}`,
          Array.from({ length: 60 }, (__, component) => ({
            id: `component-${String(component)}`,
            name: `Component${String(component)}`,
            js: [
              '/assets/entry-A1.js',
              '/assets/react-B2.js',
              `/assets/component-${String(component)}.js`,
            ],
            css: [`/assets/component-${String(component)}.css`],
          })),
        ]),
      ),
      REPORT,
    );
    const lines = message.split('\n');

    expect(lines.slice(0, 2)).toStrictEqual([
      'static build wrote HTML that does not link everything the client components its payload names need: 400 HTML files miss 122 files of 60 components',
      REPORT,
    ]);
    expect(lines.at(-1)).toBe('  … and 102 more files');
    expect(lines).toHaveLength(23);
    expect(message.length).toBeLessThan(4000);
  });
});
