---
'@k8ordo/form': patch
---

`z.iso.datetime({ local: true })` と `z.iso.time()` が `type="text"` に落ちていたのを直しました。

zod 4.5 から、JSON Schema の `format` は標準の書式と値の集合が一致するときにしか出力されなくなり、この 2 つは pattern だけになりました。結果として `datetime-local` / `time` のピッカーが消え、スキーマが求めていたコントロールが失われていました。入力の `type` は JSON Schema の `format` ではなくスキーマが宣言した書式から決めるので、zod のこの変更に左右されません。

`HiddenValue` の `data-initial`（dirty 判定の基準値）は、レンダー中の ref 参照をやめ、input がマウントされた時点の値から書くようになりました。サーバが返す HTML にはこの属性が乗らなくなります。
