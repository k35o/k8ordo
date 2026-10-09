import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/framework`は、このルーターの上に作られています。ルート表は`src/routes/`のディレクトリから生成され、ページはサーバーで描かれます。このページでは、フレームワークの下でアプリが使う部分と使わない部分、そしてルートのファイルが受け取るpropsの型を説明します。',
  en: '`@k8ordo/framework` is built on this router. The route table is generated from the `src/routes/` directories, and pages render on the server. This page covers which parts an app uses under the framework and which it does not, and the types of the props a route file receives.',
});

export const noTableTitle = message({
  ja: 'ブラウザはルート表を持たない',
  en: 'The browser holds no route table',
});

export const noTableDescription = message({
  ja: 'フレームワークの下では、ページはサーバーで描かれ、ブラウザは描かれたページを受け取ります。ルート表はクライアントのバンドルに入らず、レイアウトは`<Outlet />`ではなく`children`でページを包みます。',
  en: 'Under the framework, pages render on the server and the browser receives them rendered. The route table never enters the client bundle, and a layout wraps its page through `children` instead of `<Outlet />`.',
});

export const noTableNavigation = message({
  ja: 'それでも、ナビゲーションはこのルーターのものです。フレームワークのランタイムは、`<Router>`と同じ`useInterceptedNavigation`の上に作られています。次のページを背景で描くことや、`finished`がページが出たときに解決すること、新しいページが先頭から始まることは、そのまま成り立ちます。',
  en: 'Navigation is still this router’s. The framework’s runtime is built on `useInterceptedNavigation`, the same hook `<Router>` uses, so the next page still renders in the background, `finished` still waits for it to be on screen, and a new page still starts at the top.',
});

export const carryTitle = message({
  ja: 'そのまま使えるもの',
  en: 'What carries over',
});

export const carryDescription = message({
  ja: '次のものは、ルート表を手元に持たなくても動きます。そのため、ブラウザに表が無いフレームワークの下でも、そのまま使えます。アプリは、これらを`@k8ordo/framework`からimportします。',
  en: 'These work without the route table in hand, so they work unchanged under the framework, where the browser has none. An app imports them from `@k8ordo/framework`.',
});

export const carryLinks = message({
  ja: '`href`と`navigateTo`、`bindParams`：リンクを作り、ページを移る',
  en: '`href`, `navigateTo` and `bindParams`: building links and changing pages',
});

export const carryLocation = message({
  ja: '`usePathname`と`useMatch`、`matchPath`、`usePendingPathname`：いまいる場所を調べる',
  en: '`usePathname`, `useMatch`, `matchPath` and `usePendingPathname`: finding where you are',
});

export const carryPaths = message({
  ja: '`withBase`と`normalizePathname`：パスの付け足しと比較',
  en: '`withBase` and `normalizePathname`: adding and comparing paths',
});

export const carryProps = message({
  ja: '`PageProps`と`LayoutProps`、`RouteContext`：ルートのファイルが受け取るものの型',
  en: '`PageProps`, `LayoutProps` and `RouteContext`: the types of what a route file receives',
});

export const carryNotFound = message({
  ja: '`notFound`と`isNotFound`：そのパスにページが無いことを伝える',
  en: '`notFound` and `isNotFound`: saying a path has no page',
});

export const carryClient = message({
  ja: 'フックを使えるのはClient Componentの中だけです。Server Componentのページやレイアウトは、描画しているパスを`pathname`のpropsで受け取ります。',
  en: 'The hooks work only in Client Components. A page or layout that is a Server Component receives the path it renders for as its `pathname` prop.',
});

export const notUsedTitle = message({
  ja: 'フレームワークが受け持つもの',
  en: 'What the framework takes care of',
});

export const notUsedDescription = message({
  ja: '次のものは、フレームワークが代わりに受け持つので、アプリでは書きません。',
  en: 'These the framework handles for you, so the app does not write them.',
});

export const notUsedTable = message({
  ja: '`defineRoutes`：ルート表は`src/routes/`から`.k8ordo/routes.gen.ts`に生成されます',
  en: '`defineRoutes`: the route table is generated from `src/routes/` into `.k8ordo/routes.gen.ts`',
});

export const notUsedRouter = message({
  ja: '`<Router>`と`<Outlet />`：ページはランタイムが描き、レイアウトは`children`でページを包みます',
  en: '`<Router>` and `<Outlet />`: the runtime renders the pages, and a layout wraps its page through `children`',
});

export const notUsedBoundaries = message({
  ja: '表の`error`と`loading`：`error.tsx`と`loading.tsx`を置くと、生成された表のその位置に入ります',
  en: 'The table’s `error` and `loading`: an `error.tsx` or a `loading.tsx` goes into the generated table at its place',
});

export const notUsedRegister = message({
  ja: '`Register`の登録：`.k8ordo/register.gen.ts`に生成されます',
  en: 'Registering on `Register`: it is generated into `.k8ordo/register.gen.ts`',
});

export const notUsedHost = message({
  ja: '`PathnameProvider`と`BrowserPathname`、`NavigationGeneration`、`useInterceptedNavigation`：ランタイムが使います',
  en: '`PathnameProvider`, `BrowserPathname`, `NavigationGeneration` and `useInterceptedNavigation`: the runtime uses them',
});

export const notUsedParams = message({
  ja: '`useParams`と`useRoute`は、`<Router>`が持つ照合の結果を読みます。フレームワークの下ではブラウザに照合の結果が無いので、どちらも例外を投げます。ページは`params`をpropsで受け取ります。',
  en: '`useParams` and `useRoute` read the match `<Router>` holds. Under the framework there is no match in the browser, so both throw; a page receives `params` as a prop instead.',
});

export const pagePropsTitle = message({
  ja: 'ページのpropsに型を付ける',
  en: 'Type a page’s props',
});

export const pagePropsDescription = message({
  ja: '`PageProps`は、ページが受け取るpropsの型です。型引数には、ページのファイルを置いたディレクトリが表すパターンを渡します。',
  en: '`PageProps` is the type of a page’s props. Its type argument is the pattern the page file’s directory stands for.',
});

export const pagePropsParams = message({
  ja: '`params`には、`paramsSchema`が作った型が付きます。上の例では、スキーマが数値にした`id`は`number`です。スキーマを書いていないparamは文字列のままです。`pathname`には、この描画のパスが入ります。',
  en: '`params` has the types the `paramsSchema` produced: above, the schema made `id` a `number`. A param no schema covers stays a string. `pathname` is the path this render is for.',
});

export const pagePropsLinks = message({
  ja: '`href`も、同じ型でparamを受け取ります。`id`には数値を渡し、スキーマが読み戻せる書き方でURLに入ります。文字列を渡すと型エラーになります。',
  en: '`href` takes the param with the same type: `id` takes a number, written into the URL the one way the schema reads back. A string there is a type error.',
});

export const pagePropsNotFound = message({
  ja: '`notFound()`は、パスはパターンに合ったものの、そのページが実は無いことを伝える関数です。例外を投げるので後ろの行は走らず、フレームワークがいちばん近い`not-found.tsx`を404で返します。',
  en: '`notFound()` says that although the path fit the pattern, there is no page after all. It throws, so nothing after it runs, and the framework answers with the nearest `not-found.tsx` under a 404.',
});

export const pagePropsNotFoundWhy = message({
  ja: '`notFound`の実体はこのルーターにあり、`@k8ordo/framework`はそれを再exportしています。`<Router>`で描くアプリには返すステータスが無いので、ほかの例外と同じ扱いになります。',
  en: '`notFound` lives in this router, and `@k8ordo/framework` re-exports it. An app rendered by `<Router>` has no status to answer with, so there it is an error like any other.',
});

export const layoutPropsTitle = message({
  ja: 'レイアウトのpropsに型を付ける',
  en: 'Type a layout’s props',
});

export const layoutPropsDescription = message({
  ja: '`LayoutProps`は、`params`と`pathname`に`children`を加えた型です。型引数には、レイアウトを置いたディレクトリが表すパターンを渡します。',
  en: '`LayoutProps` adds `children` to `params` and `pathname`. Its type argument is the pattern the layout file’s directory stands for.',
});

export const layoutPropsStrings = message({
  ja: 'レイアウトの`params`は、スキーマを書いていても文字列として型が付きます。`not-found.tsx`は、スキーマが値を受け付けたかどうかにかかわらずレイアウトの中に描かれるので、スキーマの型を約束できないからです。',
  en: 'A layout’s `params` are typed as strings even when a schema is written. `not-found.tsx` renders inside the layout whether or not the schemas accepted, so the schemas’ types cannot be promised there.',
});

export const layoutPropsPage = message({
  ja: '型引数に渡せるのは、ページのあるパターンだけです。`src/routes/products/page.tsx`が無ければ`/products`は渡せないので、そのレイアウトはpropsの型を自分で書きます。',
  en: 'Only a pattern with a page can be the type argument. Without `src/routes/products/page.tsx`, `/products` is not accepted, and that layout writes its props type itself.',
});

export const requestTitle = message({
  ja: 'serverモードで`request`を受け取る',
  en: 'Receive `request` in server mode',
});

export const requestDescription = message({
  ja: 'serverモードでは、生成される`Register`が`request`も持ちます。そのため、`PageProps`と`LayoutProps`のどちらにも`request`が加わります。',
  en: 'In server mode, the generated `Register` carries `request` too, so both `PageProps` and `LayoutProps` gain `request`.',
});

export const requestStatic = message({
  ja: 'staticモードのビルドにはリクエストが無いので、`request`は加わりません。`request`を読むページは、staticモードでは型エラーになります。',
  en: 'A static-mode build has no request, so `request` is not added there, and a page that reads it fails to type-check.',
});

export const requestSearch = message({
  ja: '`search`をexportしたページは、読み取った値も`search`のpropsで受け取ります。これも`PageProps`に加わります。',
  en: 'A page that exports `search` also receives what it reads as its `search` prop, which `PageProps` adds as well.',
});

export const routeTitle = message({
  ja: '`route.ts`の引数に型を付ける',
  en: 'Type a `route.ts` handler',
});

export const routeDescription = message({
  ja: 'フィードやJSONのように、ページではない答えを返す`route.ts`は、リクエストのメソッドごとに関数をexportします。`RouteContext`は、その関数が受け取る引数の型です。',
  en: 'A `route.ts` that answers with something other than a page, such as a feed or JSON, exports a function per request method. `RouteContext` is the type of what each receives.',
});

export const routeFields = message({
  ja: '受け取るのは、`request`と`params`です。`params`には、ページと同じくスキーマが作った型が付きます。',
  en: 'Each receives `request` and `params`, with `params` typed by the schemas as a page’s are.',
});
