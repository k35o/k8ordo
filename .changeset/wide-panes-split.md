---
"@k8ordo/ui": minor
---

2 枚のパネルの大きさを仕切りで分ける `ResizablePanels`（`Root` / `Panel` / `Handle`）を追加しました。WAI-ARIA の window splitter にならい、仕切りはフォーカスできる `separator` で、値は 1 枚目の割合（%）、`aria-controls` は 1 枚目を指します。矢印キーは画面上の向きのとおりに仕切りを動かし（右から左の言語や縦書きでも同じ）、`Home` / `End` で `min` / `max` の端へ移ります。ドラッグはつかんだ点へ跳ばずに動かした分だけ広がります。仕切りの既定の名前に辞書の `resizablePanelsHandle` を足しました。高さの決まった親を分ける枠組みなので、生成 UI のカタログには載せていません。
