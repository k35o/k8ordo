import type { ViteDevServer } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { devServer } from '../fixtures/build';

// ビルドしたハンドラでの振る舞いは examples/server-basic が確かめる。dev では
// アプリの import と、ハンドラの runtime の import が、それぞれ Vite に解決されて
// 同じモジュールになるときにだけ、guard が答えている途中のリクエストを読める
describe('the request API an application imports, in vite dev', () => {
  let server: ViteDevServer;
  let origin = '';

  beforeAll(async () => {
    server = await devServer('request-api', 'server');
    await server.listen();
    origin = server.resolvedUrls?.local[0] ?? '';
  }, 60_000);

  afterAll(async () => {
    await server.close();
  });

  // 最初のリクエストが rsc と ssr のグラフをまとめて変換する。CI の負荷の
  // 下ではそれだけで 5 秒を超える
  it('reads and writes the request the handler is answering', async () => {
    const response = await fetch(new URL('/', origin), {
      headers: { cookie: 'visits=3' },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('x-visits')).toBe('3');
  }, 30_000);
});
