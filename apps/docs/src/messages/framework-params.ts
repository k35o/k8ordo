import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-params.ts / server-params.ts が持つ。

export const stringsTitle = message({
  ja: 'パラメータは文字列で届く',
  en: 'A parameter arrives as a string',
});

export const stringsDescription = message({
  ja: '`[id]`のディレクトリの下のページは、URLの区間を`params.id`として受け取ります。URLが運べるのは文字列だけなので、何も宣言しなければ値はいつも文字列です。',
  en: 'A page under an `[id]` directory receives that URL segment as `params.id`. A URL carries nothing but strings, so without a declaration the value is always one.',
});

export const schemaTitle = message({
  ja: 'スキーマで型を付ける',
  en: 'Type it with a schema',
});

export const schemaDescription = message({
  ja: '受け取る値の形を決めたいときは、`page.tsx`から`paramsSchema`をexportします。ページが描かれる前にスキーマが値を検証し、ページは変換した後の値を受け取ります。',
  en: 'To say what shape the value takes, export `paramsSchema` from the `page.tsx`. The schema validates the value before the page renders, and the page receives what it produced.',
});

export const schemaTyped = message({
  ja: "`PageProps<'/products/:id'>`の`params.id`は、スキーマの出力に合わせて`number`になります。型は生成されたルート表から引くので、ページに型を書き足す必要はありません。",
  en: "`params.id` in `PageProps<'/products/:id'>` follows the schema’s output and is a `number`. The type comes from the generated route table, so there is nothing to add to the page.",
});

export const schemaName = message({
  ja: '名前が`params`ではなく`paramsSchema`なのは、ページ自身が受け取るpropも`params`だからです。同じ名前のモジュール変数を置くと、propの名前を隠してしまいます。',
  en: 'It is `paramsSchema` rather than `params` because the page’s own prop is `params`, and a module-level binding of the same name would shadow it.',
});

export const schemaLibrary = message({
  ja: 'スキーマには、Standard Schemaを実装したものなら何でも使えます。zodやzod/miniのほか、`@k8ordo/i18n`の`locales.paramsSchema`もその1つです。',
  en: 'Anything that implements Standard Schema works: zod, zod/mini, or `@k8ordo/i18n`’s `locales.paramsSchema`.',
});

export const schemaFound = message({
  ja: 'フレームワークはファイルを構文解析して`paramsSchema`のexportを探すので、`export const { paramsSchema } = locales`のような分割代入でも見つかります。',
  en: 'The framework finds the export by parsing the file, so a destructured `export const { paramsSchema } = locales` counts as well.',
});

export const schemaSync = message({
  ja: 'スキーマは同期的に検証するものにします。どのルートがURLに答えるかは描画の前に決めるので、非同期のスキーマは`a params schema must validate synchronously`というエラーになります。',
  en: 'The schema has to validate synchronously. Which route answers a URL is decided before anything renders, so an asynchronous one fails with `a params schema must validate synchronously`.',
});

export const schemaServerFile = message({
  ja: "また、`paramsSchema`は`'use client'`の無いファイルからexportします。`'use client'`のモジュールからexportした値は、サーバー側にはスキーマではなく、クライアントの参照として届くからです。",
  en: "Export `paramsSchema` from a file without `'use client'`, too: a value exported from a `'use client'` module reaches the server side as a client reference, not as a schema.",
});

export const stackTitle = message({
  ja: 'レイアウトのスキーマと組み合わせる',
  en: 'Combine it with a layout’s schema',
});

export const stackDescription = message({
  ja: '`layout.tsx`も`paramsSchema`をexportできます。ページが描かれる前に、上のレイアウトから順にスキーマが走り、最後にページ自身のスキーマが走ります。',
  en: 'A `layout.tsx` may export `paramsSchema` too. Before a page renders, the schemas run from the outermost layout down, and the page’s own runs last.',
});

export const stackEach = message({
  ja: 'それぞれのスキーマは、自分が名指したパラメータだけを置き換えます。どのスキーマも名指さなかったパラメータは、文字列のまま残ります。',
  en: 'Each replaces only the parameters it names, and one no schema names stays a string.',
});

export const stackExample = message({
  ja: 'この例では、`[locale]`のレイアウトがロケールを、ページが`id`を検証します。ページは両方の結果を`params`で受け取ります。',
  en: 'Here the `[locale]` layout validates the locale and the page validates `id`. The page receives both results in `params`.',
});

export const refusedTitle = message({
  ja: 'スキーマが値を拒んだとき',
  en: 'When a schema refuses a value',
});

export const refusedDescription = message({
  ja: 'スキーマが値を拒むと、そのルートは最初からURLに当たらなかったものとして扱われます。`/products/shoes`が`NaN`を持ったページになることはなく、ルート表の次の候補が試され、最後は`not-found.tsx`が404として答えます。',
  en: 'When a schema refuses, the route is treated as if it had never matched. `/products/shoes` never becomes a page holding `NaN`: the table tries what comes next, and in the end `not-found.tsx` answers under a 404.',
});

export const refusedCatchAll = message({
  ja: '`not-found.tsx`自身は、どんな値も拒みません。そのため`/:locale/*`の`not-found.tsx`が受け取る`params.locale`は、`fr`のように、どのロケールにも当たらない文字列のこともあります。使う前に確かめてください。',
  en: 'A `not-found.tsx` refuses nothing, so the `params.locale` one at `/:locale/*` receives can be a string such as `fr` that names no locale. Check it before using it.',
});

export const linksTitle = message({
  ja: 'リンクにもスキーマの型を使う',
  en: 'Links take the schema’s type too',
});

export const linksDescription = message({
  ja: "生成されたルート表は、パターンごとにスキーマの出力の型を持っています。そのため`href()`もページと同じ型の値を受け取り、`href('/products/:id', { id: 42 })`には数値を渡します。文字列を渡すと型エラーです。",
  en: "The generated route table carries each pattern’s schema output type, so `href()` takes what the page receives: `href('/products/:id', { id: 42 })` takes a number, and a string there is a type error.",
});

export const linksSpelling = message({
  ja: '`href()`は値を、スキーマが読み戻せる1通りの綴りでURLに書きます。',
  en: '`href()` spells the value the one way the schema will read back.',
});

export const layoutTitle = message({
  ja: 'レイアウトの`params`は文字列として型が付く',
  en: 'A layout’s `params` are typed as strings',
});

export const layoutDescription = message({
  ja: 'レイアウトが受け取る`params`は、スキーマを宣言していても文字列として型が付きます。同じレイアウトが`not-found.tsx`のまわりでも描かれ、そこではスキーマが値を受け付けたとは限らないからです。',
  en: 'A layout’s `params` are typed as strings even when it declares a schema. The same layout also renders around `not-found.tsx`, where the schema may not have accepted anything.',
});

export const layoutValue = message({
  ja: 'ただし、実行時の値はこの型どおりとは限りません。ページのまわりではスキーマが変換した値（数値など）が届き、`not-found.tsx`のまわりではURLの文字列がそのまま届きます。型の付いた値が要るときは、下のページで受け取ってください。',
  en: 'The value at run time does not follow that type, though: around a page it is what the schema produced, a number say, and around `not-found.tsx` it is the URL’s string. When you need the typed value, take it in the page below.',
});
