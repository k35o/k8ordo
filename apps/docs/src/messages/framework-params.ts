import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`[id]`のようなディレクトリの下のページは、URLの一部をパラメータとして受け取ります。スキーマで型を付け、staticモードでは`paths.ts`で書き出す値を、serverモードでは`search`でクエリを宣言します。',
  en: 'A page under a directory such as `[id]` receives part of its URL as a parameter. A schema types the value. Under static mode a `paths.ts` returns the values to write, and under server mode `search` declares the query.',
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

export const refusedLocaleTitle = message({
  ja: '404のロケール',
  en: 'The 404’s locale',
});

export const refusedLocaleScope = message({
  ja: '`@k8ordo/i18n`の`paramsSchema`が受け付けたロケールは、そのパターンが答えたときだけ描画に使われます。後に走るスキーマが拒むと、前のスキーマが受け付けたロケールも捨てられます。',
  en: 'A locale `@k8ordo/i18n`’s `paramsSchema` accepted is used for the render only when its pattern answers. When a schema after it refuses, the locale the earlier one accepted is dropped too.',
});

export const refusedLocaleServer = message({
  ja: 'serverモードと`vite dev`では、`/en/products/shoes`の`shoes`を`id`のスキーマが拒むと、`not-found.tsx`が404を描画します。このとき`not-found.tsx`より上のスキーマが走り直すので、404はURLの`en`で描画されます。`fr`がロケールの一覧に無いので、`/fr/nothing`では`[locale]`のスキーマが拒み、404は既定のロケールで描画されます。',
  en: 'Under server mode and `vite dev`, when the `id` schema refuses the `shoes` of `/en/products/shoes`, `not-found.tsx` renders the 404. The schemas above `not-found.tsx` run again for it, so the 404 renders in the `en` its URL names. On `/fr/nothing`, where `fr` is not in the locale set, the `[locale]` schema refuses, and the 404 renders in the default locale.',
});

export const refusedLocaleStatic = message({
  ja: 'staticモードでは、どのURLの404も既定のロケールで書かれた`404.html`です。ブラウザでの描画のされ方は',
  en: 'Under static mode every 404 is `404.html`, written in the default locale. How it renders in the browser is covered in ',
});

export const existTitle = message({
  ja: 'データに無い値',
  en: 'Values not in your data',
});

export const existSchema = message({
  ja: 'スキーマが確かめるのは値の形だけです。serverモードでは、データに無い`/products/999`をページが`notFound()`で404にします。staticモードでは、`paths.ts`が返さなかった値のページは書き出されず、`404.html`が返ります。横に`fallback.tsx`を置けば、ブラウザで描くページがその値に答えます（「ビルドしていない値」の節）。`paths.ts`が返した値のページが`notFound()`を呼ぶと、ビルドできません（「`paths.ts`のエラー」の節）。`notFound()`の動きは',
  en: 'A schema checks only the shape of the value. Under server mode, for `/products/999`, which your data does not have, the page gives a 404 with `notFound()`. Under static mode a value no `paths.ts` returned is never written, and `404.html` answers it, unless a `fallback.tsx` beside the page answers it with a page rendered in the browser (see “Values the build did not write”). A page that calls `notFound()` for a value a `paths.ts` returned stops the build (see “`paths.ts` errors”). What `notFound()` does is covered in ',
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
  ja: '`paths.ts`が返す値',
  en: 'Values from `paths.ts`',
});

export const pathsRole = message({
  ja: 'staticモードだけで使えます。ビルドはパラメータの値を自分では決められないので、パラメータのディレクトリに`paths.ts`を置きます。default exportの関数が、そのパラメータの値を配列かそのPromiseで返します。パラメータの無いルートはルート表から分かるので、何も書く必要はありません。',
  en: 'Static mode only. A build cannot invent parameter values, so the parameter’s directory holds a `paths.ts`. Its default export is a function that returns the values of that parameter, as an array or a promise of one. Routes without parameters come from the route table and need nothing.',
});

export const pathsFunction = message({
  ja: '型は`@k8ordo/framework`の`Paths`で付けます。型引数は、そのディレクトリまでのパターンです。`paths.ts`はページと同じ環境で実行されるので、`server-only`のモジュールもアプリのエイリアスもimportできます。ページと同じモジュールを読むため、キャッシュしたデータも共有します。',
  en: 'Type it with `Paths` from `@k8ordo/framework`; its type argument is the pattern down to that directory. A `paths.ts` runs in the same environment as the pages, so it can import a `server-only` module and use the application’s aliases. It reads the same module instances as the pages, so data one of them cached is shared.',
});

export const pathsForm = message({
  ja: '値は、エスケープする前の文字列で返します。`café`や`a b`もそのまま返せば、URLにするときにビルドがエスケープします。空文字列と文字列でない値は返せないので、数値のidは`String()`で文字列にします。',
  en: 'Return each value as the unescaped string: `café` or `a b` as it is, and the build escapes it for the URL. An empty string or a value that is not a string is refused, so turn a numeric id into a string with `String()`.',
});

export const pathsBelow = message({
  ja: '`paths.ts`の値は、そのディレクトリより下のすべてに使われます。横の`page.tsx`のほか、下のディレクトリのページと`route.ts`、`redirect.ts`も値ごとに書き出されます。`blog/[slug]/paths.ts`があれば、`blog/[slug]/og.png/route.ts`の値を別に並べる必要はありません。',
  en: 'The values apply to everything below the directory. The `page.tsx` beside it, and every page, `route.ts` and `redirect.ts` in the directories below, are written once per value. With `blog/[slug]/paths.ts`, `blog/[slug]/og.png/route.ts` needs no list of its own.',
});

export const pathsServer = message({
  ja: 'serverモードは`paths.ts`を読みません。値はリクエストから受け取るので、データが増えても再ビルドは要りません。同じ`routes/`をどちらのモードでも使えます。',
  en: 'Server mode does not read a `paths.ts`. Values come from the request, so growing data needs no rebuild, and the same `routes/` works under either mode.',
});

export const expandTitle = message({
  ja: 'ロケールの値',
  en: 'Locale values',
});

export const expandLocales = message({
  ja: 'ロケールのディレクトリでは、`@k8ordo/i18n`の`locales.all`を返します。`[locale]`より下のページは、どれもロケールの数だけ書き出されます。`locales`の定義は',
  en: 'In the locale directory, return `locales.all` from `@k8ordo/i18n`. Every page below `[locale]` is then written once per locale. How `locales` is defined is described on ',
});

export const expandSite = message({
  ja: 'このサイトの`src/routes/[locale]/paths.ts`も同じ内容です。書き出すURLは1つずつ別のリクエストとして描画されるので、文言はそのURLのロケールになります。',
  en: 'This site’s `src/routes/[locale]/paths.ts` is the same file. Each URL is rendered as a request of its own, so its messages use that URL’s locale.',
});

export const aboveTitle = message({
  ja: '上のパラメータ',
  en: 'Parameters above',
});

export const aboveParams = message({
  ja: '`paths.ts`の関数は、上のディレクトリのパラメータを引数として受け取ります。ビルドは、上の値の組み合わせごとに関数を1回呼びます。この例では、`ja`と`en`のそれぞれについて記事のidを返します。',
  en: 'The function receives the parameters of the directories above it, and the build calls it once per combination of their values. Here it returns the post ids for `ja`, and again for `en`.',
});

export const aboveMissing = message({
  ja: '上のパラメータのディレクトリに`paths.ts`が無いと、ビルドは下の`paths.ts`を呼べず、エラーになります。上のディレクトリにも`paths.ts`を置きます。',
  en: 'When the directory of a parameter above has no `paths.ts`, the build cannot call the one below and stops. Give that directory a `paths.ts` too.',
});

export const stopsTitle = message({
  ja: '`paths.ts`のエラー',
  en: '`paths.ts` errors',
});

export const stopsIntro = message({
  ja: '`paths.ts`が次のどれかに当たると、ビルドできません。エラー文には、原因のファイルかパターン、URLが入ります。',
  en: 'The build stops when a `paths.ts` hits any of these. Each error message names the file, pattern or URL at fault.',
});

export const stopsList = [
  message({
    ja: "値を返す`paths.ts`が無いパラメータ：`static build needs the values of /tags/:tag — a paths.ts in each parameter's directory returns them, …`",
    en: "A parameter no `paths.ts` returns values for: `static build needs the values of /tags/:tag — a paths.ts in each parameter's directory returns them, …`",
  }),
  message({
    ja: '空でない文字列の配列でない戻り値：`tags/[tag]/paths.ts has to return an array of non-empty strings, the values of :tag`',
    en: 'A return value that is not an array of non-empty strings: `tags/[tag]/paths.ts has to return an array of non-empty strings, the values of :tag`',
  }),
  message({
    ja: '`paths.ts`の無いパラメータの下にある`paths.ts`：`[locale]/posts/[id]/paths.ts is asked for its values once per value of the parameters above it, and /:locale/posts still holds one — …`',
    en: 'A `paths.ts` below a parameter that has none: `[locale]/posts/[id]/paths.ts is asked for its values once per value of the parameters above it, and /:locale/posts still holds one — …`',
  }),
  message({
    ja: 'スキーマに合わない値：`a paths.ts returned values a params schema refused: /products/shoes`',
    en: 'A value the schema rejects: `a paths.ts returned values a params schema refused: /products/shoes`',
  }),
  message({
    ja: 'ページが`notFound()`を呼ぶ値：`a paths.ts returned values whose page called notFound(): /products/3`',
    en: 'A value whose page calls `notFound()`: `a paths.ts returned values whose page called notFound(): /products/3`',
  }),
  message({
    ja: '`!fallback`という値：`a paths.ts returned !fallback, which the build keeps for shells: /posts/!fallback`',
    en: 'A value of `!fallback`: `a paths.ts returned !fallback, which the build keeps for shells: /posts/!fallback`',
  }),
  message({
    ja: '`..`という値：`a pathname to write leaves the output: /products/..`',
    en: 'A value of `..`: `a pathname to write leaves the output: /products/..`',
  }),
  message({
    ja: '`[param]`でないディレクトリに置いた`paths.ts`：`paths.ts gives the values of its directory\'s parameter, and "posts" is not a [param] directory — …`',
    en: 'A `paths.ts` in a directory that is not a `[param]` one: `paths.ts gives the values of its directory\'s parameter, and "posts" is not a [param] directory — …`',
  }),
  message({
    ja: "`framework()`に渡した`paths`：`framework() takes no paths — a parameter's values come from a paths.ts in its directory under routes/`",
    en: "A `paths` passed to `framework()`: `framework() takes no paths — a parameter's values come from a paths.ts in its directory under routes/`",
  }),
] as const;

export const fallbackTitle = message({
  ja: 'ビルドしていない値',
  en: 'Values the build did not write',
});

export const fallbackStatic = message({
  ja: 'staticモードだけで使えます。`page.tsx`の横に`fallback.tsx`を置くと、どの`paths.ts`も返さなかった値のURLにはこれが答えます。ビルドの後に増えた記事のように、ビルドの時点で並べられない値に使います。serverモードでは描かれず、`page.tsx`がどの値もリクエストごとに描きます。置き場所の検査は、どちらのモードでも行います。',
  en: 'Static mode only. Put a `fallback.tsx` beside a `page.tsx`, and it answers every URL whose value no `paths.ts` returned. It is for values the build cannot know, such as posts published after it ran. Server mode never renders it: there `page.tsx` renders every value per request. Its placement is checked in both modes.',
});

export const fallbackShell = message({
  ja: 'ビルドは、レイアウトの中に`fallback.tsx`を描いたページを書きます。これをシェルと呼びます。ホスティングはファイルの無い`/posts/3`にシェルを返し、ブラウザがURLの値を読んで本文を描きます。そのための書き換えのルールは、ビルドが`_redirects`に書きます。ホスティングの設定は',
  en: 'The build writes a page holding the layouts with `fallback.tsx` inside them: the shell. The host answers `/posts/3`, which has no file, with the shell, and the browser reads the value from the URL and renders the post. The build writes the rewrite rules for this into `_redirects`; setting up the host is covered in ',
});

export const fallbackShared = message({
  ja: '`postId`と`PostArticle`は、ページと同じものを使います。`readPost`はブラウザからAPIを読みます。`use()`に渡すPromiseは描画のたびに作らず、値ごとに1つを使い回します。',
  en: '`postId` and `PostArticle` are the ones the page uses. `readPost` reads the API from the browser, and the promise it hands `use()` is made once per value and reused, never once per render.',
});

export const fallbackLeavingCallout = message({
  ja: '次のページより先にURLが変わったとき',
  en: 'The URL moved before the next page arrived',
});

export const fallbackReceivesTitle = message({
  ja: '受け取るもの',
  en: 'What it receives',
});

export const fallbackProps = message({
  ja: "`fallback.tsx`はpropsを受け取りません。シェルは値を持たないためです。Server Componentにも`'use client'`のコンポーネントにもできます。Server Componentはビルドのときに動くので、どの値にも同じものを描きます。",
  en: "A `fallback.tsx` receives no props: a shell has no value to give it. It may be a Server Component or a `'use client'` one. A Server Component runs at build time, so it renders the same thing for every value.",
});

export const fallbackBrowser = message({
  ja: '値を読むのはClient Componentです。シェルの中では、`useMatch`と`usePathname`を読む部分をサーバーで描かず、ブラウザに任せます。そのためHTMLには、`fallback.tsx`の`<Suspense>`のfallbackが入ります。`useMatch`が`null`を返すのは、次のページを受け取る前にURLだけが変わったときです。そのときは何も描きません。',
  en: 'A Client Component reads the value. Inside a shell, whatever reads `useMatch` or `usePathname` is left to the browser by the server render, so the HTML holds the fallback of the `<Suspense>` in `fallback.tsx`. `useMatch` returns `null` when the URL has moved before the next page arrived; render nothing then.',
});

export const fallbackSchemas = message({
  ja: 'ページの`paramsSchema`は、シェルでは動きません。値は、ブラウザで同じスキーマを通して確かめます。一方でレイアウトの`paramsSchema`は、シェルが埋めたパラメータに対して動きます。そのためロケールのスキーマは、ページでなくレイアウトに置きます。',
  en: 'A page’s `paramsSchema` does not run for a shell, so check the value in the browser with the same schema. A layout’s `paramsSchema` does run, over the parameters the shell fills, which is why a locale schema belongs on a layout rather than a page.',
});

export const shellPathsTitle = message({
  ja: 'シェルの場所',
  en: 'Where shells go',
});

export const shellPathsLayout = message({
  ja: 'ビルドは、上の`paths.ts`が返す値ごとにシェルを書きます。この例では`[locale]/paths.ts`が`ja`と`en`を返すので、シェルは`/ja/posts/:id`と`/en/posts/:id`の2つです。`/fr/posts/1`にはどのシェルも答えません。',
  en: 'The build writes one shell per value the `paths.ts` files above return. Here `[locale]/paths.ts` returns `ja` and `en`, so there are two shells, at `/ja/posts/:id` and `/en/posts/:id`. No shell answers `/fr/posts/1`.',
});

export const shellPathsBoth = message({
  ja: '`fallback.tsx`と同じディレクトリに`paths.ts`も置けます。返した値はページとして書き出され、それ以外の値にシェルが答えます。`paths.ts`を置かなければ、どの値にもシェルが答えます。',
  en: 'A `paths.ts` may sit in the same directory as the `fallback.tsx`. The values it returns are written as pages, and the shell answers the rest. Without it, the shell answers every value.',
});

export const shellPathsBare = message({
  ja: '上にパラメータが無ければ、シェルは1つです。ビルドがパターンから作り、`/posts/!fallback/`に書きます。',
  en: 'With no parameter above, there is one shell. The build makes it from the pattern and writes it at `/posts/!fallback/`.',
});

export const shellPathsRequired = message({
  ja: '`[locale]/layout.tsx`のようにパラメータを受け取るレイアウトが上にあると、シェルでもその値が要ります。レイアウトをHTMLとして書くためです。そのパラメータのディレクトリに`paths.ts`が無いと、ビルドできません。',
  en: 'When a layout above, such as `[locale]/layout.tsx`, receives a parameter, the shell needs that value too, since the layout is written as HTML. Without a `paths.ts` in that parameter’s directory, the build stops.',
});

export const shellPathsBelow = message({
  ja: '`fallback.tsx`が答えるのは、横の`page.tsx`のURLだけです。`/posts/:id/comments`のように下にあるルートは、`posts/[id]/paths.ts`が返した値の分だけ書き出されます。下のページにも`fallback.tsx`を置けば、そのページのシェルが書かれます。',
  en: 'A `fallback.tsx` answers only for the `page.tsx` beside it. A route below it, such as `/posts/:id/comments`, is written for the values `posts/[id]/paths.ts` returns and no others, unless it is a page with a `fallback.tsx` of its own.',
});

export const shellPathsDev = message({
  ja: '`vite dev`も、ビルドしたサイトと同じように答えます。どの`paths.ts`も返さなかった値には、`fallback.tsx`があればシェルで、無ければ404で答えます。知らない値のリクエストを受け取ると`paths.ts`を呼び直すので、データに増えた値は再起動しなくても描画されます。',
  en: '`vite dev` answers as the built site will. A value no `paths.ts` returned gets the shell where there is a `fallback.tsx`, and a 404 otherwise. A request for a value it does not know makes it call the `paths.ts` files again, so a value added to the data renders without a restart.',
});

export const shellNotFoundTitle = message({
  ja: 'シェルでの`notFound()`',
  en: '`notFound()` in a shell',
});

export const shellNotFoundInPlace = message({
  ja: 'シェルの中のClient Componentが描画中に`notFound()`を呼ぶと、いちばん近い`not-found.tsx`がページの代わりに描かれます。URLはそのままです。その`not-found.tsx`はビルドがシェルと一緒に描いているので、新たなリクエストはしません。どの値にも同じものを出すので、シェルがブラウザに任せるパラメータを受け取る`not-found.tsx`は使いません。`fallback.tsx`の横のものなどは飛ばして、その上でいちばん近いものを使います。受け取る`pathname`もシェルのもの（`/ja/posts/!fallback`）なので、訪問者のURLを出すときはClient Componentで読みます。',
  en: 'When a Client Component in the shell calls `notFound()` while it renders, the nearest `not-found.tsx` renders in the page’s place, and the URL stays. The build rendered that `not-found.tsx` along with the shell, so nothing more is requested. Since it is the same for every value, a `not-found.tsx` that would receive a parameter the shell leaves to the browser, such as one beside the `fallback.tsx`, is passed over for the nearest one above it. It also receives the shell’s `pathname` (`/ja/posts/!fallback`), so read the visitor’s URL in a Client Component when it shows it.',
});

export const shellNotFoundStatus = message({
  ja: 'ただし、ホスティングはシェルを`200`で返しています。データに無い値でも、ステータスは`200`のままです。また`notFound()`が効くのは、描画の中で呼んだときだけです。effectやイベントハンドラーから呼んでも、どの境界も受け止めません。',
  en: 'The host has already answered with the shell under a `200`, though, so a value your data does not have still gets a `200`. And `notFound()` works only during render: called from an effect or an event handler, no boundary sees it.',
});

export const shellErrorsTitle = message({
  ja: 'シェルのエラー',
  en: 'Shell errors',
});

export const shellErrorsIntro = message({
  ja: 'シェルの場所か描画に誤りがあると、ビルドできません。',
  en: 'The build stops when a shell’s location or its render goes wrong:',
});

export const shellErrorsList = [
  message({
    ja: '上のレイアウトが受け取るパラメータに`paths.ts`が無いシェル：`these shells leave out a parameter a layout above their fallback.tsx receives, so its directory needs a paths.ts: /:locale/posts/:id (…)`',
    en: 'A shell under a parameter that a layout above receives and no `paths.ts` gives values for: `these shells leave out a parameter a layout above their fallback.tsx receives, so its directory needs a paths.ts: /:locale/posts/:id (…)`',
  }),
  message({
    ja: 'レイアウトのスキーマが拒んだ値の下のシェル：`the shells stand where a params schema refuses the values above them: /xx/posts/:id`',
    en: 'A shell below a value a layout’s schema rejects: `the shells stand where a params schema refuses the values above them: /xx/posts/:id`',
  }),
  message({
    ja: '先に宣言したルートのURLにも答えるシェル：`the shell for /ja/posts/:id ([locale]/posts/[id]/fallback.tsx) would also answer …`',
    en: 'A shell that would also answer URLs a route declared earlier is for: `the shell for /ja/posts/:id ([locale]/posts/[id]/fallback.tsx) would also answer …`',
  }),
  message({
    ja: 'ビルドの描画で`notFound()`を呼んだシェル：`the shell for /ja/posts/:id called notFound() while it rendered, …`',
    en: 'A shell that calls `notFound()` while the build renders it: `the shell for /ja/posts/:id called notFound() while it rendered, …`',
  }),
  message({
    ja: '別のルートが答えたシェル：`the shell for /ja/posts/:id (…) was answered by …`',
    en: 'A shell another route answered: `the shell for /ja/posts/:id (…) was answered by …`',
  }),
] as const;

export const shellErrorsFix = message({
  ja: 'それぞれの直し方は',
  en: 'How to fix each is covered in ',
});

export const shellCostsTitle = message({
  ja: 'シェルの制約',
  en: 'What a shell gives up',
});

export const shellCostsIntro = message({
  ja: 'シェルが答える値には、書き出したページと比べて次の制約があります。',
  en: 'Compared with a page the build wrote, a value the shell answers gives up the following.',
});

export const shellCostsList = [
  message({
    ja: '本文はブラウザで描きます。値ごとの本文を、Server Componentでは描けません。',
    en: 'The body is rendered in the browser. No Server Component renders it per value.',
  }),
  message({
    ja: '最初のHTMLには本文がありません。値ごとの`<title>`やOGPも無いので、JavaScriptを動かさないクローラーには読めません。',
    en: 'The first HTML has no body, and no per-value `<title>` or OGP either, so a crawler that runs no JavaScript sees none of it.',
  }),
  message({
    ja: 'データに無い値にも、ホスティングは`200`で答えます。`not-found.tsx`で`<meta name="robots" content="noindex">`を描くと、検索結果に載りません。',
    en: 'A value your data does not have is still answered with a `200`. Render `<meta name="robots" content="noindex">` in `not-found.tsx` to keep it out of search results.',
  }),
  message({
    ja: 'データは、ブラウザから読めるAPIに置きます。`csp`を書いているなら、`connect-src`にAPIのoriginを足します。',
    en: 'The data has to be on an API the browser can reach. If you set `csp`, add the API’s origin to `connect-src`.',
  }),
  message({
    ja: 'レイアウトは、`pathname`としてシェルのURL（`/posts/!fallback`）を受け取ります。canonicalや`hreflang`のようにURLから作るものは、Client Componentで描きます。HTMLに`!fallback`が残ると、ビルドが警告します。',
    en: 'Layouts receive the shell’s URL, `/posts/!fallback`, as `pathname`. Render anything made from the URL, such as a canonical link or `hreflang`, in a Client Component. The build warns when `!fallback` is left in the HTML.',
  }),
  message({
    ja: '書き換えのルールを読めないホスティングでは使えません。GitHub Pagesでは、ビルドしていない値に`404.html`が返ります。',
    en: 'It needs a host that rewrites. On GitHub Pages, a value the build did not write gets `404.html`.',
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
  ja: '受け取った値は、`initialUrl`として`useAppState`に渡します。サーバーでの描画もハイドレーションも、URLの値を使います。クエリが変わる遷移では、そのページがその場で読み込み直されます。再マウントもスクロールの移動も起きません。戻ると進むでは、読み込み直したページが出てから、そのエントリを離れたときの位置に戻ります。',
  en: 'Pass the values on to `useAppState` as `initialUrl`. The server render and the hydration both use the values from the URL. A navigation that changes the query loads that page again in place; nothing remounts, and the scroll position stays. On back and forward, the scroll position returns to where that entry was left once the page loaded again is on screen.',
});
