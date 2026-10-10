import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/router`がexportする関数とコンポーネント、型の一覧です。',
  en: 'The functions, components and types `@k8ordo/router` exports.',
});

export const defineRoutesSummary = message({
  ja: 'ルート表を作ります。キーはパスのパターンで、値はページのコンポーネントか、`children`を持つオブジェクトです。',
  en: 'Creates the route table. Each key is a path pattern, and each value is a page component or an object with `children`.',
});

export const defineRoutesRecord = message({
  ja: 'ルート表。キーは`/`で始まるパターンです。',
  en: 'The route table. Every key is a pattern starting with `/`.',
});

export const defineRoutesReturns = message({
  ja: '渡した表と、パスを照合する`match`を持つオブジェクト。',
  en: 'An object holding the table as passed and `match`, which matches a path against it.',
});

export const defineRoutesCaveats = [
  message({
    ja: '表は呼んだ時点で検査します。`/`で始まらないキーや同じパターンの重複など、書き方の誤りは`TypeError`になります。エラー文は`route pattern "/x" is declared twice`のような形です。',
    en: 'The table is checked when this is called. A mistake in it, such as a key not starting with `/` or a pattern declared twice, is a `TypeError`. The message reads like `route pattern "/x" is declared twice`.',
  }),
  message({
    ja: '照合は書いた順に行い、最初に合ったパターンを選びます。`/*`は最後に書きます。',
    en: 'Patterns are tried in the order written, and the first that fits wins. Put `/*` last.',
  }),
] as const;

export const routerSummary = message({
  ja: 'ルート表をNavigation APIにつなぎ、今のパスに合ったページを描画します。ブラウザで描画するアプリのいちばん上に、1度だけ置きます。',
  en: 'Connects the route table to the Navigation API and renders the page that fits the current path. Put it once, at the top of an app that renders in the browser.',
});

export const routerRoutes = message({
  ja: '`defineRoutes`が返したルート表。',
  en: 'The route table `defineRoutes` returned.',
});

export const routerCaveats = [
  message({
    ja: 'ルート表に合うパスへのナビゲーションだけを処理します。それ以外はブラウザに任せます。',
    en: 'It handles only navigations to paths the table matches. The rest is left to the browser.',
  }),
  message({
    ja: '表に合わないパスで開かれたときは、何も描画しません。',
    en: 'Opened at a path the table does not match, it renders nothing.',
  }),
  message({
    ja: 'マウントした時点でブラウザのURLを読むので、サーバーでは描画できません。',
    en: 'It reads the browser’s URL when it mounts, so it cannot render on the server.',
  }),
] as const;

export const outletSummary = message({
  ja: 'レイアウトの中で、そのレイアウトが包むページを描画する位置を示します。',
  en: 'Marks where, inside a layout, the page it wraps is rendered.',
});

export const outletCaveats = [
  message({
    ja: '`<Router>`の外で描画すると、`Outlet must render inside <Router>`というエラーになります。`@k8ordo/framework`では、レイアウトは`children`を描画します。',
    en: 'Rendered outside `<Router>`, it throws `Outlet must render inside <Router>`. Under `@k8ordo/framework`, a layout renders `children` instead.',
  }),
] as const;

export const hrefSummary = message({
  ja: 'パターンとparamから、リンク先のURLを作ります。',
  en: 'Builds the URL a link points at from a pattern and its params.',
});

export const hrefPattern = message({
  ja: 'リンク先のパターン。`Register`に登録していれば、表にあるリンク先にできるパターンだけを受け付けます。',
  en: 'The pattern to link to. With `Register` augmented, only the table’s linkable patterns are accepted.',
});

export const hrefParams = message({
  ja: 'パターンのparamの値。paramの無いパターンでは渡しません。',
  en: 'The values of the pattern’s params. Left out for a pattern without params.',
});

export const hrefReturns = message({
  ja: '`<a>`の`href`属性に渡すURL。先頭にViteの`base`を付けます。',
  en: 'A URL for an `<a>`’s `href` attribute, with Vite’s `base` prepended.',
});

export const hrefCaveats = [
  message({
    ja: '値は`encodeURIComponent`でエンコードします。',
    en: 'Values are encoded with `encodeURIComponent`.',
  }),
  message({
    ja: '実行時には、`/*`を含むパターンは`is a wildcard`を含む`TypeError`になります。値の無いparamは`needs a value for`、URLで表せない値は`has no URL spelling`を含む`TypeError`になります。',
    en: 'At run time, a pattern with `/*` throws a `TypeError` containing `is a wildcard`. A param without a value throws one containing `needs a value for`, and a value that cannot be spelled in a URL one containing `has no URL spelling`.',
  }),
] as const;

export const navigateToSummary = message({
  ja: 'パターンとparamからURLを作り、そのページへ移動します。',
  en: 'Builds a URL from a pattern and its params, and navigates there.',
});

export const navigateToOptions = message({
  ja: 'ナビゲーションのオプション。paramの無いパターンでは2つ目の引数です。',
  en: 'Options for the navigation. For a pattern without params, it is the second argument.',
});

export const navigateToReturns = message({
  ja: '`navigation.navigate()`が返す`{ committed, finished }`。`finished`は、新しいページが画面に表示されたときに解決します。',
  en: 'The `{ committed, finished }` that `navigation.navigate()` returns. `finished` resolves once the new page is on screen.',
});

export const navigateToCaveats = [
  message({
    ja: '既定では新しい履歴エントリを追加します。',
    en: 'By default, it adds a new history entry.',
  }),
  message({
    ja: '別のナビゲーションに追い越されると、`finished`は`AbortError`でrejectします。',
    en: 'Overtaken by another navigation, `finished` rejects with an `AbortError`.',
  }),
] as const;

export const bindParamsSummary = message({
  ja: '一部のparamを関数から補う`href`と`navigateTo`を作ります。ロケールのように、すべてのリンクに共通のparamに使います。',
  en: 'Creates an `href` and a `navigateTo` that fill in some params from a function. Use it for a param every link shares, such as a locale.',
});

export const bindParamsSource = message({
  ja: '補うparamを返す関数。`href`や`navigateTo`を呼ぶたびに呼ばれます。',
  en: 'A function returning the params to fill in. It is called on every call to `href` or `navigateTo`.',
});

export const bindParamsReturns = message({
  ja: '`source`の値を補う`href`と`navigateTo`。',
  en: 'An `href` and a `navigateTo` that fill in what `source` returns.',
});

export const bindParamsCaveats = [
  message({
    ja: '補われるparamは省けます。渡すと、その値で上書きします。',
    en: 'A param `source` supplies may be left out. Passing it overrides the value.',
  }),
  message({
    ja: 'パターンにparamがあれば、オプションはいつも3つ目の引数です。すべてのparamを`source`が補うときは、2つ目に`undefined`を渡します。',
    en: 'When the pattern names a param, the options are always the third argument. When `source` supplies every param, pass `undefined` as the second.',
  }),
] as const;

export const pathnameHookSummary = message({
  ja: 'ブラウザが今開いているパスを返します。',
  en: 'Returns the path the browser is on.',
});

export const pathnameHookReturns = message({
  ja: '今のパス。Viteの`base`と末尾のスラッシュを外した形です。',
  en: 'The current path, without Vite’s `base` or a trailing slash.',
});

export const pathnameHookCaveats = [
  message({
    ja: 'パスが変わったときだけ再描画します。クエリが変わっても再描画しません。',
    en: 'It re-renders only when the path changes, never when only the query does.',
  }),
  message({
    ja: 'URLが書き換わった時点で変わります。新しいページの表示は待ちません。',
    en: 'It changes as soon as the URL does, without waiting for the new page to be on screen.',
  }),
  message({
    ja: 'サーバーの描画では、`@k8ordo/framework`のページの中でだけ使えます。ハイドレーションでは、`<Router>`の中でも使えます。外で呼ぶと`usePathname needs <Router> above it`で始まるエラーになります。',
    en: 'In a server render, it works only in a page `@k8ordo/framework` renders. During hydration, it also works under `<Router>`. Elsewhere it throws an error starting with `usePathname needs <Router> above it`.',
  }),
  message({
    ja: '`<BrowserPathname>`の下では、サーバーの描画でパスを返さずにブラウザを待ちます。',
    en: 'Below `<BrowserPathname>`, a server render returns no path and waits for the browser.',
  }),
] as const;

export const matchHookSummary = message({
  ja: '今のパスがパターンに合うかを調べます。',
  en: 'Checks whether the current path fits a pattern.',
});

export const matchHookPattern = message({
  ja: '表のパターンか、その後ろに`/*`を付けたもの。`/*`はそのパターンより下のパスに合います。',
  en: 'A pattern from the table, or one followed by `/*`. `/*` fits the paths below that pattern.',
});

export const matchHookOptions = message({
  ja: '`inclusive`を`true`にすると、`/*`のパターンがそのパターン自身のページにも合います。',
  en: 'With `inclusive` set to `true`, a `/*` pattern also fits its own page.',
});

export const matchHookReturns = message({
  ja: '合えばそのparam、合わなければ`null`。',
  en: 'The params when it fits, or `null`.',
});

export const matchHookCaveats = [
  message({
    ja: '`usePathname`の上に作られていて、パスが変わったときだけ再描画します。',
    en: 'Built on `usePathname`, it re-renders only when the path changes.',
  }),
  message({
    ja: 'ルート表を使わないので、`@k8ordo/framework`のページでも使えます。',
    en: 'It needs no route table, so it also works in pages under `@k8ordo/framework`.',
  }),
] as const;

export const matchPathSummary = message({
  ja: '`useMatch`と同じ判定を、渡したパスに対して行います。',
  en: 'Makes the same check as `useMatch`, against the path you pass.',
});

export const matchPathPathname = message({
  ja: '調べるパス。比べる前に末尾のスラッシュを落とします。',
  en: 'The path to check. A trailing slash is dropped before comparing.',
});

export const pendingHookSummary = message({
  ja: '読み込み中のページのパスを返します。',
  en: 'Returns the path of the page being loaded.',
});

export const pendingHookReturns = message({
  ja: '読み込み中のページのパス。何も読み込んでいなければ`null`。',
  en: 'The path of the page being loaded, or `null` when none is.',
});

export const pendingHookCaveats = [
  message({
    ja: 'ナビゲーションが始まった時点で値が入ります。新しいページが表示されると`null`に戻ります。中断や読み込みの失敗でも`null`に戻ります。',
    en: 'It is set as a navigation starts. It goes back to `null` once the new page is on screen. An abandoned navigation or a failed load also resets it.',
  }),
  message({
    ja: 'クエリだけを変えるナビゲーションでは、ページを読み込み直さない限り値が入りません。',
    en: 'A navigation that changes only the query sets nothing, unless the page loads again for it.',
  }),
  message({
    ja: 'サーバーの描画では`null`です。',
    en: 'It is `null` in a server render.',
  }),
] as const;

export const paramsHookSummary = message({
  ja: 'ページのparamを、パターンから決まる型で読みます。',
  en: 'Reads a page’s params, typed by its pattern.',
});

export const paramsHookPattern = message({
  ja: 'このコンポーネントが描画されるページのパターン。',
  en: 'The pattern of the page this component is rendered under.',
});

export const paramsHookReturns = message({
  ja: 'パターンから型の決まったparam。値はすべて文字列です。',
  en: 'The params, typed by the pattern. Every value is a string.',
});

export const paramsHookCaveats = [
  message({
    ja: '別のパターンのページの中で描画すると、`useParams("/a") rendered under "/b"`の形のエラーになります。',
    en: 'Rendered under another pattern, it throws an error of the form `useParams("/a") rendered under "/b"`.',
  }),
  message({
    ja: '`<Router>`の下でだけ使えます。`@k8ordo/framework`のページでは使えません。',
    en: 'It works only under `<Router>`, not in pages under `@k8ordo/framework`.',
  }),
] as const;

export const routeHookSummary = message({
  ja: '今選ばれているパターンとparamを、型の無い形で返します。',
  en: 'Returns the pattern that matched and its params, untyped.',
});

export const routeHookReturns = message({
  ja: '選ばれたパターンと、そのparam。',
  en: 'The matched pattern and its params.',
});

export const routeHookCaveats = [
  message({
    ja: '`<Router>`の外や、合ったページが無いところでは`useRoute must render inside a matched <Router>`というエラーになります。',
    en: 'Outside `<Router>`, or where no page matched, it throws `useRoute must render inside a matched <Router>`.',
  }),
] as const;

export const normalizeSummary = message({
  ja: 'ルーターと同じ規則でパスを整えます。末尾のスラッシュを落とし、`/`だけは残します。',
  en: 'Normalizes a path by the router’s own rule. A trailing slash is dropped, and `/` alone is kept.',
});

export const normalizePathname = message({
  ja: '整えるパス。',
  en: 'The path to normalize.',
});

export const normalizeCaveats = [
  message({
    ja: '落とすのは末尾のスラッシュだけです。途中のスラッシュの重なりやパーセントエンコードには触れません。',
    en: 'Only the trailing slash is dropped. Repeated slashes inside the path and percent-encoding are left as they are.',
  }),
] as const;

export const withBaseSummary = message({
  ja: '`base`を含まないパスの先頭に、Viteの`base`を付けます。パスはルート表と同じ書き方です。',
  en: 'Prepends Vite’s `base` to a path without it, as the route table writes paths.',
});

export const withBasePathname = message({
  ja: '`base`を含まないパス。',
  en: 'A path without `base`.',
});

export const withBaseBase = message({
  ja: 'Viteの`base`。省くと`import.meta.env.BASE_URL`を読みます。Viteを通らないコードでは渡します。',
  en: 'Vite’s `base`. Left out, it is read from `import.meta.env.BASE_URL`. Pass it from code that Vite does not process.',
});

export const withBaseReturns = message({
  ja: '`base`の付いたパス。',
  en: 'The path with `base` prepended.',
});

export const withoutBaseSummary = message({
  ja: 'URLのパスから、Viteの`base`を外します。',
  en: 'Removes Vite’s `base` from a URL’s path.',
});

export const withoutBasePathname = message({
  ja: 'URLのパス。',
  en: 'A URL’s path.',
});

export const withoutBaseReturns = message({
  ja: '`base`を外したパス。`base`の外のパスには`null`。',
  en: 'The path without `base`, or `null` for a path outside it.',
});

export const baseCaveats = [
  message({
    ja: '`./`のような相対の`base`では、何も付け外ししません。',
    en: 'A relative `base` such as `./` adds and removes nothing.',
  }),
] as const;

export const notFoundSummary = message({
  ja: '`@k8ordo/framework`のページから、そのパスにページが無いことを伝えます。',
  en: 'Signals from a page under `@k8ordo/framework` that nothing exists at its path.',
});

export const notFoundCaveats = [
  message({
    ja: 'エラーになるので、後ろの行は実行されません。',
    en: 'It throws, so nothing after it runs.',
  }),
  message({
    ja: '`@k8ordo/framework`では、いちばん近い`not-found.tsx`を404で返します。',
    en: 'Under `@k8ordo/framework`, the nearest `not-found.tsx` is served with a 404.',
  }),
  message({
    ja: '`<Router>`の下では、ほかのエラーと同じ扱いです。',
    en: 'Under `<Router>`, it is an error like any other.',
  }),
] as const;

export const isNotFoundSummary = message({
  ja: '値が`notFound()`のエラーかを調べます。',
  en: 'Checks whether a value is the error `notFound()` throws.',
});

export const isNotFoundValue = message({
  ja: '調べる値。',
  en: 'The value to check.',
});

export const isNotFoundCaveats = [
  message({
    ja: '`instanceof`でなく`Symbol.for`のシンボルで判定します。このパッケージが2つ読み込まれていても正しく判定できます。',
    en: 'It checks a `Symbol.for` symbol rather than `instanceof`, so it works even with two copies of this package loaded.',
  }),
] as const;

export const pathnameProviderSummary = message({
  ja: 'サーバーの描画とハイドレーションの間、`usePathname`が返すパスを渡します。',
  en: 'Supplies the path `usePathname` returns during a server render and hydration.',
});

export const pathnameProviderPathname = message({
  ja: 'この描画のパス。',
  en: 'The path this render is for.',
});

export const pathnameProviderCaveats = [
  message({
    ja: '`<Router>`と、`@k8ordo/framework`のランタイムが自分で置きます。アプリが書くのは、`useInterceptedNavigation`で自分のホストを作るときだけです。',
    en: '`<Router>` and the runtime of `@k8ordo/framework` provide it themselves. An app writes it only when it builds its own host on `useInterceptedNavigation`.',
  }),
] as const;

export const browserPathnameSummary = message({
  ja: 'サーバーの描画に、渡せるパスが無いことを伝えます。この下の`usePathname`と`useMatch`は、`use(browser())`でブラウザを待ちます。',
  en: 'Signals that a server render has no path to supply. Below it, `usePathname` and `useMatch` wait for the browser with `use(browser())`.',
});

export const browserPathnameCaveats = [
  message({
    ja: 'いちばん近い`<Suspense>`の中身は、ブラウザで描画されます。',
    en: 'The browser renders what is inside the nearest `<Suspense>`.',
  }),
  message({
    ja: '`@k8ordo/framework`のランタイムが、`fallback.tsx`のまわりに置きます。アプリが書くことはありません。',
    en: 'The runtime of `@k8ordo/framework` puts it around a `fallback.tsx`. An app never writes it.',
  }),
] as const;

export const generationSummary = message({
  ja: '新しいページが表示されたことを、ルート表の`error`に伝えるコンテキストです。',
  en: 'A context that tells the route table’s `error` components that a new page is on screen.',
});

export const generationValue = message({
  ja: '`useInterceptedNavigation`が返す`generation`。',
  en: 'The `generation` that `useInterceptedNavigation` returns.',
});

export const generationCaveats = [
  message({
    ja: '`<Router>`と、`@k8ordo/framework`のランタイムが自分で置きます。',
    en: '`<Router>` and the runtime of `@k8ordo/framework` provide it themselves.',
  }),
] as const;

export const interceptHookSummary = message({
  ja: '`<Router>`のナビゲーションの部分を、単独で使うためのフックです。処理すると決めたナビゲーションを読み込んで反映し、新しいページが表示されてから終えます。',
  en: 'The navigation part of `<Router>`, on its own. It loads and applies the navigations it decides to handle, and finishes each once the new page is on screen.',
});

export const interceptHookHandler = message({
  ja: 'ナビゲーションの処理を決める関数を持つオブジェクト。形は`NavigationHandler`です。',
  en: 'An object of functions that decide how navigations are handled. Its shape is `NavigationHandler`.',
});

export const interceptHookReturns = message({
  ja: '新しいページが表示されるたびに変わる`generation`。',
  en: 'A `generation` that changes each time a new page is put on screen.',
});

export const interceptHookCaveats = [
  message({
    ja: '`apply`で入れた値は、同じコンポーネントの中で`useDeferredValue`を通して描画してください。',
    en: 'Render what `apply` set through `useDeferredValue`, in the same component.',
  }),
  message({
    ja: '`handler`はイベントの時点で読むので、描画のたびに作り直してもかまいません。',
    en: '`handler` is read when the event fires, so a new object on every render is fine.',
  }),
] as const;

export const routesSummary = message({
  ja: '`defineRoutes`が返すルート表の型です。',
  en: 'The type of the route table `defineRoutes` returns.',
});

export const routesKind = message({
  ja: "常に`'routes'`。",
  en: "Always `'routes'`.",
});

export const routesRecord = message({
  ja: '`defineRoutes`に渡した表。',
  en: 'The table passed to `defineRoutes`.',
});

export const routesMatch = message({
  ja: 'パスを照合し、合った`Match`か`null`を返します。`accept`が`false`を返した結果は飛ばして、次のパターンへ進みます。',
  en: 'Matches a path and returns the `Match` or `null`. A result `accept` returns `false` for is skipped, and the next pattern is tried.',
});

export const routesRecordTypeSummary = message({
  ja: 'ルート表そのものの型です。キーは`/`で始まるパターン、値は`RouteNode`です。',
  en: 'The type of the table itself. Keys are patterns starting with `/`, and values are `RouteNode`s.',
});

export const routeNodeSummary = message({
  ja: 'ルート表の値の型です。ページのコンポーネントか、`children`を持つオブジェクトです。',
  en: 'The type of a value in the table: a page component, or an object with `children`.',
});

export const routeNodeLayout = message({
  ja: '下のページを包むレイアウト。',
  en: 'The layout wrapping the pages below.',
});

export const routeNodeError = message({
  ja: '下のページでエラーが起きたときに、ページの代わりに描画するコンポーネント。',
  en: 'The component rendered in place of the page below when that page throws.',
});

export const routeNodeLoading = message({
  ja: '下のページがサスペンドしている間に表示するコンポーネント。propsは受け取りません。',
  en: 'The component shown while a page below suspends. It receives no props.',
});

export const routeNodeChildren = message({
  ja: '下のページの表。キーは親のパターンに続けて読みます。',
  en: 'The table of pages below. Its keys continue the parent’s pattern.',
});

export const routeComponentSummary = message({
  ja: 'ページとレイアウトの型です。どんなpropsを宣言したコンポーネントでも入ります。',
  en: 'The type of a page or layout. A component declaring any props fits.',
});

export const routeComponentCaveats = [
  message({
    ja: '`<Router>`はpropsを渡さず、`@k8ordo/framework`は`params`などを渡します。どちらの表にも同じコンポーネントを書けます。',
    en: '`<Router>` passes no props, and `@k8ordo/framework` passes `params` and more. The same component fits either table.',
  }),
] as const;

export const matchTypeSummary = message({
  ja: '`match`が返す、照合の結果の型です。',
  en: 'The type of the result `match` returns.',
});

export const matchTypePattern = message({
  ja: '選ばれたパターン。表に書いた文字列のままです。',
  en: 'The matched pattern, exactly as written in the table.',
});

export const matchTypeParams = message({
  ja: 'デコードしたparamの値。',
  en: 'The decoded param values.',
});

export const matchTypeStack = message({
  ja: '描画するコンポーネントの並び。外側のレイアウトから順に、ページが最後です。',
  en: 'The components to render, outermost layout first and the page last.',
});

export const errorPropsSummary = message({
  ja: 'ルート表の`error`のコンポーネントが受け取るpropsの型です。',
  en: 'The props the route table’s `error` component receives.',
});

export const errorPropsError = message({
  ja: '下のページで起きたエラーの値。',
  en: 'The value thrown by the page below.',
});

export const errorPropsReset = message({
  ja: 'その場で下のページをもう一度描画します。',
  en: 'Renders the page below again, in place.',
});

export const errorComponentSummary = message({
  ja: 'ルート表の`error`に書くコンポーネントの型です。',
  en: 'The type of the component named by the route table’s `error`.',
});

export const navigateToOptionsSummary = message({
  ja: '`navigateTo`のオプションの型です。',
  en: 'The type of `navigateTo`’s options.',
});

export const navigateToOptionsHistory = message({
  ja: "`'push'`なら新しい履歴エントリを追加し、`'replace'`なら今のエントリを置き換えます。既定は`'push'`です。",
  en: "`'push'` adds a new history entry, and `'replace'` replaces the current one. The default is `'push'`.",
});

export const matchOptionsSummary = message({
  ja: '`useMatch`と`matchPath`のオプションの型です。',
  en: 'The type of the options `useMatch` and `matchPath` take.',
});

export const matchOptionsInclusive = message({
  ja: '`/*`のパターンを、そのパターン自身のページにも合わせます。`/*`で終わらないパターンには影響しません。',
  en: 'Lets a `/*` pattern fit its own page too. It changes nothing for a pattern not ending in `/*`.',
});

export const matchablePatternSummary = message({
  ja: '`useMatch`と`matchPath`が受け取るパターンの型です。表のパターンか、リンク先にできるパターンの後ろに`/*`を付けたものを受け付けます。',
  en: 'The type of the patterns `useMatch` and `matchPath` take: a pattern from the table, or a linkable pattern followed by `/*`.',
});

export const boundParamsSummary = message({
  ja: '`bindParams`に渡す関数が返す値の型です。URLでの表し方が1通りに決まる値を、paramの名前ごとに持ちます。',
  en: 'The type of what the function given to `bindParams` returns: values with exactly one URL spelling, by param name.',
});

export const boundLinksSummary = message({
  ja: '`bindParams`が返すオブジェクトの型です。',
  en: 'The type of the object `bindParams` returns.',
});

export const boundLinksHref = message({
  ja: '`source`のparamを補う`href`。',
  en: 'An `href` that fills in the params from `source`.',
});

export const boundLinksNavigateTo = message({
  ja: '`source`のparamを補う`navigateTo`。',
  en: 'A `navigateTo` that fills in the params from `source`.',
});

export const navigationHandlerSummary = message({
  ja: '`useInterceptedNavigation`に渡すオブジェクトの型です。',
  en: 'The type of the object `useInterceptedNavigation` takes.',
});

export const handlerClaim = message({
  ja: 'このナビゲーションを処理するかどうか。イベントの間に同期的に答えます。',
  en: 'Whether to handle this navigation, answered synchronously during the event.',
});

export const handlerLoad = message({
  ja: 'そのURLで描画するものを作ります。追い越されると`signal`が中断されます。',
  en: 'Produces what to render for the URL. `signal` aborts when the navigation is overtaken.',
});

export const handlerApply = message({
  ja: '作ったものを、トランジションの外でふつうの更新として反映します。',
  en: 'Applies what was loaded, as an ordinary update outside any transition.',
});

export const handlerRefresh = message({
  ja: 'パスが変わらないナビゲーションでも読み込み直すかどうか。省くと読み込み直しません。',
  en: 'Whether a navigation that keeps the path should still load. Left out, it never does.',
});

export const registerSummary = message({
  ja: 'ルート表を型に登録するためのインターフェースです。`declare module`で`routes`を足すと、パターンを表と照らし合わせます。',
  en: 'The interface a route table is registered on. Add `routes` with `declare module`, and patterns are checked against the table.',
});

export const registerCaveats = [
  message({
    ja: '登録はアプリの中で1度だけ行います。',
    en: 'Register once, in the app.',
  }),
  message({
    ja: '`@k8ordo/framework`では`.k8ordo/register.gen.ts`に生成されます。',
    en: 'Under `@k8ordo/framework` it is generated into `.k8ordo/register.gen.ts`.',
  }),
] as const;

export const registeredPatternSummary = message({
  ja: '登録した表のすべてのページのパターンです。`/*`のパターンも含みます。登録の前は、`/`で始まる任意の文字列です。',
  en: 'The pattern of every page in the registered table, `/*` patterns included. Before registering, any string starting with `/`.',
});

export const registeredNavigablePatternSummary = message({
  ja: '登録した表のうち、リンク先にできるパターンです。`/*`を含むものを除きます。登録の前は、`/`で始まる任意の文字列です。',
  en: 'The patterns in the registered table a link can point at, which excludes those with `/*`. Before registering, any string starting with `/`.',
});

export const registeredParamsSummary = message({
  ja: 'パターン`P`へのリンクが受け取るparamの型です。スキーマが型を決めたparamはその型で、ほかは`ParamValue`か文字列です。',
  en: 'The params a link to pattern `P` takes. A param a schema typed takes that type, and the others take a `ParamValue` or a string.',
});

export const registeredPageParamsSummary = message({
  ja: 'パターン`P`のページが受け取るparamの型です。スキーマを通したparamはその出力で、ほかは文字列です。',
  en: 'The params the page at pattern `P` receives. A param a schema ran on is that schema’s output, and the others are strings.',
});

export const pagePropsSummary = message({
  ja: '`@k8ordo/framework`のページが受け取るpropsの型です。型引数には、ページのディレクトリが表すパターンを渡します。',
  en: 'The props a page under `@k8ordo/framework` receives. The type argument is the pattern the page’s directory stands for.',
});

export const pagePropsParams = message({
  ja: 'スキーマが決めた型のparam。',
  en: 'The params, typed by the schemas.',
});

export const pagePropsPathname = message({
  ja: 'この描画のパス。',
  en: 'The path this render is for.',
});

export const pagePropsRequest = message({
  ja: 'リクエスト。serverモードでだけ加わります。',
  en: 'The request. Only in server mode.',
});

export const pagePropsSearch = message({
  ja: '`search`をexportしたページが読んだ値。そのページにだけ加わります。',
  en: 'The value a page that exports `search` read. Only on such a page.',
});

export const layoutPropsSummary = message({
  ja: '`@k8ordo/framework`のレイアウトが受け取るpropsの型です。型引数には、ページのあるパターンだけを渡せます。',
  en: 'The props a layout under `@k8ordo/framework` receives. The type argument must be a pattern the table has a page at.',
});

export const layoutPropsParams = message({
  ja: 'param。スキーマを書いていても、型は文字列です。',
  en: 'The params, typed as strings even when a schema is declared.',
});

export const layoutPropsChildren = message({
  ja: 'レイアウトが包むページ。',
  en: 'The page the layout wraps.',
});

export const routeContextSummary = message({
  ja: '`@k8ordo/framework`の`route.ts`がexportする関数の引数の型です。',
  en: 'The type of the argument a function exported from a `route.ts` under `@k8ordo/framework` receives.',
});

export const routeContextRequest = message({
  ja: '受け取ったリクエスト。',
  en: 'The incoming request.',
});

export const routeContextParams = message({
  ja: 'ページと同じく、スキーマが決めた型のparam。',
  en: 'The params, typed by the schemas as a page’s are.',
});

export const patternOfSummary = message({
  ja: '表`R`のすべてのページのパターンです。表に書いた文字列のままで、`/*`のパターンも含みます。',
  en: 'Every page pattern in table `R`, exactly as written, `/*` patterns included.',
});

export const navigablePatternOfSummary = message({
  ja: '表`R`のうち、リンク先にできるパターンです。`/*`を含むものを除きます。',
  en: 'The patterns in table `R` a link can point at, which excludes those with `/*`.',
});

export const navigablePathSummary = message({
  ja: 'パス`Path`を、表のリンク先にできるパターンと区間ごとに比べます。どれかに合えば`Path`、合わなければ`never`です。',
  en: 'Compares `Path` segment by segment with the table’s linkable patterns. It is `Path` when one fits, and `never` when none does.',
});

export const navigablePathCaveats = [
  message({
    ja: '`:param`の位置には、空でない区間が1つ入ります。',
    en: 'Where a pattern has a `:param`, any one non-empty segment fits.',
  }),
  message({
    ja: '末尾にスラッシュのあるパスは`never`です。',
    en: 'A path with a trailing slash is `never`.',
  }),
] as const;

export const paramsOfSummary = message({
  ja: 'パターンの文字列から作るparamの型です。値はすべて`string`です。',
  en: 'The params derived from a pattern string. Every value is a `string`.',
});

export const pathForSummary = message({
  ja: 'パターンに合うパスの型です。`:param`の位置は任意の文字列になります。',
  en: 'The type of a path that fits the pattern, with any string where each `:param` is.',
});

export const paramValueSummary = message({
  ja: 'URLでの表し方が1通りに決まる値の型です。リンクのparamに渡せます。',
  en: 'The values with exactly one URL spelling. A link’s params take them.',
});

export const standardSchemaLikeSummary = message({
  ja: 'Standard Schemaの形の型です。zodやzod/miniなど、Standard Schemaを実装したライブラリのスキーマが当てはまります。',
  en: 'The Standard Schema shape. A schema from any library implementing it fits, zod and zod/mini included.',
});

export const schemaOutputSummary = message({
  ja: 'スキーマが作る値の型です。',
  en: 'The type of the value a schema produces.',
});

export const paramsSchemaForSummary = message({
  ja: 'パターン`P`の`paramsSchema`として書けるスキーマの型です。出力のキーは、パターンのparamの一部です。',
  en: 'A schema that can be pattern `P`’s `paramsSchema`. Its output’s keys are some of the pattern’s params.',
});

export const parsedParamsSummary = message({
  ja: 'パターンのparamに、スキーマの並びの出力を重ねた型です。並びは外側のレイアウトから順に、ページが最後です。スキーマが扱わないparamは文字列のままです。',
  en: 'A pattern’s params with the output of a list of schemas applied on top. The list runs outermost layout first and the page last. A param no schema covers stays a string.',
});

export const parsedParamsMapSummary = message({
  ja: 'パターンごとのスキーマの並びを、パターンごとの`ParsedParams`にした型です。生成される`Register`の`params`に使います。',
  en: 'Turns each pattern’s list of schemas into its `ParsedParams`. The generated `Register`’s `params` is one.',
});

export const generatedTypesNote = message({
  ja: 'スキーマにかかわる型は、主に生成されるコードが使います。アプリが自分で書く型は`PageProps`と`LayoutProps`で足ります。',
  en: 'The schema types are mostly used by generated code. For the types an app writes by hand, `PageProps` and `LayoutProps` are enough.',
});
