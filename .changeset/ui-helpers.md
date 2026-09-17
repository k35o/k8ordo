---
'@k8ordo/ui': major
---

ルートのエントリから helpers（`cn` / `chain` / `mergeProps` / `mergeRefs` / `createSafeContext`）を公開しなくなりました。いずれも UI コンポーネントライブラリ固有の理由を持たない汎用ユーティリティで、コンポーネントの内部実装として残します。

- `cn`：`clsx` と `tailwind-merge` を直接使ってください。ui のコンポーネントは `className` を受け取らないので、`cn` が要るのは自分の要素だけです。
- `chain`：受け取ったハンドラを順に呼ぶ関数を、その場で書いてください。
- `mergeProps` / `mergeRefs`：render prop で受け取る props は、そのまま要素に展開してください。自分の ref と合わせるなら、ref コールバックの中で両方に代入してください。
- `createSafeContext`：`createContext` と、Provider が無いときに throw する `use` のラッパーを自分で書いてください。

型のリファレンスは `docs/references/helpers.md` から `docs/references/types.md` に移しました。docs サイトの `/ui/helpers` はなくなりました。
