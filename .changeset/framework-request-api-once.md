---
'@k8ordo/framework': patch
---

`@k8ordo/framework/server`の入口を、ハンドラが読むモジュールと同じファイルにしました。これまでは入口が別にバンドルされていたので、サーバーモードのアプリのバンドルには`cookies()`などのリクエストのAPIと`redirect()`が2つずつ入っていました。今は1つずつです。
