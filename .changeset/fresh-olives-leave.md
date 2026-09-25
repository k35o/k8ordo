---
"docs": patch
---

サイトの CSS に Tailwind のプリフライト（`@layer base` のリセット）が 2 回出力されていたのを直す。`@k8ordo/ui` の Tailwind 入口（`src/styles/index.css`、配布物の `tailwind.css`）が中で `@import 'tailwindcss'` しているのに、`globals.css` でも先に同じものを読み込んでいた。テーマの変数とユーティリティは 1 つにまとまっていたので、重なっていたのはプリフライトだけで、見た目は変わらない。
