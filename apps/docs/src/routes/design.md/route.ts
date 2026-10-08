import type { RouteContext } from '@k8ordo/framework';
import { tokens } from '@k8ordo/ui/tokens';

import {
  BG_TOKENS,
  BORDER_TOKENS,
  BREAKPOINTS,
  FG_TOKENS,
  FONT_WEIGHTS,
  GROUP_TOKENS,
  INSET_SHADOWS,
  LETTER_SPACINGS,
  LINE_HEIGHTS,
  PALETTE,
  PRIMARY_TOKENS,
  RADII,
  SECONDARY_TOKENS,
  SHADES,
  SHADOWS,
  TEXT_SIZES,
  Z_INDICES,
} from '../../theme/design-tokens';
import type { NamedScale, SemanticToken } from '../../theme/design-tokens';

// Token values come from design-tokens.ts; only the design rationale that
// does not exist in CSS is written here.
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

const oklchParts = (s: string): [string, string, string] => {
  const inner = /^oklch\(([^)]*)\)/iu.exec(s.trim())?.[1] ?? '';
  const [l = '', c = '', h = ''] = inner.trim().split(/\s+/u);
  return [l, c, h];
};

const table = (headers: string[], rows: string[][]): string => {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
};

// L is shared across every family by design, so gray's stands for all of them
const lightnessTable = (): string => {
  const [gray] = PALETTE;
  return table(
    ['Step', 'L', '意図'],
    SHADES.map((shade) => [
      String(shade),
      oklchParts(gray.shades[shade])[0],
      SHADE_PURPOSE[shade] ?? '',
    ]),
  );
};

const hueTable = (): string =>
  table(
    ['色相', 'H', '役割'],
    PALETTE.map((family) => [
      family.name,
      String(family.hue),
      FAMILY_ROLE[family.prefix] ?? '',
    ]),
  );

const paletteMatrix = (): string =>
  table(
    [
      'Step',
      ...PALETTE.map((family) => `${family.name}·${String(family.hue)}`),
    ],
    SHADES.map((shade) =>
      [String(shade)].concat(
        PALETTE.map((family) => {
          const [l, c] = oklchParts(family.shades[shade]);
          return `\`${l} ${c}\``;
        }),
      ),
    ),
  );

const semanticTable = (entries: readonly SemanticToken[]): string =>
  table(
    ['Token', 'Light', 'Dark'],
    entries.map(({ name, light, dark }) => [`\`${name}\``, light, dark]),
  );

const scaleTable = (
  headers: string[],
  entries: readonly NamedScale[],
  fmt: (name: string, value: string) => string[],
): string =>
  table(
    headers,
    entries.map(({ name, value }) => fmt(name, value)),
  );

const build = (): string => {
  const textRows = TEXT_SIZES.map(({ name, fontSize, lineHeight }) => [
    `\`text-${name}\``,
    fontSize,
    String(lineHeight),
  ]);
  const zRows = Z_INDICES.map(({ name, value }) => [`\`z-${name}\``, value]);

  return `${[
    `# k8ordo UI Design System`,

    `\`@k8ordo/ui\` のデザインシステム仕様。デザイントークン・タイポグラフィ・コンポーネントの単一の参照元です。人間にも LLM／エージェントにも読めるよう、\`https://ordo.k8o.me/design.md\` として配信しています（人向けのトークン一覧は \`https://ordo.k8o.me/ja/ui/theming\`）。

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

各セルは \`L C\`（H は色相表の通り）。\`--white: ${tokens.vars.white}\`。`,
    paletteMatrix(),

    `### セマンティックトークン

UI では必ず以下のトークンを使う（\`{prefix}-{token}\`、例: \`text-fg-base\`, \`bg-bg-subtle\`, \`border-border-mute\`）。Light / Dark はそのモードでエイリアスするパレット段階。

#### Foreground（テキスト）`,
    semanticTable(FG_TOKENS),
    `#### Background（サーフェス）`,
    semanticTable(BG_TOKENS),
    `#### Border`,
    semanticTable(BORDER_TOKENS),
    `#### Primary（Teal）`,
    semanticTable(PRIMARY_TOKENS),
    `#### Secondary（Cyan）`,
    semanticTable(SECONDARY_TOKENS),
    `#### Group（データ可視化）`,
    semanticTable(GROUP_TOKENS),

    `その他: \`back-drop\`（\`${tokens.vars['back-drop']}\` オーバーレイ）, \`transparent\`。`,

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
    scaleTable(['Token', '値'], FONT_WEIGHTS, (n, v) => [`\`font-${n}\``, v]),
    `\`font-normal\` (400) も使用。\`font-semibold\` (600) / \`font-extrabold\` (800) は使わない。\`font-medium\` は **450**（一般の 500 より軽い）。1 画面で 3 種類を超えて使わない。`,

    `### 行間 / 字間`,
    scaleTable(['leading', '値'], LINE_HEIGHTS, (n, v) => [
      `\`leading-${n}\``,
      v,
    ]),
    scaleTable(['tracking', '値'], LETTER_SPACINGS, (n, v) => [
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
    scaleTable(
      ['Token', '値'],
      BREAKPOINTS.map(({ name, rem }) => ({ name, value: rem })),
      (n, v) => [`\`${n}\``, v],
    ),

    `### ページ構造

ページ背景を \`bg-bg-subtle\`（薄いグレー）にし、コンテンツを白カード（\`bg-bg-base\`）で浮かせる。すべてをカードに入れない — 余白と \`Separator\` で十分なことが多い。カードのネスト（Card in Card）はしない。

カスタムユーティリティ: \`grid-cols-auto-fill-*\` / \`grid-cols-auto-fit-*\`（レスポンシブ列）, \`writing-h\` / \`writing-v\`（縦書き）, \`z-overlay\` / \`z-modal\` / \`z-toast\`。`,

    `## 角丸`,
    scaleTable(['Token', '値'], RADII, (n, v) => [`\`rounded-${n}\``, v]),
    `要素の性格で使い分ける（「触れるものは柔らかく、読むものは端正に」）:

| 用途 | 角丸 |
| --- | --- |
| Button / Avatar / IconButton / Badge / Progress | \`rounded-full\`（ピル型） |
| Input / Textarea / Select / Card / CheckboxCard / RadioCard | \`rounded-xl\` |
| Alert / Dialog / Modal | \`rounded-lg\` |
| Checkbox | \`rounded-md\` |`,

    `## エレベーション（シャドウ）

ふんわり柔らかい影で奥行きを表現する。\`shadow-xl\` 以上は使わない。`,
    scaleTable(['Token', '値'], SHADOWS, (n, v) => [
      `\`shadow-${n}\``,
      `\`${v}\``,
    ]),
    scaleTable(['inset', '値'], INSET_SHADOWS, (n, v) => [
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
- \`prefers-reduced-motion: reduce\` を尊重（アニメーションはすべて CSS で、\`base.css\` の \`@media (prefers-reduced-motion)\` が止める。Conversation の最下部へのスクロールは JS 側で instant に切り替える）
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

フォーカスは必ず \`focus-visible\`（\`focus\` ではない）を使い、リングは \`ring-border-info\` で統一。

OS の \`prefers-contrast: more\` と \`forced-colors: active\` にはライブラリの CSS が従う。高コントラストでは文字と線のトークンが一段強くなり、影だけで縁取る面に線が付く。強制カラーでは境界線・フォーカスリング・選択状態をシステムカラー（\`Highlight\` / \`CanvasText\`）で描く。自前の UI では、境界やフォーカスを \`box-shadow\` だけで描かず、\`text-transparent\` で隠さない（強制カラーで塗られる。\`invisible\` を使う）。`,

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

- **Button** — \`size: 'sm'|'md'|'lg'\`, \`color: 'primary'|'secondary'|'base'\`, \`variant: 'solid'|'outline'|'skeleton'\`, \`fullWidth\`, \`startIcon\`, \`endIcon\`, \`disabled\`
- **IconButton** — \`label\`（必須・aria-label）, \`color: 'transparent'|'base'|'primary'|'secondary'\`, \`size\`
- **CopyButton** — \`value\`（文字列、または押したときに呼ぶ関数。Promise も可）, \`label\`, \`iconOnly\`, \`size\`。押すとアイコンがチェックに変わり、結果を読み上げる。コピーは IconButton と自前のクリップボード処理ではなくこれを使う
- リンクとして描画するときは Button / IconButton に \`renderItem\` を渡す（\`<button>\` 専用の \`disabled\` / \`type\` を外し、残りの props を \`<a>\` などへ展開する。IconButton は tooltip の配線と ref を持つ \`triggerProps\` も展開する）

### Data display

- **Accordion**（compound: \`Root\` / \`Item\`(\`defaultOpen?\`) / \`Button\` / \`Panel\`）
- **Avatar** — \`src\` / \`name\`（イニシャル）/ \`fallback\`, \`size\`
- **Badge** — \`label\`, \`tone: 'neutral'|'info'|'success'|'warning'|'error'\`, \`variant: 'solid'|'outline'\`, \`size\`, \`interactive\`
- **Card** — \`width: 'full'|'fit'\`, \`variant: 'shadow'|'outline'\`, \`interactive\`
- **Carousel**（compound: \`Root\`(\`label\`, \`slideSize: 'full'|'lg'|'md'|'sm'\`) / \`Slide\`(\`label?\`)）— スクロールスナップと前後ボタン。自動再生なし
- **Code** — \`children: string\`（インラインコード。色文字列には色見本が付く）
- **Heading** — \`level: 'h1'..'h6'\`（必須）, \`id?\`, \`lineClamp?\`
- **Kbd** — \`children: string\`（1 キー 1 要素。組み合わせは並べる）, \`label?\`（記号キーの読み上げ）
- **Prose** — Markdown / MDX が描いた本文の組版を戻す入れ物。クラスの無い素の要素だけを組み、部品は自分の見た目のまま（日本語向け: 広い行間、em は傍点、縦書きは段落頭を 1 字下げ）
- **Table**（compound: \`Root\` / \`Caption\` / \`Head\` / \`Body\` / \`Row\` / \`HeaderCell\` / \`Cell\` / \`EmptyState\`(\`colSpan\` + EmptyState の props)）
- **DataTable** — 制御型（\`sort\` / \`onSortChange\`、\`selectedIds\` / \`onSelectedIdsChange\`、\`hiddenColumnIds\` / \`onHiddenColumnIdsChange\`）。並べ替えはせず、渡された順に描く。列は \`{ id, header, cell, align?, sortable?, hideable? }\`
- **Tree** — \`items\`（\`{ id, label, icon?, children? }\` の木）, \`label\`、\`expandedIds\` / \`selectedId\` は制御も非制御も可。WAI-ARIA tree のキーボード操作

### Feedback

- **Alert** — \`tone: 'info'|'success'|'warning'|'error'\`, \`message: string | string[]\`
- **EmptyState** — \`title\`（必須）, \`description?\`, \`icon?\`, \`action?\`（空のリスト・表・検索結果に置く）
- **Progress** — \`value\`, \`max\`（必須）, \`min?\`, \`label?\`
- **Skeleton** — \`shape: 'rect'|'circle'\`, \`size\`, \`animate\`
- **Spinner** — \`size\`, \`label?\`（aria-live）
- **Toast** — \`ToastProvider\` + \`useToast()\`（\`open(tone, message, options?)\` は id を返す / \`close(id)\` / \`closeAll()\`）

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

### Observers

- **InView** — 子要素が見えているかを知らせる。\`onChange(isInView)\`, \`root?\`, \`rootMargin?\`, \`threshold?\`, \`once?\`
- **Resize** — 子要素の大きさが変わると知らせる。\`onChange()\`

### Navigation

- **Anchor** — テキストリンク。外部リンクに自動で新規タブアイコン。\`href\`, \`openInNewTab?\`, \`renderAnchor?\`
- **Breadcrumb**（compound: \`List\` / \`Item\` / \`Link\`(\`current?\`) / \`Separator\`）
- **Pagination** — ページネーション
- **SideNav**（compound: \`Root\`(\`label\`) / \`Group\`(\`title\`) / \`Link\`(\`href\`, \`current?\`, \`renderAnchor?\`)）— 今のページを傍線で示す
- **TableOfContents** — \`items\`（\`{ id, label, children? }\` の木）, \`label?\`。見出しの scroll-margin を読み取り位置にして今の見出しを示す
- **Tabs**（compound: \`Root\`(\`ids\` / \`defaultSelectedId?\`) / \`List\` / \`Tab\` / \`Panel\`）

### Overlays

- **Modal** — \`isOpen?\`/\`onClose?\`/\`defaultOpen?\`, \`side: 'center'|'bottom'|'right'|'left'\`（\`ModalSide\`）
- **Dialog**（compound: \`Root\` / \`Header\` / \`Content\`）
- **Drawer** — \`title\`, \`isOpen\`, \`onClose\`, \`side: 'left'|'right'\`（\`DrawerSide\`。Modal の \`side\` の部分集合）
- **Popover**（compound: \`Root\` / \`Trigger\` / \`Content\`、\`placement\`, \`role\`）
- **Tooltip**（compound: \`Root\` / \`Trigger\` / \`Content\`、\`placement\`）
- **DropdownMenu**（compound: \`Root\`(\`placement\`) / \`Trigger\`(\`label\`) / \`IconTrigger\`(\`icon\`, \`label\`) / \`Content\` / \`Item\`(\`label\`)）
- **ListBox**（compound: \`Root\` / \`Trigger\` / \`IconTrigger\` / \`Content\`、\`options\` / \`value\` / \`onChange\`）

### Icons

アイコンは \`size\` prop を受け取る（\`'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'\`、デフォルト \`md\`）。\`xs\`=12px, \`sm\`=16px, \`md\`=24px, \`lg\`=32px, \`xl\`=40px, \`2xl\`=48px, \`3xl\`=56px。特殊: \`ChevronIcon\`（\`direction\` 必須）, \`AlertIcon\`（\`status\` 必須）。\`Logo\` だけは \`size\` を持たない SVG 本体で、大きさは \`className\` で決める（\`size\` で揃えるなら \`LogoIcon\`）。

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
};

export function GET(_context: RouteContext<'/design.md'>) {
  return new Response(build(), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
