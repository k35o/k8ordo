import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ルーターが作ったURLに、定義の状態を載せたリンクを作れるようになります。クエリは既定値を省いた形にそろいます。',
  en: 'Build links that put a definition’s state on the URL the router built. The query leaves defaults out.',
});

export const hrefTitle = message({
  ja: '`href`',
  en: '`href`',
});

export const hrefCanonical = message({
  ja: '`href(url, values?)`は、渡したURLに定義の状態を載せます。指定しなかったフィールドは既定値として扱い、既定値のままのフィールドはクエリから省きます。できるURLの形は',
  en: '`href(url, values?)` puts the definition’s state on the URL it is given. A field you leave out means its default, and a field at its default is left out of the query. The shape of the URL it builds is described on ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const hrefUrl = message({
  ja: "`url`には、`@k8ordo/router`の`href`が返したURLか、Next.jsの`Route`を渡します。`''`を渡すと、`?page=2`のような今のページへの相対リンクになります。ブラウザはこれをページのクエリ全体の置き換えとして読むので、表示や、ほかのクエリを残さないリンクに使います。",
  en: "Pass `url` a URL `href` of `@k8ordo/router` returned, or a Next.js `Route`. Given `''`, it returns a link relative to the page, such as `?page=2`. The browser reads that as replacing the page’s whole query, so use it for display or for a link that keeps nothing else of the query.",
});

export const hrefEdges = message({
  ja: '返り値の型は、渡したURLをリテラルのまま残します。渡したURLがすでにこの定義のパラメーターやフラグメントを持つときは、そこを書き換え、クエリをフラグメントの前に入れるので、型は近似になります。`entry`だけの定義は、渡したURLをそのまま返します。URLで表せない値を渡すと、`has no URL serialization`を含むエラーになります。',
  en: 'The return type keeps the URL you passed as a literal. When that URL already carries the definition’s params or a fragment, the type is an approximation: those params are rewritten, and the query goes in before the fragment. An `entry`-only definition returns the URL as given. A value no URL can represent throws an error containing `has no URL serialization`.',
});

export const hrefOneWay = message({
  ja: 'ページへのリンクやコードからの遷移など、URLを扱う操作ごとの書き方の一覧は、',
  en: 'For the one way to write every other URL, from a link to a page to a page change from code, see ',
});

export const sharedTitle = message({
  ja: 'ほかのパラメーター',
  en: 'Other params',
});

export const sharedOwn = message({
  ja: '書き換えるのは、この定義の`url`のパラメーターだけです。渡したURLのほかのパラメーターは、例の`ref`のように別の定義が載せたものも、綴りを変えずに残します。この定義のパラメーターはその後ろに並べます。`update()`がURLを書き換えるときと同じ決まりです。',
  en: 'Only the definition’s own `url` params are rewritten. The URL’s other params, such as the `ref` another definition put there in the example, stay as they are spelled, and the definition’s params follow them. It is the same rule `update()` follows when it writes the URL.',
});

export const sharedHash = message({
  ja: '`hash`を持つ定義は、フラグメントを`values.hash`の値にします。既定値ならフラグメントを外します。`hash`を持たない定義は、渡したURLのフラグメントを残します。',
  en: 'A definition with a `hash` slot sets the fragment to the value of `values.hash`, and drops it at the default. A definition without one keeps the URL’s own fragment.',
});

export const baseTitle = message({
  ja: 'Viteの`base`',
  en: 'Vite’s `base`',
});

export const baseRouter = message({
  ja: "`href`はパスに何も足しません。`@k8ordo/router`の`href`がすでにViteの`base`を付けているので、`base`が`'/docs/'`なら`'/docs/products?page=2'`になります。Next.jsの`basePath`は、そのフレームワークの`<Link>`が付けます。",
  en: "`href` adds nothing to the path. `href` of `@k8ordo/router` has already put Vite’s `base` in front, so under `base: '/docs/'` the link is `'/docs/products?page=2'`. Next.js’s own `<Link>` adds its `basePath`.",
});

export const typedTitle = message({
  ja: 'パスの型検査',
  en: 'Typed paths',
});

export const typedRouter = message({
  ja: 'パターンの型検査は、URLを作る`@k8ordo/router`の`href`が行います。表に無いパターンやparamの渡し忘れは、そこで型エラーになります。このパッケージに登録するものはありません。書き方は',
  en: 'The pattern is type-checked by `href` of `@k8ordo/router`, which builds the URL. A pattern missing from the table, or a missing param, is a type error there, and there is nothing to register with this package. See ',
});

export const typedNext = message({
  ja: 'Next.jsでは、`Route`のパスをそのまま渡します。返り値の型は渡したパスを残すので、`<Link>`の型検査がそのまま効きます。',
  en: 'In Next.js, pass the `Route` path as it is. The return type keeps that path, so `<Link>`’s typed-route check still applies.',
});
