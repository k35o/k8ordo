---
'@k8ordo/ui': patch
---

`Anchor`が既定の`<a>`に`kind="internal"`や`kind="external"`という属性を出していたのを直しました。`kind`は`renderAnchor`に渡す値で、HTMLの属性ではありません。`renderAnchor`にはこれまでどおり渡ります。CSSやテストが`a[kind]`を読んでいた場合は、`renderAnchor`で自分の属性を付けてください。
