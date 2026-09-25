import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/static` と `@k8ordo/server` は、このルーターの上に作られています。表は `src/routes/` から生成され、ページはサーバーで描かれます。このページでは、フレームワークの下でアプリが使うルーターの部分と使わない部分、ルートファイルの props の型、そしてアプリが書くものと生成されるものの境目を扱います。',
  en: '`@k8ordo/static` and `@k8ordo/server` are built on this router. The table is generated from `src/routes/`, and pages render on the server. This page covers which parts of the router an application uses under the framework and which it does not, the types of a route file’s props, and where what the application writes ends and what is generated begins.',
});

export const noTableTitle = message({
  ja: 'ブラウザは表を持たない',
  en: 'The browser holds no table',
});

export const noTableDescription = message({
  ja: 'フレームワークの下では、ページはサーバーで描かれ、ブラウザは表から木を組み立てるのではなく、描かれた木を受け取ります。クライアントのバンドルにルート表は含まれず、レイアウトは `<Outlet />` ではなく `children` で入れ子になります。',
  en: 'Under the framework pages render on the server, and the browser receives a tree instead of building one from a table. There is no route table in the client bundle at all, and layouts nest through `children` instead of `<Outlet />`.',
});

export const noTableNavigation = message({
  ja: 'ナビゲーションは引き続きこのルーターのものです。フレームワークのランタイムは `useInterceptedNavigation` の上に作られていて、同一オリジンの URL を引き受け、`load` で次のページの RSC ペイロードを取得し、背景で描きます。`finished` が画面に出た時点で解決すること、状態の変更がページの切り替えにならないこと、スクロール、transition の型、追い越されたナビゲーションの abort は、そのまま引き継がれます。',
  en: 'Navigation is still this router’s. The framework’s runtime is built on `useInterceptedNavigation`: it claims same-origin URLs, fetches the next page’s RSC payload in `load`, and renders it in the background. `finished` meaning on screen, state changes not being page changes, scrolling, transition types and aborting superseded navigations all carry over unchanged.',
});

export const compareTable = {
  api: message({ ja: 'API', en: 'API' }),
  client: message({
    ja: '`<Router>` を自分でマウントするアプリ',
    en: 'An application that mounts `<Router>`',
  }),
  framework: message({
    ja: '`@k8ordo/static` / `@k8ordo/server`',
    en: '`@k8ordo/static` / `@k8ordo/server`',
  }),
  handWritten: message({ ja: '手書きする', en: 'Written by hand' }),
  generatedTable: message({
    ja: '`src/routes/` から `.k8ordo/routes.gen.ts` に生成',
    en: 'Generated from `src/routes/` into `.k8ordo/routes.gen.ts`',
  }),
  mountYourself: message({ ja: '自分で使う', en: 'You use them' }),
  notUsed: message({
    ja: '使わない（ランタイムが描き、レイアウトは `children` で入れ子）',
    en: 'Not used: the runtime renders, and layouts nest through `children`',
  }),
  same: message({ ja: '同じ', en: 'The same' }),
  sameTyped: message({
    ja: '同じ。params はスキーマの型で受け取る',
    en: 'The same, with params typed by the schemas',
  }),
  readParams: message({
    ja: '使う（params はいつも文字列）',
    en: 'Used; params are always strings',
  }),
  paramsProp: message({
    ja: '使えない。ページが `params` を props で受け取る',
    en: 'Not available: a page receives `params` as a prop',
  }),
  registerHand: message({
    ja: '`types/` に手書き',
    en: 'Written by hand in `types/`',
  }),
  registerGenerated: message({
    ja: '`.k8ordo/register.gen.ts` に生成',
    en: 'Generated into `.k8ordo/register.gen.ts`',
  }),
  errorKey: message({
    ja: '表の branch に `error` を書く',
    en: 'An `error` key on a branch',
  }),
  errorFile: message({
    ja: '`error.tsx` が表の `error` になる',
    en: '`error.tsx` becomes the table’s `error`',
  }),
  mountedByRouter: message({
    ja: '`<Router>` がマウントする',
    en: 'Mounted by `<Router>`',
  }),
  mountedByRuntime: message({
    ja: 'モードのランタイムがマウントする',
    en: 'Mounted by the mode’s runtime',
  }),
  notApplicable: message({ ja: '—', en: '—' }),
  routeFileProps: message({
    ja: 'ルートファイルの props の型',
    en: 'The types of a route file’s props',
  }),
};

export const locationTitle = message({
  ja: '現在地は `usePathname` と `useMatch` で読む',
  en: '`usePathname` and `useMatch` are the location hooks',
});

export const locationDescription = message({
  ja: '`usePathname` と `useMatch` は表ではなくプラットフォームを読むので、フレームワークの下でもそのまま動きます。`useRoute` と `useParams` はコンテキストの照合結果を読みますが、ブラウザには読むべき照合結果が無いので throw します。',
  en: '`usePathname` and `useMatch` read the platform rather than a table, so they work unchanged under the framework. `useRoute` and `useParams` read the match from context, and there is no match in the browser to read, so they throw.',
});

export const locationServerComponent = message({
  ja: 'フックは client component でしか使えません。Server Component のページやレイアウトは、自分の描画の `pathname` を props で受け取ります。',
  en: 'Hooks work only in client components. A page or layout that is a Server Component receives the `pathname` of its render as a prop.',
});

export const locationThisSite = message({
  ja: "このサイトのサイドナビゲーションも、ロケール配下のシェル（client component）で `useMatch('/:locale/ui/components/*')` に「部品のページが開いているか」を尋ねて出し分けています。パターンは生成された表のものなので、区画の名前を変えればコンパイルで落ちます。",
  en: "This site’s own sidebar is decided the same way: the locale shell, a client component, asks `useMatch('/:locale/ui/components/*')` whether a component page is showing. The pattern comes from the generated table, so renaming the section fails to compile.",
});

export const propsTitle = message({
  ja: '`PageProps` と `LayoutProps`',
  en: '`PageProps` and `LayoutProps`',
});

export const propsDescription = message({
  ja: 'ルートファイルが受け取る props の型は、そのファイルを置いたディレクトリが表すパターンで決まります。`src/routes/products/[id]/page.tsx` のパターンは `/products/:id` です。',
  en: 'The props a route file receives are typed by the pattern its directory stands for: `src/routes/products/[id]/page.tsx` is `/products/:id`.',
});

export const propsPage = message({
  ja: '`PageProps<P>` は `{ params, pathname }` です。`params` はそのページまでのスキーマが作った型で、スキーマが扱わない param は文字列のままです。`pathname` はこの描画の URL の pathname です。',
  en: '`PageProps<P>` is `{ params, pathname }`. `params` has the types the schemas along the page’s stack produced, and a param no schema covers stays a string. `pathname` is the pathname this render is for.',
});

export const propsLayout = message({
  ja: '`LayoutProps<P>` はそれに `children` を足したものです（下の例は `src/routes/products/page.tsx` もあるものとします）。`LayoutProps` は、スキーマを宣言していても `params` を文字列（`ParamsOf<P>`）として型付けします。`not-found.tsx` の下では、スキーマが受理したかどうかに関わらずレイアウトが描かれるからです。ただし検証を通ったページの描画では、実行時にはスキーマの出力がレイアウトにも渡ります。値が文字列であることに頼らないでください。',
  en: '`LayoutProps<P>` adds `children` (the example below assumes `src/routes/products/page.tsx` exists too). `LayoutProps` types a layout’s `params` as strings (`ParamsOf<P>`) whatever the schemas declare, because a layout also renders under `not-found.tsx`, whether or not its schemas accepted. At run time, though, a layout rendered for a validated page receives the schemas’ output, so do not rely on the values being strings.',
});

export const propsRequest = message({
  ja: '`@k8ordo/server` では、生成される `Register` が `request` も持つので、どちらの型にも `request` が加わります。`@k8ordo/static` のビルドにはリクエストが無いので、`request` を読むページはそこで型エラーになります。',
  en: 'Under `@k8ordo/server` the generated `Register` carries the `request` too, so both types gain `request`. A build into files has no request, so a page that reads it fails to type-check under `@k8ordo/static`.',
});

export const propsInline = message({
  ja: '`P` は生成された表にページがあるパターンでなければなりません。自分の位置にページを持たないレイアウトは、props をインラインで宣言します。インラインで宣言しても、生成された表が import の位置で同じことを検査します。',
  en: '`P` must be a pattern the generated table has a page at, so a layout with no page of its own at that prefix declares its props inline. Inline props are checked by the generated table at the import all the same.',
});

export const schemaTitle = message({
  ja: '`paramsSchema` と params の型',
  en: '`paramsSchema` and typed params',
});

export const schemaDescription = message({
  ja: 'ページやレイアウトは `paramsSchema` を export して、params をどう読むかを宣言できます。ルーター自身はスキーマを走らせません。走らせるのはフレームワークで、このパッケージが受け持つのは出てくる値の型です。',
  en: 'A page or layout can export a `paramsSchema` to say how its params are read. The router itself never runs a schema — the framework does — and this package types what comes out.',
});

export const schemaLinks = message({
  ja: '生成される `Register` は、スキーマのかかるパターンごとにスキーマの出力型を `params` として持ちます。そのため `href` と `navigateTo` は、ページが受け取るのと同じ型で param を受け取り、スキーマが読み戻す綴りに変換します。スキーマが `number` にした `:id` には `{ id: 42 }` を渡し、文字列を渡すと型エラーになります。スキーマのかかるパターンで、どのスキーマも扱わない param は、ページと同じく文字列で受け取ります。生成より前、あるいはどのスキーマもかからないパターンでは、綴りが 1 つに決まる値ならどれでも渡せます。',
  en: 'The generated `Register` carries, for each pattern a schema covers, the schema output as `params`, so `href` and `navigateTo` take a param as the page receives it and spell it the one way the schema reads back: an `:id` the schema made a `number` takes `{ id: 42 }`, and a string there is a type error. On such a pattern, a param the schemas leave alone takes a string, as the page receives it. Before the file is generated, or for a pattern no schema along its stack covers, any value with one spelling is accepted.',
});

export const schemaGenerated = message({
  ja: '生成されるファイルは次のような形です（このサイトのものから抜粋）。',
  en: 'The generated file looks like this, taken from this site:',
});

export const schemaTypesTable = {
  type: message({ ja: '型', en: 'Type' }),
  meaning: message({ ja: '意味', en: 'Meaning' }),
  parsedParams: message({
    ja: 'パターンの params に、スキーマの列（外側のレイアウトから順、ページが最後）の出力を順に重ねた型',
    en: 'A pattern’s params after a list of schemas — outer layouts first, the page last — each replacing the strings it names with what it produced',
  }),
  parsedParamsMap: message({
    ja: '`{ パターン: スキーマの列 }` を `{ パターン: ParsedParams }` にした型。生成される `Register` の `params`',
    en: '`{ pattern: schemas }` turned into `{ pattern: ParsedParams }`: the `params` of the generated `Register`',
  }),
  paramsSchemaFor: message({
    ja: 'そのパターンのスキーマとして書けるもの。出力のキーはパターンの params の部分集合',
    en: 'What may serve as a schema for the pattern: its output’s keys are a subset of the pattern’s params',
  }),
  standardSchemaLike: message({
    ja: 'Standard Schema の形（`~standard` の `types.output`）。zod・zod/mini など、実装するライブラリならどれでも',
    en: 'The Standard Schema shape (`types.output` under `~standard`); any library that implements it — zod, zod/mini or another',
  }),
  schemaOutput: message({
    ja: 'スキーマの出力の型',
    en: 'What a schema produces',
  }),
  registeredPageParams: message({
    ja: 'そのパターンのページが受け取る `params`。`PageProps` の `params`',
    en: 'The `params` a page under the pattern receives: `PageProps`’s `params`',
  }),
};

export const schemaTypesNote = message({
  ja: 'これらは主に生成されるコードのための型です。アプリが直接書くのは `PageProps` と `LayoutProps` で足ります。',
  en: 'These are mostly for the generated code; what an application writes by hand is `PageProps` and `LayoutProps`.',
});

export const providerTitle = message({
  ja: '`PathnameProvider` はアプリが書かない',
  en: '`PathnameProvider` is never the application’s',
});

export const providerDescription = message({
  ja: 'client component の最初の描画は、Navigation API の無い場所（サーバーと、ハイドレーション）で起きます。そのため `usePathname` の値は、それを知っている描画側から `<PathnameProvider pathname>` で届ける必要があります。`<Router>` は自分でマウントし、両モードのランタイムも自分でマウントします。アプリが書くことはありません。書くのは `useInterceptedNavigation` で自前の継ぎ目を作るホストだけです。',
  en: 'A client component’s first render happens where there is no Navigation API — on the server, and again during hydration — so `usePathname`’s value has to arrive from the renderer that knew it, through `<PathnameProvider pathname>`. `<Router>` mounts one itself, and both mode runtimes mount one; an application never writes it. Only a host building its own seam out of `useInterceptedNavigation` does.',
});

export const providerMissing = message({
  ja: 'どれの下にも無いままサーバーやハイドレーションで `usePathname` を呼ぶと、次のエラーになります。',
  en: 'Calling `usePathname` on the server or during hydration with none of them above it throws:',
});

export const providerHydration = message({
  ja: 'ハイドレーションではサーバーの pathname で描き、その後ブラウザの pathname に切り替わります。2 つが違えば 1 度描き直されるだけで、不一致のエラーにはなりません。このサイトの `404.html` は 1 枚で全ロケールに答えるので、表示中の URL のロケールへこの描き直しで切り替わります。',
  en: 'Hydration renders with the server’s pathname and then switches to the browser’s; when the two differ, that is one re-render, not a mismatch. This site’s single `404.html` answers for every locale, and this re-render is how it switches to the locale of the URL it is shown at.',
});

export const writesTitle = message({
  ja: 'アプリが書くもの、生成されるもの',
  en: 'What the application writes, and what is generated',
});

export const writesDescription = message({
  ja: 'フレームワークの下では、ルーターに関わるものの多くが生成されるか、ランタイムに含まれています。',
  en: 'Under the framework, much of what touches the router is generated or lives in the runtime.',
});

export const writesApp = message({
  ja: 'アプリが書く',
  en: 'The application writes',
});

export const writesAppRoutes = message({
  ja: '`src/routes/` のルートファイル（`page.tsx`・`layout.tsx`・`error.tsx`・`not-found.tsx`・`redirect.ts`）と `paramsSchema`',
  en: 'The route files under `src/routes/` (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`, `redirect.ts`) and their `paramsSchema`',
});

export const writesAppLinks = message({
  ja: '`href` / `navigateTo` のリンク。共有の param があれば `bindParams` のモジュール',
  en: 'Links with `href` / `navigateTo`, and a `bindParams` module for params every link shares',
});

export const writesAppLocation = message({
  ja: 'client component での `usePathname` / `useMatch`',
  en: '`usePathname` / `useMatch` in client components',
});

export const writesAppTransition = message({
  ja: 'ページの切り替えをアニメーションするなら、レイアウトの `children` を包む `<ViewTransition>`',
  en: 'A `<ViewTransition>` around a layout’s `children`, to animate page changes',
});

export const writesGenerated = message({
  ja: '生成される、またはランタイムが持つ',
  en: 'Generated, or part of the runtime',
});

export const writesGeneratedTable = message({
  ja: '`.k8ordo/routes.gen.ts`：`defineRoutes` の表と、パターンごとのスキーマの列',
  en: '`.k8ordo/routes.gen.ts`: the `defineRoutes` table and each pattern’s list of schemas',
});

export const writesGeneratedRegister = message({
  ja: '`.k8ordo/register.gen.ts`：このルーターの `Register`（アプリが `@k8ordo/state` に依存していればその `Register` も）',
  en: '`.k8ordo/register.gen.ts`: this router’s `Register` — and `@k8ordo/state`’s, when the application depends on it',
});

export const writesGeneratedRuntime = message({
  ja: 'ランタイム：`useInterceptedNavigation`・`<NavigationGeneration>`・`<PathnameProvider>`',
  en: 'The runtime: `useInterceptedNavigation`, `<NavigationGeneration>` and `<PathnameProvider>`',
});

export const writesNever = message({
  ja: 'アプリが書かない',
  en: 'The application never writes',
});

export const writesNeverList = message({
  ja: '`<Router>`・`<Outlet />`・`useRoute`・`useParams`、そして手書きの `Register`（生成されたものと 2 つ目の答えになる）',
  en: '`<Router>`, `<Outlet />`, `useRoute`, `useParams`, or a hand-written `Register` — a second answer to one already generated',
});

export const writesTsconfig = message({
  ja: '生成された型を効かせるには、`tsconfig.json` の `include` に `.k8ordo/**/*.ts` のグロブを書きます。`.k8ordo` はドットで始まるので、ディレクトリ名だけを書くと黙って読み飛ばされ、`href` が表と照合されなくなります。',
  en: 'For the generated types to apply, put the glob `.k8ordo/**/*.ts` in `include` in `tsconfig.json`. `.k8ordo` starts with a dot, and a bare directory entry silently skips it — `href` simply stops being checked against the table.',
});

export const transitionTitle = message({
  ja: 'ページの切り替えのアニメーション',
  en: 'Animating page changes',
});

export const transitionDescription = message({
  ja: 'レイアウトで `children` を `<ViewTransition>` で包みます。`<ViewTransition>` は RSC ペイロードでそのまま送られるので、Server Component のレイアウトが直接描けます。このサイトが client component の中に置いているのは、シェルがフックを使うからです。',
  en: 'A layout wraps its `children` in `<ViewTransition>`. React sends a `<ViewTransition>` through the RSC payload as it is, so a Server Component layout can render it directly; this site keeps it in a client component only because its shell uses hooks.',
});

export const nextTitle = message({
  ja: 'モードごとのルーティング',
  en: 'Routing in each mode',
});

export const nextStatic = message({
  ja: '`@k8ordo/static` のルーティング',
  en: 'Routing in `@k8ordo/static`',
});

export const nextServer = message({
  ja: '`@k8ordo/server` のルーティング',
  en: 'Routing in `@k8ordo/server`',
});

export const nextParams = message({
  ja: '`paramsSchema` の詳細（`@k8ordo/static`）',
  en: '`paramsSchema` in depth, in `@k8ordo/static`',
});
