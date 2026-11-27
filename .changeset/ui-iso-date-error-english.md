---
'@k8ordo/ui': patch
---

`Calendar`と`DatePicker`が日付を計算するときに、`YYYY-MM-DD`の暦日でない値で投げる`RangeError`の文言を英語にしました。公開するパッケージが実行時に開発者へ出す文言は英語にそろえています。文言は`@k8ordo/ui: not a YYYY-MM-DD calendar date: "2023-02-30"`のように、パッケージ名と受け取った値を含みます。
