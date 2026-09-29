import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const ORIGIN = 'https://k8ordo.test';

let built: BuiltFixture | undefined;

const answer = (pathname: string, init?: RequestInit): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`${ORIGIN}${pathname}`, init));
};

// redirect.ts が表のどこで答えるかは、組み上がったハンドラでしか確かめられない
// ので、[slug]/redirect.ts の隣に about/page.tsx を置いたアプリをビルドする
beforeAll(async () => {
  built = await buildFixture('redirect-beside-literal');
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

describe('a [slug]/redirect.ts beside a literal page', () => {
  it('leaves the literal page its URL', async () => {
    const response = await answer('/about');
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<h1>about</h1>');
  });

  it('leaves the literal page its payload', async () => {
    const response = await answer('/about/index.rsc');
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/x-component;charset=utf-8',
    );
  });

  it('leaves a literal redirect beside it its own target', async () => {
    const response = await answer('/gone');
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('/about');
  });

  it.each([
    ['a document', '/elsewhere', 'GET'],
    ['a document spelled with a trailing slash', '/elsewhere/', 'GET'],
    ['a payload', '/elsewhere/index.rsc', 'GET'],
    ['a HEAD', '/elsewhere', 'HEAD'],
  ])(
    'sends %s for any other segment where it redirects',
    async (_what, pathname, method) => {
      const response = await answer(pathname, { method });
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('/');
    },
  );

  it('answers a method other than a read with 405, naming the reads', async () => {
    const response = await answer('/elsewhere', {
      method: 'POST',
      headers: { origin: ORIGIN },
    });
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET, HEAD');
  });
});
