---
"@k8ordo/ui": minor
"docs": patch
---

部品を Tailwind CSS でなく CSS Modules で書くようにし、利用側に Tailwind を求めないようにする（破壊的変更）。

- **スタイルの届き方**: `styles.css` はレイヤーの順（`@layer properties, theme, base, components, utilities;`）、トークン、リセット（Tailwind 4 の preflight と同じ中身）、ページ全体の既定だけを持つ。部品の見た目は部品ごとの CSS が持ち、部品の JS がそれを import する。使った部品の CSS だけがアプリに入る。部品の CSS はすべて `components` レイヤーにあるので、レイヤー外の利用側の CSS と Tailwind のユーティリティが部品に勝つ。利用側のバンドラは、パッケージの JS からの CSS の import を扱える必要がある（Vite、Next.js、webpack、Rspack はそのまま扱える）。
- **トークンの名前**: トークンを `@theme inline` から素の `:root` に移し、分類を接頭辞にした名前に変えた。古い名前の別名は無い。`--fg-*` / `--bg-*` / `--border-*` / `--primary-*` / `--secondary-*` / `--group-*` は `--color-fg-*` などに、`--back-drop` は `--color-back-drop` に、`--text-*` は `--font-size-*` に、`--text-*--line-height` と `--leading-*` は `--line-height-*` に、`--tracking-*` は `--letter-spacing-*` に、`--z-*` は `--z-index-*` に、`--inset-shadow-*` は `--shadow-inset-*` になった。利用側が定義するフォントの変数も `--font-noto-sans-jp` / `--font-m-plus-2` から `--font-family-noto-sans-jp` / `--font-family-m-plus-2` に変わる。新しく `--radius-full`、`--font-family-sans` / `--font-family-mono`、`--shadow-ring-*`（フォーカスの輪）、`--duration-*`、`--easing-*`（Tailwind の曲線）、`--z-index-raised`、em を基準にした `--spacing-em` などを足した。
- **`tailwind.css`**: Tailwind 4 の利用者向けの橋として残す。これまでと同じユーティリティ名（`bg-bg-base`、`text-md`、`leading-loose`、`dark:`、`vertical:` など）が新しいトークンを読む。テーマは `reference` なので、変数を自分では宣言しない。`@source` で ui の部品を走査することはもう無い。橋は `@import 'tailwindcss'` を含まなくなり、利用側の Tailwind の後に読み込む。`tailwindcss` は peer から外した（`@k8ordo/ui` は Tailwind に依存しない）。
- **`cn` と tailwind-merge**: 内部の `cn` をやめ、依存から tailwind-merge を外した。部品は今までどおり `className` を受け取らない。variant は要素自身の修飾クラスで表すので、`renderItem` / `renderAnchor` の束から `className` だけを受け取る使い方はそのまま同じ見た目になる。クラス名は CSS Modules のハッシュになり、`.ao-code-block` や `.ao-prose` などの決まった名前は無くなった。
- **`@k8ordo/ui/tokens`**: `tokens` は DTCG の resolver 文書（Resolver Module 2025.10）になった。`:root` のトークンが set、`.dark` と `prefers-contrast: more` が modifier になる。`tokens.theme` / `tokens.vars` / `tokens.refs`、`meta`、キーの和集合の型は無くなった。
- **縦書き**: `writing-v` / `writing-h` は `styles.css` のクラスとして残り、`writing-mode` と一緒にカスタムプロパティ `--writing`（`vertical` / `horizontal`）を設定する。自分の CSS では `@container style(--writing: vertical)` で縦書きに合わせる。`vertical:` の変種は `tailwind.css` にだけある。
- **`Response`**: streamdown が要素に付ける `data-streamdown` で見た目を当てるので、Tailwind も `@source` も要らない。確認ダイアログと表の全画面は `Response` の中に出す（`portal` は部品が持つ）。`streamdown/styles.css` は streamdown の `animated` を使うときだけ要る。
- CSS は `@scope`、style クエリ、`light-dark()`、`:dir()`、入れ子を使う。利用側のバンドラの CSS の target は新しく保つ。古い target では Lightning CSS が `:dir(rtl)` を `:lang()` の並びに書き換え、`dir` に従わなくなる。

移行: `var(--fg-mute)` などトークンを直接読んでいる CSS は新しい名前に書き換える。Tailwind の利用者は `@import '@k8ordo/ui/tailwind.css';` の前に `@import 'tailwindcss';` を足す。フォントの変数を定義しているなら名前を変える。`@k8ordo/ui/tokens` を読んでいるなら DTCG の文書から値を取る。

サイトは CSS Modules で書き直し、`better-css-modules check` を通す。トークンの名前の表示とテーマのページを新しい名前に合わせた。
