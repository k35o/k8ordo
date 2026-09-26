import { asFile, policyProblems, redirectPage, sitemap } from './documents';

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

  it('leaves scripts unrestricted when the policy does not restrict them', () => {
    const html = page(`<script nonce="${NONCE}">signed()</script>`);
    expect(policyOf(asFile(html, NONCE, { 'img-src': ["'self'"] }))).toBe(
      'img-src &apos;self&apos;',
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

  it('names a directive name that is not one', () => {
    expect(policyProblems({ 'Script-Src': [] })).toStrictEqual([
      '"Script-Src" is not a directive name',
    ]);
  });
});
