/**
 * Generates `apps/docs/public/design.md` — the machine-readable design-system
 * spec served at `https://ordo.k8o.me/design.md`.
 *
 * Single source of truth:
 *   index.css ──tailwind-token-extractor──► tokens.generated.ts ──(this)──► design.md
 *
 * Token VALUES are read straight from the committed `tokens.generated.ts`
 * (a dependency-free literal, so this runs without building the package).
 * Only design rationale that does not exist in CSS is authored here. The
 * derivation mirrors `apps/docs/src/theme/design-tokens.ts`.
 *
 *   node scripts/generate-design-md.ts            # write public/design.md
 *   node scripts/generate-design-md.ts --check    # fail if the file is stale
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { tokens } from '../../../packages/ui/src/styles/tokens.generated.ts';

const OUT_PATH = fileURLToPath(new URL('../public/design.md', import.meta.url));

type Scalar = string | number;
type VarValue = Scalar | { light: Scalar; dark: Scalar };

const VARS = tokens.vars as Record<string, VarValue>;
const THEME = tokens.theme as unknown as Record<
  string,
  Record<string, unknown>
>;
const REFS = tokens.refs as Record<string, { light: string; dark: string }>;

// ── authored knowledge (not derivable from CSS) ────────────────────────────

/** Purpose of each lightness step, keyed by shade number. */
const SHADE_PURPOSE: Record<number, string> = {
  50: '最も薄い背景',
  100: '薄い背景',
  200: '控えめな背景',
  300: 'サポートカラー',
  400: '中間トーン',
  500: 'コアカラー',
  600: 'やや暗い',
  700: '暗いトーン',
  800: 'テキスト用（AAA on white）',
  900: '最も暗い',
  950: '反転背景・最暗部',
};

/** Semantic role of each hue family, keyed by palette prefix. */
const FAMILY_ROLE: Record<string, string> = {
  gray: 'ニュートラル（sky blue tint・低彩度）',
  red: 'error',
  pink: 'group',
  purple: 'group',
  cyan: '**Secondary**',
  blue: 'info',
  teal: '**Primary**',
  green: 'success',
  yellow: 'warning',
  orange: '—',
};

// ── derivation (mirrors apps/docs/src/theme/design-tokens.ts) ───────────────

const scalar = (v: VarValue): string =>
  typeof v === 'object' ? String(v.light) : String(v);
const reqVar = (key: string): string => {
  const value = VARS[key];
  if (value === undefined) {
    throw new Error(`design.md: missing CSS variable --${key}`);
  }
  return scalar(value);
};
const isColor = (s: string): boolean => /^(oklch|rgb|hsl|#)/iu.test(s);
const oklchParts = (s: string): [string, string, string] => {
  const inner = /^oklch\(([^)]*)\)/iu.exec(s.trim())?.[1] ?? '';
  const [l = '', c = '', h = ''] = inner.trim().split(/\s+/u);
  return [l, c, h];
};

type Family = { prefix: string; hue: string; shades: Map<number, string> };

const PALETTE_RE = /^([a-z]+)-(\d+)$/u;
const families: Family[] = [];
const familyByPrefix = new Map<string, Family>();
const shadeSet = new Set<number>();
for (const [name, value] of Object.entries(VARS)) {
  const m = PALETTE_RE.exec(name);
  const prefix = m?.[1];
  const shadeStr = m?.[2];
  if (prefix === undefined || shadeStr === undefined) continue;
  const shade = Number(shadeStr);
  const color = scalar(value);
  if (!isColor(color)) continue;
  shadeSet.add(shade);
  let family = familyByPrefix.get(prefix);
  if (!family) {
    family = { prefix, hue: oklchParts(color)[2], shades: new Map() };
    familyByPrefix.set(prefix, family);
    families.push(family);
  }
  family.shades.set(shade, color);
}
const SHADES = Array.from(shadeSet).toSorted((a, b) => a - b);

const refsByPrefix = (
  prefix: string,
): Array<[string, { light: string; dark: string }]> =>
  Object.entries(REFS).filter(([name]) => name.startsWith(prefix));

const namedScale = (
  group: Record<string, unknown> | undefined,
): Array<[string, string]> =>
  Object.entries(group ?? {}).map(([name, v]) => [name, String(v)]);

// ── markdown helpers ────────────────────────────────────────────────────────

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const table = (headers: string[], rows: string[][]): string => {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
};

// ── token tables ────────────────────────────────────────────────────────────

const lightnessTable = (): string => {
  // gray — L is shared across all families by design
  const ref = families[0];
  const rows = SHADES.map((shade) => [
    String(shade),
    ref ? oklchParts(ref.shades.get(shade) ?? '')[0] : '',
    SHADE_PURPOSE[shade] ?? '',
  ]);
  return table(['Step', 'L', '意図'], rows);
};

const hueTable = (): string =>
  table(
    ['色相', 'H', '役割'],
    families.map((f) => [cap(f.prefix), f.hue, FAMILY_ROLE[f.prefix] ?? '']),
  );

const paletteMatrix = (): string => {
  const headers = ['Step'];
  for (const f of families) {
    headers.push(`${cap(f.prefix)}·${f.hue}`);
  }
  const rows = SHADES.map((shade) => {
    const row = [String(shade)];
    for (const f of families) {
      const [l, c] = oklchParts(f.shades.get(shade) ?? '');
      row.push(`\`${l} ${c}\``);
    }
    return row;
  });
  return table(headers, rows);
};

const semanticTable = (prefix: string): string =>
  table(
    ['Token', 'Light', 'Dark'],
    refsByPrefix(prefix).map(([name, ref]) => [
      `\`${name}\``,
      ref.light,
      ref.dark,
    ]),
  );

const scaleTable = (
  headers: string[],
  entries: Array<[string, string]>,
  fmt: (name: string, value: string) => string[],
): string =>
  table(
    headers,
    entries.map(([n, v]) => fmt(n, v)),
  );

// ── compose ─────────────────────────────────────────────────────────────────

function build(): string {
  const text = THEME.text as Record<
    string,
    { value: string; lineHeightNumber?: number; lineHeight: Scalar }
  >;
  const textRows = Object.entries(text).map(([name, t]) => [
    `\`text-${name}\``,
    t.value,
    String(t.lineHeightNumber ?? t.lineHeight),
  ]);

  const zRows = Object.entries(VARS)
    .filter(([n]) => n.startsWith('z-'))
    .map(([n, v]) => [`\`${n}\``, scalar(v)]);

  return `${[
    `<!-- AUTO-GENERATED by apps/docs/scripts/generate-design-md.ts — DO NOT EDIT BY HAND.
     Token values come from the design-system SSOT (tokens.generated.ts ← index.css).
     Regenerate: pnpm --filter docs generate:design -->`,

    `# k8ordo UI Design System`,

    `\`@k8ordo/ui\` のデザインシステム仕様。デザイントークン・タイポグラフィ・コンポーネントの単一の参照元です。人間にも LLM／エージェントにも読めるよう、\`https://ordo.k8o.me/design\` の Markdown 版として配信しています。

- パッケージ: \`@k8ordo/ui\`（npm, public）
- スタック: React + Tailwind CSS 4 + OKLCH カラー
- トークン定義の実体: \`packages/ui/src/styles/{tokens,base,utilities}.css\`

> 生のカラー値（\`bg-teal-500\` 等）は使わず、常にセマンティックトークン（\`bg-primary-bg\` 等）を使います。トークンはダークモードで自動的に再マッピングされます。`,

    `## 原則`,

    `**「柔らかな余白と静かな洗練」** — 色の華やかさではなく、余白のゆとりと形の柔らかさで個性を出すミニマルなデザイン。

**「触れるものは柔らかく、読むものは端正に」**

- 触れる要素（Button, Input, Card）は柔らかく — 大きな角丸、ピル型、ゆったりしたパディング
- 情報を示す要素（Tabs, Breadcrumb, Table）は端正に — 構造を明確に

中核となる規範:

- **60-30-10** — 60% ニュートラル（グレー系）、30% サポート（\`bg-subtle\` 等）、10% アクセント（primary）
- **穏やかな色** — パレットは OKLCH で鮮やかに保ちつつ、UI に出るトークンは抑えたトーンへマッピング
- **WCAG AAA** — fg / bg の組み合わせで 7:1 以上のコントラストを確保
- **静かな変化** — トランジションは 150–200ms、bounce / spring 系は使わない
- **余白で語る** — 余白の差で情報の関連度と階層を表現する
- **日本語最適化** — Noto Sans JP / M PLUS 2。Inter / Roboto / Open Sans は使わない`,

    `## カラー`,

    `### 設計

全色を OKLCH 色空間で定義。明度（L）を全色相で統一しているため、同じステップ番号同士のコントラストが揃う。Chroma は色相ごとに gamut 内で最適化。

明度スケール（全色相で共通）:`,
    lightnessTable(),

    `色相（H）と役割:`,
    hueTable(),

    `### 生パレット（OKLCH）

各セルは \`L C\`（H は色相表の通り）。\`--white: ${reqVar('white')}\`。`,
    paletteMatrix(),

    `### セマンティックトークン

UI では必ず以下のトークンを使う（\`{prefix}-{token}\`、例: \`text-fg-base\`, \`bg-bg-subtle\`, \`border-border-mute\`）。Light / Dark はそのモードでエイリアスするパレット段階。

#### Foreground（テキスト）`,
    semanticTable('fg-'),
    `#### Background（サーフェス）`,
    semanticTable('bg-'),
    `#### Border`,
    semanticTable('border-'),
    `#### Primary（Teal）`,
    semanticTable('primary-'),
    `#### Secondary（Cyan）`,
    semanticTable('secondary-'),
    `#### Group（データ可視化）`,
    semanticTable('group-'),

    `その他: \`back-drop\`（\`${reqVar('back-drop')}\` オーバーレイ）, \`transparent\`。`,

    `### ダークモード

クラスベース（\`html\` に \`.dark\`）。すべてのセマンティックトークンが自動で再マッピングされるため、トークン利用時に \`dark:\` プレフィックスは不要。ダークモードは「ライトの反転」ではなく独立したトーンで設計する。`,

    `### やってはいけないこと

- グラデーション背景（\`bg-gradient-to-*\`）
- 生のパレット色を直接使う（\`bg-teal-500\`）— セマンティックトークンを使う
- 透明度で状態表現（\`/90\`, \`/80\`）— 専用トークンを使う
- ホバーに \`bg-primary-bg\` — \`bg-bg-mute\` を使う
- 鮮やかな色を広範囲に使う（アクセントは小面積で）`,

    `## タイポグラフィ`,

    `### フォントファミリー

\`\`\`css
font-family: 'Noto Sans JP', 'M PLUS 2', sans-serif;
\`\`\`

トークン: \`--font-noto-sans-jp\`, \`--font-m-plus-2\`。日本語テキストが主体のため和文フォントを優先する。**Inter / Roboto / Open Sans は使わない。**`,

    `### サイズスケール`,
    table(['Token', 'size', 'line-height'], textRows),

    `### ウェイト`,
    scaleTable(['Token', '値'], namedScale(THEME['font-weight']), (n, v) => [
      `\`font-${n}\``,
      v,
    ]),
    `\`font-normal\` (400) も使用。\`font-semibold\` (600) / \`font-extrabold\` (800) は使わない。\`font-medium\` は **450**（一般の 500 より軽い）。1 画面で 3 種類を超えて使わない。`,

    `### 行間 / 字間`,
    scaleTable(['leading', '値'], namedScale(THEME.leading), (n, v) => [
      `\`leading-${n}\``,
      v,
    ]),
    scaleTable(['tracking', '値'], namedScale(THEME.tracking), (n, v) => [
      `\`tracking-${n}\``,
      v,
    ]),
    `本文は \`leading-relaxed\` 推奨。日本語に \`uppercase\` / \`tracking-widest\` は使わない。テキストにグラデーションをかけない。`,

    `## スペーシング・レイアウト

4px ベース（\`--spacing: ${tokens.theme.spacing}\`）。Tailwind 標準スケールを使用。`,

    `### パディング・余白の目安`,
    table(
      ['step', 'rem', 'px', '用途'],
      [
        ['1', '0.25rem', '4px', '最小単位'],
        ['2', '0.5rem', '8px', '近い要素（`mt-2`）'],
        ['4', '1rem', '16px', '標準余白 / コンパクトな padding'],
        ['6', '1.5rem', '24px', '標準 padding（`p-6`）'],
        ['8', '2rem', '32px', 'ゆったり padding（`p-8`）/ セクション間'],
        ['10', '2.5rem', '40px', '大きなカード内（`p-10`）'],
        ['12', '3rem', '48px', 'ページレベルの区切り（`mt-12`）'],
      ],
    ),
    `余白の差で関連度を表す（近い \`mt-2\` / 標準 \`mt-4\` / セクション間 \`mt-8\` / ページ間 \`mt-12\`）。カード間は \`gap-6\`、縦セクションは \`gap-8\`〜\`gap-10\`。`,

    `### ブレークポイント`,
    scaleTable(['Token', '値'], namedScale(THEME.breakpoint), (n, v) => [
      `\`${n}\``,
      v,
    ]),

    `### ページ構造

ページ背景を \`bg-bg-subtle\`（薄いグレー）にし、コンテンツを白カード（\`bg-bg-base\`）で浮かせる。すべてをカードに入れない — 余白と \`Separator\` で十分なことが多い。カードのネスト（Card in Card）はしない。

カスタムユーティリティ: \`grid-cols-auto-fill-*\` / \`grid-cols-auto-fit-*\`（レスポンシブ列）, \`writing-h\` / \`writing-v\`（縦書き）, \`z-overlay\` / \`z-modal\` / \`z-toast\`。`,

    `## 角丸`,
    scaleTable(['Token', '値'], namedScale(THEME.radius), (n, v) => [
      `\`rounded-${n}\``,
      v,
    ]),
    `要素の性格で使い分ける（「触れるものは柔らかく、読むものは端正に」）:

| 用途 | 角丸 |
| --- | --- |
| Button / Avatar / IconButton / Badge / Progress | \`rounded-full\`（ピル型） |
| Input / Textarea / Select / Card / CheckboxCard / RadioCard | \`rounded-xl\` |
| Alert / Dialog / Modal | \`rounded-lg\` |
| Checkbox | \`rounded-md\` |`,

    `## エレベーション（シャドウ）

ふんわり柔らかい影で奥行きを表現する。\`shadow-xl\` 以上は使わない。`,
    scaleTable(['Token', '値'], namedScale(THEME.shadow), (n, v) => [
      `\`shadow-${n}\``,
      `\`${v}\``,
    ]),
    scaleTable(['inset', '値'], namedScale(THEME['inset-shadow']), (n, v) => [
      `\`inset-shadow-${n}\``,
      `\`${v}\``,
    ]),
    `利用指針: Card（\`variant="shadow"\`）= \`shadow-sm\` / Modal・Dialog・Tooltip・Dropdown・ListBox = \`shadow-md\` / Button = なし / Card（\`variant="outline"\`）= \`border border-border-mute\`。`,

    `## モーション

「静かな変化」を原則とする。

| タイミング | 用途 |
| --- | --- |
| 100ms | 即時フィードバック（ボタンプレス） |
| 150–200ms | 標準トランジション（ホバー、フォーカス） |
| 300ms | 開閉アニメーション（限度） |

- 基本は \`transition-colors duration-150 ease-out\`
- **300ms を超えない。bounce / spring 系のイージングは使わない。**
- \`prefers-reduced-motion: reduce\` を尊重（Popover アニメーション・motion ライブラリが自動対応）
- 組み込み: \`ao-anim-scale\`（\`:popover-open\` で 0.18s scale）/ \`ao-anim-fade\`（0.15s opacity）

### インタラクティブ状態

| 状態 | スタイル |
| --- | --- |
| Hover | \`hover:bg-bg-mute\` |
| Focus | \`focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-info\` |
| Active | \`active:bg-bg-emphasize\` |
| Disabled | \`opacity-50 cursor-not-allowed\` |
| Selected | \`bg-primary-bg-subtle\` |
| Error | \`border-border-error\` + \`text-fg-error\` |

フォーカスは必ず \`focus-visible\`（\`focus\` ではない）を使い、リングは \`ring-border-info\` で統一。`,

    `## z-index`,
    table(['Token', '値'], zRows),

    `## コンポーネント

\`@k8ordo/ui\` から名前付きエクスポート。スタイルシートとプロバイダーが必要。
このガイドのトークンを自分のマークアップで使うには Tailwind ソース版の \`tailwind.css\` を
import する（Tailwind を持たないプロジェクトはビルド済みの \`styles.css\`）:

\`\`\`tsx
import '@k8ordo/ui/tailwind.css';
import { UIProvider, Button, Card } from '@k8ordo/ui';

<UIProvider>
  <App />
</UIProvider>;
\`\`\`

### Buttons

- **Button** — \`size: 'sm'|'md'|'lg'\`, \`color: 'primary'|'gray'\`, \`variant: 'contained'|'outlined'|'skeleton'\`, \`fullWidth\`, \`startIcon\`, \`endIcon\`, \`disabled\`
- **IconButton** — \`label\`（必須・aria-label）, \`bg: 'transparent'|'base'|'primary'\`, \`size\`
- **LinkButton** / **IconLink** — Button / IconButton のリンク版。\`href\`, \`openInNewTab?\`, \`renderAnchor?\`

### Data display

- **Accordion**（compound: \`Root\` / \`Item\`(\`defaultOpen?\`) / \`Button\` / \`Panel\`）
- **Avatar** — \`src\` / \`name\`（イニシャル）/ \`fallback\`, \`size\`
- **Badge** — \`label\`, \`tone: 'neutral'|'info'|'success'|'warning'|'error'\`, \`variant: 'solid'|'outline'\`, \`size\`, \`interactive\`
- **Card** — \`width: 'full'|'fit'\`, \`variant: 'shadow'|'outline'\`, \`interactive\`
- **Code** — \`children: string\`（コードブロック）
- **Heading** — \`level: 'h1'..'h6'\`（必須）, \`id?\`, \`lineClamp?\`
- **Table**（compound: \`Root\` / \`Caption\` / \`Head\` / \`Body\` / \`Row\` / \`HeaderCell\` / \`Cell\` / \`EmptyState\`）

### Feedback

- **Alert** — \`tone: 'info'|'success'|'warning'|'error'\`, \`message: string | string[]\`
- **Progress** — \`value\`, \`max\`（必須）, \`min?\`, \`label?\`
- **Skeleton** — \`shape: 'rect'|'circle'\`, \`size\`, \`animate\`
- **Spinner** — \`size\`, \`label?\`（aria-live）
- **Toast** — \`ToastProvider\` + \`useToast()\`（\`open(tone, message, options?)\` / \`close(id)\` / \`closeAll()\`）

### Form

ラベルは入力の上に配置。エラーは入力直下に \`text-fg-error text-sm\`。バリデーションは送信時が基本。

- **FormControl** — フィールドのラッパー。\`label\`（必須）, \`helpText?\`, \`errorText?\`, \`required?\`, \`renderInput\`
- **TextField** / **Textarea** / **PasswordInput** / **NumberField** — テキスト系入力
- **Select** / **Autocomplete** — \`options\` ベースの選択
- **Checkbox** / **CheckboxGroup** / **CheckboxCard** — 複数選択
- **Radio** / **RadioCard** — 単一選択（\`options\` ベース）
- **Switch** — \`label\`（必須）, controlled \`checked: boolean\`
- **Slider** — \`min\`/\`max\`/\`step\`, controlled \`value\`
- **FileField**（compound: \`Root\` / \`Trigger\` / \`ItemList\`）
- **Form** — \`<form>\` ラッパー

状態 prop は \`disabled\` / \`invalid\` / \`required\`、controlled は \`value\`（Checkbox / Switch は \`checked\`）+ \`onChange\`、uncontrolled は \`defaultValue\` / \`defaultChecked\`。

### Layout

- **Stack** — フレックスレイアウト
- **Grid** — グリッドレイアウト
- **Separator** — \`color: 'base'|'mute'|'subtle'\`, \`orientation: 'horizontal'|'vertical'\`
- **ScrollLinked** — スクロール進捗バー（\`container?\`）

### Navigation

- **Anchor** — テキストリンク。外部リンクに自動で新規タブアイコン。\`href\`, \`openInNewTab?\`, \`renderAnchor?\`
- **Breadcrumb**（compound: \`List\` / \`Item\` / \`Link\`(\`current?\`) / \`Separator\`）
- **Pagination** — ページネーション
- **Tabs**（compound: \`Root\`(\`ids\` / \`defaultSelectedId?\`) / \`List\` / \`Tab\` / \`Panel\`）

### Overlays

- **Modal** — \`isOpen?\`/\`onClose?\`/\`defaultOpen?\`, \`side: 'center'|'bottom'|'right'|'left'\`（\`ModalSide\`）
- **Dialog**（compound: \`Root\` / \`Header\` / \`Content\`）
- **Drawer** — \`title\`, \`isOpen\`, \`onClose\`, \`side: 'left'|'right'\`（\`DrawerSide\`。Modal の \`side\` の部分集合）
- **Popover**（compound: \`Root\` / \`Trigger\` / \`Content\`、\`placement\`, \`type\`）
- **Tooltip**（compound: \`Root\` / \`Trigger\` / \`Content\`、\`placement\`）
- **DropdownMenu**（compound: \`Root\`(\`placement\`) / \`Trigger\`(\`label\`) / \`IconTrigger\`(\`icon\`, \`label\`) / \`Content\` / \`Item\`(\`label\`)）
- **ListBox**（compound: \`Root\` / \`Trigger\` / \`Content\`、\`options\` / \`value\` / \`onSelect\`）

### Icons

すべてのアイコンが \`size\` prop を受け取る（\`'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'\`、デフォルト \`md\`）。\`xs\`=12px, \`sm\`=16px, \`md\`=24px, \`lg\`=32px, \`xl\`=40px, \`2xl\`=48px, \`3xl\`=56px。特殊: \`ChevronIcon\`（\`direction\` 必須）, \`AlertIcon\`（\`status\` 必須）。

### Providers

- **UIProvider** — アプリルートで 1 回
- **PortalRootProvider** / **usePortalRoot** — ポータルのルート指定`,

    `## ボイス

- 簡潔で端正な日本語。誇張やマーケティング的な装飾を避ける
- 状態・操作は明確に（「保存する」「キャンセル」のように動作を示す）
- 色だけに頼らず、アイコンやテキストを併用して状態を伝える`,

    `## インストール

\`\`\`bash
npm install @k8ordo/ui
\`\`\`

\`\`\`tsx
// Tailwind CSS 4 のプロジェクト（トークンを自分のマークアップでも使える）
import '@k8ordo/ui/tailwind.css';
// Tailwind を持たないプロジェクトはビルド済み CSS を使う
// import '@k8ordo/ui/styles.css';
import { UIProvider } from '@k8ordo/ui';
\`\`\`

- Docs: <https://ordo.k8o.me>
- npm: \`@k8ordo/ui\``,
  ].join('\n\n')}\n`;
}

// ── entry ───────────────────────────────────────────────────────────────────

const md = build();

if (process.argv.includes('--check')) {
  const current = await readFile(OUT_PATH, 'utf8').catch(() => '');
  if (current !== md) {
    process.stderr.write(
      'design.md is out of sync with the design tokens.\n' +
        'Fix with: pnpm --filter docs generate:design\n',
    );
    process.exit(1);
  }
  process.stdout.write('design.md is in sync.\n');
} else {
  await writeFile(OUT_PATH, md);
  process.stdout.write(`Wrote ${OUT_PATH}\n`);
}
