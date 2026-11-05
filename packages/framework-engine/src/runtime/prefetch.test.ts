import { describe, expect, it } from 'vite-plus/test';

import { createPageCache, KEPT_PAGES, PREFETCH_LIFETIME } from './prefetch';

// 時計はテストが進める。読み込みは呼ばれた key と signal と優先度を記録して、
// 既定ではその場で決着する
const setup = (
  files: boolean,
  load: (key: string) => Promise<string> = (key) => Promise.resolve(key),
) => {
  let time = 0;
  const loaded: string[] = [];
  const signals: AbortSignal[] = [];
  const priorities: RequestPriority[] = [];
  const cache = createPageCache(
    (key, signal, priority) => {
      loaded.push(key);
      signals.push(signal);
      priorities.push(priority);
      return load(key);
    },
    { files },
    () => time,
  );
  return {
    cache,
    loaded,
    signals,
    priorities,
    advance: (ms: number) => {
      time += ms;
    },
  };
};

const navigating = (): AbortSignal => new AbortController().signal;

// 決着しない読み込み
const pending = (): Promise<string> =>
  new Promise(() => {
    // 何もしない
  });

// 失敗は then のマイクロタスクで片付く。その後のタスクで読む
const nextTask = (): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('a cache of pages rendered per request', () => {
  it('hands a prefetched load to the first navigation that asks for it', async () => {
    const { cache, loaded } = setup(false);

    void cache.prefetch('/next/index.rsc', 'auto');

    await expect(cache.load('/next/index.rsc', navigating())).resolves.toBe(
      '/next/index.rsc',
    );
    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it('hands it to no second navigation — a later visit fetches afresh', () => {
    const { cache, loaded } = setup(false);
    void cache.prefetch('/next/index.rsc', 'auto');

    void cache.load('/next/index.rsc', navigating());
    void cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
  });

  it('holds nothing a navigation loaded itself', () => {
    const { cache, loaded } = setup(false);

    void cache.load('/next/index.rsc', navigating());
    void cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
  });

  it('loads what a navigation asks for itself under that navigation’s signal', () => {
    const { cache, signals } = setup(false, () => pending());
    const navigation = new AbortController();

    void cache.load('/next/index.rsc', navigation.signal);

    expect(signals[0]).toBe(navigation.signal);
  });

  it('starts no second load while one is held', () => {
    const { cache, loaded } = setup(false);

    void cache.prefetch('/next/index.rsc', 'auto');
    void cache.prefetch('/next/index.rsc', 'auto');

    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it('holds a load until its lifetime from the moment it started runs out', () => {
    const { cache, loaded, advance } = setup(false);
    void cache.prefetch('/next/index.rsc', 'auto');

    advance(PREFETCH_LIFETIME - 1);
    void cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it('forgets a load once its lifetime has run out', () => {
    const { cache, loaded, advance } = setup(false);
    void cache.prefetch('/next/index.rsc', 'auto');

    advance(PREFETCH_LIFETIME);
    void cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
  });

  it('starts a new load for a page whose held load has run out', () => {
    const { cache, loaded, advance } = setup(false);
    void cache.prefetch('/next/index.rsc', 'auto');
    advance(PREFETCH_LIFETIME);

    void cache.prefetch('/next/index.rsc', 'auto');
    void cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
  });

  it('forgets a load that failed, so the navigation asks again', async () => {
    const { cache, loaded } = setup(false, () =>
      Promise.reject(new TypeError('offline')),
    );
    void cache.prefetch('/next/index.rsc', 'auto');
    await nextTask();

    cache.load('/next/index.rsc', navigating()).catch(() => undefined);

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
  });

  it('still hands a failure to the navigation that took the load in flight', async () => {
    let fail!: (error: Error) => void;
    const { cache } = setup(
      false,
      () =>
        new Promise((_resolve, reject) => {
          fail = reject;
        }),
    );
    void cache.prefetch('/next/index.rsc', 'auto');
    const taken = cache.load('/next/index.rsc', navigating());

    fail(new TypeError('offline'));

    await expect(taken).rejects.toThrow('offline');
  });

  it('forgets everything it holds when cleared', () => {
    const { cache, loaded } = setup(false);
    void cache.prefetch('/a/index.rsc', 'auto');
    void cache.prefetch('/b/index.rsc', 'auto');

    cache.clear();
    void cache.load('/a/index.rsc', navigating());
    void cache.load('/b/index.rsc', navigating());

    expect(loaded).toHaveLength(4);
  });

  it('aborts what it forgets before anyone took it, on clear', () => {
    const { cache, signals } = setup(false, () => pending());
    void cache.prefetch('/next/index.rsc', 'auto');

    cache.clear();

    expect(signals[0]?.aborted).toBe(true);
  });

  it('aborts a load whose lifetime ran out before anyone took it', () => {
    const { cache, signals, advance } = setup(false, () => pending());
    void cache.prefetch('/next/index.rsc', 'auto');
    advance(PREFETCH_LIFETIME);

    void cache.prefetch('/other/index.rsc', 'auto');

    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });

  it('hands a taken load to its taker: aborting the taker aborts it', () => {
    const { cache, signals } = setup(false, () => pending());
    void cache.prefetch('/next/index.rsc', 'auto');
    const navigation = new AbortController();
    void cache.load('/next/index.rsc', navigation.signal);

    navigation.abort();

    expect(signals[0]?.aborted).toBe(true);
  });

  it('leaves a taken load alone on clear — it is the taker’s now', () => {
    const { cache, signals } = setup(false, () => pending());
    void cache.prefetch('/next/index.rsc', 'auto');
    void cache.load('/next/index.rsc', navigating());

    cache.clear();

    expect(signals[0]?.aborted).toBe(false);
  });

  it('loads at the priority it was asked to prefetch at', () => {
    const { cache, priorities } = setup(false);

    void cache.prefetch('/next/index.rsc', 'low');

    expect(priorities).toStrictEqual(['low']);
  });
});

describe('a cache of pages written into files', () => {
  it('hands a prefetched page to every navigation to it', async () => {
    const { cache, loaded } = setup(true);
    void cache.prefetch('/next/index.rsc', 'auto');

    await cache.load('/next/index.rsc', navigating());
    await cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it('holds what a navigation loaded itself for the next one', async () => {
    const { cache, loaded } = setup(true);

    await cache.load('/next/index.rsc', navigating());
    await cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it('hands over the page it was given without loading it', async () => {
    const { cache, loaded } = setup(true);

    cache.keep('/index.rsc', 'the document');

    await expect(cache.load('/index.rsc', navigating())).resolves.toBe(
      'the document',
    );
    expect(loaded).toStrictEqual([]);
  });

  it('holds a page however long ago it was loaded', () => {
    const { cache, loaded, advance } = setup(true);
    void cache.prefetch('/next/index.rsc', 'auto');

    advance(PREFETCH_LIFETIME * 100);
    void cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it(`holds ${String(KEPT_PAGES)} pages, giving up the one used least recently`, async () => {
    const { cache, loaded } = setup(true);
    for (let page = 0; page < KEPT_PAGES; page += 1) {
      void cache.prefetch(`/${String(page)}/index.rsc`, 'low');
    }
    // 最初に読んだページを訪ねる。手放されるのは 2 番目になる
    await cache.load('/0/index.rsc', navigating());

    void cache.prefetch('/last/index.rsc', 'low');
    void cache.load('/0/index.rsc', navigating());
    void cache.load('/1/index.rsc', navigating());

    expect(loaded.slice(KEPT_PAGES)).toStrictEqual([
      '/last/index.rsc',
      '/1/index.rsc',
    ]);
  });

  it('aborts a page it gives up while nobody waits for it', () => {
    const { cache, signals } = setup(true, () => pending());

    for (let page = 0; page <= KEPT_PAGES; page += 1) {
      void cache.prefetch(`/${String(page)}/index.rsc`, 'low');
    }

    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });

  it('lets a page it gives up finish once it has arrived', async () => {
    const { cache, loaded, signals } = setup(true);
    void cache.load('/visited/index.rsc', navigating());
    await nextTask();

    for (let page = 0; page < KEPT_PAGES; page += 1) {
      void cache.prefetch(`/${String(page)}/index.rsc`, 'low');
    }
    void cache.load('/visited/index.rsc', navigating());

    // 手放したので取り直す。手放したものは止めていない
    expect(loaded.filter((key) => key === '/visited/index.rsc')).toHaveLength(
      2,
    );
    expect(signals[0]?.aborted).toBe(false);
  });

  it('gives up no page a navigation is waiting for', () => {
    const { cache, loaded, signals } = setup(true, () => pending());
    void cache.load('/waited/index.rsc', navigating());

    for (let page = 0; page < KEPT_PAGES; page += 1) {
      void cache.prefetch(`/${String(page)}/index.rsc`, 'low');
    }
    void cache.load('/waited/index.rsc', navigating());

    expect(signals[0]?.aborted).toBe(false);
    expect(loaded.filter((key) => key === '/waited/index.rsc')).toHaveLength(1);
  });

  it('aborts a load once every navigation waiting for it was overtaken', () => {
    const { cache, signals } = setup(true, () => pending());
    const first = new AbortController();
    const second = new AbortController();
    void cache.load('/next/index.rsc', first.signal);
    void cache.load('/next/index.rsc', second.signal);

    first.abort();
    const afterFirst = signals[0]?.aborted;
    second.abort();

    expect(afterFirst).toBe(false);
    expect(signals[0]?.aborted).toBe(true);
  });

  it('starts afresh for a page whose load was aborted with its navigation', () => {
    const { cache, loaded } = setup(true, () => pending());
    const navigation = new AbortController();
    void cache.load('/next/index.rsc', navigation.signal);

    navigation.abort();
    void cache.load('/next/index.rsc', navigating());

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
  });

  it('lets a page that has arrived finish when its navigation is overtaken', async () => {
    const { cache, signals } = setup(true);
    const navigation = new AbortController();
    await cache.load('/next/index.rsc', navigation.signal);

    navigation.abort();

    expect(signals[0]?.aborted).toBe(false);
  });

  it('forgets a page whose load failed, so the next navigation asks again', async () => {
    const { cache, loaded } = setup(true, () =>
      Promise.reject(new TypeError('offline')),
    );
    void cache.prefetch('/next/index.rsc', 'low');
    await nextTask();

    cache.load('/next/index.rsc', navigating()).catch(() => undefined);

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
  });

  it('loads what a navigation asks for itself at the default priority', () => {
    const { cache, priorities } = setup(true);

    void cache.load('/next/index.rsc', navigating());

    expect(priorities).toStrictEqual(['auto']);
  });
});
