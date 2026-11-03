---
'@k8ordo/framework': patch
---

staticモードで`site`を渡し、`sitemap.xml`を答える`route.ts`も置いたアプリで、ビルドが`route.ts`の書いた`sitemap.xml`をフレームワークのもので上書きしないようにしました。これまでは警告も出さずに上書きし、`vercel()`では中身がフレームワークのsitemap、型が`route.ts`の`GET`の返した`Content-Type`になっていました。いまはビルドを止め、その`route.ts`と`site`を名指して、どちらかを外すよう伝えます。

- `not-found.tsx`があるときに`paths`で`/404.html`を渡した`route.ts`の`404.html`、シェルがあるときの`_redirects`の`route.ts`も、同じく黙って上書きされていました。ページやリダイレクトの`index.html`と同じ場所に書く`route.ts`は、どちらが残るかが決まっていませんでした。これらと、ページの`index.rsc`の場所に置いた`route.ts`もビルドを止めます。`paths`で値をもらう`route.ts`なら、`paths`からその値を外すよう伝えます。
- 大文字と小文字だけが違う名前（`Sitemap.xml/route.ts`と`site`の`sitemap.xml`など）は、macOSとWindowsでは同じファイルになり、黙ってどちらかが消えていました。どのOSでも同じくビルドを止めます。
- `vite dev`は止まりません。パラメータの無い`route.ts`なら、ビルドが止まることを警告します。
