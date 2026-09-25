---
"@k8ordo/server": minor
"docs": patch
---

リクエストハンドラ（`dist/rsc/index.js` の `(request: Request) => Promise<Response>`）をビルドの正式な出口にする。ハンドラが実行環境から借りるのは `node:async_hooks` の `AsyncLocalStorage` だけで、Node.js・Bun・Deno・`nodejs_compat` の Cloudflare Workers でそのまま動く。そのために `serve` を `@k8ordo/server/runtime` から新しい入口 `@k8ordo/server/serve` に移した（`import { serve } from '@k8ordo/server/serve'` に書き換える）。`./runtime` に `serve` が同居していると、Server Action の `redirect()` を import しただけで `serve` の CommonJS 依存（`node:module` の `createRequire` を使う）がハンドラの bundle に入り、Node 以外で動かなくなっていた。`@k8ordo/server/runtime` は `redirect()` と `RedirectTarget`・`RouteRequest` の型だけになる。
