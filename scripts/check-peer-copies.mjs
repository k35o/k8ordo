// `@k8ordo/*` を使う側とライブラリ側が、共有する peer の「同じ 1 コピー」を
// 解決していることを確かめるチェック。
//
// peer の範囲を満たしているかは pnpm が見る。見てくれないのは、満たしたうえで
// 2 コピーに割れている状態。アダプタは相手フレームワークの React context を
// 読む（OpenUI の `useStateField`、json-render の `useBoundProp`）ので、
// コピーが割れると context オブジェクトが別物になり、スキーマ検証も型も
// ビルドも全部通ったまま描画時にだけ落ちる。
//
// dev サーバーの依存最適化はパッケージ名でコピーを畳むため、ブラウザモードの
// テストではこの失敗を再現できない。本番バンドルと同じ node_modules の
// 探索を自分で辿って、解決先の実パスを突き合わせる。
//
// 使う側には packages も含める。アプリのバンドルは、workspace のパッケージが
// import するものをそのパッケージ自身の実ディレクトリから解決するので、
// color-scheme → state のような間の辺で割れると、アプリが自分で宣言した
// パッケージとは揃っていても 2 コピーが入る。アプリ側だけを見ると、その辺は
// アプリが両端と peer をたまたま宣言しているときにしか検査されない。

import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

/** node と同じく node_modules を上に辿って最初に見つかった実体を返す。 */
const resolvePackageDir = (fromDir, name) => {
  let dir = fromDir;
  for (;;) {
    const candidate = join(dir, 'node_modules', name);
    if (existsSync(candidate)) return realpathSync(candidate);
    const parent = dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
};

const readPackage = (dir) =>
  JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));

const consumers = ['apps', 'examples', 'packages'].flatMap((group) => {
  const abs = join(ROOT, group);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(ROOT, group, entry.name))
    .filter((dir) => existsSync(join(dir, 'package.json')));
});

const findings = [];
for (const consumerDir of consumers) {
  const consumer = readPackage(consumerDir);
  const declared = {
    ...consumer.dependencies,
    ...consumer.devDependencies,
  };
  const libraries = Object.entries(declared)
    .filter(
      ([name, range]) =>
        name.startsWith('@k8ordo/') && String(range).startsWith('workspace:'),
    )
    .map(([name]) => name);

  for (const library of libraries) {
    const libraryDir = resolvePackageDir(consumerDir, library);
    if (libraryDir === undefined) continue;
    const peers = Object.keys(readPackage(libraryDir).peerDependencies ?? {});

    for (const peer of peers) {
      // 使う側が入れていない optional peer は、そのエントリを使っていない。
      if (declared[peer] === undefined) continue;
      const fromConsumer = resolvePackageDir(consumerDir, peer);
      const fromLibrary = resolvePackageDir(libraryDir, peer);
      if (fromConsumer === undefined || fromLibrary === undefined) continue;
      if (fromConsumer === fromLibrary) continue;

      findings.push(
        `${relative(ROOT, consumerDir)}: ${peer} が ${library} と別コピーになっている\n` +
          `    使う側   ${readPackage(fromConsumer).version} (${relative(ROOT, fromConsumer)})\n` +
          `    ${library} ${readPackage(fromLibrary).version} (${relative(ROOT, fromLibrary)})`,
      );
    }
  }
}

if (findings.length > 0) {
  console.error('共有 peer が 2 コピーに割れています:\n');
  for (const finding of findings) console.error(`  ${finding}\n`);
  console.error(
    'ライブラリが開発対象にしているバージョン（devDependencies）に合わせてください。',
  );
  process.exit(1);
}

console.log(`共有 peer の単一コピーを確認しました (${consumers.length} workspaces)`);
