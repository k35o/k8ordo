---
'@k8ordo/framework': major
'@k8ordo/i18n': major
---

staticモードで、パラメータの値を`framework()`の`paths`オプションではなく、パラメータのディレクトリに置く`paths.ts`から読むようにしました。`src/routes/blog/[slug]/paths.ts`は、`slug`の値を配列かそのPromiseで返す関数をdefault exportします（型は`@k8ordo/framework`の`Paths<'/blog/:slug'>`）。これまでは`vite.config.ts`の中で値を並べていたので、アプリのエイリアスや`server-only`のモジュールを素直に読めず、URLの情報の一部が`routes/`の外にありました。`paths.ts`はページと同じモジュールグラフで実行されるので、ページと同じデータの読み方をそのまま使えます。値はそのディレクトリより下のすべてに使われ、`/blog/:slug/og.png`のような`route.ts`や`redirect.ts`のパターンを手で展開する必要はありません。関数は上のディレクトリのパラメータを引数として受け取り、上の値の組み合わせごとに1回呼ばれます。値はエスケープする前の文字列で返します。`fallback.tsx`のシェルの場所も、上の`paths.ts`が返す値ごとに自動で決まります（`[locale]/paths.ts`が`ja`と`en`を返せば`/ja/posts/:id`と`/en/posts/:id`）。`fallback.tsx`と同じディレクトリに`paths.ts`を置くと、返した値はページとして書き出され、残りの値にシェルが答えます。`vite dev`は、どの`paths.ts`も返さなかった値にビルドしたサイトと同じく答えるようになりました。`fallback.tsx`があればシェルで、無ければ404です。これまでは、どの値も`page.tsx`で描画していました。`@k8ordo/i18n`の`locales.paths`は削除しました。移行するには、`vite.config.ts`から`paths`を消し（残っていると設定を読んだ時点でエラーになります）、パラメータのディレクトリごとに`paths.ts`を置きます。`paths: locales.paths`を渡していたアプリは、`src/routes/[locale]/paths.ts`で`locales.all`を返します。
