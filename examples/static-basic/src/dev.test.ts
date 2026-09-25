import path from 'node:path';

import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';

const root = path.resolve(import.meta.dirname, '..');

// 主張の対象は「dev サーバがそのモジュールをどう扱うか」なので、テストが本物の
// dev サーバを立てる。プラグインの transform を直接呼ぶ形にすると、RSC の変換が
// 先に走るという肝心の並びごと消えてしまい、拒否が死んでいても気づけない
let server: ViteDevServer;
// guard.ts を置いた構成の dev サーバ。本物より先に立てる: どちらも同じ
// .k8ordo/ に表を書くので、後に立てた本物の表が残る
let guarded: ViteDevServer;
// GET 以外を export する route.ts を置いた構成の dev サーバ
let routed: ViteDevServer;

const start = (config: string): Promise<ViteDevServer> =>
  createServer({
    root,
    configFile: path.join(root, config),
    logLevel: 'error',
  });

beforeAll(async () => {
  guarded = await start('vite.broken-guard.config.ts');
  routed = await start('vite.broken-route.config.ts');
  server = await start('vite.config.ts');
}, 180_000);

afterAll(async () => {
  await guarded.close();
  await routed.close();
  await server.close();
});

const transform = (
  environment: 'rsc' | 'client',
  url: string,
  on: ViteDevServer = server,
): Promise<unknown> => {
  const target = on.environments[environment];
  if (target === undefined) {
    throw new Error(`no ${environment} environment`);
  }
  return target.transformRequest(url);
};

describe('vite dev under @k8ordo/static', () => {
  it('refuses a module that declares a Server Action', async () => {
    await expect(transform('rsc', '/src/refused-action.ts')).rejects.toThrow(
      /static build cannot ship Server Actions/u,
    );
  });

  it('names the file the application would have to change', async () => {
    await expect(transform('rsc', '/src/refused-action.ts')).rejects.toThrow(
      /src\/refused-action\.ts/u,
    );
  });

  it('refuses it in the browser environment too, where a form would import it', async () => {
    await expect(transform('client', '/src/refused-action.ts')).rejects.toThrow(
      /static build cannot ship Server Actions/u,
    );
  });

  it('refuses a guard.ts the moment it is compiled, naming it', async () => {
    await expect(
      transform('rsc', '/src/routes-broken-guard/admin/guard.ts', guarded),
    ).rejects.toThrow(
      /static build cannot run guard\.ts[\s\S]*src\/routes-broken-guard\/admin\/guard\.ts/u,
    );
  });

  it('refuses a route.ts that answers a method a file cannot, the moment it is compiled', async () => {
    await expect(
      transform('rsc', '/src/routes-broken-route/api/route.ts', routed),
    ).rejects.toThrow(
      /a file cannot answer another method[\s\S]*src\/routes-broken-route\/api\/route\.ts \(POST\)/u,
    );
  });

  it('leaves every other module alone', async () => {
    await expect(
      transform('rsc', '/src/routes/page.tsx'),
    ).resolves.not.toBeNull();
    await expect(
      transform('rsc', '/src/routes/_data/catalog.server.ts'),
    ).resolves.not.toBeNull();
  });
});
