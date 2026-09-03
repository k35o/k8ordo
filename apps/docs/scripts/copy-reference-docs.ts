/**
 * Copies each package's markdown docs into `apps/docs/public/` so the site
 * serves them verbatim as markdown twins of the HTML pages.
 *
 * Single source of truth, one mapping per package:
 *   packages/ui/docs/**\/*.md    ──(this)──► public/docs/**\/*.md
 *   packages/form/docs/**\/*.md  ──(this)──► public/form/docs/**\/*.md
 *   packages/state/docs/**\/*.md ──(this)──► public/state/docs/**\/*.md
 *
 * `@k8ordo/ui` predates the package-first URL rule and keeps `/docs/…` so its
 * published links stay alive; every later package lives under `/<package>/…`.
 *
 * The copies are generated, never committed (see the root `.gitignore`). Links
 * inside the docs are package-relative (`references/typography.md`), and they
 * keep resolving once served because the directory layout is preserved.
 *
 *   node scripts/copy-reference-docs.ts
 */
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const MAPPINGS = [
  { out: '../public/docs/', src: '../../../packages/ui/docs/' },
  { out: '../public/form/docs/', src: '../../../packages/form/docs/' },
  { out: '../public/state/docs/', src: '../../../packages/state/docs/' },
];

const counts = await Promise.all(
  MAPPINGS.map(async (mapping) => {
    const src = fileURLToPath(new URL(mapping.src, import.meta.url));
    const out = fileURLToPath(new URL(mapping.out, import.meta.url));

    await rm(out, { force: true, recursive: true });
    await mkdir(out, { recursive: true });

    await cp(src, out, {
      recursive: true,
      filter: (source) =>
        !source.endsWith('.txt') && !source.endsWith('props.generated.json'),
    });

    const copied = await readdir(out, { recursive: true });
    return copied.filter((name) => name.endsWith('.md')).length;
  }),
);
console.warn(
  `Copied ${counts.reduce((sum, count) => sum + count, 0)} markdown docs into public/`,
);
