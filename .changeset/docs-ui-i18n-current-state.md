---
'@k8ordo/ui': patch
---

同梱ドキュメントの i18n の説明を、今の使い方だけにしました。`GUIDE.md` の「Migrating from 2.x」の節と、README・`llms.txt` からその節への案内を消しました。移行の手順は CHANGELOG にあります。あわせて、`references/types.md` のルートの型の表から、ルートが export していない `Messages` の行を消しました（`Messages` は `@k8ordo/ui/i18n` から import します）。
