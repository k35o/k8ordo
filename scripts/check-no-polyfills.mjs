// 家族の血縁のうち「ポリフィルを持たない」だけを機械的に守るチェック。
//
// Baseline 入りの機能だけを使うという規律そのものは、web-features のデータを
// oxlint プラグインに載せないと検証できず（CSS 側は oxlint の射程外）、
// 独立したツールの規模になる。ここで守れるのは「ポリフィルを依存に足さない」
// という、規律が破られたときに最も分かりやすく現れる一点だけ。
//
// ビルドターゲットを下げて構文をトランスパイルする経路は検出していない。

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const FORBIDDEN = [
  { re: /^core-js(-pure)?$/, why: 'ECMAScript のポリフィル' },
  { re: /polyfill/i, why: 'ポリフィル' },
  { re: /^regenerator-runtime$/, why: 'generator のランタイム' },
  { re: /^whatwg-fetch$/, why: 'fetch のポリフィル' },
  { re: /^@babel\/runtime$/, why: 'Babel ヘルパーのランタイム' },
  { re: /^es[3-9]-shim$/, why: 'ECMAScript の shim' },
];

const workspaces = ['packages', 'apps', 'examples'].flatMap((dir) => {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(dir, e.name));
});

const findings = [];
for (const ws of ['.', ...workspaces]) {
  const file = join(ROOT, ws, 'package.json');
  if (!existsSync(file)) continue;
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const deps = {
    dependencies: pkg.dependencies,
    devDependencies: pkg.devDependencies,
    peerDependencies: pkg.peerDependencies,
  };
  for (const [field, map] of Object.entries(deps)) {
    for (const name of Object.keys(map ?? {})) {
      const hit = FORBIDDEN.find((f) => f.re.test(name));
      if (hit) findings.push({ ws, field, name, why: hit.why });
    }
  }
}

if (findings.length === 0) {
  console.log(
    `ポリフィル依存なし（${String(workspaces.length + 1)} ワークスペースを確認）`,
  );
  process.exit(0);
}

console.error('ポリフィル依存が見つかりました:\n');
for (const f of findings) {
  console.error(`  ${f.ws}/package.json  ${f.field}  ${f.name}  — ${f.why}`);
}
console.error(
  '\nk8ordo は Baseline 入りの機能だけを前提にし、ポリフィルもフォールバックも持たない。',
);
console.error(
  '古いブラウザを支える必要が本当にあるなら、それは血縁の見直しであって依存の追加ではない。',
);
process.exit(1);
