---
"@k8ordo/static": patch
"@k8ordo/server": patch
---

npm から入れたアプリの `vite`（開発サーバー）で、`'use client'` のモジュールを持つ `@k8ordo/*`（router、state、color-scheme、form、ui）がブラウザに 2 つずつ載らないようにした。これまでは依存の事前バンドルに入った版と、RSC プラグインがファイルのまま読ませる版が並び、`client component dependency is inconsistently optimized` の警告が出ていた。片方が渡した context をもう片方が読めないので、`error.tsx` がクライアント遷移で消えず、サーバーのレイアウトで描いた `<ColorSchemeProvider>` を client コンポーネントの `useColorScheme()` が見つけられずにページごと落ちていた。これらを client 環境の `optimizeDeps.exclude` に入れ、どちらもファイルのまま読ませる。ビルドの出力は変わらない。
