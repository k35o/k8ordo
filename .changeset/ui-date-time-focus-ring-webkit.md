---
'@k8ordo/ui': patch
---

WebKit（Safari）で、`type`が`date`、`time`、`datetime-local`の`TextField`にフォーカスの輪が出なかったのを直しました。これらの欄ではフォーカスを持つのが欄の中のパーツ（年、月、日など）で、WebKitはそのあいだ`<input>`を`:focus`にはしますが、`:focus-visible`にはしません。日付や時刻の欄は`:focus`でも輪を出すようにしました。ChromiumとFirefoxでは、これらの欄はフォーカスがあれば必ず`:focus-visible`になるので、見た目は変わりません。
