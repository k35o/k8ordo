---
"@k8ordo/server": minor
---

Content-Security-Policy のために、フレームワークが自分で出すインラインスクリプト（hydration 用に HTML へ書くペイロードと React のもの）と起動のモジュールに、リクエストごとに作った nonce を付けるようにした。`@k8ordo/server/runtime` の `nonce()` でそれを読める（guard.ts・レイアウトやページ・Server Action のどこからでも、描画の中でも同じ値）。フレームワークはポリシーを決めないので、アプリが guard.ts でそれを名指す `Content-Security-Policy` を書く。
