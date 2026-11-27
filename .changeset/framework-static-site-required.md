---
'@k8ordo/framework': major
---

`mode: 'static'`では`site`を必須にしました。`site`はサイトを配信するoriginで、パスを含めません（`https://example.com`）。ビルドはページと`route.ts`をすべてこのoriginで頼むので、`route.ts`が受け取る`request.url`のoriginも、ビルドが書く`sitemap.xml`のURLもこの値になります。値はURLとして読むので、`https://Example.com`や`https://example.com:443`、`https://例え.jp`もそのoriginとして受け取ります。無いとき、またはhttp:かhttps:のURLでない値や、パス・クエリ・フラグメント・ユーザー名を含む値のときは、設定を読んだ時点で`mode: 'static' needs site, the origin the site is served from, like 'https://example.com' — …`のエラーになり、何が違うかを挙げます。

これまで`site`が無いビルドは、`http://k8ordo.localhost`というフレームワークの番兵のoriginでページを頼んでいました。RSSやOG画像のように`new URL(request.url).origin`から絶対URLを組む`route.ts`には、この番兵が黙って書き込まれていました。また、リクエストは`new URL(site).origin`、`sitemap.xml`は`site`の文字列のままを使っていたので、パスを含む`site`を渡すと2つが食い違っていました。

移行: staticモードの`framework()`に`site`を足してください。`sitemap.xml`を`route.ts`で書いているアプリも、ビルドはそちらを使うので出力は変わりません。
