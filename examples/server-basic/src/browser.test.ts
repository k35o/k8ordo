import path from 'node:path';

import { serve } from '@k8ordo/server/runtime';
import type { Server } from '@k8ordo/server/runtime';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

let server: Server;
let browser: Browser;

beforeAll(async () => {
  server = await serve({
    dist: path.resolve(import.meta.dirname, '..', 'dist'),
    port: 0,
  });
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser.close();
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

describe('the built application in a browser', () => {
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

  it('keeps the cookie a Server Action set, so the guard lets a client navigation through', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(server.url);
    await hydrated(page);
    await page.evaluate(() => {
      Object.assign(window, { stayed: true });
    });

    await page.getByLabel('name').fill('k8o');
    await page.getByRole('button', { name: 'sign' }).click();
    await page.getByTestId('entries').getByText('k8o').first().waitFor();
    await page.getByRole('link', { name: 'members' }).click();

    await page.getByTestId('member').getByText('k8o').waitFor();
    expect(await page.evaluate(() => 'stayed' in window)).toBe(true);
    await context.close();
  }, 30_000);

  it('hands a client navigation to a page that said notFound() back to the server, which answers 404', async () => {
    const page = await browser.newPage();
    await page.goto(server.url);
    await hydrated(page);
    const responses: Array<{ type: string; status: number }> = [];
    page.on('response', (response) => {
      responses.push({
        type: response.request().resourceType(),
        status: response.status(),
      });
    });

    await page.evaluate(async () => {
      await navigation.navigate('/products/99').committed;
    });

    await page.getByRole('heading', { name: 'not found' }).waitFor();
    expect(new URL(page.url()).pathname).toBe('/products/99');
    expect(
      responses
        .filter((response) => response.type === 'document')
        .map((response) => response.status),
    ).toStrictEqual([404]);
    await page.close();
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
