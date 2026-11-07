---
'@k8ordo/color-scheme': patch
---

`ColorSchemeScript`をClient Componentにして、スクリプトの中身がページのペイロードに載らないようにしました。これまではServer Componentとして描いた`<script>`の中身が、各ページの`.rsc`と、HTMLに埋め込むペイロードにも入っていました。遷移で届いた`<script>`は実行されないので、使われないバイトでした。今はペイロードに`themeColor`などのpropsだけが載り、サーバーの描画とハイドレーションが同じ中身を作ります。props、HTMLに書くスクリプト、`colorSchemeScriptHash()`が返すハッシュは変わりません。
