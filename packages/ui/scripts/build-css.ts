import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

/**
 * Builds the two published stylesheet entries:
 *
 *   dist/styles/tailwind.css  Tailwind source entry (`./tailwind.css`).
 *                             利用側の Tailwind 4 がコンパイルする。@theme の
 *                             トークンが利用側マークアップでも使える。
 *   dist/styles/index.css     ビルド済み CSS（`./styles.css`）。Tailwind を
 *                             持たないプロジェクト（CSS Modules・素の CSS）が
 *                             そのまま読み込む。
 *
 * `vp pack` の後（dist/ が揃った後）に実行すること。
 */
import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';

const srcDir = 'src/styles';
const outDir = 'dist/styles';

mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(srcDir)) {
  if (!file.endsWith('.css')) continue;
  // ソースの index.css は dist では tailwind.css に改名する。
  // dist/styles/index.css の名前はビルド済み CSS が引き継ぐ（既存の
  // `./styles.css` エクスポートのパスを変えないため）。
  const outName = file === 'index.css' ? 'tailwind.css' : file;
  copyFileSync(path.join(srcDir, file), path.join(outDir, outName));
}

// src ではなく dist 側のエントリをコンパイルする: `@source '../components'` /
// `'../integrations'` が走査するのが配布物の JS になり、クラス集合が配布物と
// 正確に一致する。source(none) は Tailwind の自動ソース検出（CWD 起点で src の
// stories/test まで走査してしまう）を止め、@source を唯一のクラス源にするための
// ビルド時限定の差し替え。配布する tailwind.css 自体に付けると利用側の
// マークアップが走査されなくなるため、ファイルには書けない。
const entry = path.join(outDir, 'tailwind.css');
const css = readFileSync(entry, 'utf8').replace(
  "@import 'tailwindcss';",
  "@import 'tailwindcss' source(none);",
);
if (!css.includes("@import 'tailwindcss' source(none);")) {
  throw new Error(
    "build-css: @import 'tailwindcss' not found in " +
      `${entry} — source(none) の差し替えに失敗（クラス集合が CWD の自動検出に依存してしまう）`,
  );
}
const result = await postcss([tailwindcss()]).process(css, { from: entry });
writeFileSync(path.join(outDir, 'index.css'), result.css);
