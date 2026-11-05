import { STYLESHEET_ORDER_HREF } from '@k8ordo/framework-engine';
import { describe, expect, it } from 'vite-plus/test';

import {
  asFile,
  clientFiles,
  policyProblems,
  redirectPage,
  sitemap,
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

// React が書く形の文書
const documentOf = (head: string, body = ''): string =>
  `<!DOCTYPE html><html><head><meta charSet="utf-8"/>${head}</head><body>${body}</body></html>`;

const policyOf = (html: string): string | undefined =>
  /<meta http-equiv="Content-Security-Policy" content="([^"]*)">/u.exec(
    html,
  )?.[1];

// 1 つの client コンポーネントが要るファイル。入口のスクリプトはどれも要る
const needing = (js: string[], css: string[] = []) => ({
  id: '/src/components/x.tsx',
  name: 'default',
  js: ['/assets/entry.js', ...js],
  css,
});

describe('clientFiles', () => {
  it('lists each page’s files by its payload’s path, leaving out what every document links', () => {
    const home = [needing(['/assets/home.js'])];
    const about = [needing(['/assets/about.js'], ['/assets/about.css'])];

    expect(
      clientFiles(
        new Map([
          ['/index.rsc', home],
          ['/about/index.rsc', about],
        ]),
        [home, about],
      ),
    ).toStrictEqual({
      files: ['/assets/about.css', '/assets/about.js', '/assets/home.js'],
      pages: { '/about/index.rsc': [0, 1], '/index.rsc': [2] },
    });
  });

  it('leaves out a page whose files every document links', () => {
    const shared = [needing(['/assets/shared.js'])];
    const about = [needing(['/assets/shared.js', '/assets/about.js'])];

    expect(
      clientFiles(
        new Map([
          ['/index.rsc', shared],
          ['/about/index.rsc', about],
        ]),
        [shared, about],
      ),
    ).toStrictEqual({
      files: ['/assets/about.js'],
      pages: { '/about/index.rsc': [0] },
    });
  });

  it('keeps a file a document that is no page does not link — a 404.html, a shell', () => {
    const home = [needing(['/assets/layout.js'])];
    const notFound = [needing([])];

    expect(
      clientFiles(new Map([['/index.rsc', home]]), [home, notFound]),
    ).toStrictEqual({
      files: ['/assets/layout.js'],
      pages: { '/index.rsc': [0] },
    });
  });

  it('writes the same list whatever order the pages rendered in', () => {
    const a = [needing(['/assets/b.js', '/assets/a.js'])];
    const b = [needing(['/assets/c.js'])];
    const pages = (order: Array<[string, typeof a]>) =>
      clientFiles(
        new Map(order),
        order.map(([, named]) => named),
      );

    expect(
      JSON.stringify(
        pages([
          ['/b/index.rsc', b],
          ['/a/index.rsc', a],
        ]),
      ),
    ).toBe(
      JSON.stringify(
        pages([
          ['/a/index.rsc', a],
          ['/b/index.rsc', b],
        ]),
      ),
    );
  });
});

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

  it('puts the policy first in a <head> that declares no charset, ahead of anything it governs', () => {
    const html = asFile(page(''), NONCE, { 'object-src': ["'none'"] });
    expect(html).toBe(
      `<!DOCTYPE html><html><head><meta http-equiv="Content-Security-Policy" content="object-src &apos;none&apos;"><title>t</title></head><body></body></html>`,
    );
  });

  it('puts the policy right after the charset that opens <head>, with nothing it governs between them', () => {
    const html = asFile(
      documentOf(
        `<script nonce="${NONCE}">console.log(1)</script><link rel="stylesheet" href="/a.css"/>`,
      ),
      NONCE,
      { 'script-src': ["'self'"] },
    );
    expect(html).toBe(
      `<!DOCTYPE html><html><head><meta charSet="utf-8"/><meta http-equiv="Content-Security-Policy" content="script-src &apos;self&apos; &apos;sha256-CihokcEcBW4atb/CW/XWsvWwbTjqwQlE9nj9ii5ww5M=&apos;"><script>console.log(1)</script><link rel="stylesheet" href="/a.css"/></head><body></body></html>`,
    );
  });

  it('keeps the charset within the first 1024 bytes, where a browser looks for it, however many scripts the policy names', () => {
    const scripts = Array.from(
      { length: 30 },
      (_, index) => `<script nonce="${NONCE}">chunk(${String(index)})</script>`,
    ).join('');
    const html = asFile(documentOf('', scripts), NONCE, {
      'script-src': ["'self'"],
    });
    expect(policyOf(html)?.length).toBeGreaterThan(1024);
    expect(
      new TextDecoder().decode(new TextEncoder().encode(html).slice(0, 1024)),
    ).toContain('<meta charSet="utf-8"/>');
  });

  it('never puts the policy behind anything it governs, even to follow a charset declared later', () => {
    const html = asFile(
      '<!DOCTYPE html><html><head><link rel="stylesheet" href="/a.css"/><meta charSet="utf-8"/></head><body></body></html>',
      NONCE,
      { 'object-src': ["'none'"] },
    );
    expect(html).toBe(
      `<!DOCTYPE html><html><head><meta http-equiv="Content-Security-Policy" content="object-src &apos;none&apos;"><link rel="stylesheet" href="/a.css"/><meta charSet="utf-8"/></head><body></body></html>`,
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
