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
let server: BuiltFixture | undefined;

const answer = (
  fixture: BuiltFixture | undefined,
  pathname: string,
): Promise<Response> => {
  if (fixture === undefined) throw new Error('the fixture was not built');
  return fixture.handler(new Request(`${ORIGIN}${pathname}`));
};

// ページのモジュールはリクエストが届いたときに読むので、評価で投げるのは
// 組み上がったハンドラの中だけ。生成される表をモードごとに書き換えるので順に
beforeAll(async () => {
  built = await buildFixture('page-throws', { mode: 'static' });
  server = await buildFixture('page-throws', { mode: 'server' });
}, 240_000);

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await built?.dispose();
  await server?.dispose();
});

describe('a page whose module throws as it is read, under a build into files', () => {
  it('is answered with a 500 whose body is the message', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await answer(built, '/broken');

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('the settings are missing');
  });

  it('logs the error whole, its stack naming the built file it threw in', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    await answer(built, '/broken');

    expect(errors).toHaveBeenCalledExactlyOnceWith(
      'k8ordo: answering %s failed',
      '/broken',
      expect.objectContaining({
        message: 'the settings are missing',
        stack: expect.stringContaining('fixtures/page-throws/dist-static/rsc/'),
      }),
    );
  });

  it('leaves the other pages answered', async () => {
    const response = await answer(built, '/');

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<h1>home</h1>');
  });
});

describe('a page whose module throws as it is read, under a running server', () => {
  it('rejects, for serve to answer with a 500', async () => {
    await expect(answer(server, '/broken')).rejects.toThrow(
      'the settings are missing',
    );
  });
});
