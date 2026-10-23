---
'@k8ordo/framework': minor
---

`mode: 'static'` の `vercel()` が、`route.ts` から書いたファイルを、その `GET` が返した `Content-Type` で配るようにしました。`.vercel/output/config.json` の `overrides` に、ファイルごとの型として書きます。

- 拡張子の無いファイル（`blog/feed` など）にも型が付き、`vite dev` と同じ型になります。
- 拡張子と同じ型でも書くので、Vercel が拡張子に付ける型には頼りません。型を返さなかった `GET`（型の無いバイト列の本文など）のファイルだけは、これまでどおり拡張子で決まります。
- 文字列の本文の `Response` には、型を書かなくても `text/plain;charset=UTF-8` が付き、Vercel でもその型で配られます。`route.ts` では型を書いてください。
- `vite preview` と `serve` は、これまでどおり拡張子で型を決めます。
