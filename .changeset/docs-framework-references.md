---
'@k8ordo/static': patch
'@k8ordo/server': patch
'docs': patch
---

同梱ドキュメントを、入口の `GUIDE.md` とトピックごとの `references/*.md` に分けました。`@k8ordo/ui` と同じ形です。

- static は routing / params / errors / boundaries / deploy の 5 本、server はそれに actions / guards を足した 7 本で、docs サイトの `/static/…`・`/server/…` のページと同じ分け方です。
- `llms.txt` に references を載せ、docs サイトの `/llms.txt` からも `/static/docs/references/…` などの markdown の twin に辿れるようにしました。
- static の GUIDE で、`framework()` の option の一覧から `csp` が抜けていたのを足しました。
