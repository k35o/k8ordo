---
'@k8ordo/framework': minor
---

応答を返したあとも続く処理のために、`@k8ordo/framework/server` に `waitUntil(promise)` を足しました。渡した promise が決着するまで、ホストはプロセスや関数を止めません。Vercel の関数は応答が終わると止められるので、利用者が切断したあとも生成を最後まで読んで保存する、といった処理には、ホストに「まだ終わっていない」と伝える手段が要ります。

- `waitUntil()` は guard.ts・route.ts・Server Action のほか、ページの描画の中や、route.ts が返したストリームの中からも呼べます。渡した promise が reject しても未処理の rejection にはならず、ハンドラが `k8ordo: waitUntil() of <メソッド> <パス> failed` の形で 1 度だけログに出します。`mode: 'static'` では `/server` のほかの値と同じく断ります。
- ビルドされたハンドラ（`dist/rsc/index.js`）は、第 2 引数でホストの `waitUntil` を受け取ります（型は `/server` の `HandlerContext`）。ハンドラを自分で呼ぶランタイムは `handler(request, ctx)` のように渡せます。渡さなければ、ハンドラが promise を持つだけです。
- `serve()` の `close()` は、サーバーを閉じたあと、`waitUntil()` に渡された promise がすべて決着するまで解決しません。`node dist/server.js` は SIGTERM で止める前に処理を終えます。
- `vercel()` は、アプリが `waitUntil` を import しているとき、アプリが入れた `@vercel/functions` の `waitUntil` を関数に束ねてハンドラに渡します。`@vercel/functions` は optional な peer で、入っていなければ import しているファイルを挙げてビルドを止めます。`waitUntil` を使わないアプリの出力は変わりません。
