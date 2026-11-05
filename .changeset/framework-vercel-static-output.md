---
"@k8ordo/framework": patch
---

staticモードで`vercel()`を使うビルドが、`_redirects`をCloudflareがどう読むかの警告（静的と動的のルールの上限、書けないURL、シェルを隠す`public/_redirects`のルール）を出さないようにしました。Vercelは`_redirects`を読みません。`_redirects`は`serve`と`vite preview`のためにこれまでどおり書きます。

あわせて、Vercelに書き出すルートが`public/_redirects`に左右されなくなりました。ページでないURL（`redirect.ts`や`route.ts`のファイル）のペイロードをシェルのHTMLで答えるルートを、`public/_redirects`に同じ`from`があるときや、URLに`:`と英字が並ぶときにも書きます。

Vercelの上で`vercel()`を使わずにシェルを書き出したときの警告はなくしました。
