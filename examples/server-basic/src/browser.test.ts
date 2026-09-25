import path from 'node:path';

import { serve } from '@k8ordo/server/runtime';
import type { Server } from '@k8ordo/server/runtime';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

let server: Server;
let browser: Browser;

beforeAll(async () => {
  server = await serve({
    dist: path.resolve(import.meta.dirname, '..', 'dist'),
    port: 0,
  });
});

afterAll(async () => {
  await server.close();
});

// hydration 前の送信は JS なしの経路（303）を通って、主張をすり抜ける。
// クライアントの state が動いたことで、JS が握ったのを確かめる
const hydrated = async (page: Page): Promise<void> => {
  const counter = page.getByTestId('counter');
  await vi.waitFor(
    async () => {
      await counter.click();
      expect(await counter.textContent()).not.toBe('count 0');
    },
    { timeout: 10_000 },
  );
};

describe.each(browserTypes)('the built application in $name', ({ type }) => {
  beforeAll(async () => {
    browser = await type.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('follows an action that redirected when JavaScript ran it', async () => {
    const page = await browser.newPage();
    await page.goto(server.url);
    await hydrated(page);
    // 文書の読み込みが起きれば window ごと入れ替わり、この印は消える
    await page.evaluate(() => {
      Object.assign(window, { stayed: true });
    });

    await page.getByRole('button', { name: 'leave' }).click();

    await page
      .getByRole('heading', { name: 'products' })
      .waitFor({ timeout: 5000 });
    expect(new URL(page.url()).pathname).toBe('/products');
    expect(await page.evaluate(() => 'stayed' in window)).toBe(true);
  }, 30_000);

  it('hydrates the page where it streamed in, leaving no hidden copy and one <title>', async () => {
    // ダークの訪問者: ルートの SchemeProvider の値が hydrate の直後に変わる
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    // 商品ページはデータを待つので、その境界はシェルより遅れて届く。
    // ストリームを読み終え、本文が見えてから数える
    await page.goto(`${server.url}/products/1`, { waitUntil: 'load' });
    await page.getByText('scheme: dark').waitFor();
    await page.getByRole('heading', { name: 'first product' }).waitFor();

    expect({
      hiddenSegments: await page.locator('div[hidden][id^="S:"]').count(),
      titles: await page.locator('title').count(),
      headings: await page.getByTestId('title').count(),
    }).toStrictEqual({ hiddenSegments: 0, titles: 1, headings: 1 });
    await context.close();
  });
});
