/**
 * Writes `@k8ordo/ui/tokens`: the design tokens of `src/styles/index.css` as
 * the DTCG resolver document better-css-modules exports (Resolver Module
 * 2025.10). The tokens at `:root` are the set, and each mode (`.dark`, the
 * `prefers-contrast: more` overrides) is a modifier.
 *
 *   dist/styles/tokens.mjs    export const tokens = { … }
 *   dist/styles/tokens.d.mts  the same document as a literal type
 *
 * Runs after `vp pack` (`pnpm build`), from this package's directory.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { exportTokens, loadConfig } from '@better-css-modules/core';

const outDir = path.join(import.meta.dirname, '..', 'dist', 'styles');
const document = JSON.stringify(
  await exportTokens(
    await loadConfig({ cwd: path.join(import.meta.dirname, '..') }),
  ),
);

mkdirSync(outDir, { recursive: true });
writeFileSync(
  path.join(outDir, 'tokens.mjs'),
  `export const tokens = ${document};\n`,
);
// JSON はそのまま TypeScript の型リテラルとして読めるので、値と同じ形を型にする
writeFileSync(
  path.join(outDir, 'tokens.d.mts'),
  `export declare const tokens: ${document};\n`,
);
