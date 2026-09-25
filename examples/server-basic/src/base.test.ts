import path from 'node:path';

import { serve } from '@k8ordo/server/serve';
import type { Server } from '@k8ordo/server/serve';
import { chromium } from 'playwright';
import type { Browser } from 'playwright';

// global-setup.ts が base: '/site/' で dist/base/ に書いたビルド
let server: Server;
let browser: Browser;

beforeAll(async () => {
  server = await serve({
    dist: path.resolve(import.meta.dirname, '..', 'dist', 'base'),
    port: 0,
  });
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser.close();
  await server.close();
});

// ページの HTML が読み込むクライアントのスクリプトの URL
const scriptOf = (html: string): string =>
  /src="(\/site\/assets\/[^"]+\.js)"/u.exec(html)?.[1] ?? '';

describe('the application built under a base', () => {
  it('answers its pages below the base, with links and scripts that carry it', async () => {
    const response = await fetch(`${server.url}/site/`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('href="/site/products"');
    expect(html).toMatch(/src="\/site\/assets\/[^"]+\.js"/u);
  });

  it('answers the payload beside a page below the base', async () => {
    const response = await fetch(`${server.url}/site/products/index.rsc`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/x-component');
  });

  it('serves the client build below the base, its hashed assets immutable', async () => {
    const script = scriptOf(await (await fetch(`${server.url}/site/`)).text());

    const response = await fetch(`${server.url}${script}`);

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('immutable');
  });

  it('answers a URL outside the base as one it does not have', async () => {
    const response = await fetch(`${server.url}/products`);

    expect(response.status).toBe(404);
  });

  it('sends a redirect.ts to its target below the base', async () => {
    const response = await fetch(`${server.url}/site/old`, {
      redirect: 'manual',
    });

    expect(response.headers.get('location')).toBe('/site/products');
  });

  it('navigates in place below the base, and follows an action that redirected there', async () => {
    const page = await browser.newPage();
    await page.goto(`${server.url}/site/`);
    // hydrate 前の送信は JS なしの経路を通るので、クライアントの state が
    // 動いたことで JS が握ったのを確かめる
    const counter = page.getByTestId('counter');
    await vi.waitFor(
      async () => {
        await counter.click();
        expect(await counter.textContent()).not.toBe('count 0');
      },
      { timeout: 10_000 },
    );
    // 文書の読み込みが起きれば window ごと入れ替わり、この印は消える
    await page.evaluate(() => {
      Object.assign(window, { stayed: true });
    });

    await page.getByRole('link', { name: 'guide' }).click();
    await page.getByRole('heading', { name: 'guide' }).waitFor();
    expect(new URL(page.url()).pathname).toBe('/site/guide');

    await page.getByRole('link', { name: 'home' }).click();
    await page.getByRole('button', { name: 'leave' }).click();
    await page
      .getByRole('heading', { name: 'products' })
      .waitFor({ timeout: 5000 });
    expect(new URL(page.url()).pathname).toBe('/site/products');
    expect(await page.evaluate(() => 'stayed' in window)).toBe(true);
    await page.close();
  }, 30_000);
});
