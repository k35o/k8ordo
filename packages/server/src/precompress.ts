import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { brotliCompress, constants, gzip } from 'node:zlib';

import { lookup } from 'mime-types';

import { ENCODINGS, isCompressible, SUFFIX } from './encoding';
import type { Encoding } from './encoding';

const compress: Readonly<Record<Encoding, (data: Buffer) => Promise<Buffer>>> =
  {
    br: (data) =>
      promisify(brotliCompress)(data, {
        params: {
          [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
          [constants.BROTLI_PARAM_SIZE_HINT]: data.length,
        },
      }),
    gzip: (data) =>
      promisify(gzip)(data, { level: constants.Z_BEST_COMPRESSION }),
  };

/**
 * Writes `<file>.br` and `<file>.gz` beside every file under `dir` whose type
 * is worth compressing, once and at the slowest, smallest setting — the work
 * a request would otherwise repeat. A copy that came out no smaller than the
 * file is not written. Returns how many files got one.
 */
export const precompress = async (dir: string): Promise<number> => {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const written = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const file = path.join(entry.parentPath, entry.name);
        const type = lookup(file);
        if (type === false || !isCompressible(type)) return false;
        const data = await readFile(file);
        const copies = await Promise.all(
          ENCODINGS.map(async (encoding) => {
            const compressed = await compress[encoding](data);
            if (compressed.length >= data.length) return false;
            await writeFile(`${file}${SUFFIX[encoding]}`, compressed);
            return true;
          }),
        );
        return copies.includes(true);
      }),
  );
  return written.filter(Boolean).length;
};
