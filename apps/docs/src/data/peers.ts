export type Peer = {
  name: string;
  /** The range as the README prints it, e.g. `≥19.3.0`. */
  version: string;
  optional: boolean;
};

// 版を package.json から直接読まないのは、内部の peer が `workspace:^` で、
// 公開される範囲（次の版）は pnpm のリリース計画にしか無いため。ルートの
// scripts/sync-peer-tables.ts がそれを解いて README の表に書き、CI が差分を
// 検出するので、ここはその表を読む。
const readmes = import.meta.glob<string>('../../../../packages/*/README.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const BLOCK = /<!-- peers -->\n(?<table>[\s\S]*?)<!-- \/peers -->/u;
const ROW =
  /^\| `(?<name>[^`]+)` +\| (?<version>.+?) +\| (?<required>yes|optional) +\|/u;

const manifests = import.meta.glob<{ engines?: { node?: string } }>(
  '../../../../packages/*/package.json',
  { eager: true, import: 'default' },
);

const dirOf = (name: string): string => name.replace(/^@k8ordo\//u, '');

/** The Node.js range a `@k8ordo/*` package declares in `engines`, if any. */
export const nodeOf = (name: string): string | undefined =>
  manifests[`../../../../packages/${dirOf(name)}/package.json`]?.engines?.node;

/** The peer dependencies of a `@k8ordo/*` package, in its README's order. */
export const peersOf = (name: string): readonly Peer[] => {
  const dir = dirOf(name);
  const table = BLOCK.exec(
    readmes[`../../../../packages/${dir}/README.md`] ?? '',
  )?.groups?.table;
  if (table === undefined) {
    throw new Error(
      `${name}: packages/${dir}/README.md has no <!-- peers --> table to read`,
    );
  }
  return table
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .slice(2)
    .map((line) => {
      const row = ROW.exec(line)?.groups;
      if (row === undefined) {
        throw new Error(
          `${name}: a row of the README's peer table is not what scripts/sync-peer-tables.ts writes — got "${line}"`,
        );
      }
      return {
        name: row.name,
        version: row.version,
        optional: row.required === 'optional',
      };
    });
};
