---
"@k8ordo/ui": patch
---

ダークモードで、スクロールバーやフォーム部品、`<dialog>` の既定の色といったブラウザ自身の描画が明るいまま残っていたのを直しました。ベースレイヤーで CSS の `color-scheme` プロパティを、トークンと同じく `dark` クラスに合わせて設定します（`:root` は `light`、`.dark` の下は `dark`）。`prefers-color-scheme` ではなくクラスに従うので、OS がダークでも `.dark` が無ければ明るいままです。`@layer base` の中にあるので、レイヤー外の `color-scheme` の指定で上書きできます。
