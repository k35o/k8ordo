import type { Transform } from 'node:stream';
import { constants, createBrotliCompress, createGzip } from 'node:zlib';

import compressible from 'compressible';
import Negotiator from 'negotiator';

/** The content codings `serve` sends, the more compact first. */
export const ENCODINGS = ['br', 'gzip'] as const;
export type Encoding = (typeof ENCODINGS)[number];

/** Where the build leaves each coding's copy of a file: beside it. */
export const SUFFIX: Readonly<Record<Encoding, string>> = {
  br: '.br',
  gzip: '.gz',
};

/**
 * Which of `available` the request accepts best, or `null` for the bytes as
 * they are. A client that accepts both equally gets `br`; one that refuses
 * everything (`identity;q=0` and nothing else) still gets the bytes — a
 * page it cannot decode helps no one more than one it did not ask for.
 */
export const negotiateEncoding = (
  acceptEncoding: string | undefined,
  available: readonly Encoding[],
): Encoding | null => {
  if (available.length === 0) return null;
  const chosen = new Negotiator({
    headers: { 'accept-encoding': acceptEncoding },
  }).encoding([...available, 'identity'], { preferred: ENCODINGS });
  return available.find((encoding) => encoding === chosen) ?? null;
};

/** Whether a body of this `content-type` is worth compressing. */
export const isCompressible = (type: string): boolean =>
  compressible(type) === true;

/**
 * A compressor that hands on what it has after every chunk. React writes a
 * page as it renders — the shell first, each boundary as its data arrives —
 * and a compressor left to fill its own buffer would hold the shell back
 * until the slowest boundary was done, which is the streaming undone.
 */
export const streamingCompressor = (encoding: Encoding): Transform =>
  encoding === 'br'
    ? createBrotliCompress({
        flush: constants.BROTLI_OPERATION_FLUSH,
        // 既定の 11 はビルド時に一度だけ圧縮するファイル向け。リクエストごとに
        // 払うと、減るバイトより CPU のほうが高くつく
        params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
      })
    : createGzip({ flush: constants.Z_SYNC_FLUSH });
