import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

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

test('styles.css は Tailwind のビルドを要求するディレクティブを含まない', () => {
  // これが1つでも残っていたら「Tailwind を持たないプロジェクトでは使えない」
  // に逆戻りする。この example の存在理由そのものを固定するテスト。
  expect(css).not.toContain('@import');
  expect(css).not.toContain('@source');
  expect(css).not.toContain('@theme');
  expect(css).not.toContain('@utility');
  expect(css).not.toContain('@custom-variant');
});

test('コンポーネントが参照するユーティリティが実際に生成されている', () => {
  // ディレクティブ不在・レイヤー・トークンはクラス走査が全滅していても
  // 成立してしまう。走査（@source）由来のクラスが最低限あることを固定する。
  // 順に: 汎用 / Button の基底 / トークン由来 / フォーカスリング。
  expect(css).toContain('.sr-only');
  expect(css).toContain('.rounded-full');
  expect(css).toContain('.bg-primary-bg');
  expect(css).toContain('focus-visible\\:ring-2');
});

test('スタイルルールはすべてカスケードレイヤーに載っている', () => {
  // ライブラリ側が @layer 内にいる限り、レイヤー外にある利用側の CSS Modules
  // はカスケードで優先される。宣言文の存在だけでなく、トップレベルに
  // 非レイヤーのスタイルルールが残っていないことまで確認する。
  expect(css).toContain('@layer theme, base, components, utilities;');
  expect(collectUnlayeredSelectors(css)).toStrictEqual([]);
});

test('セマンティックトークンが CSS カスタムプロパティとして配布される', () => {
  // app.module.css が var(--fg-mute) 等を参照できることの担保。
  expect(css).toContain('--fg-mute:');
  expect(css).toContain('--bg-subtle:');
  expect(css).toContain('--primary-bg:');
});
