---
'@k8ordo/framework': patch
---

同梱のドキュメントの食い違いを直しました。GUIDEのオプションの節に、両モードで使える`headers`を足しました。llms.txtの冒頭は「`mode`を変えて`site`と`csp`を外すだけで、ほかは何も変わらない」と書いていましたが、GUIDEと同じく、serverモードへ移るときとstaticモードへ移るときに何を外し何を足すかを書きました。ビルドしたハンドラ（`dist/rsc/index.js`）の型も、第2引数の`HandlerContext`を含めて書きました。GUIDEには、リクエストに答えるものをビルドしたハンドラか`serve({ port: 0 })`でテストする方法を書いた「Testing」の節を足しました。
