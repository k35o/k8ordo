import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { expect, test } from 'vite-plus/test';

// アプリ（main.tsx）と同じ exports サブパスで配布物を解決する。
// import や ?raw だと vitest の CSS スタブに潰されて中身が届かないため、
// createRequire で実ファイルパスに解決してから読む。
const require = createRequire(import.meta.url);
const css = readFileSync(require.resolve('@k8ordo/ui/styles.css'), 'utf8');

// トップレベル（どの @layer にも属さない）ブロックのうち、@ルールでも
// トークン変数ブロック（:root / .dark。利用側が上書きして勝てる）でもない
// スタイルルールのセレクタを列挙する。CSS のネストは波括弧の深さだけで
// 判定できる。
const collectUnlayeredSelectors = (source: string): string[] => {
  const withoutComments = source.replaceAll(/\/\*[\s\S]*?\*\//gu, '');
  const selectors: string[] = [];
  let depth = 0;
  let buf = '';
  for (const ch of withoutComments) {
    if (ch === '{') {
      if (depth === 0) {
        selectors.push(buf.trim());
      }
      depth++;
      buf = '';
    } else if (ch === '}') {
      depth--;
    } else if (depth === 0) {
      buf = ch === ';' ? '' : buf + ch;
    }
  }
  return selectors.filter(
    (selector) =>
      !selector.startsWith('@') && selector !== ':root' && selector !== '.dark',
  );
};

// @layer の宣言文とブロックに、レイヤーの名前が初めて現れた順
const layerOrder = (source: string): string[] => [
  ...new Set(
    [...source.matchAll(/@layer ([^{;]+)[{;]/gu)].flatMap(([, names = '']) =>
      names.split(',').map((name) => name.trim()),
    ),
  ),
];

test('styles.css は Tailwind のビルドを要求するディレクティブを含まない', () => {
  // これが1つでも残っていたら「Tailwind を持たないプロジェクトでは使えない」
  // に逆戻りする。この example の存在理由そのものを固定するテスト。
  expect(css).not.toContain('@import');
  expect(css).not.toContain('@source');
  expect(css).not.toContain('@theme');
  expect(css).not.toContain('@utility');
  expect(css).not.toContain('@custom-variant');
});

test('スタイルルールはすべてカスケードレイヤーに載っている', () => {
  // ライブラリ側が @layer 内にいる限り、レイヤー外にある利用側の CSS Modules
  // はカスケードで優先される。順序の宣言だけでなく、トップレベルに
  // 非レイヤーのスタイルルールが残っていないことまで確認する。
  expect(layerOrder(css)).toStrictEqual([
    'properties',
    'theme',
    'base',
    'components',
    'utilities',
  ]);
  expect(collectUnlayeredSelectors(css)).toStrictEqual([]);
});

test('セマンティックトークンが CSS カスタムプロパティとして配布される', () => {
  // app.module.css が var(--color-fg-mute) 等を参照できることの担保。
  expect(css).toContain('--color-fg-mute:');
  expect(css).toContain('--color-bg-subtle:');
  expect(css).toContain('--color-primary-bg:');
});

test('部品の CSS は部品の import と一緒にアプリへ届く', () => {
  // styles.css は部品の見た目を持たない。部品の CSS は部品の JS が import
  // するので、アプリのビルドに components レイヤーとして入る。
  // ビルド済みの dist を読むので、先に `pnpm build` を実行しておく。
  const assets = path.resolve(import.meta.dirname, '../dist/assets');
  expect(existsSync(assets)).toBe(true);
  const built = readdirSync(assets)
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(path.join(assets, file), 'utf8'))
    .join('\n');

  expect(built).toMatch(/@layer components\s*\{/u);
  // Button（solid / primary）の地の色
  expect(built).toContain('background-color:var(--color-primary-bg)');
});
