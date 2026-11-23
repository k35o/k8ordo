import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const ORIGIN = 'https://k8ordo.test';

let built: BuiltFixture | undefined;

const answer = (pathname: string, init?: RequestInit): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`${ORIGIN}${pathname}`, init));
};

const htmlOf = async (pathname: string): Promise<string> => {
  const response = await answer(pathname);
  return response.text();
};

// [...name] が何を受け、何に配列を渡すかは、組み上がったハンドラでしか
// 確かめられないので、自前のアプリをビルドする
beforeAll(async () => {
  built = await buildFixture('rest');
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

describe('a [...name] directory, answered by the built handler', () => {
  it('hands its page every remaining segment as an array', async () => {
    const response = await answer('/files/a/b/c');
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('data-count="3"');
    expect(html).toContain('data-path="a|b|c"');
    expect(html).toContain('data-pathname="/files/a/b/c"');
  });

  it('hands its layout the same array', async () => {
    expect(await htmlOf('/files/a/b')).toContain('data-layout="a|b"');
  });

  it('decodes each segment on its own, so an escaped slash stays inside one', async () => {
    expect(await htmlOf('/files/a%2Fb/caf%C3%A9')).toContain(
      'data-path="a/b|café"',
    );
  });

  it('answers a payload request for the same page', async () => {
    const response = await answer('/files/a/b/index.rsc');
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/x-component;charset=utf-8',
    );
  });

  it('leaves zero segments to the page of the directory above', async () => {
    expect(await htmlOf('/files')).toContain('<h1>files</h1>');
    expect(await htmlOf('/files/')).toContain('<h1>files</h1>');
  });

  it('leaves zero segments to the not-found when the directory above has no page', async () => {
    const response = await answer('/docs');
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('<h1>not found</h1>');
  });

  it('comes after a literal beside it', async () => {
    expect(await htmlOf('/files/readme')).toContain('<h1>readme</h1>');
  });

  it('comes after a [name] beside it, and answers what its schema refused', async () => {
    expect(await htmlOf('/files/7')).toContain('data-id="7"');
    expect(await htmlOf('/files/seven')).toContain('data-path="seven"');
  });

  it('hands a paramsSchema the array, and its page what the schema made of it', async () => {
    expect(await htmlOf('/docs/guide/intro')).toContain(
      'data-path="GUIDE|INTRO"',
    );
  });

  it('is a pathname it does not answer when its schema refuses, so the not-found does', async () => {
    const response = await answer('/docs/private/keys');
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('<h1>not found</h1>');
  });

  it('hands a route.ts the array', async () => {
    const response = await answer('/api/v1/users/a%2Fb');
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual(['v1', 'users', 'a/b']);
  });

  it('hands a guard.ts the array', async () => {
    const response = await answer('/api/secret/keys');
    expect(response.status).toBe(401);
    expect(await response.text()).toBe('no secret|keys');
  });

  it('moves every segment into a redirect target that names it, as the URL spelled them', async () => {
    const response = await answer('/old/a%2Fb/caf%C3%A9');
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/files/a%2Fb/caf%C3%A9');
  });
});
