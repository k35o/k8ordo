import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';
import { forget, seen } from '../../fixtures/locales-first/src/evaluations';

let built: BuiltFixture | undefined;

const answer = (pathname: string): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`https://k8ordo.test${pathname}`));
};

beforeAll(async () => {
  forget();
  built = await buildFixture('locales-first');
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

describe('src/i18n.ts', () => {
  it('runs in the RSC and then the SSR environment, each a module graph of its own, before any module of the application there', async () => {
    expect(await (await answer('/')).text()).toContain('<p>client</p>');
    expect(seen()).toStrictEqual({ layout: 1, page: 1, client: 2 });
  });
});
