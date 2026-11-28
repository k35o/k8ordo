---
'@k8ordo/state': major
'@k8ordo/framework': major
---

`definePageState`の`href`の第1引数を、ルーターが作ったURLにしました。`@k8ordo/router`（`@k8ordo/framework`）の`href()`が返したURL、Next.jsの`Route`、今のページを指す`''`のどれかを渡します。`href`はそのURLのクエリのうち、この定義の`url`のパラメーターだけを既定値を省いた形で書き直し、ほかのパラメーターは綴りを変えずに残します。`hash`を持つ定義はフラグメントを`values.hash`の値にし（既定値なら外します）、持たない定義は渡したURLのフラグメントを残します。`base`は足しません。

これまでは、表のパスを受け取ってViteの`base`を足す`href(path)`と、`?`の無いクエリだけを返す`search()`の2通りがありました。`[locale]`のアプリでは、ロケールやidを手で綴るか、`search()`の結果を自分でつなぐことになり、`hash`を持つ定義にはフラグメントを組む手段がありませんでした。ルーターの`href()`が返したURLを渡すと`base`が2重に付くので、渡すなと案内するしかありませんでした。いまは`listState.href(href('/:locale/products'), { page: 2 })`、`productState.href(href('/:locale/products/:id', { id }), { hash: 'reviews' })`の1通りです。パターンの型検査はルーターの`href()`が受け持つので、`Register`、`RegisteredPath`、`search()`をなくしました。`@k8ordo/framework`が生成する`.k8ordo/register.gen.ts`も、`@k8ordo/state`の`Register`を拡張しなくなりました。

移行するには、次のように書き換えます。

- `listState.href('/products', values)`は`listState.href(href('/products'), values)`にします。`href`は`@k8ordo/router`か`@k8ordo/framework`から読みます。Viteの`base`はルーターの`href()`が付けます。Next.jsでは`Route`のパスをそのまま渡せます。
- `listState.search(values)`は`listState.href('', values)`にします。返り値は`?`付きの`'?page=2'`（既定値だけなら`''`）です。
- `` `${deckState.href(path, values)}#${fragment}` ``のようにフラグメントを手でつないでいた箇所は、`hash`の値を`values`に入れて`deckState.href(href(…), { …values, hash })`にします。
- `declare module '@k8ordo/state' { interface Register { … } }`と`RegisteredPath`の利用は消します。
