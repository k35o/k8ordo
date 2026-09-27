---
"docs": patch
---

Props の表（型の区切りの `|` と、狭い画面の `Type:` / `Default:`）と `/ui/i18n` の文言キー一覧（狭い画面の列名）のラベルを、`fg-mute` の 60% ではなく `fg-subtle` で塗る。不透明度修飾子のために Tailwind が出していた `@supports (color: color-mix(in lab, red, red))` の分岐がサイトの CSS からなくなり、ライトで 2.9:1 だったラベルのコントラストが AA（5.1:1）に上がる。
