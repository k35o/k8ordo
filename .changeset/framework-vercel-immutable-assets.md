---
'@k8ordo/framework': patch
---

`vercel()`が書く`config.json`で、`assets/`の下のハッシュ付きのファイルに`Cache-Control: public, max-age=31536000, immutable`が付くようにしました。Vercelはrouteの`src`をパスの全体に当てるので、これまでの`assets/`で終わる`src`はどのファイルにも当たらず、`assets/`の下のファイルも`public, max-age=0, must-revalidate`で配られていました。staticモードとserverモードのどちらの出力も直ります。
