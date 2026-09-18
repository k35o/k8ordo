---
"@k8ordo/ui": patch
---

非制御の `NumberField` が、フォームの reset（`form.reset()`、reset ボタン、action の成功後に React が行う reset）で `defaultValue`（無ければ空欄）に戻るようになりました。これまでは input が常に React の制御下にあり、`value` 属性が入力した値に同期され続けていたため、reset しても表示も送信値も変わりませんでした。reset で戻った値は `onChange` にも渡します。

制御モードの `NumberField` は reset で `value` を変えません。値の持ち主は親なので、reset に合わせて戻すならフォームの `onReset` で自分の state を戻してください。
