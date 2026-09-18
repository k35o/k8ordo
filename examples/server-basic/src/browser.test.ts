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
});
