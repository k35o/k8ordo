import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-params.ts / server-params.ts が持つ。

export const stringsTitle = message({
  ja: 'パラメータは文字列で届く',
  en: 'A parameter arrives as a string',
});

export const stringsDescription = message({
  ja: 'URL が運べるのは文字列だけなので、何も宣言しなければ `params` の値はすべて文字列です。`[id]` の下のページは `params.id: string` を受け取ります。',
  en: 'A URL carries nothing but strings, so without a declaration every value in `params` is one: a page under `[id]` receives `params.id: string`.',
});

export const schemaTitle = message({
  ja: 'スキーマで形を言う',
  en: 'Saying what it expects with a schema',
});

export const schemaDescription = message({
  ja: '`page.tsx` か `layout.tsx` は `paramsSchema` を export して、受け取るものの形を言えます。レイアウトのスキーマは、その下のすべてのページに効きます。名前が `params` でないのは、ページ自身の prop が `params` で、同じ名前のモジュール変数はそれを隠してしまうからです。',
  en: "A `page.tsx` or a `layout.tsx` may export `paramsSchema` to say what it expects; a layout's applies to every page below it. It is not called `params` because the page's own prop is, and a module-level binding of the same name would shadow it.",
});

export const schemaLibraries = message({
  ja: 'Standard Schema を実装したライブラリなら何でも使えます。zod、zod/mini、ほかのライブラリ、そして `@k8ordo/i18n` の `locales.paramsSchema` もそうです。仕様はリンク先にあります。',
  en: "Any library that implements Standard Schema works — zod, zod/mini, another library, or `@k8ordo/i18n`'s `locales.paramsSchema`. The specification is linked here.",
});

export const schemaParsing = message({
  ja: 'export はファイルを構文解析して見つけるので、書き方は問いません。`export const paramsSchema = …`、`export { paramsSchema }`、分割代入の `export const { paramsSchema } = locales` のどれも export です。文字列やコメントの中の同じ単語と `export type` は数えません。読まれるのは `page.tsx` と `layout.tsx` だけで、構文として解析できないファイルは何も宣言していないものとして扱われます。',
  en: 'The export is found by parsing the file, so its spelling does not matter: `export const paramsSchema = …`, `export { paramsSchema }` and a destructured `export const { paramsSchema } = locales` all count, while the same word inside a string or a comment, or an `export type`, does not. Only `page.tsx` and `layout.tsx` are read, and a file that does not parse declares nothing.',
});

export const stackTitle = message({
  ja: 'スタックに沿ってスキーマが順に走る',
  en: 'The schemas along a stack run in order',
});

export const stackDescription = message({
  ja: 'ページが描かれる前に、そのページの上で宣言されたスキーマが外側のレイアウトから順に走り、最後にページ自身のものが走ります。それぞれは自分が名指した文字列を自分の出力で置き換え、どのスキーマも名指さなかったパラメータは文字列のまま残ります。',
  en: 'Before a page renders, the schemas declared along its stack run — every layout above it that declared one, outermost first, then its own. Each replaces the strings it names with what it produced, and a parameter no schema names stays a string.',
});

export const stackExample = message({
  ja: '次の例では、`[locale]` のレイアウトがロケールを、ページが `id` を検証し、ページは両方の結果を受け取ります。',
  en: 'Below, the `[locale]` layout validates the locale, the page validates `id`, and the page receives both results.',
});

export const refusedTitle = message({
  ja: '拒まれた値には、そのパターンが答えない',
  en: 'A refused value is a pathname the pattern does not answer',
});

export const refusedDescription = message({
  ja: 'スキーマが値を拒んでも、`/products/shoes` が `NaN` を持ったページになることはありません。照合はそのパターンが一致しなかったものとして表の次へ進み、最後は `not-found.tsx` が 404 として答えます。ディレクトリが最初から一致しなかったのと同じです。',
  en: 'When a schema refuses, `/products/shoes` does not become a page rendering `NaN`. The walk goes on as if the pattern had never matched, to whatever the table declares next — in the end `not-found.tsx`, under a 404.',
});

export const refusedCatchAll = message({
  ja: 'catch-all 自身のパラメータは検証されません。catch-all はほかのどれも答えなかったものに答えるので、値を拒んだときに返るはずの 404 がすでにそこにあります。`/:locale/*` の `not-found.tsx` が受け取る `params.locale` は、どんな文字列でもありえます。',
  en: "A catch-all's own params are never validated: it answers what nothing else did, and a 404 is already what a refusal means. The `params.locale` a `not-found.tsx` at `/:locale/*` receives can be any string.",
});

export const syncTitle = message({
  ja: 'スキーマは同期的に',
  en: 'The schema is synchronous',
});

export const syncDescription = message({
  ja: 'どのパターンが pathname に答えるかは、何かが描かれる前に決まり、その判断は待てません。非同期に検証するスキーマは、描画の前に次のエラーで拒まれます。値が形として正しいかはスキーマが、データとして存在するかはページが確かめます。',
  en: "Which pattern answers a pathname is decided before anything renders, and that decision cannot wait. A schema that validates asynchronously is refused with the error below. Whether a value has the right shape is the schema's question; whether it exists in your data is the page's.",
});

export const clientTitle = message({
  ja: 'スキーマは Server Component のファイルに置く',
  en: 'The schema lives in a Server Component file',
});

export const clientDescription = message({
  ja: "`'use client'` のモジュールから export した値は、RSC 側にはスキーマではなく client reference として届き、ハンドラはそれを走らせられません。クライアントコンポーネントにしたいレイアウトは、スキーマを Server Component の `layout.tsx` に置き、そこからクライアント側の殻を描きます。このサイトの `[locale]` レイアウトがその形です。",
  en: "A value exported from a `'use client'` module reaches the RSC side as a client reference, not a schema, and the handler cannot run it. A layout that has to be a client component keeps its schema in a Server Component `layout.tsx` that renders the client shell — which is how this site's `[locale]` layout is built.",
});

export const clientMore = message({
  ja: '殻の側の書き方は、リンク先にあります。',
  en: 'How the shell side is written is covered here.',
});

export const typesTitle = message({
  ja: 'ページもリンクも、スキーマの出力を受け取る',
  en: 'The page and its links take the output',
});

export const typesDescription = message({
  ja: "生成された `Register` は、パターンごとにスキーマの出力型を持っています。`PageProps<'/products/:id'>` の `params.id` は number になり、`href('/products/:id', { id: 42 })` も number を受け取って、スキーマが読み戻せる 1 通りの綴りで書きます。そこに文字列やオブジェクトを渡すと型エラーです。",
  en: "The generated `Register` carries each pattern's schema output type. `params.id` in `PageProps<'/products/:id'>` is a number, and `href('/products/:id', { id: 42 })` takes the number too, spelling it the one way the schema will read back; a string or an object there is a type error.",
});

export const typesCheck = message({
  ja: '生成された表は各スキーマを `satisfies ParamsSchemaFor<pattern>` で検査しますが、この検査は緩やかです。パラメータを持つパターンで、そのどれも名指さないスキーマは、`tsc` が `.k8ordo/routes.gen.ts` でエラーにします。一方、実在するパラメータと一緒にパターンに無いキーを名指すスキーマは通ります。そうしたキーは無害ではありません。パターンに無いパラメータを必須にしたスキーマはすべての pathname を拒むので、そのページは決して答えません。`vite build` は型を検査しないので、上のエラーも `tsc` を走らせたときにしか出ません。',
  en: 'The generated table checks each schema with `satisfies ParamsSchemaFor<pattern>`, and only loosely: on a pattern that has params, a schema naming none of them is an error `tsc` reports in `.k8ordo/routes.gen.ts`, while one naming a real param beside a key the pattern lacks passes. Such a key is not harmless — a schema that requires a param its pattern does not have refuses every pathname, so that page never answers. `vite build` does not type-check, so even the error above surfaces only under `tsc`.',
});

export const layoutTitle = message({
  ja: 'レイアウトの params は文字列として型が付く',
  en: "A layout's params are typed as strings",
});

export const layoutDescription = message({
  ja: 'レイアウトの `params` は、自分でスキーマを宣言していても文字列として型が付きます（`LayoutProps` でも、生成された `Layout` でも）。同じレイアウトは `not-found.tsx` のまわりでも描かれ、そこでは何も検証されないからです。ただし実行時の値はこの型のとおりではありません。ページのまわりではスタックのスキーマが出したページの値（スキーマが数値にしたなら数値）が届き、`not-found.tsx` のまわりでは URL の文字列がそのまま届きます。型が文字列だからといって文字列のメソッドを呼ばず、1 つの形が要るならレイアウト自身が `String()` で揃えるか、型の付いた値は下のページに受け取らせます。',
  en: "A layout's `params` are typed as strings — in `LayoutProps` and in the generated `Layout` — even when it declared a schema, because the same layout also renders around `not-found.tsx`, where nothing is validated. The run-time value does not follow that type: around a page the layout receives the page's parsed params (a number where a schema coerced one), and around `not-found.tsx` the raw strings. Do not call a string method on a param because the type says string; a layout that needs one form converts the value itself (`String(params.id)`), or leaves the typed value to the pages below.",
});

export const layoutPropsPage = message({
  ja: '`LayoutProps<pattern>` が受け取るのは、表がその位置にページを持つパターンだけです。型の制約がページのパターンだからです。自分の位置にページが無いレイアウト（ページがすべて `shop/[id]/` の下にある `shop/layout.tsx` など）は、props をインラインで書きます。',
  en: '`LayoutProps<pattern>` takes only a pattern the table has a page for, since its constraint is the page patterns. A layout with no page at its own prefix — a `shop/layout.tsx` whose pages all sit under `shop/[id]/`, say — declares its props inline.',
});
