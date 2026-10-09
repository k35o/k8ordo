import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { readRules, resolveStatic } from './static-host';

let client: string;

const RULES = [
  { from: '/posts/:p1', to: '/posts/!fallback/' },
  { from: '/posts/:p1/index.rsc', to: '/posts/!fallback/index.rsc' },
  { from: '/gone/:p1', to: '/gone/!fallback/' },
];

const put = async (file: string, body = file): Promise<void> => {
  const at = path.join(client, file);
  await mkdir(path.dirname(at), { recursive: true });
  await writeFile(at, body);
};

beforeEach(async () => {
  client = await mkdtemp(path.join(tmpdir(), 'k8ordo-static-host-'));
  await put('index.html');
  await put('feed.xml');
  await put('posts/1/index.html');
  await put('posts/1/index.rsc');
  await put('posts/!fallback/index.html');
  await put('posts/!fallback/index.rsc');
  await put('404.html');
});

afterEach(async () => {
  await rm(client, { recursive: true, force: true });
});

const served = async (
  pathname: string,
  base = '/',
): Promise<{ file: string; status: number } | null> => {
  const answer = await resolveStatic(client, RULES, pathname, base);
  return answer === null
    ? null
    : {
        file: path.relative(client, answer.file).split(path.sep).join('/'),
        status: answer.status,
      };
};

describe('resolveStatic', () => {
  it('serves a file as it is', async () => {
    expect(await served('/feed.xml')).toStrictEqual({
      file: 'feed.xml',
      status: 200,
    });
  });

  it.each(['/posts/1', '/posts/1/'])(
    "serves %s from its directory's index.html, before any rule",
    async (pathname) => {
      expect(await served(pathname)).toStrictEqual({
        file: 'posts/1/index.html',
        status: 200,
      });
    },
  );

  it("serves a built page's payload before the rule that would catch it", async () => {
    expect(await served('/posts/1/index.rsc')).toStrictEqual({
      file: 'posts/1/index.rsc',
      status: 200,
    });
  });

  it.each([
    ['/posts/3', 'posts/!fallback/index.html'],
    ['/posts/3/', 'posts/!fallback/index.html'],
    ['/posts/%33', 'posts/!fallback/index.html'],
    ['/posts/3/index.rsc', 'posts/!fallback/index.rsc'],
  ])(
    'serves %s from the target of the first rule that matches it',
    async (pathname, file) => {
      expect(await served(pathname)).toStrictEqual({ file, status: 200 });
    },
  );

  it('serves 404.html under 404 for a rule whose target is not there', async () => {
    expect(await served('/gone/3')).toStrictEqual({
      file: '404.html',
      status: 404,
    });
  });

  it('serves 404.html under 404 for a URL nothing answers', async () => {
    expect(await served('/nope')).toStrictEqual({
      file: '404.html',
      status: 404,
    });
  });

  it('answers nothing when there is not even a 404.html', async () => {
    await rm(path.join(client, '404.html'));
    expect(await served('/nope')).toBeNull();
  });

  it('names no file for an escape that does not decode', async () => {
    expect(await served('/%E0%A4%A')).toStrictEqual({
      file: '404.html',
      status: 404,
    });
  });

  it('never serves a file outside the client build', async () => {
    expect(await served('/..%2F..%2Fetc%2Fpasswd')).toStrictEqual({
      file: '404.html',
      status: 404,
    });
  });
});

describe('resolveStatic under a base', () => {
  const UNDER = [
    { from: '/site/posts/:p1', to: '/site/posts/!fallback/' },
    {
      from: '/site/posts/:p1/index.rsc',
      to: '/site/posts/!fallback/index.rsc',
    },
  ];

  const servedUnder = async (pathname: string) => {
    const answer = await resolveStatic(client, UNDER, pathname, '/site/');
    return answer === null
      ? null
      : path.relative(client, answer.file).split(path.sep).join('/');
  };

  it('serves the client build at the base, its index at the base itself', async () => {
    expect(await servedUnder('/site/posts/1')).toBe('posts/1/index.html');
    expect(await servedUnder('/site')).toBe('index.html');
  });

  it('matches the rules, which carry the base, against the whole pathname', async () => {
    expect(await servedUnder('/site/posts/3')).toBe(
      'posts/!fallback/index.html',
    );
  });

  it('answers nothing outside the base', async () => {
    expect(await servedUnder('/posts/1')).toBeNull();
  });
});

describe('readRules', () => {
  it('reads the 200 rules of the client build’s _redirects', async () => {
    await put(
      '_redirects',
      ['# a comment', '/old /new 301', '/posts/:p1 /posts/!fallback/ 200'].join(
        '\n',
      ),
    );
    expect(await readRules(client)).toStrictEqual([
      { from: '/posts/:p1', to: '/posts/!fallback/' },
    ]);
  });

  it('reads none from a build without one', async () => {
    expect(await readRules(client)).toStrictEqual([]);
  });
});
