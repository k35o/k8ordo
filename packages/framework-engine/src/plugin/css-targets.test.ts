import { glob, readFile } from 'node:fs/promises';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

let built: BuiltFixture | undefined;
let css = '';

// 既定の postcss ではなく lightningcss で組む。CSS が Lightning CSS を
// 変換と圧縮の 2 度通るので、どちらの target が外れていても落ちる
beforeAll(async () => {
  built = await buildFixture('css-targets', {
    plugins: [
      {
        name: 'app:lightningcss',
        config: () => ({ css: { transformer: 'lightningcss' } }),
      },
    ],
  });
  const { out } = built;
  const files = await Array.fromAsync(glob('**/*.css', { cwd: out }));
  css = (
    await Promise.all(
      files.map((file) => readFile(path.join(out, file), 'utf8')),
    )
  ).join('\n');
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

describe('the stylesheets an application that names no target builds', () => {
  it('keep light-dark() as written, so a .dark below the root darkens what it holds', () => {
    expect(css).toContain('--ink:light-dark(#111,#eee)');
    expect(css).toContain('background-color:light-dark(#fff,#000)');
  });

  it('keep :dir() as written, so it follows dir rather than lang', () => {
    expect(css).toContain('[data-flip]:dir(rtl)');
  });
});
