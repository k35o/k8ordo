---
"@k8ordo/server": patch
---

`serve()` が、パスが `//`（や `/\`）で始まるリクエストを別のホストの URL として handler に渡していたのを直した（セキュリティ）。

- これまでは `new URL(パス, http://<Host>)` と解決していたので、`https://example.com//evil.test/x` は `http://evil.test/x` として handler に届いていた。Server Action の同一オリジン検査は `Origin` をこの URL のホストと比べるため、evil.test のページからこの URL へ送ったフォームが検査を通り、action が走った。cookie は SameSite の規則どおりに付く（`SameSite=None` の cookie や、同じサイトの別のサブドメインから送ったときは付く）。`guard.ts` や `route.ts` の `request.url` のホストも evil.test になり、`new URL('/login', request.url)` のようなリダイレクトは evil.test へ向かっていた。
- パスは `Host` のホストの後ろに文字列としてつなぐ。`//evil.test/x` は `example.com` の `//evil.test/x` というパスになる。
- 挙動の変化: リクエスト行がパスでないもの（プロキシへ送る絶対形式の `GET http://…`、`OPTIONS *`）と、`Host` がホストとして読めないもの（空、`@` や `/` を含むもの）には `400` で答える。これまで絶対形式はそこに書かれたホストで配り、`OPTIONS *` には `405` で答えていた。ブラウザがオリジンサーバーへ送るのはパスだけなので、ブラウザからのリクエストは変わらない。`Host` を送らない HTTP/1.0 のリクエストは、これまでどおり `localhost` の URL で handler に渡す。
- `@k8ordo/server/vercel` など、基盤が URL を作って handler を呼ぶホストは、この変更の対象外。
