---
'@k8ordo/state': patch
---

同梱ドキュメントを実装に追従させました。

- `defineMemoryState` はスキーマを取らない型付きの箱で、スキーマを持つのは境界をまたぐ置き場所（url・entry・localStorage・sessionStorage・Cookie）だけ、とどの面でもそろえました。
- 更新のハンドルは、ナビゲーションを伴わない種類でも書き込みが済んでから settle し、local は保存に失敗すると reject します。
