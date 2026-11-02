import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture, serveFixture } from '../../fixtures/build';
import type { Mode } from '../host';

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

type Serving = {
  readonly origin: string;
  readonly stop: () => Promise<void>;
};

// ハッシュ付きの資産はファイルから、それ以外はハンドラが答える。
// @k8ordo/framework/serve と同じ分担
const serveBuild = async (mode: Mode): Promise<Serving> => {
  const built = await buildFixture('hydrate-id', { mode });
  const answer = async (url: URL): Promise<Response> => {
    if (!url.pathname.startsWith('/assets/')) {
      return built.handler(new Request(url));
    }
    try {
      const body = await readFile(path.join(built.out, 'client', url.pathname));
      return new Response(body, {
        headers: { 'content-type': 'text/javascript' },
      });
    } catch {
      return new Response(null, { status: 404 });
    }
  };
  let origin = '';
  const server = createServer((incoming, outgoing) => {
    void (async () => {
      const response = await answer(new URL(incoming.url ?? '/', origin));
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    })();
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  origin = `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
  return {
    origin,
    stop: async () => {
      server.close();
      await built.dispose();
    },
  };
};

const serveDev = async (mode: Mode): Promise<Serving> => {
  const { origin, close } = await serveFixture('hydrate-id', { mode });
  return { origin, stop: close };
};

// HTML を描く木とブラウザが hydrate する木の形が違うと、useId はその下の
// すべての部品で HTML と違う id を返す。属性は HTML のまま残るので、
// ブラウザが id で探す要素（aria-labelledby の先、anchor-name）が見つからない
describe.each([
  { how: 'a static build', serve: () => serveBuild('static') },
  { how: 'a server build', serve: () => serveBuild('server') },
  { how: 'vite dev', serve: () => serveDev('static') },
])('the ids useId gives on a page from $how', ({ serve }) => {
  let serving: Serving | undefined;

  beforeAll(async () => {
    serving = await serve();
  }, 120_000);

  afterAll(async () => {
    await serving?.stop();
  });

  const origin = (): string => {
    if (serving === undefined) throw new Error('the fixture is not served');
    return serving.origin;
  };

  describe.each(browserTypes)('in $name', ({ type }) => {
    let browser: Browser;

    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    // Firefox は最初のページを開くだけで数秒かかり、既定の 5 秒に収まらない
    it('are, once the page has hydrated, the ones its HTML was rendered with', async () => {
      const page = await browser.newPage();
      await page.goto(origin());
      await page.waitForFunction(
        () => document.querySelectorAll('[data-hydrated-id]').length === 2,
      );

      const probes = await page.$$eval('[data-hydrated-id]', (nodes) =>
        nodes.map((node) => ({
          name: node.textContent,
          rendered: node.id,
          hydrated: node.dataset.hydratedId,
        })),
      );

      expect(probes.map(({ name }) => name)).toStrictEqual(['layout', 'page']);
      expect(probes.map(({ hydrated }) => hydrated)).toStrictEqual(
        probes.map(({ rendered }) => rendered),
      );
      await page.close();
    }, 30_000);
  });
});
