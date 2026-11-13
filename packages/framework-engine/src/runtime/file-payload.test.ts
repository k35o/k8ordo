import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

let built: BuiltFixture | undefined;

// フィクスチャは自分のものを持つ。並んで走るほかのテストと同じものを別の mode
// でビルドすると、生成される .k8ordo/ を取り合う
beforeAll(async () => {
  built = await buildFixture('file-payload', { mode: 'static' });
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

const decoded = (bytes: ArrayBuffer | undefined): string =>
  new TextDecoder().decode(bytes);

describe('the payload a document written into a file was rendered from', () => {
  // 1 バイトも違わないことは、本番のビルドでしか言えない。テストの下のビルドは
  // React の開発版を束ね、ペイロードに描画ごとの時刻とスタックが入る。
  // examples/static-basic の build.test.ts が、書かれた index.rsc で確かめる
  it('is the page’s own, kept by the answer the document came in', async () => {
    const { handler, payloadOf } = built as BuiltFixture;
    const document = await handler(new Request('https://k8ordo.test/'));

    expect(document.status).toBe(200);
    expect(decoded(payloadOf(document))).toContain('"children":"home"');
  });

  it('is kept for the document alone: a payload’s own answer holds none', async () => {
    const { handler, payloadOf } = built as BuiltFixture;
    const asked = await handler(new Request('https://k8ordo.test/index.rsc'));

    expect(payloadOf(asked)).toBeUndefined();
  });
});
