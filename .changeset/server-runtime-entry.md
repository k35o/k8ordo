---
'@k8ordo/server': minor
---

実行時に使う API を `@k8ordo/server/runtime` に移した。ルートの `@k8ordo/server` はプラグインの `framework()` と `ServerOptions` だけを持つ。

ルートのエントリは 1 つのファイルで `serve` / `redirect` と並んで `vite`・`@vitejs/plugin-react`・`@vitejs/plugin-rsc` を import していたため、ビルドしたアプリ（`dist/rsc/index.js` と `serve.js`）が `pnpm install --prod` した環境で `ERR_MODULE_NOT_FOUND` で落ちていた。`@k8ordo/server/runtime` は Vite を読まないので、`vite` は devDependency のままでよい。`vite.config.ts` は `@k8ordo/static` と同一のまま。

- `serve` / `Server` / `ServeOptions` → `@k8ordo/server/runtime`
- `redirect` / `RedirectTarget` / `RouteRequest` → `@k8ordo/server/runtime`
- 生成する `routes.gen.ts` / `register.gen.ts` も `RouteRequest` を `@k8ordo/server/runtime` から import する（次のビルドで書き直される）。
