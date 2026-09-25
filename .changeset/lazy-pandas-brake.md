---
"@k8ordo/server": minor
"docs": patch
---

Vercel のアダプタ `@k8ordo/server/vercel` を追加。`plugins: [framework(), vercel()]` とすると、`vite build` が Vercel の Build Output API（v3）の形で `.vercel/output/` も書き、`vercel build` / `vercel deploy --prebuilt` がそのままデプロイする。クライアントのビルドは CDN の静的ファイル（`assets/` はファイルが答えたときだけ immutable）、それ以外はリクエストハンドラを `fetch` として渡すストリーミングの Node.js 関数 1 つになる。関数は自分のディレクトリしか持てないので、`vercel()` の下ではハンドラをすべての依存ごと bundle する（ネイティブのバイナリを持つ依存は動かない）。
