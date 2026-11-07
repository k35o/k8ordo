import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { preloadClientFiles, readClientFiles } from './client-files';
import type { ClientFiles } from './payload';

const passThrough = globalThis.fetch;

// ビルドの書いた一覧を返すホスト。一覧のほかは本物に回す
const listing = (answer: () => Response): void => {
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      input instanceof Request ? input.url : input,
      location.href,
    );
    if (url.pathname !== '/client-files.json') return passThrough(input, init);
    return Promise.resolve(answer());
  });
};

const listed = (files: ClientFiles): Response => Response.json(files);

const linksTo = (href: string): Array<{ rel: string; as: string }> =>
  [...document.head.querySelectorAll('link')]
    .filter((link) => link.getAttribute('href') === href)
    .map((link) => ({ rel: link.rel, as: link.as }));

afterEach(() => {
  vi.unstubAllGlobals();
  for (const link of document.head.querySelectorAll('link[href^="/listed/"]')) {
    link.remove();
  }
});

describe('the files a static build listed for each page', () => {
  it('links the scripts of a page as module preloads, and its stylesheets as preloads', async () => {
    listing(() =>
      listed({
        files: ['/listed/page.js', '/listed/page.css'],
        pages: { '/next/index.rsc': [0, 1] },
      }),
    );
    await readClientFiles();

    preloadClientFiles('/next/index.rsc', 'auto');

    expect(linksTo('/listed/page.js')).toStrictEqual([
      { rel: 'modulepreload', as: '' },
    ]);
    expect(linksTo('/listed/page.css')).toStrictEqual([
      { rel: 'preload', as: 'style' },
    ]);
  });

  it('links them at the priority its payload is asked for at', async () => {
    listing(() =>
      listed({
        files: ['/listed/ahead.js', '/listed/ahead.css'],
        pages: { '/ahead/index.rsc': [0, 1] },
      }),
    );
    await readClientFiles();

    preloadClientFiles('/ahead/index.rsc', 'low');

    expect(
      Array.from(
        document.head.querySelectorAll<HTMLLinkElement>(
          'link[href^="/listed/ahead."]',
        ),
        (link) => link.fetchPriority,
      ),
    ).toStrictEqual(['low', 'low']);
  });

  it('finds a page by its payload’s path, whatever the search', async () => {
    listing(() =>
      listed({
        files: ['/listed/search.js'],
        pages: { '/search/index.rsc': [0] },
      }),
    );
    await readClientFiles();

    preloadClientFiles('/search/index.rsc?q=shoes', 'auto');

    expect(linksTo('/listed/search.js')).toHaveLength(1);
  });

  it('links a file once however many pages list it', async () => {
    listing(() =>
      listed({
        files: ['/listed/shared.js'],
        pages: { '/a/index.rsc': [0], '/b/index.rsc': [0] },
      }),
    );
    await readClientFiles();

    preloadClientFiles('/a/index.rsc', 'auto');
    preloadClientFiles('/b/index.rsc', 'auto');

    expect(linksTo('/listed/shared.js')).toHaveLength(1);
  });

  it('links nothing the document links already — a stylesheet it applied is preloaded for nobody', async () => {
    const applied = document.createElement('link');
    applied.rel = 'stylesheet';
    applied.href = '/listed/applied.css';
    document.head.append(applied);
    listing(() =>
      listed({
        files: ['/listed/applied.css', '/listed/fresh.css'],
        pages: { '/applied/index.rsc': [0, 1] },
      }),
    );
    await readClientFiles();

    preloadClientFiles('/applied/index.rsc', 'auto');

    expect(linksTo('/listed/applied.css')).toStrictEqual([
      { rel: 'stylesheet', as: '' },
    ]);
    expect(linksTo('/listed/fresh.css')).toStrictEqual([
      { rel: 'preload', as: 'style' },
    ]);
  });

  it('links nothing for a page the list leaves out', async () => {
    listing(() =>
      listed({
        files: ['/listed/other.js'],
        pages: { '/other/index.rsc': [0] },
      }),
    );
    await readClientFiles();

    preloadClientFiles('/unlisted/index.rsc', 'auto');

    expect(
      document.head.querySelectorAll('link[href^="/listed/"]'),
    ).toHaveLength(0);
  });

  it.each([
    ['the host has no list', () => new Response('not found', { status: 404 })],
    [
      'the host answers with something else',
      () =>
        new Response('<!doctype html>', {
          headers: { 'content-type': 'text/html' },
        }),
    ],
  ])('settles quietly when %s', async (_, answer) => {
    listing(answer);

    await expect(readClientFiles()).resolves.toBeUndefined();
  });

  it('asks for the list at low priority', async () => {
    let priority: RequestPriority | undefined;
    vi.stubGlobal('fetch', (_input: RequestInfo | URL, init?: RequestInit) => {
      priority = init?.priority;
      return Promise.resolve(listed({ files: [], pages: {} }));
    });

    await readClientFiles();

    expect(priority).toBe('low');
  });
});
