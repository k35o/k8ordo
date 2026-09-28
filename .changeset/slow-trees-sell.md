---
"@k8ordo/server": minor
---

Server Action を、送られた先のページの文脈で実行するようにした。action のリクエストでもページの params のスキーマが走り、その文脈（`@k8ordo/i18n` が記録するロケールなど）の中で action が走るので、`/ja/…` のページから送られた action は `ja` で文言を作る。ロケールを `bind` したり `locales.run` で囲んだりする必要はなくなった。
