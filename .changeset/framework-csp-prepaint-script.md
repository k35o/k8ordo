---
'@k8ordo/framework': patch
'@k8ordo/state': patch
---

CSPのリファレンスに、アプリ自身の「最初の描画の前に動くスクリプト」の書き方を足しました。`@k8ordo/state`の`inlineRead()`で値を読むスクリプトは、ルートレイアウトに`<script>`で直接書くと、本文がすべてのページのペイロードに入ります。serverモードでnonceのポリシーを敷くと拒まれ、staticモードではハッシュが要ります。`@k8ordo/color-scheme`の`ColorSchemeScript`と同じく、nonceをpropsで受け取る小さな`'use client'`のコンポーネントにし、serverモードでは`nonce()`を渡し、staticモードでは同じ本文のハッシュを`csp`に書く形を示しました。

`@k8ordo/state`のガイドの「Reading before hydration」からは、この項へ1文で案内します。
