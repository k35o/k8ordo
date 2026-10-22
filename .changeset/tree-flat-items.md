---
'@k8ordo/ui': minor
---

`Tree`の項目を入れ子にせず、見えている項目を1つの平らな一覧で描くようにしました。階層は`aria-level`、兄弟の中の位置は`aria-posinset`と`aria-setsize`で伝えます。これまでは開いた親の`treeitem`が子の`group`まで含んでいたので、axe-core 4.14から既定で有効になった`label-content-name-mismatch`が、子の項目の文字も親のラベルに数えて違反にしていました。`role="group"`は描かなくなったので、テストで`group`を引いている場合は`aria-level`で確かめてください。
