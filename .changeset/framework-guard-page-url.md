---
'@k8ordo/framework': patch
---

クライアント側の遷移でペイロードを取りに来たリクエストでも、`guard.ts`が受け取る`request.url`をページのURLにしました。これまでは届いたままのペイロードのURL（`/en/account/index.rsc`）を渡していたので、`new URL(request.url).pathname`で判断するguardや、ログインのあとの戻り先を組むguardが、文書の要求とクライアント側の遷移とで別のURLを見ていました。`base`とクエリはそのまま残ります。
