---
"@k8ordo/ui": minor
---

範囲を選ぶ `RangeSlider` を追加しました。2 つのつまみはそれぞれ本物の `<input type="range">` で、`name` の組で 2 つの欄として送られ、互いを越えません（WAI-ARIA の multi-thumb slider）。非制御のときは値を DOM に持つので、フォームの reset と変更の有無の判定がそのまま効きます。`Progress` は `value` を省くと進み具合の分からない表示（帯が行き来する。動きを減らす設定では明滅だけ）になり、`max` は省略時 100 になりました。名前に組み込みの `loading` を使うため、`Progress` はクライアントコンポーネントになりました。どちらも json-render と OpenUI のカタログに載っています。
