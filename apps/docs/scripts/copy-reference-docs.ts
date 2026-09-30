/**
 * Copies the markdown in every package that ships `docs/` into
 * `apps/docs/public/`, so the site serves it verbatim as markdown twins:
 *   packages/<name>/docs/**\/*.md ──(this)──► public/<name>/docs/**\/*.md
 *   packages/ui/docs/**\/*.md     ──(this)──► public/docs/**\/*.md
 *
 * The copies are generated, never committed (see the root `.gitignore`). Links
 * inside the docs are package-relative (`references/typography.md`), and they
 * keep resolving once served because the directory layout is preserved.
 *
 *   node scripts/copy-reference-docs.ts
 */
import { cp, glob, readFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { docsPathOf, shipsDocs } from '../src/data/shipped-docs.ts';
import type { Manifest } from '../src/data/shipped-docs.ts';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

// 載せなくなったパッケージの twin も残さないよう、写す前に全部消す
for await (const twins of glob(['docs', '*/docs'], { cwd: publicDir })) {
  await rm(join(publicDir, twins), { force: true, recursive: true });
}

let copied = 0;
for await (const manifestPath of glob('packages/*/package.json', {
  cwd: root,
})) {
  const manifest = JSON.parse(
    await readFile(join(root, manifestPath), 'utf8'),
  ) as Manifest;
  if (!shipsDocs(manifest)) continue;

  const src = join(root, dirname(manifestPath), 'docs');
  const out = join(publicDir, docsPathOf(manifest.name));
  for await (const file of glob('**/*.md', { cwd: src })) {
    await cp(join(src, file), join(out, file));
    copied += 1;
  }
}
console.warn(`Copied ${String(copied)} markdown docs into public/`);
