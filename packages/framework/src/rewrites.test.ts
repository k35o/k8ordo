import type { Shell } from './paths';
import {
  builtRules,
  cloudflareCounts,
  cloudflareMatches,
  formatRedirects,
  parseRedirects,
  rewriteFor,
  rulesOf,
  shellRules,
} from './rewrites';
import type { Rewrite } from './rewrites';

const shellAt = (pattern: string, location: string): Shell => ({
  pattern,
  location,
  pathname: location.replaceAll(/:[A-Za-z_]\w*/gu, '!fallback'),
});

const POSTS = '/:locale/posts/:id';

// Cloudflare が 200 の宛先を符号化し直した綴り
const canonical = (pathname: string): string =>
  pathname
    .split('/')
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');

// examples/static-basic が書き出すもの: 1 と 2 を書き、first は redirect.ts
const STATIC_BASIC_FILES = [
  '404.html',
  '_redirects',
  'assets/index-abc123.js',
  'en/about/index.html',
  'en/about/index.rsc',
  'en/index.html',
  'en/index.rsc',
  'en/posts/!fallback/index.html',
  'en/posts/!fallback/index.rsc',
  'en/posts/1/index.html',
  'en/posts/1/index.rsc',
  'en/posts/2/index.html',
  'en/posts/2/index.rsc',
  'en/posts/first/index.html',
  'index.html',
  'index.rsc',
  'ja/posts/!fallback/index.html',
  'ja/posts/!fallback/index.rsc',
  'ja/posts/1/index.html',
  'ja/posts/1/index.rsc',
  'ja/posts/2/index.html',
  'ja/posts/2/index.rsc',
  'ja/posts/first/index.html',
  'sitemap.xml',
];

const staticBasic = (base: string): string => {
  const shells = shellRules(
    [shellAt(POSTS, '/en/posts/:id'), shellAt(POSTS, '/ja/posts/:id')],
    base,
  );
  const { rules } = builtRules(
    STATIC_BASIC_FILES,
    ['/en/posts/first', '/ja/posts/first'],
    shells,
    [],
    base,
  );
  return formatRedirects(rules, null, shells);
};

describe('the _redirects file', () => {
  it('lists, for examples/static-basic, the built URLs the shell rules would catch and then the shells', () => {
    expect(staticBasic('/')).toBe(
      [
        '# @k8ordo/framework: built URLs the rules below would also catch',
        '/en/posts/1 /en/posts/1 200',
        '/en/posts/1/index.rsc /en/posts/1/index.rsc 200',
        '/en/posts/2 /en/posts/2 200',
        '/en/posts/2/index.rsc /en/posts/2/index.rsc 200',
        '/en/posts/first /en/posts/first 200',
        '/en/posts/first/index.rsc /en/posts/!fallback/ 200',
        '/ja/posts/1 /ja/posts/1 200',
        '/ja/posts/1/index.rsc /ja/posts/1/index.rsc 200',
        '/ja/posts/2 /ja/posts/2 200',
        '/ja/posts/2/index.rsc /ja/posts/2/index.rsc 200',
        '/ja/posts/first /ja/posts/first 200',
        '/ja/posts/first/index.rsc /ja/posts/!fallback/ 200',
        "# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell",
        '/en/posts/:p1 /en/posts/!fallback/ 200',
        '/ja/posts/:p1 /ja/posts/!fallback/ 200',
        '/en/posts/:p1/index.rsc /en/posts/!fallback/index.rsc 200',
        '/ja/posts/:p1/index.rsc /ja/posts/!fallback/index.rsc 200',
        '',
      ].join('\n'),
    );
  });

  it('puts the base in front of both sides of every line', () => {
    expect(staticBasic('/site/')).toBe(
      [
        '# @k8ordo/framework: built URLs the rules below would also catch',
        '/site/en/posts/1 /site/en/posts/1 200',
        '/site/en/posts/1/index.rsc /site/en/posts/1/index.rsc 200',
        '/site/en/posts/2 /site/en/posts/2 200',
        '/site/en/posts/2/index.rsc /site/en/posts/2/index.rsc 200',
        '/site/en/posts/first /site/en/posts/first 200',
        '/site/en/posts/first/index.rsc /site/en/posts/!fallback/ 200',
        '/site/ja/posts/1 /site/ja/posts/1 200',
        '/site/ja/posts/1/index.rsc /site/ja/posts/1/index.rsc 200',
        '/site/ja/posts/2 /site/ja/posts/2 200',
        '/site/ja/posts/2/index.rsc /site/ja/posts/2/index.rsc 200',
        '/site/ja/posts/first /site/ja/posts/first 200',
        '/site/ja/posts/first/index.rsc /site/ja/posts/!fallback/ 200',
        "# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell",
        '/site/en/posts/:p1 /site/en/posts/!fallback/ 200',
        '/site/ja/posts/:p1 /site/ja/posts/!fallback/ 200',
        '/site/en/posts/:p1/index.rsc /site/en/posts/!fallback/index.rsc 200',
        '/site/ja/posts/:p1/index.rsc /site/ja/posts/!fallback/index.rsc 200',
        '',
      ].join('\n'),
    );
  });

  it('places the application’s own rules between the two blocks', () => {
    const text = formatRedirects(
      [{ from: '/a', to: '/a' }],
      '/old /new 301\n',
      [{ from: '/:p1', to: '/!fallback/' }],
    );
    expect(text.split('\n')).toStrictEqual([
      '# @k8ordo/framework: built URLs the rules below would also catch',
      '/a /a 200',
      '/old /new 301',
      "# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell",
      '/:p1 /!fallback/ 200',
      '',
    ]);
  });
});

describe('shellRules', () => {
  it('writes every document rule before any payload rule', () => {
    const rules = shellRules(
      [
        shellAt('/posts/:id', '/posts/:id'),
        shellAt('/tags/:tag', '/tags/:tag'),
      ],
      '/',
    );
    expect(rules.map((rule) => rule.from)).toStrictEqual([
      '/posts/:p1',
      '/tags/:p1',
      '/posts/:p1/index.rsc',
      '/tags/:p1/index.rsc',
    ]);
  });

  it('puts a location with more known segments before its pattern’s others', () => {
    const rules = shellRules(
      [
        shellAt('/:a/:b/:c', '/:a/:b/:c'),
        shellAt('/:a/:b/:c', '/x/y/:c'),
        shellAt('/:a/:b/:c', '/x/:b/:c'),
      ],
      '/',
    ).filter((rule) => rule.to.endsWith('/'));
    expect(rules.map((rule) => rule.from)).toStrictEqual([
      '/x/y/:p1',
      '/x/:p1/:p2',
      '/:p1/:p2/:p3',
    ]);
  });

  it('names its placeholders by position, so a param named _id still makes a rule Cloudflare matches', () => {
    const [document] = shellRules([shellAt('/posts/:_id', '/posts/:_id')], '/');
    expect(document).toStrictEqual({
      from: '/posts/:p1',
      to: '/posts/!fallback/',
    });
    expect(cloudflareMatches('/posts/:p1', '/posts/3')).toBe(true);
  });

  it('writes a known segment in both spellings when a browser sends it otherwise than it is re-encoded', () => {
    const rules = shellRules([shellAt('/:who/:id', '/a@b/:id')], '/');
    expect(rules).toStrictEqual([
      { from: '/a@b/:p1', to: '/a%40b/!fallback/' },
      { from: '/a%40b/:p1', to: '/a%40b/!fallback/' },
      { from: '/a@b/:p1/index.rsc', to: '/a%40b/!fallback/index.rsc' },
      { from: '/a%40b/:p1/index.rsc', to: '/a%40b/!fallback/index.rsc' },
    ]);
  });

  it('keeps the first rule of two with the same from', () => {
    const rules = shellRules(
      [shellAt('/:a', '/:a'), shellAt('/:b/x', '/:b/x'), shellAt('/:a', '/:a')],
      '/',
    );
    const froms = rules.map((rule) => rule.from);
    expect(froms).toStrictEqual([...new Set(froms)]);
  });
});

describe('builtRules', () => {
  const shells = shellRules([shellAt('/posts/:id', '/posts/:id')], '/');

  it('lists a page by its directory and a file by its name, as themselves', () => {
    const { rules } = builtRules(
      [
        'posts/1/index.html',
        'posts/1/index.rsc',
        'posts/feed.html',
        'posts/a.xml',
      ],
      [],
      shells,
      [],
      '/',
    );
    expect(rules).toStrictEqual([
      { from: '/posts/1', to: '/posts/1' },
      { from: '/posts/1/index.rsc', to: '/posts/1/index.rsc' },
      { from: '/posts/a.xml', to: '/posts/a.xml' },
      { from: '/posts/feed', to: '/posts/feed' },
      { from: '/posts/feed.html', to: '/posts/feed.html' },
    ]);
  });

  it('leaves out _redirects and the shells’ own files', () => {
    const { rules } = builtRules(
      ['_redirects', 'posts/!fallback/index.html', 'posts/!fallback/index.rsc'],
      [],
      shellRules([shellAt('/:a/:b', '/:a/:b')], '/'),
      [],
      '/',
    );
    expect(rules).toStrictEqual([]);
  });

  it('answers the payload URL of a redirect.ts and of a route.ts file with the shell’s HTML', () => {
    const { rules } = builtRules(
      ['posts/old/index.html', 'posts/feed.xml'],
      ['/posts/old', '/posts/feed.xml'],
      shells,
      [],
      '/',
    );
    expect(rules).toStrictEqual([
      { from: '/posts/feed.xml', to: '/posts/feed.xml' },
      { from: '/posts/feed.xml/index.rsc', to: '/posts/!fallback/' },
      { from: '/posts/old', to: '/posts/old' },
      { from: '/posts/old/index.rsc', to: '/posts/!fallback/' },
    ]);
  });

  it('lists a URL in both spellings when a browser sends it otherwise than it is re-encoded', () => {
    const { rules } = builtRules(['posts/a@b/index.html'], [], shells, [], '/');
    expect(rules).toStrictEqual([
      { from: '/posts/a%40b', to: '/posts/a%40b' },
      { from: '/posts/a@b', to: '/posts/a%40b' },
    ]);
  });

  it('leaves out, and reports, the spelling of a URL a host would read a placeholder in', () => {
    const { rules, unlisted } = builtRules(
      ['posts/a:b/index.html'],
      [],
      shells,
      [],
      '/',
    );
    expect(rules).toStrictEqual([{ from: '/posts/a%3Ab', to: '/posts/a%3Ab' }]);
    expect(unlisted).toStrictEqual(['/posts/a:b']);
  });

  it('leaves a from the application’s own rules have to them', () => {
    const { rules } = builtRules(
      ['posts/1/index.html'],
      [],
      shells,
      ['/posts/1'],
      '/',
    );
    expect(rules).toStrictEqual([]);
  });

  it('writes every target as Cloudflare re-encodes it, and every identity in the canonical spelling too', () => {
    const shellRewrites = shellRules(
      [
        shellAt('/:who/:id', '/a@b/:id'),
        shellAt('/:who/:id', '/caf%C3%A9/:id'),
        shellAt('/:who/:id', '/x y/:id'),
      ],
      '/',
    );
    const { rules } = builtRules(
      ['a@b/1/index.html', 'café/1/index.html', 'x y/1/index.html'],
      [],
      shellRewrites,
      [],
      '/',
    );
    for (const rule of [...shellRewrites, ...rules]) {
      expect(rule.to).toBe(canonical(rule.to));
    }
    const froms = new Set(rules.map((rule) => rule.from));
    for (const rule of rules)
      expect(froms.has(canonical(rule.from))).toBe(true);
  });
});

describe('cloudflareCounts', () => {
  it('counts the application’s own rules, and every line after the first dynamic one as dynamic', () => {
    const text = formatRedirects(
      [{ from: '/a', to: '/a' }],
      '/old /new 301\n/blog/* /posts/:splat 301\n/later /new 301',
      [{ from: '/:p1', to: '/!fallback/' }],
    );
    expect(cloudflareCounts(text)).toStrictEqual({ static: 2, dynamic: 3 });
  });
});

describe('parseRedirects', () => {
  it('reads the 200 lines made of literals and placeholders, and nothing else', () => {
    expect(
      parseRedirects(
        [
          '# a comment',
          '',
          '/a /b 200',
          '/c /d 301',
          '/e /f 200!',
          '/g/* /h 200',
          '/i /j 200 Country=jp',
          '/k /l',
          '/posts/:p1 /posts/!fallback/ 200',
        ].join('\n'),
      ),
    ).toStrictEqual([
      { from: '/a', to: '/b' },
      { from: '/posts/:p1', to: '/posts/!fallback/' },
    ]);
  });

  it('reads the from of every rule of an application’s own file, comments aside', () => {
    expect(rulesOf('# x\n/a /b 301\n\n/* /index.html 200')).toStrictEqual([
      { line: '/a /b 301', from: '/a' },
      { line: '/* /index.html 200', from: '/*' },
    ]);
  });
});

describe('rewriteFor', () => {
  const rules: Rewrite[] = [
    { from: '/en/posts/1', to: '/en/posts/1' },
    { from: '/en/posts/:p1', to: '/en/posts/!fallback/' },
    { from: '/:p1/posts/:p2', to: '/!fallback/posts/!fallback/' },
  ];

  it('takes one segment for a placeholder', () => {
    expect(rewriteFor(rules, '/en/posts/3')).toBe('/en/posts/!fallback/');
    expect(rewriteFor(rules, '/en/posts/3/4')).toBeNull();
  });

  it('ignores a trailing slash', () => {
    expect(rewriteFor(rules, '/en/posts/3/')).toBe('/en/posts/!fallback/');
  });

  it('answers with the first rule that matches', () => {
    expect(rewriteFor(rules, '/en/posts/1')).toBe('/en/posts/1');
    expect(rewriteFor(rules, '/ja/posts/1')).toBe(
      '/!fallback/posts/!fallback/',
    );
  });
});
