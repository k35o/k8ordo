import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';

import { precompress } from './precompress';

// 圧縮が効くだけの長さがある、よくある形のスクリプト
const SCRIPT = 'export const greet = (name) => name.toUpperCase();\n'.repeat(
  200,
);

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'k8ordo-precompress-'));
  await mkdir(path.join(dir, 'assets'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('precompress', () => {
  it('writes a br and a gz copy beside a text file, each decoding to the file', async () => {
    await writeFile(path.join(dir, 'assets', 'app-abc123.js'), SCRIPT);

    expect(await precompress(dir)).toBe(1);

    const br = await readFile(path.join(dir, 'assets', 'app-abc123.js.br'));
    const gz = await readFile(path.join(dir, 'assets', 'app-abc123.js.gz'));
    expect(brotliDecompressSync(br).toString()).toBe(SCRIPT);
    expect(gunzipSync(gz).toString()).toBe(SCRIPT);
  });

  it('leaves a file in an already compressed format alone', async () => {
    await writeFile(path.join(dir, 'photo.png'), SCRIPT);

    expect(await precompress(dir)).toBe(0);
    expect((await readdir(dir)).toSorted()).toStrictEqual([
      'assets',
      'photo.png',
    ]);
  });

  it('writes no copy that came out larger than the file', async () => {
    await writeFile(path.join(dir, 'robots.txt'), 'a');

    expect(await precompress(dir)).toBe(0);
    expect((await readdir(dir)).toSorted()).toStrictEqual([
      'assets',
      'robots.txt',
    ]);
  });
});
