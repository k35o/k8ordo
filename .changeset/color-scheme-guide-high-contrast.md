---
'@k8ordo/color-scheme': patch
---

ガイドの「Contrast」の説明を、`@k8ordo/ui`の今のスタイルシートに合わせました。これまでは、ハイコントラストの値が`:root`と`.dark`の両方に宣言されていると書いていました。いまは`@media (prefers-contrast: more)`の中の`:root`に`light-dark()`の組で1回だけ宣言され、クラスから決まる`color-scheme`がどちらの値にするかを選びます。自分のスタイルシートで対応するときも、同じ書き方をすればよいことを書き添えました。
