---
'@k8ordo/ui': minor
---

`Breadcrumb.Link`が、`hrefLang`や`data-*`などの`<a>`の属性を受け取り、そのまま渡すようにしました。`renderAnchor`にも同じ属性が渡ります。`current`のときは`<span aria-current="page">`を描くので、これらの属性は付きません。`className`と`style`は受け取りません。
