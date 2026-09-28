import { createPrefetchCache, PREFETCH_LIFETIME } from './prefetch';

// 時計はテストが進める。読み込みは呼ばれた key と signal を記録して、
// 既定ではその場で決着する
const setup = (
  load: (key: string) => Promise<string> = (key) => Promise.resolve(key),
) => {
  let time = 0;
  const loaded: string[] = [];
  const signals: AbortSignal[] = [];
  const cache = createPrefetchCache(
    (key, signal) => {
      loaded.push(key);
      signals.push(signal);
      return load(key);
    },
    () => time,
  );
  return {
    cache,
    loaded,
    signals,
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

describe('createPrefetchCache', () => {
  it('hands a prefetched load to the first navigation that asks for it', async () => {
    const { cache, loaded } = setup();

    cache.prefetch('/next/index.rsc');

    await expect(cache.take('/next/index.rsc', navigating())).resolves.toBe(
      '/next/index.rsc',
    );
    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it('hands it to no second navigation — a later visit fetches afresh', () => {
    const { cache } = setup();
    cache.prefetch('/next/index.rsc');

    void cache.take('/next/index.rsc', navigating());

    expect(cache.take('/next/index.rsc', navigating())).toBeUndefined();
  });

  it('starts no second load while one is held', () => {
    const { cache, loaded } = setup();

    cache.prefetch('/next/index.rsc');
    cache.prefetch('/next/index.rsc');

    expect(loaded).toStrictEqual(['/next/index.rsc']);
  });

  it('holds a load until its lifetime from the moment it started runs out', () => {
    const { cache, advance } = setup();
    cache.prefetch('/next/index.rsc');

    advance(PREFETCH_LIFETIME - 1);

    expect(cache.take('/next/index.rsc', navigating())).toBeDefined();
  });

  it('forgets a load once its lifetime has run out', () => {
    const { cache, advance } = setup();
    cache.prefetch('/next/index.rsc');

    advance(PREFETCH_LIFETIME);

    expect(cache.take('/next/index.rsc', navigating())).toBeUndefined();
  });

  it('starts a new load for a page whose held load has run out', () => {
    const { cache, loaded, advance } = setup();
    cache.prefetch('/next/index.rsc');
    advance(PREFETCH_LIFETIME);

    cache.prefetch('/next/index.rsc');

    expect(loaded).toStrictEqual(['/next/index.rsc', '/next/index.rsc']);
    expect(cache.take('/next/index.rsc', navigating())).toBeDefined();
  });

  it('forgets a load that failed, so the navigation asks again', async () => {
    const { cache } = setup(() => Promise.reject(new TypeError('offline')));
    cache.prefetch('/next/index.rsc');

    // 失敗は catch のマイクロタスクで片付く。その後のタスクで読む
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(cache.take('/next/index.rsc', navigating())).toBeUndefined();
  });

  it('still hands a failure to the navigation that took the load in flight', async () => {
    let fail!: (error: Error) => void;
    const { cache } = setup(
      () =>
        new Promise((_resolve, reject) => {
          fail = reject;
        }),
    );
    cache.prefetch('/next/index.rsc');
    const taken = cache.take('/next/index.rsc', navigating());

    fail(new TypeError('offline'));

    await expect(taken).rejects.toThrow('offline');
  });

  it('forgets everything it holds when cleared', () => {
    const { cache } = setup();
    cache.prefetch('/a/index.rsc');
    cache.prefetch('/b/index.rsc');

    cache.clear();

    expect(cache.take('/a/index.rsc', navigating())).toBeUndefined();
    expect(cache.take('/b/index.rsc', navigating())).toBeUndefined();
  });

  it('aborts what it forgets before anyone took it, on clear', () => {
    const { cache, signals } = setup(() => pending());
    cache.prefetch('/next/index.rsc');

    cache.clear();

    expect(signals[0]?.aborted).toBe(true);
  });

  it('aborts a load whose lifetime ran out before anyone took it', () => {
    const { cache, signals, advance } = setup(() => pending());
    cache.prefetch('/next/index.rsc');
    advance(PREFETCH_LIFETIME);

    cache.prefetch('/other/index.rsc');

    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });

  it('hands a taken load to its taker: aborting the taker aborts it', () => {
    const { cache, signals } = setup(() => pending());
    cache.prefetch('/next/index.rsc');
    const navigation = new AbortController();
    void cache.take('/next/index.rsc', navigation.signal);

    navigation.abort();

    expect(signals[0]?.aborted).toBe(true);
  });

  it('leaves a taken load alone on clear — it is the taker’s now', () => {
    const { cache, signals } = setup(() => pending());
    cache.prefetch('/next/index.rsc');
    void cache.take('/next/index.rsc', navigating());

    cache.clear();

    expect(signals[0]?.aborted).toBe(false);
  });
});
