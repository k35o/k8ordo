---
"@k8ordo/server": minor
"@k8ordo/static": minor
"@k8ordo/router": minor
---

ルートファイル `route.ts` を足した。答えるリクエストのメソッドごとに関数（`GET` / `POST` など）を export し、`{ request, params }` を受け取って `Response` を返す。RSS・robots・JSON・webhook のようなページではない答えに使う。表の順番にはページと同じく並び、ページや redirect.ts と同じディレクトリには置けず、メソッドを 1 つも export しなければ拒む。`@k8ordo/server` では export したメソッドにだけ答え（`HEAD` は `GET` から本文を外したもの、ほかは `Allow` 付きの `405`）、上の guard が先に走り、同じ origin は求めず、`cookies()` などが使える。`@k8ordo/static` ではビルドが `GET` を 1 度呼んで答えを pathname のファイルとして書き（`feed.xml/route.ts` → `feed.xml`、`site` があればリクエストの origin はそれ）、`GET` 以外を export する `route.ts` は名指しで拒む。`@k8ordo/router` に型 `RouteContext<P>` を足した。
