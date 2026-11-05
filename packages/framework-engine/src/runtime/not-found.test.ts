import type { Browser, Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { browserTypes, buildFixture, serveBuilt } from '../../fixtures/build';
import type { BuiltFixture, ServedBuild } from '../../fixtures/build';

let built: BuiltFixture | undefined;
let served: ServedBuild | undefined;
let browser: Browser;
let origin = '';

// 素の NotFound はビルドされたアプリの中にしか現れないので、テストが
// not-found.tsx を持たないアプリを実際にビルドする
beforeAll(async () => {
  built = await buildFixture('bare-not-found');
  served = await serveBuilt(built);
  ({ origin } = served);
}, 120_000);

afterAll(async () => {
  served?.close();
  await built?.dispose();
});

// hydrate する前のリンクは JS なしの文書の読み込みになり、クライアント遷移の
// 主張をすり抜ける。ブラウザでしか描かれない印が出たら、JS が握っている
const openHydrated = async (url: string): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(url);
  await page.getByText('hydrated').waitFor();
  return page;
};

const payloadRequests = (page: Page): string[] => {
  const pathnames: string[] = [];
  page.on('request', (request) => {
    const { pathname } = new URL(request.url());
    if (pathname.endsWith('.rsc')) pathnames.push(pathname);
  });
  return pathnames;
};

describe.each(browserTypes)(
  'an application that declares no not-found.tsx, in $name',
  ({ type }) => {
    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    // Firefox は最初のページを開くだけで数秒かかり、既定の 5 秒に収まらない
    it('answers a URL no route matches with the framework’s own page, under a real 404', async () => {
      const page = await browser.newPage();

      const response = await page.goto(`${origin}/nowhere`);

      expect(response?.status()).toBe(404);
      await page.getByRole('heading', { name: '404' }).waitFor();
      // ルートレイアウトの中に描かれる: レイアウトのナビゲーションが残る
      await page.getByRole('link', { name: 'nowhere' }).waitFor();
      expect(await page.title()).toBe('Not found');
      await page.close();
    }, 30_000);

    it('shows that page when a client navigation reaches such a URL', async () => {
      const page = await openHydrated(origin);
      const requested = payloadRequests(page);

      await page.getByRole('link', { name: 'nowhere' }).click();

      await page.getByRole('heading', { name: '404' }).waitFor();
      expect(new URL(page.url()).pathname).toBe('/nowhere');
      // 文書の読み込みで行き着いたのではなく、クライアントがペイロードを取りに行った
      expect(requested).toStrictEqual(['/nowhere/index.rsc']);
      await page.close();
    }, 30_000);

    it('takes the visitor back to the page they left', async () => {
      const page = await openHydrated(origin);
      await page.getByRole('link', { name: 'nowhere' }).click();
      await page.getByRole('heading', { name: '404' }).waitFor();

      await page.goBack();

      await page.getByRole('heading', { name: 'home' }).waitFor();
      expect(new URL(page.url()).pathname).toBe('/');
      await page.close();
    }, 30_000);
  },
);
