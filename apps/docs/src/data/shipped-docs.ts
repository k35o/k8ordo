// scripts/copy-reference-docs.ts reads this with plain Node, which resolves
// no extensionless specifier or alias: keep it free of value imports.
export type Manifest = {
  name: string;
  private?: boolean;
  files?: readonly string[];
};

export const shipsDocs = (manifest: Manifest): boolean =>
  manifest.private !== true &&
  (manifest.files ?? []).some(
    (entry) => entry === 'docs' || entry.startsWith('docs/'),
  );

/**
 * Where the site serves a package's shipped `docs/` as markdown twins.
 * `@k8ordo/ui` keeps `/docs/` rather than `/ui/docs/`: its twins predate the
 * package-first URL rule, and links to them are already published.
 */
export const docsPathOf = (name: string): string =>
  name === '@k8ordo/ui'
    ? '/docs/'
    : `/${name.replace(/^@k8ordo\//u, '')}/docs/`;
