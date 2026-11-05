---
"@k8ordo/framework": patch
---

確かめようのない推測にもとづく検査をやめました。

- staticモードのビルドは、`route.ts`のファイルとビルドが自分で書くファイルを、大文字と小文字を区別して比べます。
- `vite dev`は、`route.ts`のファイルがビルドの書くファイルと重なることを前もって警告しません。止まるのはこれまでどおりビルドです。
- `vercel()`は、`beforeFiles`と`beforeNotFound`の`has`のヘッダーの`key`が小文字かどうかを確かめません。
