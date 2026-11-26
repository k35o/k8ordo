import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const ORIGIN = 'https://k8ordo.test';

let built: BuiltFixture | undefined;

const answer = (pathname: string, init?: RequestInit): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`${ORIGIN}${pathname}`, init));
};

beforeAll(async () => {
  built = await buildFixture('ended');
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

describe('a guard that ends the request, answered by the built handler', () => {
  it('answers redirect() with a 303 to its URL, the cookies it wrote before it on the answer', async () => {
    const response = await answer('/account');
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/login');
    expect(response.headers.get('set-cookie')).toMatch(/^next=%2Faccount;/u);
  });

  it('answers a payload request for the page with the same redirect', async () => {
    const response = await answer('/account/index.rsc');
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/login');
  });

  it('answers notFound() with the nearest not-found.tsx under 404, and never renders the page', async () => {
    const response = await answer('/hidden');
    expect(response.status).toBe(404);
    const html = await response.text();
    expect(html).toContain('<h1>not found</h1>');
    expect(html).not.toContain('<h1>hidden</h1>');
  });

  it('answers a payload request for a page it said notFound() for with the not-found, under 404', async () => {
    const response = await answer('/hidden/index.rsc');
    expect(response.status).toBe(404);
    const payload = await response.text();
    expect(payload).toContain('"children":"not found"');
    expect(payload).not.toContain('"children":"hidden"');
  });

  it('answers a HEAD it said notFound() for with a bare 404', async () => {
    const response = await answer('/hidden', { method: 'HEAD' });
    expect(response.status).toBe(404);
    expect(response.body).toBeNull();
  });
});

describe('a route.ts that ends the request, answered by the built handler', () => {
  it('answers redirect() with a 303 to its URL', async () => {
    const response = await answer('/api/old');
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/api/new');
  });

  it('answers notFound() with the nearest not-found.tsx under 404', async () => {
    const response = await answer('/api/gone');
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('<h1>not found</h1>');
  });

  it('answers with its own Response otherwise', async () => {
    const response = await answer('/api/7');
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({ id: '7' });
  });
});
