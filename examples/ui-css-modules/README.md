# @k8ordo/ui × CSS Modules

Tailwind CSS を**一切入れずに** `@k8ordo/ui` を使う example。
セットアップはビルド済み CSS の import 1行だけ。

```tsx
import '@k8ordo/ui/styles.css';
```

## この example が示すこと

- **コンポーネントはそのまま動く** — コンポーネントが参照するクラスは
  ビルド済み `styles.css` にすべて含まれている。利用側のビルドに
  Tailwind は不要（このパッケージの依存に `tailwindcss` は存在しない）。
- **自分の UI は CSS Modules で書く** — ページのレイアウトや文字色は
  [`src/app.module.css`](src/app.module.css) にある。k8ordo UI の
  コンポーネントは `className` / `style` を受け取らない閉じたスタイリング API
  なので、カスタム UI は自分のマークアップ側に書く。
- **デザイントークンはそのまま使える** — トークンは `:root` / `.dark` の
  CSS カスタムプロパティとして配布されるので、CSS Modules から
  `var(--fg-mute)` のように参照でき、ダークモードにも自動で追従する。
- **カスケードは利用側が勝つ** — ライブラリのルールはすべて
  `@layer theme, base, components, utilities` 内にあり、レイヤー外の
  CSS Modules はレイヤー内のルールより優先される（唯一の例外は preflight の
  `[hidden] { display: none !important }`）。なお import すると Tailwind の
  preflight とライブラリの base スタイルが文書全体に適用される点には注意
  （`strong` の太字解除・リストスタイルのリセットなど）。

Tailwind CSS 4 を使うプロジェクトは、代わりにソース版の
`@k8ordo/ui/tailwind.css` を import すると、デザイントークンを
自分のマークアップの Tailwind クラスとしても使える（`examples/vite` /
`examples/nextjs` を参照）。

## Getting Started

```bash
pnpm install
pnpm --filter @k8ordo/ui build # ワークスペース内では先にライブラリをビルド
pnpm --filter example-ui-css-modules dev
```

## Scripts

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `pnpm dev`       | 開発サーバーを起動              |
| `pnpm build`     | プロダクションビルド            |
| `pnpm test`      | ビルド済み CSS の消費契約テスト |
| `pnpm typecheck` | 型チェック                      |
| `pnpm check`     | lint / format チェック          |

## Structure

```
examples/css-modules/
├── src/
│   ├── main.tsx           # styles.css の import と Provider
│   ├── app.tsx            # コンポーネント + CSS Modules の併用デモ
│   ├── app.module.css     # ページ固有のスタイル（トークンを var() で参照）
│   └── styles.test.ts     # 「Tailwind なしで消費できる」を固定するテスト
├── index.html
├── package.json           # tailwindcss への依存なし
└── vite.config.ts         # @tailwindcss/vite なし（意図的）
```
