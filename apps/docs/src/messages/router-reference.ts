import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/router`が書き出す関数とコンポーネント、型の一覧です。使う場面の近いものを隣に並べ、型は最後にまとめています。',
  en: 'Every function, component and type `@k8ordo/router` exports. Things used together sit side by side, and the types come last.',
});

export const defineRoutesSummary = message({
  ja: 'ルート表を作ります。キーがパスのパターンで、値はページのコンポーネントか、ページをまとめるオブジェクトです。',
  en: 'Creates the route table. Each key is a path pattern, and each value is a page component or an object grouping pages.',
});

export const defineRoutesRecord = message({
  ja: 'ルート表そのもの。キーは`/`で始まるパターンです。',
  en: 'The table itself. Every key is a pattern starting with `/`.',
});

export const defineRoutesReturns = message({
  ja: '渡した表と、パスを照合する`match`を持つオブジェクト。',
  en: 'An object holding the table as passed and `match`, which matches a path against it.',
});

export const defineRoutesCaveats = [
  message({
    ja: '表は呼んだ時点で検査され、書き方の誤りは`TypeError`になります。',
    en: 'The table is checked when this runs, and a mistake in it is a `TypeError`.',
  }),
  message({
    ja: '照合は書いた順に行い、最初に合ったパターンを選びます。',
    en: 'Patterns are tried in the order written, and the first that fits wins.',
  }),
] as const;

export const routerSummary = message({
  ja: 'ルート表をブラウザのナビゲーションにつなぎ、いまのパスに合ったページを描きます。ブラウザの中で描くアプリの根に、1度だけ置きます。',
  en: 'Connects the route table to the browser’s navigation and renders the page that fits the current path. Put it once, at the root of an app that renders in the browser.',
});

export const routerRoutes = message({
  ja: '`defineRoutes`が返したルート表。',
  en: 'The route table `defineRoutes` returned.',
});

export const routerCaveats = [
  message({
    ja: 'ルート表が答えるパスへのナビゲーションだけを引き受け、それ以外はブラウザに任せます。',
    en: 'It takes only navigations to paths the table answers, and leaves the rest to the browser.',
  }),
  message({
    ja: '表に無いパスで開かれたときは、何も描きません。',
    en: 'Opened at a path the table lacks, it renders nothing.',
  }),
  message({
    ja: 'マウントした時点でブラウザのURLを読むので、サーバーでは描けません。',
    en: 'It reads the browser’s URL when it mounts, so it cannot render on a server.',
  }),
] as const;

export const outletSummary = message({
  ja: 'レイアウトの中で、そのレイアウトが包むページを描く位置を決めます。',
  en: 'Marks where, inside a layout, the page it wraps renders.',
});

export const outletCaveats = [
  message({
    ja: '`<Router>`の外で描くと例外を投げます。フレームワークの下では、レイアウトは`children`を描きます。',
    en: 'Rendered outside `<Router>`, it throws. Under the framework, a layout renders `children` instead.',
  }),
] as const;

export const hrefSummary = message({
  ja: 'パターンとparamから、リンク先のURLを作ります。',
  en: 'Builds the URL a link points at from a pattern and its params.',
});

export const hrefPattern = message({
  ja: 'リンク先のパターン。`Register`に登録していれば、表にあるリンク先にできるパターンに限られます。',
  en: 'The pattern to link to. With `Register` augmented, only the table’s linkable patterns are accepted.',
});

export const hrefParams = message({
  ja: 'パターンのparamの値。paramの無いパターンでは渡しません。',
  en: 'The values of the pattern’s params. Left out for a pattern without params.',
});

export const hrefReturns = message({
  ja: '`<a>`の`href`属性に渡すURL。サブパスの下で配信しているときは、その分も前に付きます。',
  en: 'A URL for an `<a>`’s `href` attribute, with the base path in front when the app is served below one.',
});

export const hrefCaveats = [
  message({
    ja: '値は`encodeURIComponent`で符号化されます。',
    en: 'Values are encoded with `encodeURIComponent`.',
  }),
  message({
    ja: '`/*`を含むパターンや値の無いparam、URLでの書き方が無い値は、実行時に`TypeError`になります。',
    en: 'A pattern with `/*`, a param without a value, or a value with no URL spelling is a `TypeError` at run time.',
  }),
] as const;

export const navigateToSummary = message({
  ja: 'パターンとparamからURLを作り、そのページへ移ります。',
  en: 'Builds a URL from a pattern and its params, and goes there.',
});

export const navigateToOptions = message({
  ja: 'ナビゲーションのオプション。paramの無いパターンでは2つ目の引数になります。',
  en: 'Options for the navigation; the second argument for a pattern without params.',
});

export const navigateToReturns = message({
  ja: 'ブラウザの`navigation.navigate()`が返す`{ committed, finished }`。`finished`は、新しいページが画面に出たときに解決します。',
  en: 'The `{ committed, finished }` that the browser’s `navigation.navigate()` returns. `finished` resolves once the new page is on screen.',
});

export const navigateToCaveats = [
  message({
    ja: '既定では、履歴に新しいエントリを積みます。',
    en: 'By default, it pushes a new history entry.',
  }),
  message({
    ja: '別のナビゲーションに追い越されると、`finished`は`AbortError`でrejectします。',
    en: 'Overtaken by another navigation, `finished` rejects with an `AbortError`.',
  }),
] as const;

export const bindParamsSummary = message({
  ja: 'いくつかのparamを関数から補う、`href`と`navigateTo`を作ります。ロケールのように、すべてのリンクに共通のparamに使います。',
  en: 'Creates an `href` and a `navigateTo` that take some params from a function, for a param every link shares, such as a locale.',
});

export const bindParamsSource = message({
  ja: '束ねるparamを返す関数。`href`や`navigateTo`が呼ばれるたびに呼ばれます。',
  en: 'A function returning the params to bind, called every time `href` or `navigateTo` is.',
});

export const bindParamsReturns = message({
  ja: '`source`の値を補う`href`と`navigateTo`。',
  en: 'An `href` and a `navigateTo` that fill in what `source` returns.',
});

export const bindParamsCaveats = [
  message({
    ja: '束ねたparamは省けますが、渡せば上書きできます。',
    en: 'A bound param may be left out, or passed to override it.',
  }),
  message({
    ja: 'パターンにparamがあれば、オプションはいつも3つ目の引数です。すべてを束ねたときは、2つ目に`undefined`を渡します。',
    en: 'When the pattern names a param, the options are always the third argument; with every param bound, pass `undefined` second.',
  }),
] as const;

export const pathnameHookSummary = message({
  ja: 'ブラウザがいま開いているパスを返します。',
  en: 'Returns the path the browser is on.',
});

export const pathnameHookReturns = message({
  ja: 'いまのパス。サブパスと末尾のスラッシュを外した形です。',
  en: 'The current path, without the base path or a trailing slash.',
});

export const pathnameHookCaveats = [
  message({
    ja: 'パスが変わったときだけ再描画され、クエリ文字列が変わっても再描画されません。',
    en: 'It re-renders when the path changes, and never when only the query string does.',
  }),
  message({
    ja: 'URLが書き換わった時点で変わり、新しいページが画面に出るのは待ちません。',
    en: 'It changes as soon as the URL does, without waiting for the new page to be on screen.',
  }),
  message({
    ja: 'サーバーでの描画とハイドレーションでは、`<Router>`かフレームワークが描くページの中でなければ例外を投げます。',
    en: 'During a server render or hydration, it throws unless it is under `<Router>` or in a page the framework renders.',
  }),
] as const;

export const matchHookSummary = message({
  ja: 'いまのパスがパターンに合うかを調べます。',
  en: 'Checks whether the current path fits a pattern.',
});

export const matchHookPattern = message({
  ja: '表のパターンか、その後ろに`/*`を付けたもの。`/*`は「そのパターンより下のどこか」を表します。',
  en: 'A pattern from the table, or one followed by `/*`, which means “anywhere below it”.',
});

export const matchHookOptions = message({
  ja: '`inclusive`を`true`にすると、`/*`のパターンがそのパターン自身のページにも合います。',
  en: 'With `inclusive` set to `true`, a `/*` pattern also fits its own page.',
});

export const matchHookReturns = message({
  ja: '合えばそのparams、合わなければ`null`。',
  en: 'The params when it fits, or `null`.',
});

export const matchHookCaveats = [
  message({
    ja: '`usePathname`の上に作られていて、パスが変わったときだけ再描画されます。',
    en: 'Built on `usePathname`, it re-renders only when the path changes.',
  }),
  message({
    ja: 'ルート表を使わないので、フレームワークの下でも使えます。',
    en: 'It needs no route table, so it works under the framework.',
  }),
] as const;

export const matchPathSummary = message({
  ja: '`useMatch`と同じ判定を、渡したパスに対して行います。',
  en: 'Makes the same check as `useMatch`, against the path you pass.',
});

export const matchPathPathname = message({
  ja: '調べるパス。比べる前に末尾のスラッシュを落とします。',
  en: 'The path to check; a trailing slash is dropped before comparing.',
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
    ja: 'ナビゲーションが始まった時点で値が入り、新しいページが画面に出たとき、中断されたとき、読み込みに失敗したときに`null`に戻ります。',
    en: 'It is set as a navigation starts, and goes back to `null` once the new page is on screen, or when the navigation is abandoned or its load fails.',
  }),
  message({
    ja: 'クエリ文字列だけを変える状態の更新では、値が入りません。',
    en: 'An update that changes only the query string sets nothing.',
  }),
  message({
    ja: 'サーバーでの描画では`null`です。',
    en: 'It is `null` in a server render.',
  }),
] as const;

export const paramsHookSummary = message({
  ja: 'ページのparamを、パターンから決まる型で読みます。',
  en: 'Reads a page’s params, typed by its pattern.',
});

export const paramsHookPattern = message({
  ja: 'このコンポーネントが描かれるページのパターン。',
  en: 'The pattern of the page this component renders as.',
});

export const paramsHookReturns = message({
  ja: 'パターンから型の決まったparams。値はいつも文字列です。',
  en: 'The params, typed by the pattern. Every value is a string.',
});

export const paramsHookCaveats = [
  message({
    ja: '別のパターンのページの中で描かれると、例外を投げます。',
    en: 'Rendered under another pattern, it throws.',
  }),
  message({
    ja: '`<Router>`の下でだけ使えます。フレームワークの下では使えません。',
    en: 'It works only under `<Router>`, not under the framework.',
  }),
] as const;

export const routeHookSummary = message({
  ja: 'いま選ばれているパターンとparamsを、型の無い形で返します。',
  en: 'Returns the pattern that won and its params, untyped.',
});

export const routeHookReturns = message({
  ja: '選ばれたパターンと、そのparams。',
  en: 'The winning pattern and its params.',
});

export const routeHookCaveats = [
  message({
    ja: '`<Router>`の外や、合ったページが無いところでは例外を投げます。',
    en: 'It throws outside `<Router>`, or where no page matched.',
  }),
] as const;

export const normalizeSummary = message({
  ja: 'ルーターと同じ規則でパスを整えます。末尾のスラッシュを落とし、`/`だけは残します。',
  en: 'Tidies a path by the router’s own rule: trailing slashes are dropped, and `/` alone is kept.',
});

export const normalizePathname = message({
  ja: '整えるパス。',
  en: 'The path to tidy.',
});

export const normalizeCaveats = [
  message({
    ja: '落とすのは末尾のスラッシュだけです。途中のスラッシュの重なりや、パーセントエンコードには触れません。',
    en: 'Only trailing slashes go: repeated slashes inside the path and percent-encoding are left alone.',
  }),
] as const;

export const withBaseSummary = message({
  ja: '表のパスの前に、アプリを配信しているサブパスを付けます。',
  en: 'Puts the base path the app is served under in front of a path in the table’s terms.',
});

export const withBasePathname = message({
  ja: '表の書き方のパス。',
  en: 'A path in the table’s terms.',
});

export const withBaseBase = message({
  ja: 'サブパス。省くと`import.meta.env.BASE_URL`を読みます。Viteを通らないコードでは渡します。',
  en: 'The base path. Left out, it is read from `import.meta.env.BASE_URL`; code Vite does not process passes it.',
});

export const withBaseReturns = message({
  ja: 'サブパスの付いたパス。',
  en: 'The path with the base path in front.',
});

export const withoutBaseSummary = message({
  ja: 'URLのパスから、アプリを配信しているサブパスを外します。',
  en: 'Takes the base path the app is served under off a URL’s path.',
});

export const withoutBasePathname = message({
  ja: 'URLのパス。',
  en: 'A URL’s path.',
});

export const withoutBaseReturns = message({
  ja: 'サブパスを外したパス。サブパスの外のパスには`null`。',
  en: 'The path without the base path, or `null` for a path outside it.',
});

export const baseCaveats = [
  message({
    ja: '`./`のような相対のサブパスでは、何も付け外ししません。',
    en: 'A relative base such as `./` adds and removes nothing.',
  }),
] as const;

export const notFoundSummary = message({
  ja: 'フレームワークのページから、そのパスにページが無いことを伝えます。',
  en: 'Says, from a framework page, that its path has no page after all.',
});

export const notFoundCaveats = [
  message({
    ja: '例外を投げるので、後ろの行は走りません。',
    en: 'It throws, so nothing after it runs.',
  }),
  message({
    ja: '`@k8ordo/framework`では、いちばん近い`not-found.tsx`が404で答えます。',
    en: 'Under `@k8ordo/framework`, the nearest `not-found.tsx` answers under a 404.',
  }),
  message({
    ja: '`<Router>`の下では、ほかの例外と同じ扱いです。',
    en: 'Under `<Router>`, it is an error like any other.',
  }),
] as const;

export const isNotFoundSummary = message({
  ja: '投げられた値が、`notFound()`の投げたものかを調べます。',
  en: 'Checks whether a thrown value is what `notFound()` throws.',
});

export const isNotFoundValue = message({
  ja: '調べる値。',
  en: 'The value to check.',
});

export const isNotFoundCaveats = [
  message({
    ja: 'クラスではなく`Symbol.for`の印で見分けるので、このパッケージが2つ読み込まれていても判定できます。',
    en: 'It looks for a `Symbol.for` brand rather than a class, so it works even with two copies of this package loaded.',
  }),
] as const;

export const pathnameProviderSummary = message({
  ja: 'サーバーでの描画とハイドレーションの間に、`usePathname`が返すパスを渡します。',
  en: 'Gives `usePathname` its path during a server render and hydration.',
});

export const pathnameProviderPathname = message({
  ja: 'この描画のパス。',
  en: 'The path this render is for.',
});

export const pathnameProviderCaveats = [
  message({
    ja: '`<Router>`とフレームワークのランタイムが自分で置きます。アプリが書くのは、`useInterceptedNavigation`で自分の仕組みを作るときだけです。',
    en: '`<Router>` and the framework’s runtime provide it themselves. An app writes it only when it builds its own host on `useInterceptedNavigation`.',
  }),
] as const;

export const generationSummary = message({
  ja: '新しいページが画面に出たことを、ルート表の`error`に伝えるコンテキストです。',
  en: 'A context that tells the route table’s `error` a new page is on screen.',
});

export const generationValue = message({
  ja: '`useInterceptedNavigation`が返す`generation`。',
  en: 'The `generation` `useInterceptedNavigation` returns.',
});

export const generationCaveats = [
  message({
    ja: '`<Router>`とフレームワークのランタイムが自分で置きます。',
    en: '`<Router>` and the framework’s runtime provide it themselves.',
  }),
] as const;

export const interceptHookSummary = message({
  ja: '`<Router>`のナビゲーションの部分を、単独で使うためのフックです。引き受けたナビゲーションを読み込んで反映し、新しいページが画面に出てから終えます。',
  en: 'The navigation half of `<Router>`, on its own: it loads and applies the navigations it takes, and finishes each once the new page is on screen.',
});

export const interceptHookHandler = message({
  ja: '引き受けるかどうか、何を読み込むか、どう反映するかを決める関数の組。',
  en: 'The functions that decide whether to take a navigation, what to load, and how to apply it.',
});

export const interceptHookReturns = message({
  ja: '新しいページが画面に出るたびに変わる`generation`。',
  en: '`generation`, which changes each time a new page is on screen.',
});

export const interceptHookCaveats = [
  message({
    ja: '`apply`で入れた値は、同じコンポーネントの中で`useDeferredValue`を通して描きます。',
    en: 'Render what `apply` set through `useDeferredValue`, in the same component.',
  }),
  message({
    ja: '`handler`はイベントの時点で読むので、描画のたびに作り直してもかまいません。',
    en: '`handler` is read at event time, so a new object on every render is fine.',
  }),
] as const;

export const routesSummary = message({
  ja: '`defineRoutes`が返すルート表の型です。',
  en: 'The type of the route table `defineRoutes` returns.',
});

export const routesKind = message({
  ja: 'いつも`routes`。',
  en: 'Always `routes`.',
});

export const routesRecord = message({
  ja: '`defineRoutes`に渡した表。',
  en: 'The table passed to `defineRoutes`.',
});

export const routesMatch = message({
  ja: 'パスを照合し、合った`Match`か`null`を返します。`accept`が`false`を返すと、その結果を見送って次のパターンへ進みます。',
  en: 'Matches a path, returning the `Match` or `null`. When `accept` returns `false`, that result is passed over and the walk goes on to the next pattern.',
});

export const routesRecordTypeSummary = message({
  ja: 'ルート表そのものの型です。キーは`/`で始まるパターン、値は`RouteNode`です。',
  en: 'The type of a table: keys are patterns starting with `/`, values are `RouteNode`s.',
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
  ja: '下のページが例外を投げたときに、ページの代わりに描くコンポーネント。',
  en: 'What renders in place of a page below that throws.',
});

export const routeNodeLoading = message({
  ja: '下のページがサスペンドしている間に出すコンポーネント。propsは受け取りません。',
  en: 'What shows while a page below suspends. It receives no props.',
});

export const routeNodeChildren = message({
  ja: '下のページの表。キーは親のパターンに続けて読みます。',
  en: 'The table of pages below; its keys continue the parent’s pattern.',
});

export const routeComponentSummary = message({
  ja: 'ページとレイアウトの型です。どんなpropsを宣言したコンポーネントでも入ります。',
  en: 'The type of a page or layout: a component declaring any props.',
});

export const routeComponentCaveats = [
  message({
    ja: '`<Router>`はpropsを渡さず、フレームワークは`params`などを渡します。同じ表をどちらでも描けるように、`ComponentType<never>`にしています。',
    en: '`<Router>` passes no props and the framework passes `params` and more, so it is `ComponentType<never>` to let either render the same table.',
  }),
] as const;

export const matchTypeSummary = message({
  ja: '`match`が返す、照合の結果の型です。',
  en: 'The type of what `match` returns.',
});

export const matchTypePattern = message({
  ja: '選ばれたパターン。表に書いたとおりの綴りです。',
  en: 'The winning pattern, spelled as in the table.',
});

export const matchTypeParams = message({
  ja: 'デコードしたparamの値。',
  en: 'The decoded param values.',
});

export const matchTypeStack = message({
  ja: '描くコンポーネントの並び。外側のレイアウトから順に、ページが最後です。',
  en: 'The components to render, outermost layout first and the page last.',
});

export const errorPropsSummary = message({
  ja: 'ルート表の`error`のコンポーネントが受け取るpropsの型です。',
  en: 'The props the route table’s `error` component receives.',
});

export const errorPropsError = message({
  ja: '投げられた値。',
  en: 'What was thrown.',
});

export const errorPropsReset = message({
  ja: 'その場で下のページをもう一度描きます。',
  en: 'Renders the page below again, in place.',
});

export const errorComponentSummary = message({
  ja: 'ルート表の`error`に書くコンポーネントの型です。',
  en: 'The type of the component the route table’s `error` names.',
});

export const navigateToOptionsSummary = message({
  ja: '`navigateTo`のオプションの型です。',
  en: 'The type of `navigateTo`’s options.',
});

export const navigateToOptionsHistory = message({
  ja: "`'push'`なら新しいエントリを積み、`'replace'`ならいまのエントリを置き換えます。既定は`'push'`です。",
  en: "`'push'` adds a new entry and `'replace'` replaces the current one. The default is `'push'`.",
});

export const matchOptionsSummary = message({
  ja: '`useMatch`と`matchPath`のオプションの型です。',
  en: 'The type of `useMatch`’s and `matchPath`’s options.',
});

export const matchOptionsInclusive = message({
  ja: '`/*`のパターンを、そのパターン自身のページにも合わせます。`/*`で終わらないパターンには影響しません。',
  en: 'Lets a `/*` pattern fit its own page too. It changes nothing for a pattern not ending in `/*`.',
});

export const matchablePatternSummary = message({
  ja: '`useMatch`と`matchPath`が受け取るパターンの型です。表のパターンか、リンク先にできるパターンの後ろに`/*`を付けたものです。',
  en: 'The patterns `useMatch` and `matchPath` take: one from the table, or a linkable pattern followed by `/*`.',
});

export const boundParamsSummary = message({
  ja: '`bindParams`に渡す関数が返す値の型です。URLでの書き方が1通りに決まる値を、paramの名前ごとに持ちます。',
  en: 'What the function given to `bindParams` returns: values with one URL spelling, by param name.',
});

export const boundLinksSummary = message({
  ja: '`bindParams`が返すオブジェクトの型です。',
  en: 'The type of what `bindParams` returns.',
});

export const boundLinksHref = message({
  ja: '束ねたparamを補う`href`。',
  en: 'An `href` that fills in the bound params.',
});

export const boundLinksNavigateTo = message({
  ja: '束ねたparamを補う`navigateTo`。',
  en: 'A `navigateTo` that fills in the bound params.',
});

export const navigationHandlerSummary = message({
  ja: '`useInterceptedNavigation`に渡す関数の組の型です。',
  en: 'The type of the functions `useInterceptedNavigation` takes.',
});

export const handlerClaim = message({
  ja: 'このナビゲーションを引き受けるかどうか。イベントの間に同期的に答えます。',
  en: 'Whether to take this navigation, answered synchronously during the event.',
});

export const handlerLoad = message({
  ja: 'そのURLで描くものを作ります。追い越されると`signal`が中断されます。',
  en: 'Produces what to render for the URL. `signal` aborts when the navigation is overtaken.',
});

export const handlerApply = message({
  ja: '作ったものを、transitionの外でふつうの更新として反映します。',
  en: 'Applies it, as an ordinary update outside any transition.',
});

export const handlerRefresh = message({
  ja: 'パスが変わらないナビゲーションでも、読み込み直すかどうか。省くと読み込み直しません。',
  en: 'Whether a navigation that keeps the path should still load. Left out, it never does.',
});

export const registerSummary = message({
  ja: 'ルート表を型に登録するためのインターフェースです。`declare module`で`routes`を足すと、パターンが表と照らし合わされます。',
  en: 'The interface a route table is registered on. Add `routes` with `declare module`, and patterns are checked against the table.',
});

export const registerCaveats = [
  message({
    ja: '登録はアプリの中で1度だけ行います。',
    en: 'Register once, in the app.',
  }),
  message({
    ja: '`@k8ordo/framework`では`.k8ordo/register.gen.ts`に生成され、`params`と`search`、serverモードでは`request`も加わります。',
    en: 'Under `@k8ordo/framework` it is generated into `.k8ordo/register.gen.ts`, with `params` and `search`, and in server mode `request` too.',
  }),
] as const;

export const registeredPatternSummary = message({
  ja: '登録した表のすべてのページのパターンです。`/*`のパターンも含みます。登録の前は、`/`で始まる任意の文字列です。',
  en: 'The pattern of every page in the registered table, `/*` patterns included. Before registering, any string starting with `/`.',
});

export const registeredNavigablePatternSummary = message({
  ja: '登録した表のうち、リンク先にできるパターンです。`/*`を含むものを除きます。登録の前は、`/`で始まる任意の文字列です。',
  en: 'The registered table’s patterns a link can point at, which leaves out those with `/*`. Before registering, any string starting with `/`.',
});

export const registeredParamsSummary = message({
  ja: 'パターン`P`へのリンクが受け取るparamsの型です。スキーマが型を決めたparamはその型で、ほかは`ParamValue`か文字列です。',
  en: 'The params a link to pattern `P` takes. A param a schema typed takes that type; the others take a `ParamValue` or a string.',
});

export const registeredPageParamsSummary = message({
  ja: 'パターン`P`のページが受け取るparamsの型です。スキーマを走らせたところはその出力で、ほかは文字列です。',
  en: 'The params the page at pattern `P` receives: a schema’s output where one ran, and strings elsewhere.',
});

export const pagePropsSummary = message({
  ja: 'フレームワークのページが受け取るpropsの型です。型引数には、ページのディレクトリが表すパターンを渡します。',
  en: 'The props a framework page receives, by the pattern its directory stands for.',
});

export const pagePropsParams = message({
  ja: 'スキーマが作った型のparams。',
  en: 'The params, typed by the schemas.',
});

export const pagePropsPathname = message({
  ja: 'この描画のパス。',
  en: 'The path this render is for.',
});

export const pagePropsRequest = message({
  ja: 'リクエスト。`@k8ordo/framework`のserverモードでだけ加わります。',
  en: 'The request; only in `@k8ordo/framework`’s server mode.',
});

export const pagePropsSearch = message({
  ja: '`search`をexportしたページが読み取った値。そのページにだけ加わります。',
  en: 'What a page that exports `search` reads; only on such a page.',
});

export const layoutPropsSummary = message({
  ja: 'フレームワークのレイアウトが受け取るpropsの型です。型引数には、ページのあるパターンだけを渡せます。',
  en: 'The props a framework layout receives. Its type argument must be a pattern with a page.',
});

export const layoutPropsParams = message({
  ja: 'params。スキーマを書いていても、型は文字列です。',
  en: 'The params, typed as strings even with a schema.',
});

export const layoutPropsChildren = message({
  ja: 'レイアウトが包むページ。',
  en: 'The page the layout wraps.',
});

export const routeContextSummary = message({
  ja: 'フレームワークの`route.ts`がexportする関数の引数の型です。',
  en: 'The type of what a framework `route.ts` handler receives.',
});

export const routeContextRequest = message({
  ja: '受け取ったリクエスト。',
  en: 'The incoming request.',
});

export const routeContextParams = message({
  ja: 'ページと同じく、スキーマが作った型のparams。',
  en: 'The params, typed by the schemas as a page’s are.',
});

export const patternOfSummary = message({
  ja: '表`R`のすべてのページのパターンです。書いたとおりの綴りで、`/*`のパターンも含みます。',
  en: 'Every page pattern in table `R`, as written, `/*` patterns included.',
});

export const navigablePatternOfSummary = message({
  ja: '表`R`のうち、リンク先にできるパターンです。`/*`を含むものを除きます。',
  en: 'The patterns of table `R` a link can point at, which leaves out those with `/*`.',
});

export const navigablePathSummary = message({
  ja: 'パス`Path`が、表のリンク先にできるパターンのどれかに区間ごとに合えば`Path`、合わなければ`never`です。',
  en: '`Path` when it fits one of the table’s linkable patterns segment by segment, and `never` when none fits.',
});

export const navigablePathCaveats = [
  message({
    ja: '`:param`の位置には、空でない1区間ならどれでも入ります。',
    en: 'Where a pattern has a `:param`, any one non-empty segment fits.',
  }),
  message({
    ja: '末尾にスラッシュのあるパスは`never`です。',
    en: 'A path with a trailing slash is `never`.',
  }),
] as const;

export const paramsOfSummary = message({
  ja: 'パターンの文字列から作るparamsの型です。値はどれも`string`です。',
  en: 'The params derived from a pattern string, every value a `string`.',
});

export const pathForSummary = message({
  ja: 'パターンに合うパスの型です。`:param`の位置は任意の文字列になります。',
  en: 'The type of a path that fits the pattern, with any string where each `:param` is.',
});

export const paramValueSummary = message({
  ja: 'URLでの書き方が1通りに決まる値の型です。リンクのparamに渡せます。',
  en: 'The values with exactly one URL spelling, which a link’s params take.',
});

export const standardSchemaLikeSummary = message({
  ja: 'Standard Schemaの形の型です。zodやzod/miniなど、Standard Schemaを実装したライブラリのスキーマが当てはまります。',
  en: 'The Standard Schema shape, which a schema from any library implementing it fits, zod and zod/mini included.',
});

export const schemaOutputSummary = message({
  ja: 'スキーマが作る値の型です。',
  en: 'The type of what a schema produces.',
});

export const paramsSchemaForSummary = message({
  ja: 'パターン`P`の`paramsSchema`として書けるスキーマの型です。出力のキーは、パターンのparamの一部です。',
  en: 'A schema that can be pattern `P`’s `paramsSchema`: its output’s keys are some of the pattern’s params.',
});

export const parsedParamsSummary = message({
  ja: 'パターンのparamsに、スキーマの並び（外側のレイアウトから順に、ページが最後）の出力を重ねた型です。スキーマが扱わないparamは文字列のままです。',
  en: 'A pattern’s params after a list of schemas has run, outer layouts first and the page last. A param no schema covers stays a string.',
});

export const parsedParamsMapSummary = message({
  ja: 'パターンごとのスキーマの並びを、パターンごとの`ParsedParams`にした型です。生成される`Register`の`params`に使います。',
  en: 'Turns each pattern’s list of schemas into its `ParsedParams`; the generated `Register`’s `params` is one.',
});

export const generatedTypesNote = message({
  ja: 'スキーマにかかわる型は、主に生成されるコードが使います。アプリが自分で書くのは、`PageProps`と`LayoutProps`で足ります。',
  en: 'The schema types are mostly for the generated code; what an app writes by hand is `PageProps` and `LayoutProps`.',
});
