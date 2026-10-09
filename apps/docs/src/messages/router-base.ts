import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'アプリをオリジンの直下ではなく、`https://example.com/docs/`のようなサブパスの下で配信することがあります。そのときもルート表はアプリの根から書いたままにして、サブパスの付け外しはルーターに任せます。',
  en: 'Sometimes an app is served below a path of its origin, such as `https://example.com/docs/`, rather than at its root. The route table stays written from the app’s root even then, and the router adds and removes that base path.',
});

export const configTitle = message({
  ja: 'Viteの`base`を設定する',
  en: 'Set Vite’s `base`',
});

export const configDescription = message({
  ja: 'サブパスはViteの`base`で指定します。ルーターは`import.meta.env.BASE_URL`からその値を読みます。',
  en: 'The base path is Vite’s `base`, and the router reads it from `import.meta.env.BASE_URL`.',
});

export const configTable = message({
  ja: 'ルート表は書き換えません。`/products`のページは、表の中では`/products`のままで、ブラウザのアドレスバーでは`/docs/products`になります。',
  en: 'The route table does not change. The `/products` page is still `/products` in the table, and `/docs/products` in the browser’s address bar.',
});

export const linksTitle = message({
  ja: 'リンクにはサブパスが付く',
  en: 'Links carry the base path',
});

export const linksDescription = message({
  ja: '`href`と`navigateTo`は、作ったURLの前にサブパスを付けます。',
  en: '`href` and `navigateTo` put the base path in front of the URL they build.',
});

export const linksString = message({
  ja: '`href`の戻り値の型が、表のパスではなく`string`になっているのはこのためです。返すのは、サブパスの付いたURLです。',
  en: 'This is why `href` returns a `string` rather than a path in the table: what it returns is a URL, base path included.',
});

export const readTitle = message({
  ja: '読み取るパスからはサブパスが外れる',
  en: 'Paths you read leave the base path out',
});

export const readDescription = message({
  ja: '`usePathname`は、サブパスを外したパスを返します。`/docs/products`を開いているとき、値は`/products`です。',
  en: '`usePathname` returns the path without the base path: at `/docs/products`, it is `/products`.',
});

export const readCompare = message({
  ja: 'そのため、返ってきたパスはルート表のパターンとそのまま比べられます。`useMatch`もサブパスを外したパスで判定し、`<Router>`もサブパスより下のパスで表を照合します。',
  en: 'What comes back therefore compares directly with the route table’s patterns. `useMatch` checks the path without the base path too, and `<Router>` matches the table against the path below it.',
});

export const readOutside = message({
  ja: 'サブパスの外のURLはアプリのものではないので、ルート表に何が書いてあっても、`<Router>`は引き受けずにブラウザに任せます。',
  en: 'A URL outside the base path is not the app’s, so `<Router>` leaves it to the browser whatever the route table says.',
});

export const helpersTitle = message({
  ja: '自分のコードで付け外しする',
  en: 'Add and remove it in your own code',
});

export const helpersDescription = message({
  ja: '`withBase`と`withoutBase`は、ルーターが行う付け外しを自分のコードで使うための関数です。',
  en: '`withBase` and `withoutBase` are the router’s own two steps, for code of your own.',
});

export const helpersNull = message({
  ja: '`withoutBase`は、サブパスの外のパスに`null`を返します。サブパスそのもの（`/docs`）は、末尾のスラッシュが無くても`/`になります。',
  en: '`withoutBase` returns `null` for a path outside the base path. The base path itself, `/docs`, becomes `/` with or without its trailing slash.',
});

export const helpersExplicit = message({
  ja: 'Viteを通らないコードには`import.meta.env`が無いので、2つ目の引数でサブパスを渡します。',
  en: 'Code that Vite does not process has no `import.meta.env`, so it passes the base path as the second argument.',
});

export const helpersRelative = message({
  ja: '`./`のような相対の`base`はパスを指していないので、どちらの関数も何も付け外ししません。',
  en: 'A relative `base` such as `./` names no path, so neither function adds or removes anything.',
});

export const statePitfall = message({
  ja: '`href`が返したURLを、`@k8ordo/state`の`href`に渡さないでください。`@k8ordo/state`の`href`もサブパスを付けるので、`/docs/docs/products`のように2重になります。渡すのは、`/products`のような表のパスです。',
  en: 'Do not hand what `href` returned to `@k8ordo/state`’s `href`. It adds the base path as well, which doubles it into `/docs/docs/products`. Hand it a path in the table’s terms, such as `/products`.',
});

export const frameworkNote = message({
  ja: '`@k8ordo/framework`の下でも同じです。Server Actionの`redirect()`に渡すURLも、`href`で作るとサブパスが付きます。',
  en: 'The same holds under `@k8ordo/framework`. A URL handed to a Server Action’s `redirect()` gets its base path when `href` builds it, too.',
});
