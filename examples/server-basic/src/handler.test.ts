import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

type Handler = (request: Request) => Promise<Response>;

const root = path.resolve(import.meta.dirname, '..');
const ORIGIN = 'https://example.test';
let handler: Handler;

// 主張の対象は組み上がったハンドラなので、テストがビルドを走らせる。
// これは @k8ordo/static が事前描画で呼ぶのと同じ関数でもある
beforeAll(async () => {
  execFileSync('pnpm', ['exec', 'vite', 'build'], { cwd: root, stdio: 'pipe' });
  const entry = pathToFileURL(path.join(root, 'dist', 'rsc', 'index.js')).href;
  ({ default: handler } = (await import(entry)) as { default: Handler });
}, 180_000);

describe('the built request handler', () => {
  it('answers a page with HTML the server rendered', async () => {
    const response = await handler(new Request(`${ORIGIN}/`));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(await response.text()).toContain('rendered on the server');
  });

  it('answers the same page as a payload for a client navigation', async () => {
    const response = await handler(new Request(`${ORIGIN}/products/index.rsc`));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/x-component');
    expect(await response.text()).toContain('first product');
  });

  it('reads the parameter out of the request, with no list of values', async () => {
    expect(
      await (await handler(new Request(`${ORIGIN}/products/2`))).text(),
    ).toContain('second product');
  });

  it('answers a URL it does not have with the not-found page, under a real 404', async () => {
    const response = await handler(new Request(`${ORIGIN}/nowhere`));
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('not found');
  });

  it('refuses a Server Action posted from another origin', async () => {
    const body = new FormData();
    body.set('name', 'mallory');
    const response = await handler(
      new Request(`${ORIGIN}/`, {
        method: 'POST',
        headers: { origin: 'https://attacker.test' },
        body,
      }),
    );
    expect(response.status).toBe(403);
  });
});
