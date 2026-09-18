---
"@k8ordo/state": patch
---

ガイドの「Updates」を `@k8ordo/router` の修正に合わせて直しました。非同期アクション（`startTransition(async …)`・`useTransition`・`Button` の `onAction`）の中でも `update().finished` を待てます。別ページの読み込み中の url 更新もページの切り替えになりますが、ページの切り替えはアクションに加わらないので止まりません。
