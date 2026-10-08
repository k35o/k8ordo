import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`[id]`のようなディレクトリの下のページは、URLの一部をパラメータとして受け取ります。スキーマで型を付け、staticモードでは`paths`でURLの一覧を、serverモードでは`search`でクエリを宣言します。',
  en: 'A page under a directory such as `[id]` receives part of its URL as a parameter. A schema types the value. Under static mode `paths` lists the URLs, and under server mode `search` declares the query.',
});

export const stringsTitle = message({
  ja: '文字列のパラメータ',
  en: 'Parameters as strings',
});

export const stringsValue = message({
  ja: '`[id]`のディレクトリの下のページは、URLのその区間を`params.id`として受け取ります。URLは文字列しか表せないので、何も宣言しなければ値は文字列です。',
  en: 'A page under an `[id]` directory receives that URL segment as `params.id`. A URL holds only strings, so without a declaration the value is a string.',
});

export const schemaTitle = message({
  ja: 'スキーマによる型付け',
  en: 'Typing with a schema',
});

export const schemaNameCallout = message({
  ja: 'ページのpropがparamsなので、exportの名前はparamsSchema',
  en: 'The page’s prop is params, so the export is paramsSchema',
});

export const schemaExport = message({
  ja: "`page.tsx`から`paramsSchema`をexportすると、ページを描画する前にスキーマが値を検証します。ページは変換後の値を受け取り、`PageProps<'/products/:id'>`の`params.id`は`number`になります。型は生成されたルート表から引くので、`params`の型を手で書く必要はありません。",
  en: "Export `paramsSchema` from `page.tsx`, and the schema validates the value before the page renders. The page receives the converted value, and `params.id` in `PageProps<'/products/:id'>` becomes a `number`. The type comes from the generated route table, so you never write the type of `params` by hand.",
});

export const schemaLibrary = message({
  ja: 'スキーマには、Standard Schemaを実装したものを使えます。zodやzod/miniのほか、`@k8ordo/i18n`の`locales.paramsSchema`も使えます。exportはファイルの構文解析で見つけるので、`export const { paramsSchema } = locales`のような分割代入でも構いません。',
  en: 'Anything that implements Standard Schema works: zod, zod/mini, or `locales.paramsSchema` from `@k8ordo/i18n`. The export is found by parsing the file, so a destructured `export const { paramsSchema } = locales` works too.',
});

export const schemaSync = message({
  ja: 'スキーマは同期的に検証するものにします。非同期のスキーマは`a params schema must validate synchronously`というエラーになります。',
  en: 'The schema has to validate synchronously. An asynchronous one fails with `a params schema must validate synchronously`.',
});

export const schemaServerFile = message({
  ja: "`paramsSchema`は`'use client'`の無いファイルからexportします。`'use client'`のモジュールからexportした値は、サーバー側にはクライアントの参照として渡り、スキーマとして読めません。",
  en: "Export `paramsSchema` from a file without `'use client'`. A value exported from a `'use client'` module reaches the server as a client reference, which cannot be read as a schema.",
});

export const stackTitle = message({
  ja: 'レイアウトのスキーマ',
  en: 'Layout schemas',
});

export const stackRuns = message({
  ja: '`layout.tsx`も`paramsSchema`をexportできます。ページを描画する前に、上のレイアウトから順にスキーマが走り、最後にページ自身のスキーマが走ります。',
  en: 'A `layout.tsx` can export `paramsSchema` too. Before the page renders, the schemas run from the outermost layout down, and the page’s own runs last.',
});

export const stackEach = message({
  ja: 'それぞれのスキーマは、自分のキーにあるパラメータだけを置き換えます。どのスキーマのキーにも無いパラメータは、文字列のまま残ります。',
  en: 'Each schema replaces only the parameters among its keys. A parameter in no schema stays a string.',
});

export const stackExample = message({
  ja: 'この例では、`[locale]`のレイアウトがロケールを、ページが`id`を検証します。ページは両方の結果を`params`で受け取ります。',
  en: 'Here the `[locale]` layout validates the locale and the page validates `id`. The page receives both results in `params`.',
});

export const refusedTitle = message({
  ja: 'スキーマに合わない値',
  en: 'Values the schema rejects',
});

export const refusedRoute = message({
  ja: 'スキーマに合わない値は、URLがそのルートに一致しなかったものとして扱われます。`/products/shoes`が`NaN`を持つページになることはありません。ルート表の次の候補が試され、最後は`not-found.tsx`を404で返します。',
  en: 'When the schema rejects a value, the route is treated as if it had not matched the URL. `/products/shoes` never becomes a page holding `NaN`. The next candidate in the route table is tried, and in the end `not-found.tsx` is rendered with a 404.',
});

export const refusedMode = message({
  ja: 'staticモードでは、その404は`404.html`という1つのファイルです。serverモードでは、404のステータスで`not-found.tsx`を返します。文書を読み込むときも、クライアント側の遷移でペイロードを要求するときも同じです。',
  en: 'Under static mode that 404 is a single file, `404.html`. Under server mode the response is a 404 status with `not-found.tsx` as its body, both for a document load and for a client navigation’s payload request.',
});

export const refusedCatchAll = message({
  ja: '`not-found.tsx`自身はどんな値も拒みません。`/:locale/*`の`not-found.tsx`が受け取る`params.locale`は、`fr`のように、どのロケールとも一致しない文字列のこともあります。使う前に確かめてください。',
  en: 'A `not-found.tsx` rejects nothing. The `params.locale` that the one at `/:locale/*` receives can be a string such as `fr` that names no locale. Check it before using it.',
});

export const existTitle = message({
  ja: 'データに無い値',
  en: 'Values not in your data',
});

export const existSchema = message({
  ja: 'スキーマが確かめるのは値の形だけです。serverモードでは、データに無い`/products/999`をページが`notFound()`で404にします。staticモードでは、`paths`に無い値のページは書き出されず、`404.html`が返ります。`paths`に入れた値のページが`notFound()`を呼ぶと、ビルドが止まります（「`paths`のエラー」の節）。`notFound()`の動きは',
  en: 'A schema checks only the shape of the value. Under server mode, for `/products/999`, which your data does not have, the page gives a 404 with `notFound()`. Under static mode a value missing from `paths` is never written, and `404.html` answers it. A page that calls `notFound()` for a value in `paths` stops the build (see “`paths` errors”). What `notFound()` does is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const linksTitle = message({
  ja: 'リンクの型',
  en: 'Link types',
});

export const linksTyped = message({
  ja: "生成されたルート表は、パターンごとにスキーマの出力の型を持ちます。`href()`もページと同じ型の値を受け取るので、`href('/products/:id', { id: 42 })`には数値を渡します。文字列を渡すと型エラーです。",
  en: "The generated route table carries each pattern’s schema output type. `href()` takes the same type the page receives, so `href('/products/:id', { id: 42 })` takes a number. A string there is a type error.",
});

export const linksSpelling = message({
  ja: '`href()`は値を文字列にしてURLに書きます。その文字列は、スキーマで元の値に戻せる形です。',
  en: '`href()` writes the value into the URL as a string the schema converts back to the same value.',
});

export const layoutTitle = message({
  ja: 'レイアウトの`params`',
  en: 'Layout `params`',
});

export const layoutTyped = message({
  ja: 'レイアウトが受け取る`params`は、スキーマを宣言していても文字列として型が付きます。',
  en: 'A layout’s `params` are typed as strings even when it declares a schema.',
});

export const layoutValue = message({
  ja: '実行時の値も型のとおり文字列です。レイアウトは、ページを包むときも`not-found.tsx`を包むときも、URLの文字列をそのまま受け取ります。スキーマが変換した値を受け取るのはページだけです。変換した値が要るときは、ページで受け取るか、レイアウトの中でスキーマを通してください。',
  en: 'At run time the value is a string too, as the type says. A layout receives the URL’s strings whether it wraps a page or `not-found.tsx`; only the page receives what the schema produced. When you need the converted value, take it in the page, or run the schema inside the layout.',
});

export const pathsTitle = message({
  ja: '`paths`で渡すURL',
  en: 'URLs for `paths`',
});

export const pathsRole = message({
  ja: 'staticモードだけで使えます。ビルドはパラメータの値を自分では決められないので、パラメータを持つルートのURLは`framework()`の`paths`で渡します。serverモードでは値をリクエストから受け取ります。データが増えても再ビルドは要りません。',
  en: 'Static mode only. A build cannot invent parameter values, so the URLs of routes with parameters are passed through the `paths` option of `framework()`. Under server mode the value comes from the request, and growing data needs no rebuild.',
});

export const pathsFunction = message({
  ja: '`paths`は値の要るパターンの一覧を受け取り、URLの配列かそのPromiseを返す関数です。パラメータの無いルートはルート表から分かるので、渡す必要はありません。`paths`が返すURLに誤りがあるとビルドが止まります。エラー文は「`paths`のエラー」の節にまとめています。',
  en: '`paths` is a function that receives the patterns needing values and returns an array of URLs, or a promise of one. Routes without parameters come from the route table and need nothing. A mistake in the URLs it returns stops the build. The messages are listed under “`paths` errors”.',
});

export const pathsForm = message({
  ja: 'URLは`href()`が返すエスケープ済みの形でも受け付けます。Viteの`base`を設定しているときは、`href()`の返す値にも`base`が付いているので、それを除いて渡します。パラメータの下にある`redirect.ts`と`route.ts`も、ファイルとして書き出すので`paths`で値を渡します。',
  en: 'A URL may be escaped the way `href()` returns it. Under a Vite `base`, `href()` puts the base in front, so strip it before passing the URL. A `redirect.ts` or `route.ts` under a parameter is written as a file too, so it takes its values from `paths` as well.',
});

export const expandTitle = message({
  ja: 'ロケールのパス',
  en: 'Locale paths',
});

export const expandLocales = message({
  ja: '`@k8ordo/i18n`の`locales.paths`は、`/:locale`を持つパターンをロケールの数だけ展開する関数です。`locales`の定義は',
  en: '`locales.paths` from `@k8ordo/i18n` expands every pattern with `/:locale` once per locale. How `locales` is defined is described on ',
});

export const expandSite = message({
  ja: 'このサイトの`vite.config.ts`も、`locales.paths`をそのまま渡しています。書き出すURLは1つずつ別のリクエストとして描画されるので、文言はそのURLのロケールになります。',
  en: 'This site’s `vite.config.ts` passes `locales.paths` as it is. Each URL is rendered as a request of its own, so its messages use that URL’s locale.',
});

export const partialTitle = message({
  ja: '一部だけの展開',
  en: 'Partial expansion',
});

export const expandPartial = message({
  ja: 'パラメータを2つ持つパターンで片方だけを展開すると、`/ja/blog/:slug`のようなパスが残ります。これはURLではないので、`/:locale/blog/:slug`に当てはまるURLが無いとしてビルドが止まります。残ったパラメータも、同じ関数の中で展開してから返します。',
  en: 'Expanding only one of two parameters leaves paths such as `/ja/blog/:slug`. That is not a URL, so the build stops, reporting no URLs for `/:locale/blog/:slug`. Expand the remaining parameter in the same function before returning.',
});

export const stopsTitle = message({
  ja: '`paths`のエラー',
  en: '`paths` errors',
});

export const stopsIntro = message({
  ja: '`paths`が次のどれかに当たると、ビルドが止まります。エラー文には、原因のパターンかURLが入ります。',
  en: 'The build stops when `paths` hits any of these. Each error message includes the pattern or URL at fault.',
});

export const stopsList = [
  message({
    ja: '当てはまるURLが無いルート：`static build needs pathnames for /products/:id — supply them with the "paths" option`',
    en: 'A route no URL covers: `static build needs pathnames for /products/:id — supply them with the "paths" option`',
  }),
  message({
    ja: 'どのルートとも一致しないURL：`the "paths" option supplied pathnames no route wants: /produtcs/2`',
    en: 'A URL no route matches: `the "paths" option supplied pathnames no route wants: /produtcs/2`',
  }),
  message({
    ja: 'スキーマに合わないURL：`the "paths" option supplied pathnames a params schema refused: /products/shoes`',
    en: 'A URL the schema rejects: `the "paths" option supplied pathnames a params schema refused: /products/shoes`',
  }),
  message({
    ja: 'ページが`notFound()`を呼ぶURL：`the "paths" option supplied pathnames whose page called notFound(): /products/3`',
    en: 'A URL whose page calls `notFound()`: `the "paths" option supplied pathnames whose page called notFound(): /products/3`',
  }),
  message({
    ja: 'デコードできないエスケープを含むURL：`the "paths" option supplied a pathname with a malformed escape: /products/%zz`',
    en: 'A URL with an escape that does not decode: `the "paths" option supplied a pathname with a malformed escape: /products/%zz`',
  }),
  message({
    ja: 'デコードすると出力の外を指すURL：`the "paths" option supplied a pathname that leaves the output: /products/..%2F..`',
    en: 'A URL that, decoded, points outside the output: `the "paths" option supplied a pathname that leaves the output: /products/..%2F..`',
  }),
] as const;

export const searchTitle = message({
  ja: 'クエリの読み取り',
  en: 'Reading the query',
});

export const searchSchemaCallout = message({
  ja: 'このページが読むクエリのスキーマ',
  en: 'The query schema this page reads',
});

export const searchInitialCallout = message({
  ja: 'ProductListがuseAppStateにinitialUrlとして渡す',
  en: 'ProductList hands it to useAppState as initialUrl',
});

export const searchDeclare = message({
  ja: 'serverモードだけで使えます。ページが読むクエリは、`search`のexportでスキーマとして宣言します。宣言したページは、検証済みの値を`search`として受け取ります。レイアウトと、`search`を宣言していないページはクエリを受け取りません。',
  en: 'Server mode only. A page declares the query it reads by exporting a schema as `search`, and receives the validated values as `search`. A layout, and a page that does not declare `search`, never receives the query.',
});

export const searchState = message({
  ja: '欠けたパラメータには既定値が入り、スキーマに合わない値はそのフィールドだけが既定値に戻ります。`search`としてexportするのは、`@k8ordo/state`の`definePageState`で定義した`url`のスキーマです。アプリの依存に`@k8ordo/state`が要ります。定義の仕方は',
  en: 'A missing parameter takes its default, and a value the schema rejects resets that field alone to its default. The `search` export is the `url` schema of a `definePageState` from `@k8ordo/state`, so the application depends on `@k8ordo/state`. Defining one is described on ',
});

export const searchInitial = message({
  ja: '受け取った値は、`initialUrl`として`useAppState`に渡します。サーバーでの描画もハイドレーションも、URLの値を使います。クエリが変わる遷移では、そのページがその場で読み込み直されます。再マウントもスクロールの移動も起きません。',
  en: 'Pass the values on to `useAppState` as `initialUrl`. The server render and the hydration both use the values from the URL. A navigation that changes the query loads that page again in place; nothing remounts, and the scroll position stays.',
});
