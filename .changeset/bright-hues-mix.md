---
"@k8ordo/ui": minor
---

色を選ぶ `ColorPicker` を追加しました。値は `#rrggbb` で、`name` を持つテキスト欄が値を運ぶので、ほかの欄と同じく送信・reset・変更の有無の判定に乗ります。色相・彩度・明度のつまみ（ネイティブの `<input type="range">`）と、名前付きの見本（`swatches`、`aria-pressed` のボタン）は欄に書き込み、打ち込んだときと同じく `input` イベントで知らせます。欄の横の色はネイティブの `<input type="color">` で、押すとブラウザの色選びが開き、選んだ色は同じように欄に書き込まれます（`name` を持たないので、送られるのは欄の値だけです）。打っている間は 6 桁そろって初めて色として知らせ、離れるときと Enter で小文字の `#rrggbb` にそろえます（3 桁の `#f80` はそこで広げます）。`@k8ordo/form` の `formFields` が導いた属性はそのまま広げられ、スキーマの `.regex()` は `pattern` として既定のものを置き換えます。つまみの名前に辞書の `colorPickerHue` / `colorPickerSaturation` / `colorPickerLightness`、見本のまとまりに `colorPickerSwatches`、欄の横の色に `colorPickerOpen` を足しました。json-render と OpenUI のカタログにも載せました。
