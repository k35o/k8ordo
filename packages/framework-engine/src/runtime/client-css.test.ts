import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

let built: BuiltFixture | undefined;
let html = '';

// client コンポーネントの CSS と JS がどの <link> になるかは、組み上がった
// アプリの HTML にしか現れないので、CSS を import する client コンポーネントを
// レイアウトに置いたアプリをビルドする
beforeAll(async () => {
  built = await buildFixture('client-css');
  html = await (
    await built.handler(new Request('https://k8ordo.test/'))
  ).text();
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

const linked = (rel: string): string[] =>
  [...html.matchAll(/<link\b[^>]*>/gu)]
    .map(([link]) => link)
    .filter((link) => link.includes(`rel="${rel}"`))
    .map((link) => /\bhref="([^"]+)"/u.exec(link)?.[1] ?? '');

const builtFiles = (hrefs: readonly string[]): Promise<string> =>
  Promise.all(
    hrefs.map((href) =>
      readFile(path.join(built?.out ?? '', 'client', href), 'utf8'),
    ),
  ).then((files) => files.join('\n'));

describe('the HTML of a page rendering a client component', () => {
  it('links the stylesheet the component imports', async () => {
    expect(await builtFiles(linked('stylesheet'))).toContain('[data-badge]');
  });

  it('preloads the script the component is in', async () => {
    expect(await builtFiles(linked('modulepreload'))).toContain(
      'a badge from the client',
    );
  });
});
