---
"@k8ordo/router": minor
---

`@k8ordo/router` に型 `RouteContext<P>` を足した。`@k8ordo/framework` のルートファイル `route.ts` で、メソッドごとに export する関数（`GET` / `POST` など）が受け取る `{ request, params }` の型。
