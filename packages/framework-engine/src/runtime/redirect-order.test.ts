import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const ORIGIN = 'https://k8ordo.test';

let built: BuiltFixture;

// redirect.ts が表のどこで答えるかは、組み上がったハンドラでしか確かめられない
// ので、[slug]/redirect.ts の隣に about/page.tsx を置いたアプリをビルドする
beforeAll(async () => {
  built = await buildFixture('redirect-beside-literal');
}, 120_000);

afterAll(async () => {
  await built.dispose();
});

describe('a [slug]/redirect.ts beside a literal page', () => {
  it('leaves the literal page its URL', async () => {
    const response = await built.handler(new Request(`${ORIGIN}/about`));
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<h1>about</h1>');
  });

  it('leaves the literal page its payload', async () => {
    const response = await built.handler(
      new Request(`${ORIGIN}/about/index.rsc`),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/x-component;charset=utf-8',
    );
  });

  it('sends every other segment where it redirects', async () => {
    const response = await built.handler(new Request(`${ORIGIN}/elsewhere`));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/');
  });

  it('answers a method other than a read with 405, naming the reads', async () => {
    const response = await built.handler(
      new Request(`${ORIGIN}/elsewhere`, {
        method: 'POST',
        headers: { origin: ORIGIN },
      }),
    );
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET, HEAD');
  });
});
