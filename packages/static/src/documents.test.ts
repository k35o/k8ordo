import { redirectPage, sitemap } from './documents';

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
});
