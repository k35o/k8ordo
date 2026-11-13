---
'@k8ordo/framework': minor
---

staticモードで、アプリが`sitemap.xml`を`route.ts`で書いているときは、`site`を渡していてもビルドが`sitemap.xml`を書かないようにしました。これまでは両方があるとビルドが止まり、更新日や並びを自分で決めたいアプリは`site`を外すしかありませんでした。`site`を外すと、`route.ts`が受け取る`request.url`からもサイトの配信元が消えます。今は`routes/`の`route.ts`がそのURLの答えになり、`site`は渡したままにできます。`404.html`や`client-files.json`のように、ビルドが自分で書くほかのファイルに`route.ts`を置いたときは、これまでどおりビルドが止まります。
