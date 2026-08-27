/**
 * Copies the package's markdown docs into `apps/docs/public/docs/` so the site
 * serves them verbatim as markdown twins of the HTML pages.
 *
 * Single source of truth:
 *   packages/ui/docs/**\/*.md ──(this)──► public/docs/**\/*.md
 *
 * The copies are generated, never committed (see the root `.gitignore`). Links
 * inside the docs are package-relative (`references/typography.md`), and they
 * keep resolving once served because the directory layout is preserved.
 *
 *   node scripts/copy-reference-docs.ts
 */
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const SRC_DIR = fileURLToPath(
  new URL('../../../packages/ui/docs/', import.meta.url),
);
const OUT_DIR = fileURLToPath(new URL('../public/docs/', import.meta.url));

await rm(OUT_DIR, { force: true, recursive: true });
await mkdir(OUT_DIR, { recursive: true });

await cp(SRC_DIR, OUT_DIR, {
  recursive: true,
  filter: (source) =>
    !source.endsWith('.txt') && !source.endsWith('props.generated.json'),
});

const copied = await readdir(OUT_DIR, { recursive: true });
console.warn(
  `Copied ${copied.filter((name) => name.endsWith('.md')).length} markdown docs to public/docs/`,
);
