import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const ORIGIN = 'https://k8ordo.test';

let built: BuiltFixture | undefined;

/** A host that keeps what it was asked to wait for. */
const hostOf = () => {
  const held: Array<Promise<unknown>> = [];
  return {
    held,
    waitUntil: (promise: Promise<unknown>): void => {
      held.push(promise);
    },
  };
};

const answer = (
  pathname: string,
  host?: ReturnType<typeof hostOf>,
): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`${ORIGIN}${pathname}`), host);
};

// waitUntil() が読むのは答えている途中のリクエストなので、route.ts がそれを
// 呼ぶアプリをビルドし、組み上がったハンドラをホストの代わりに呼ぶ
beforeAll(async () => {
  built = await buildFixture('wait-until');
}, 120_000);

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await built?.dispose();
});

describe('waitUntil() in a built handler', () => {
  it('hands the host a promise for what a route.ts asked it to wait for', async () => {
    const host = hostOf();

    const response = await answer('/work', host);

    expect(await response.text()).toBe('answered');
    expect(host.held).toHaveLength(1);
    await expect(host.held[0]).resolves.toBeUndefined();
  });

  it('hands the host what a route.ts asks for from inside the stream it answered with', async () => {
    const host = hostOf();

    const response = await answer('/stream', host);

    expect(await response.text()).toBe('first second last');
    expect(host.held).toHaveLength(1);
  });

  it('hands the host what a page asks for as it renders', async () => {
    const host = hostOf();

    const response = await answer('/rendered', host);

    expect(await response.text()).toContain('<h1>rendered</h1>');
    expect(host.held).toHaveLength(1);
  });

  it('answers the same with no host to hand the promise to', async () => {
    const response = await answer('/work');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('answered');
  });

  it('logs a rejection once, naming the request, and hands the host a promise that does not reject', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const host = hostOf();

    await answer('/work?fail', host);

    await expect(host.held[0]).resolves.toBeUndefined();
    expect(errors).toHaveBeenCalledExactlyOnceWith(
      'k8ordo: waitUntil() of %s %s failed',
      'GET',
      '/work',
      expect.objectContaining({ message: 'the save failed' }),
    );
  });

  it('logs a rejection once with no host either, leaving none unhandled', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled = vi.fn<(reason: unknown) => void>();
    process.on('unhandledRejection', unhandled);

    try {
      await answer('/work?fail');
      // 未処理の rejection は、マイクロタスクが尽きた後に Node が知らせる
      await new Promise((resolve) => {
        setImmediate(resolve);
      });
    } finally {
      process.off('unhandledRejection', unhandled);
    }

    expect(unhandled).not.toHaveBeenCalled();
    expect(errors).toHaveBeenCalledExactlyOnceWith(
      'k8ordo: waitUntil() of %s %s failed',
      'GET',
      '/work',
      expect.objectContaining({ message: 'the save failed' }),
    );
  });
});
