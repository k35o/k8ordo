import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const built: Partial<Record<'static' | 'server', BuiltFixture>> = {};

beforeAll(async () => {
  built.static = await buildFixture('client-css', { mode: 'static' });
  built.server = await buildFixture('client-css');
}, 240_000);

afterAll(async () => {
  await built.static?.dispose();
  await built.server?.dispose();
});

const decoded = (bytes: ArrayBuffer | undefined): string =>
  new TextDecoder().decode(bytes);

describe('the payload a document written into a file was rendered from', () => {
  // 1 バイトも違わないことは、本番のビルドでしか言えない。テストの下のビルドは
  // React の開発版を束ね、ペイロードに描画ごとの時刻とスタックが入る。
  // examples/static-basic の build.test.ts が、書かれた index.rsc で確かめる
  it('is the page’s own, kept by the answer the document came in', async () => {
    const { handler, payloadOf } = built.static as BuiltFixture;
    const document = await handler(new Request('https://k8ordo.test/'));

    expect(document.status).toBe(200);
    expect(decoded(payloadOf(document))).toContain('"children":"home"');
  });

  it('is kept for the document alone: a payload’s own answer holds none', async () => {
    const { handler, payloadOf } = built.static as BuiltFixture;
    const asked = await handler(new Request('https://k8ordo.test/index.rsc'));

    expect(payloadOf(asked)).toBeUndefined();
  });

  it('is not kept under a running server, whose HTML streams', async () => {
    const { handler, payloadOf } = built.server as BuiltFixture;
    const document = await handler(new Request('https://k8ordo.test/'));

    expect(payloadOf(document)).toBeUndefined();
  });
});
