import type { Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import {
  browserTypes,
  buildFixture,
  serveBuilt,
  serveFixture,
} from '../../fixtures/build';
import type { Mode } from '../host';

type Serving = {
  readonly origin: string;
  readonly stop: () => Promise<void>;
};

const serveBuild = async (mode: Mode): Promise<Serving> => {
  const built = await buildFixture('hydrate-id', { mode });
  const { origin, close } = await serveBuilt(built);
  return {
    origin,
    stop: async () => {
      close();
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
