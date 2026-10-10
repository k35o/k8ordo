import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`https://example.com/docs/`のように、アプリをベースパスの下で配信するときの書き方です。ルート表は`/`から書いたままで、ベースパスの付け外しはルーターが行います。',
  en: 'How to serve the app below a base path, such as `https://example.com/docs/`. The route table stays written from `/`, and the router adds and removes the base path.',
});

export const configTitle = message({
  ja: 'Viteの`base`',
  en: 'Vite’s `base`',
});

export const configRead = message({
  ja: 'ベースパスはViteの`base`で指定します。ルーターは`import.meta.env.BASE_URL`からその値を読みます。',
  en: 'Set the base path with Vite’s `base`. The router reads it from `import.meta.env.BASE_URL`.',
});

export const configTable = message({
  ja: 'ルート表は変えません。`/products`のページは、表では`/products`のままで、アドレスバーでは`/docs/products`になります。',
  en: 'The route table does not change. The `/products` page stays `/products` in the table and is `/docs/products` in the address bar.',
});

export const linksTitle = message({
  ja: 'リンク先のURL',
  en: 'Link URLs',
});

export const linksPrefix = message({
  ja: '`href`と`navigateTo`は、作るURLの先頭にベースパスを付けます。そのため、`href`の戻り値の型はルート表のパスでなく`string`です。',
  en: '`href` and `navigateTo` put the base path in front of the URL they build. So `href` returns a `string`, not a path in the route table.',
});

export const frameworkBefore = message({
  ja: '`@k8ordo/framework`でベースパスが付くURLは、',
  en: 'Which URLs get the base path under `@k8ordo/framework` is covered in ',
});

export const frameworkAfter = message({
  ja: 'で説明しています。',
  en: '.',
});

export const statePitfall = message({
  ja: '`href`が返したURLを`@k8ordo/state`の`href`に渡すと、ベースパスが2重に付きます。詳しくは`@k8ordo/state`の',
  en: 'Passing the URL `href` returned to `@k8ordo/state`’s `href` adds the base path twice. See ',
});

export const statePitfallAfter = message({
  ja: 'を見てください。',
  en: ' in the `@k8ordo/state` guide.',
});

export const readTitle = message({
  ja: '読み取るパス',
  en: 'Paths you read',
});

export const readPathname = message({
  ja: '`usePathname`は、ベースパスを外したパスを返します。`/docs/products`を開いているとき、値は`/products`です。返ってきたパスは、ルート表のパターンとそのまま比べられます。',
  en: '`usePathname` returns the path without the base path: `/products` at `/docs/products`. What comes back compares directly with the route table’s patterns.',
});

export const readMatch = message({
  ja: '`useMatch`と`<Router>`も、ベースパスを外したパスでルート表と照合します。',
  en: '`useMatch` and `<Router>` also match the route table against the path without the base path.',
});

export const readOutside = message({
  ja: 'ベースパスの外のURLは、ルート表に何が書いてあっても`<Router>`は照合しません。ブラウザの通常の遷移になります。',
  en: '`<Router>` does not match a URL outside the base path, whatever the route table says. The browser navigates to it as usual.',
});

export const helpersTitle = message({
  ja: '`withBase`と`withoutBase`',
  en: '`withBase` and `withoutBase`',
});

export const helpersExplicitCallout = message({
  ja: 'Viteを通らないコードでは、2つ目の引数でベースパスを渡す',
  en: 'Code Vite does not process passes the base path as the second argument',
});

export const helpersSteps = message({
  ja: '`withBase`と`withoutBase`は、ルーターが行う付け外しを自分のコードで使うための関数です。`withoutBase`は、ベースパスの外のパスに`null`を返します。ベースパスそのもの（`/docs`）は、末尾のスラッシュが無くても`/`になります。',
  en: '`withBase` and `withoutBase` let your own code add and remove the base path the way the router does. `withoutBase` returns `null` for a path outside the base path. The base path itself, `/docs`, becomes `/` with or without its trailing slash.',
});

export const helpersExplicit = message({
  ja: 'Viteを通らないコードには`import.meta.env`が無いので、ルーターはベースパスを読めません。',
  en: 'Code that Vite does not process has no `import.meta.env` to read the base path from.',
});

export const helpersRelative = message({
  ja: '`./`のような相対の`base`はパスを指していないので、どちらの関数も何も付け外ししません。',
  en: 'A relative `base` such as `./` names no path, so neither function adds or removes anything.',
});
