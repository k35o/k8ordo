---
'@k8ordo/server': minor
---

実行時の API をプラグインと別の入口に分けた。ルートの `@k8ordo/server` はプラグインの `framework()` と `ServerOptions` だけを持つ。

これまでルートのエントリは 1 つのファイルで `serve` / `redirect` と並んで `vite`・`@vitejs/plugin-react`・`@vitejs/plugin-rsc` を import していたため、ビルドしたアプリ（`dist/rsc/index.js` と `serve.js`）が `pnpm install --prod` した環境で `ERR_MODULE_NOT_FOUND` で落ちていた。新しい入口は Vite を読まないので、`vite` は devDependency のままでよい。`vite.config.ts` は `@k8ordo/static` と同一のまま。

- `serve` / `Server` / `ServeOptions` → `@k8ordo/server/serve`
- `redirect` / `RedirectTarget` / `RouteRequest` → `@k8ordo/server/runtime`（`cookies()` などリクエストの中で使う API もここにある）
- 生成する `routes.gen.ts` / `register.gen.ts` も `RouteRequest` を `@k8ordo/server/runtime` から import する（次のビルドで書き直される）。

リクエストハンドラ（`dist/rsc/index.js` の `(request: Request) => Promise<Response>`）がビルドの正式な出口になる。`@k8ordo/server/runtime` は `serve` の Node 専用の依存を読まないので、ハンドラが実行環境から借りるのは `node:async_hooks` の `AsyncLocalStorage` だけで、Node.js・Bun・Deno・`nodejs_compat` の Cloudflare Workers でそのまま動く。
