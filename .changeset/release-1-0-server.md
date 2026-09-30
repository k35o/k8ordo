---
"@k8ordo/server": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・static・server・i18n・color-scheme）はそろって 1.0.0 になり、互いの peer は `^1.0.0` で結ぶ。

0.1.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

- peer の `react` / `react-dom` を `>=19.3.0`、`@k8ordo/router` を `^0.1.0` から `^1.0.0` にした。
- ルートの `@k8ordo/server` は `framework()` と `ServerOptions` だけになった。`serve` は `@k8ordo/server/serve`、`redirect` と `RedirectTarget` / `RouteRequest` は `@k8ordo/server/runtime` から import する。
- `redirect(to, { permanent })` の第 2 引数と `RedirectOptions` 型を削除した。
- リクエストハンドラは GET・HEAD・POST 以外のメソッドに `405` で答える。`serve()` は、リクエスト行がパスでないもの（絶対形式・`OPTIONS *`）と、ホストとして読めない `Host` に `400` で答える。
- `redirect.ts` を、表より先ではなく、表の中で宣言した順番（文字どおりの区間が先）に照合する。リダイレクトの URL への GET・HEAD 以外のリクエストには `405` で答える。
- Vite の `base` が根からのパスでない（`./` や別オリジン）ときは、ビルドを止める。

この版で足した主なもの: `guard.ts`・`route.ts`・`loading.tsx`、`cookies()` / `requestHeaders()` / `responseHeaders()` / `nonce()`、`notFound()`、ページの型付きの `search`、Vercel のアダプタ（`@k8ordo/server/vercel`）、Node.js 以外のランタイムでも動くリクエストハンドラ、Vite の `base` の下への配置、リンクの先読み。
