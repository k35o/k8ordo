---
'@k8ordo/ui': minor
---

印刷では、`.dark`が付いていても、色のトークンと`color-scheme`をライトの値に戻すようにしました。ブラウザは既定で背景を刷らないので、ダークのまま刷ると、白い紙に明るい文字が出ていました。

- `@media print`のとき、`.dark`が上書きする色のトークンは`:root`の値になり、`color-scheme`は`light`になります。`prefers-contrast: more`のときは、ライトのハイコントラストの値になります。
- `tailwind.css`の`dark:`と`light:`のバリアントも、印刷ではトークンと同じく切り替わります。
- 背景ごと刷るスライドのように、画面の配色のまま刷りたいときは、`print-as-shown`クラスを付けた要素を置きます。この要素を含む`.dark`は、印刷でもダークの値のままです。背景を刷るには、`print-color-adjust: exact`も指定します。
- `@k8ordo/ui/tokens`には、印刷の2つのモードが修飾子として加わります。
