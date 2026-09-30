// 各パッケージの README の peer 表を、package.json から書き直す。
//
// 版と「必須か optional か」は manifest（peerDependencies と
// peerDependenciesMeta）が持っていて、README に手で写すとずれる。何のために
// 要るのかは manifest に置く欄が無いので、README の行に残す。表は
// <!-- peers --> … <!-- /peers --> の間に置き、この間の行から説明をパッケージ名で
// 引き継いで、版と Required の列だけを manifest から組み直す。行の順序は README に
// 書いた順のまま。説明の無い peer と、peer でない行があれば失敗する。
//
// 内部の peer は manifest に `workspace:^` と書く（pnpm のリリース計画が
// それ以外を拒む）。公開時に pnpm が `^<相手のその時の版>` に書き換えるが、
// 相手の版はリリース PR がマージされるまで上がらない。今の版から組むと、README は
// 公開されない範囲（`^0.1.0`）を書き、リリース PR が版を上げた時点で差分になる。
// リリース PR のブランチは bot が作り直すので、そこで README を直す機会は無い。
// pending の intent を当てた「次の版」をリリース計画から読めば、リリース PR の
// 前後で同じ表になる。
//
// docs サイトの入門ページ（apps/docs/src/data/peers.ts）は、ここで書いた表を
// 読む。列を変えるときは両方を直す。
//
// `--check` は書き換えずに差分があれば失敗する（CI 用）。
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type Manifest = {
  name: string;
  version: string;
  private?: boolean;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

const root = path.resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');

const packages = readdirSync(path.join(root, 'packages'))
  .toSorted()
  .map((dir) => ({
    readme: path.join(root, 'packages', dir, 'README.md'),
    manifest: JSON.parse(
      readFileSync(path.join(root, 'packages', dir, 'package.json'), 'utf8'),
    ) as Manifest,
  }));

// 次に公開される版。計画に載らないパッケージは、今の版のまま公開されている
const nextVersions = new Map(
  packages.map(({ manifest }) => [manifest.name, manifest.version]),
);
// `--json` を付けても dry-run の出力はテキストのまま（pnpm 12.4.2）
const plan = execFileSync('pnpm', ['version', '-r', '--dry-run'], {
  cwd: root,
  encoding: 'utf8',
});
// 出力の形が変わったときに「計画が空」と読み違えて今の版を書かないよう、
// 知っている 2 つの形のどちらでもなければ止める
if (!/^(?:Release plan:|No pending changes\.)/u.test(plan)) {
  throw new Error(
    `\`pnpm version -r --dry-run\` printed neither a release plan nor "No pending changes.":\n${plan}`,
  );
}
for (const { groups } of plan.matchAll(
  /^ {2}(?<name>\S+): \S+ → (?<next>\S+) \(/gmu,
)) {
  if (groups?.name !== undefined && groups.next !== undefined) {
    nextVersions.set(groups.name, groups.next);
  }
}

const publishedRange = (owner: string, name: string, range: string): string => {
  if (!range.startsWith('workspace:')) return range.replaceAll('>=', '≥');
  const next = nextVersions.get(name);
  if (range !== 'workspace:^' || next === undefined) {
    throw new Error(
      `${owner}: cannot tell what "${name}": "${range}" is published as — only \`workspace:^\` on a package under packages/ is handled`,
    );
  }
  return `^${next}`;
};

const HEAD = ['Package', 'Version', 'Required', 'Needed for'];

// oxfmt が整形した後と同じ形（列の幅をそろえた表）で書く。違う形で書くと、
// 整形と生成が互いの出力を差分とみなす
const table = (rows: readonly string[][]): string => {
  const widths = [HEAD, ...rows].reduce<number[]>(
    (max, row) =>
      row.map((cell, column) => Math.max(cell.length, max[column] ?? 0)),
    [],
  );
  const line = (cells: readonly string[], fill = ' '): string =>
    `| ${cells.map((cell, column) => cell.padEnd(widths[column] ?? 0, fill)).join(' | ')} |`;
  return [
    line(HEAD),
    line(
      HEAD.map(() => ''),
      '-',
    ),
    ...rows.map((row) => line(row)),
  ].join('\n');
};

const BLOCK = /<!-- peers -->\n[\s\S]*?<!-- \/peers -->\n/gu;
// 先頭の欄がパッケージ名、最後の欄が説明。間の欄は書き直すので読まない
const ROW = /^\| `(?<name>[^`]+)` +\|.*\| (?<neededFor>.*?) *\|$/u;

let drift = 0;
for (const { readme, manifest } of packages) {
  const peers = manifest.peerDependencies ?? {};
  if (manifest.private === true || Object.keys(peers).length === 0) continue;

  const file = path.relative(root, readme);
  const before = readFileSync(readme, 'utf8');
  const blocks = before.match(BLOCK) ?? [];
  const [block] = blocks;
  if (block === undefined || blocks.length > 1) {
    throw new Error(
      `${file}: <!-- peers --> … <!-- /peers --> must appear exactly once, found ${String(blocks.length)}`,
    );
  }

  const neededFor = new Map<string, string>();
  for (const row of block
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .slice(2)) {
    const { name, neededFor: text } = ROW.exec(row)?.groups ?? {};
    if (name === undefined || text === undefined || neededFor.has(name)) {
      throw new Error(
        `${file}: a row of the peer table is \`| \`<name>\` | … | <what it is needed for> |\`, one per package — got "${row}"`,
      );
    }
    neededFor.set(name, text);
  }

  const unexplained = Object.keys(peers).filter(
    (name) => (neededFor.get(name) ?? '') === '',
  );
  if (unexplained.length > 0) {
    throw new Error(
      `${file}: nothing under "Needed for" for the peer ${unexplained.join(', ')} — add \`| \`<name>\` | | | <what it is needed for> |\` to the peer table, then run \`pnpm check:write\``,
    );
  }

  const rows = [...neededFor].map(([name, text]) => {
    const range = peers[name];
    if (range === undefined) {
      throw new Error(
        `${file}: ${name} has a row in the peer table but is not in peerDependencies — remove the row`,
      );
    }
    return [
      `\`${name}\``,
      publishedRange(manifest.name, name, range),
      manifest.peerDependenciesMeta?.[name]?.optional === true
        ? 'optional'
        : 'yes',
      text,
    ];
  });
  const after = before.replace(
    BLOCK,
    () => `<!-- peers -->\n\n${table(rows)}\n\n<!-- /peers -->\n`,
  );
  if (after === before) continue;
  if (check) {
    drift += 1;
    console.error(
      `${file}: the peer table differs from package.json — run \`pnpm check:write\``,
    );
  } else {
    writeFileSync(readme, after);
    console.warn(`synced ${file}`);
  }
}
if (drift > 0) process.exit(1);
