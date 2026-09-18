import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページは表を import しません。リンクもナビゲーションも現在地の問い合わせも、パターンの文字列だけで書きます。このページでは `href` と `navigateTo`、共有の params を束ねる `bindParams`、その型の出どころである `Register`、そして現在地を読むフックを扱います。',
  en: 'Pages never import the table. Links, navigation and questions about where the browser is are all written with the pattern string alone. This page covers `href` and `navigateTo`, `bindParams` for params every link shares, `Register` where their types come from, and the hooks that read the location.',
});

export const hrefTitle = message({
  ja: '`href` でパスを作る',
  en: 'Building a path with `href`',
});

export const hrefDescription = message({
  ja: '`href(pattern, params?)` はパターンと params から具体的なパスを作ります。表は使わないので、どのコンポーネントからでも呼べます。params はパターン文字列から推論され、params を持たないパターンは第 2 引数を取りません。',
  en: '`href(pattern, params?)` builds a concrete path from a pattern and its params. It uses no table, so any component can call it. Params are inferred from the pattern string, and a pattern without params takes no second argument.',
});

export const hrefValues = message({
  ja: '`Register` が params の型を持たないとき（`<Router>` を自分でマウントするアプリ、またはどのスキーマもかからないパターン）、値は `string`・`number`・`bigint`・`boolean` のどれでも渡せます（型 `ParamValue`）。どれも綴りが 1 つに決まるからです。値は `encodeURIComponent` で符号化されるので `a/b` は `a%2Fb` になり、照合で params を読むときに再びデコードされます（戻るのは文字列です）。',
  en: 'Where `Register` carries no param types — an application that mounts `<Router>`, or a pattern no schema covers — a value may be a `string`, `number`, `bigint` or `boolean` (the `ParamValue` type): each has exactly one spelling. It is encoded with `encodeURIComponent`, so `a/b` becomes `a%2Fb`, and matching decodes it again on the way out, as a string.',
});

export const hrefReturn = message({
  ja: '戻り値の型はパスの形を保ちます。`:param` の位置が任意の文字列になったテンプレートリテラル型なので、型付きのパスを受け取る側（`@k8ordo/state` など）にそのまま渡せます。',
  en: 'The return type keeps the path’s shape — a template literal type with any string where each `:param` was — so a typed-path consumer such as `@k8ordo/state` accepts it as it is.',
});

export const hrefErrors = message({
  ja: '型を迂回して呼んだ場合、`href` は実行時にも `TypeError` で拒みます。',
  en: 'Called around the types, `href` refuses at run time as well, with a `TypeError`:',
});

export const hrefErrorWildcard = message({
  ja: 'ワイルドカードを含むパターン',
  en: 'A pattern with a wildcard',
});

export const hrefErrorMissing = message({
  ja: 'param の値が無い',
  en: 'A param without a value',
});

export const hrefErrorSpelling = message({
  ja: 'オブジェクトなど、URL の綴りを持たない値',
  en: 'A value with no URL spelling, such as an object',
});

export const noLinkTitle = message({
  ja: '`<Link>` が無い理由',
  en: 'Why there is no `<Link>`',
});

export const noLinkDescription = message({
  ja: 'Navigation API の下では、素の `<a>` がすでにクライアント遷移です。ブラウザはリンクのクリックで navigate イベントを送り、ルーターはそのイベントを intercept します。`<a>` を包むコンポーネントを作っても同じことを書く方法が 2 つになるだけなので、型の検査は `href` が受け持ちます。',
  en: 'Under the Navigation API a plain `<a>` is already a client navigation: the browser sends a navigate event for the click, and the router intercepts it. A component wrapping the anchor would add a second way to write the same thing, so the type check lives in `href` instead.',
});

export const noLinkNotClaimed = message({
  ja: '表が答えない pathname へのリンクは intercept されず、ブラウザの通常の文書読み込みになります。ただし表の最後に `/*` があれば、表はどの pathname にも答えます。そのときホストが配るファイルへのリンクには `download` 属性を付けてください。ブラウザがクリックの時点でダウンロードだと伝えるので、ルーターは手を出しません。',
  en: 'A link to a pathname the table does not answer is not intercepted: it is an ordinary document load. With a `/*` at the end of the table, though, the table answers every pathname, so mark a link to a file the host serves with `download`: the browser then says it is a download at the click, and the router leaves it alone.',
});

export const navigateTitle = message({
  ja: '`navigateTo` で移動する',
  en: 'Going somewhere with `navigateTo`',
});

export const navigateDescription = message({
  ja: '`navigateTo(pattern, params?, options?)` は `href` で作ったパスへ `navigation.navigate()` で移動します。戻り値はプラットフォームの `{ committed, finished }` そのものです。',
  en: '`navigateTo(pattern, params?, options?)` goes to the path `href` would build, through `navigation.navigate()`, and returns the platform’s own `{ committed, finished }`.',
});

export const navigateOptions = message({
  ja: "オプションは `NavigateToOptions` の `history` だけで、`'push'`（既定）か `'replace'` です。params を持たないパターンでは、オプションが第 2 引数になります。",
  en: "The one option, `history` in `NavigateToOptions`, is `'push'` (the default) or `'replace'`. For a pattern without params, the options are the second argument.",
});

export const navigateDefault = message({
  ja: '既定が `push` なのは、ページの移動は戻るボタンで取り消せるべきだからです。`@k8ordo/state` の `update()` は逆に `replace` が既定で、理由も同じです。ページの中身を絞り込む操作を戻るボタンで 1 つずつ戻したくはありません。ページを変えるのは `navigateTo`、状態を変えるのは `update` です。',
  en: 'The default is `push` because going to a page is what the back button should undo. `@k8ordo/state`’s `update()` defaults the other way for the same reason: refining what is on the page is not something the back button should step through. Changing pages goes through `navigateTo`; changing state goes through `update`.',
});

export const navigateFinished = message({
  ja: '`finished` は新しいページが画面に出たときに解決します。移動を待つ間の表示は、普通のイベントハンドラで `finished` を待って作ります。',
  en: '`finished` resolves once the new page is on screen. To show that a navigation is under way, await it in an ordinary event handler:',
});

export const navigateNoAction = message({
  ja: '`startTransition` の非同期アクション（`useTransition` や `@k8ordo/ui` の `Button` の `onAction`）の中で `finished` を待ってはいけません。非同期アクションの実行中に始まった transition を、React はそのアクションが終わるまで保留します。ルーターが新しいページを適用する transition もその 1 つなので、ページはアクションの終わりを待ち、アクションはページが出るのを待ち、URL だけが変わったまま止まります。`finished` を待たない場合でも、どこかの非同期アクションが保留中の間に始まったページの切り替えは、そのアクションが終わるまで画面に出ません。',
  en: 'Do not await `finished` inside an async `startTransition` action — `useTransition`’s, or the `onAction` of `@k8ordo/ui`’s `Button`. React holds every transition started while an async action is pending until that action ends, and the transition in which the router applies the new page is one of them: the page waits for the action, the action waits for the page, and only the URL moves. Even without awaiting it, a page change that starts while any async action is pending does not reach the screen until that action ends.',
});

export const navigateAbort = message({
  ja: '別のナビゲーションが追い越すと、`finished` は abort の理由（名前が `AbortError` の `DOMException`）で reject します。追い越されうる場所で待つコードは、上の例のように abort だけを無視し、それ以外のエラーは投げ直します。',
  en: 'When another navigation overtakes this one, `finished` rejects with the abort reason, a `DOMException` named `AbortError`. Code that awaits it where it can be overtaken ignores the abort and rethrows anything else, as the example above does.',
});

export const registerTitle = message({
  ja: '`Register` で表と照合する',
  en: 'Checking patterns with `Register`',
});

export const registerDescription = message({
  ja: 'params の推論は設定なしで働きます。パターンそのものを実際の表と照合するには、アプリで 1 度だけ `Register` に `routes` を宣言します。',
  en: 'Param inference works with no setup. To check the pattern itself against the application’s real table, declare `routes` on `Register` once, in the application.',
});

export const registerEffect = message({
  ja: '宣言すると、`href`・`navigateTo`・`useParams`・`useMatch`・`matchPath` に渡すパターンが表のものに限られます。宣言の前は `/` で始まる任意の文字列が通ります。',
  en: 'Once declared, the patterns `href`, `navigateTo`, `useParams`, `useMatch` and `matchPath` accept are the table’s. Before it, any string starting with `/` passes.',
});

export const registerFramework = message({
  ja: '`@k8ordo/static` と `@k8ordo/server` では、この宣言が `.k8ordo/register.gen.ts` に生成されます。そこで手書きすると、すでに答えのある問いに 2 つ目の答えを書くことになります。',
  en: 'Under `@k8ordo/static` and `@k8ordo/server` this declaration is generated into `.k8ordo/register.gen.ts`; writing it by hand there is a second answer to a question already answered.',
});

export const registerTypesTable = {
  type: message({ ja: '型', en: 'Type' }),
  meaning: message({ ja: '意味', en: 'Meaning' }),
  registeredPattern: message({
    ja: '表のすべての leaf パターン（各ページと各 `/*`。自分の位置にページを持たない接頭辞は含まない）。宣言の前は `/` で始まる任意の文字列',
    en: 'Every leaf pattern in the registered table — each page and each `/*`, never a prefix with no page of its own; before the declaration, any string starting with `/`',
  }),
  registeredNavigablePattern: message({
    ja: 'リンク先にできるパターン（ワイルドカードを除く）。宣言の前は `/` で始まる任意の文字列',
    en: 'The linkable patterns, wildcards excluded; before the declaration, any string starting with `/`',
  }),
  registeredParams: message({
    ja: 'リンクが受け取る params の型。スキーマのかかるパターンでは、スキーマが型を決めた param はその型、残りはページと同じ文字列。スキーマのかからないパターンでは、どの param も `ParamValue`',
    en: 'The params a link takes. On a pattern a schema covers, a param the schema typed takes that type and the rest take a string, as the page receives them; on a pattern no schema covers, every param takes a `ParamValue`',
  }),
  paramsOf: message({
    ja: "パターンの params。`ParamsOf<'/:locale/products/:id'>` は `{ locale: string; id: string }`",
    en: "A pattern’s params: `ParamsOf<'/:locale/products/:id'>` is `{ locale: string; id: string }`",
  }),
  pathFor: message({
    ja: 'パターンに合うパスの型。`:param` の位置を任意の文字列にしたテンプレートリテラル型',
    en: 'The path type a pattern stands for: a template literal type with any string where each `:param` was',
  }),
  paramValue: message({
    ja: 'URL の綴りが 1 つに決まる値。`string | number | bigint | boolean`',
    en: 'A value with one URL spelling: `string | number | bigint | boolean`',
  }),
};

export const bindTitle = message({
  ja: '共有の params を `bindParams` で束ねる',
  en: 'Binding shared params with `bindParams`',
});

export const bindDescription = message({
  ja: 'ロケールやテナントのように、すべてのリンクが繰り返すことになる区間は、関数から供給します。`bindParams(source)` は、`source` が返す params を毎回補う `href` と `navigateTo` を返します。このサイト自身の `src/links.ts` がそのまま例です。',
  en: 'A segment every link would otherwise repeat — a locale, a tenant — is supplied by a function instead. `bindParams(source)` returns an `href` and a `navigateTo` that fill in the params `source` returns. This site’s own `src/links.ts` is exactly that:',
});

export const bindUsage = message({
  ja: 'パターンは `/:locale/…` と綴ったままなので、表の型はそのまま効きます。束ねた param は省略でき、渡せば上書きできます。',
  en: 'Patterns keep their full `/:locale/…` spelling, so the table’s types apply unchanged. A bound param may be left out, or given to override the source.',
});

export const bindSource = message({
  ja: '`source` は呼び出しのたびに読まれます。リクエストや URL ごとに違う値も、その時点の値になります。どのパッケージが値を供給するかはアプリが決めることで、ルーターが知っているのは param の名前だけです。',
  en: '`source` is read at every call, so a value that differs per request or per URL is read where it is current. Which package supplies the value is the application’s business; the router knows a param name and nothing more.',
});

export const bindPitfall = message({
  ja: 'すべての param が束ねられたパターンでも、`navigateTo` のオプションは第 2 引数ではなく第 3 引数です。params もオプションも素のオブジェクトなので、どちらかを決めるのはパターンが param を持つかどうかだけです。params の位置には `undefined` を渡してから、オプションを渡します。第 2 引数にオプションを書くと型エラーになります。',
  en: 'Even when every param of a pattern is bound, `navigateTo`’s options are the third argument, not the second: params and options are both plain objects, and only whether the pattern names a param decides which is which. Pass `undefined` in the params slot, then the options. Options in second place are a type error.',
});

export const bindTypes = message({
  ja: '戻り値の型は `BoundLinks<Bound>`、`source` が返す値の型は `BoundParams`（`ParamValue` の読み取り専用レコード）です。',
  en: 'The return type is `BoundLinks<Bound>`, and what `source` returns is a `BoundParams` — a read-only record of `ParamValue`s.',
});

export const paramsTitle = message({
  ja: '`useParams` と `useRoute`',
  en: '`useParams` and `useRoute`',
});

export const paramsDescription = message({
  ja: '`<Router>` の下のコンポーネントは、今描かれているルートの params をコンテキストから読みます。`useParams(pattern)` はパターン文字列から型の付いた params を返します。値は常に文字列です。',
  en: 'A component under `<Router>` reads the current route’s params from context. `useParams(pattern)` returns them typed by the pattern string. The values are always strings.',
});

export const paramsBelief = message({
  ja: '`useParams` に渡すパターンは「このコンポーネントはこのパターンの下で描かれる」という宣言で、実行時に確かめられます。別のパターンの下で描かれると、形の違う params を黙って返すのではなく throw します。',
  en: 'The pattern given to `useParams` is a claim — this component renders under this pattern — and it is checked at run time: rendered under any other pattern, it throws instead of silently returning params of the wrong shape.',
});

export const paramsRoute = message({
  ja: '`useRoute()` は型の無い形で、勝ったパターンと params を返します。いくつものルートで使い回すコンポーネントが、どのルートの下にいるかを見分けるときに使います。照合結果が無ければ throw します。',
  en: '`useRoute()` is the untyped form: the winning pattern and its params. Use it in a component shared by several routes that needs to tell which one it is under. It throws when there is no match to read.',
});

export const paramsFramework = message({
  ja: '`@k8ordo/static` と `@k8ordo/server` の下では、ブラウザに表が無いのでどちらも使えません。ページは `params` を props で受け取ります。',
  en: 'Under `@k8ordo/static` and `@k8ordo/server` neither works — the browser holds no table — and a page receives `params` as a prop.',
});

export const pathnameTitle = message({
  ja: '`usePathname` で現在地を読む',
  en: 'Reading the location with `usePathname`',
});

export const pathnameDescription = message({
  ja: '`usePathname()` はブラウザが今いる pathname を、末尾のスラッシュを落とした形で返します。表ではなくプラットフォームを読むので、`<Router>` を自分でマウントしたアプリでもフレームワークの下でも同じように動きます。',
  en: '`usePathname()` returns the pathname the browser is on, with the trailing slash dropped. It reads the platform rather than the table, so it works the same in an application that mounts `<Router>` and under the framework.',
});

export const pathnameNoSearch = message({
  ja: 'pathname が変わったときだけ再描画され、search が変わっても再描画されません。search を返さないのは意図したものです。search が変わるたびに再描画されるコンポーネントは `@k8ordo/state` のキー単位の購読を台無しにするからで、`?` で分けることが 2 つのパッケージの境界そのものです。',
  en: 'It re-renders when the pathname changes and never on the search. Leaving the search out is deliberate: a component re-rendering on every search change would defeat `@k8ordo/state`’s keyed subscriptions, and the split at the `?` is the boundary between the two packages.',
});

export const pathnameTiming = message({
  ja: '`usePathname` は新しいページが出たときではなく、URL が変わったときに変わります。intercept では URL が先に確定し、木は読み込みが終わってから届くので、遅いナビゲーションではリンクが先に選択状態になり、前のページがまだ画面に残ります。ブラウザのアドレスバーと同じ順序です。待ちを見せたいなら、上のようにイベントハンドラで `navigateTo` の `finished` を待ちます。',
  en: '`usePathname` changes when the URL changes, not when the new page appears. Interception commits the URL first and the tree arrives once it has loaded, so on a slow navigation a link marks itself active while the previous page is still on screen — the same order as the browser’s own address bar. If the wait needs showing, await `navigateTo`’s `finished` in an event handler, as above.',
});

export const pathnameRaw = message({
  ja: '値は URL の綴りのままで、デコードしません。ASCII 以外の文字はパーセント符号化された形で返ります。',
  en: 'The value is the URL’s own spelling and is not decoded: characters outside ASCII come back percent-encoded.',
});

export const pathnameServer = message({
  ja: 'サーバーでの描画とハイドレーションの間は Navigation API を読めないので、描画した側が `<PathnameProvider>` で pathname を渡します。`<Router>` と両モードのランタイムが自分でマウントするので、アプリが書くことはありません。',
  en: 'During a server render and hydration there is no Navigation API to read, so the renderer supplies the pathname through `<PathnameProvider>`. `<Router>` and both mode runtimes mount it themselves; an application never writes it.',
});

export const matchTitle = message({
  ja: '`useMatch` と `matchPath` で選択状態を尋ねる',
  en: 'Asking about active links with `useMatch` and `matchPath`',
});

export const matchDescription = message({
  ja: 'リンクが選択状態かどうかは props ではなく、尋ねる問いです。`useMatch(pattern, options?)` は、今の pathname がそのパターンに合えば params を、合わなければ `null` を返します。',
  en: 'Whether a link is active is a question you ask, not a prop. `useMatch(pattern, options?)` returns the params when the current pathname fits the pattern, and `null` when it does not.',
});

export const matchWildcard = message({
  ja: 'パターンは表のもの、または表のパターンに `/*` を続けたもので、後者は「その下のどこか」を意味します（型 `MatchablePattern`）。パターン自身のページは「下」に含まれず、`/products/*` は `/products/42` に合い、`/products` には合いません。index でも下でも選択状態にしたい区画のリンクは `{ inclusive: true }`（型 `MatchOptions`）を渡します。`inclusive` は `/*` で終わらないパターンには影響しません。',
  en: 'The pattern is one from the table, or a table pattern followed by `/*` to mean “anywhere below it” (the `MatchablePattern` type). The pattern’s own page is not below it: `/products/*` matches `/products/42` and not `/products`. A section link that should be active on the index as much as below it passes `{ inclusive: true }` (the `MatchOptions` type), which changes nothing for a pattern that does not end in `/*`.',
});

export const matchPure = message({
  ja: '`matchPath(pattern, pathname, options?)` は同じ判定を行う純粋関数で、手元にある pathname を調べます。`useMatch` は `usePathname` の上に作られているので、再描画されるのは pathname が変わったときだけで、表も要りません。このサイトのサイドナビゲーションも `useMatch` で「`/ui/components` の下が開いているか」を尋ねています。',
  en: '`matchPath(pattern, pathname, options?)` is the same test as a pure function, for a pathname you have in hand. `useMatch` is built on `usePathname`, so it re-renders on the pathname only and needs no table — this site’s own sidebar asks `useMatch` whether a page under `/ui/components` is showing.',
});

export const demoTitle = message({
  ja: '`matchPath` を試す',
  en: 'Try `matchPath`',
});

export const demoDescription = message({
  ja: 'パターンと pathname を書き換えると、本物の `matchPath` と `normalizePathname` の結果がその場で変わります。最初の値は、このページが属する区画のパターン `/:locale/router/*` と、今いる pathname です。',
  en: 'Edit the pattern and the pathname, and the real `matchPath` and `normalizePathname` answer as you type. It starts with the pattern for this page’s section, `/:locale/router/*`, and the pathname you are on.',
});

export const demo = {
  pattern: message({ ja: 'パターン', en: 'Pattern' }),
  pathname: message({ ja: 'pathname', en: 'Pathname' }),
  inclusive: message({ ja: 'inclusive', en: 'inclusive' }),
  examples: message({ ja: '例', en: 'Examples' }),
  reset: message({ ja: '最初の値に戻す', en: 'Reset' }),
  call: message({ ja: '呼び出し', en: 'Call' }),
  normalized: message({
    ja: 'normalizePathname',
    en: 'normalizePathname',
  }),
  result: message({ ja: '結果', en: 'Result' }),
  miss: message({
    ja: '一致しない',
    en: 'No match',
  }),
  invalid: message({
    ja: 'URLPattern がパターンを解釈できません',
    en: 'URLPattern could not parse the pattern',
  }),
};

export const normalizeTitle = message({
  ja: '`normalizePathname` と末尾のスラッシュ',
  en: '`normalizePathname` and the trailing slash',
});

export const normalizeDescription = message({
  ja: 'URLPattern は `/products` と `/products/` を別の pathname として扱いますが、ルーターは同じものとして扱います。`normalizePathname(pathname)` はその規則そのもので、末尾のスラッシュをすべて落とし、ルートの `/` だけは残します。表の照合・`matchPath`・`usePathname`・`<PathnameProvider>` はどれもこの形に揃えてから比べます。',
  en: 'URLPattern treats `/products` and `/products/` as different pathnames; the router does not. `normalizePathname(pathname)` is that rule on its own: every trailing slash is dropped, and the root `/` is kept. Table matching, `matchPath`, `usePathname` and `<PathnameProvider>` all bring a pathname to this form before comparing.',
});

export const normalizeScope = message({
  ja: '落とすのは末尾のスラッシュだけです。途中の連続したスラッシュ、パーセント符号化、search や fragment には触れません。pathname を表と同じ規則で比べるコードで使います。',
  en: 'It drops trailing slashes and nothing else: repeated slashes in the middle, percent-encoding, a search or a fragment are left as they are. Use it in code that compares pathnames the way the table does.',
});

export const normalizeTable = {
  input: message({ ja: '入力', en: 'Input' }),
  output: message({ ja: '出力', en: 'Output' }),
};

export const stateTitle = message({
  ja: '`@k8ordo/state` と同じパスの型を使う',
  en: 'Sharing typed paths with `@k8ordo/state`',
});

export const stateDescription = message({
  ja: '`@k8ordo/state` の `Register` にも、このルーターと同じ 1 行を書きます。両方に同じ表を宣言すると、`@k8ordo/state` のリンクも、このルーターが照合するのと同じ表で検査され、2 つのパッケージが「パス」について同じ答えを持ちます。',
  en: '`@k8ordo/state`’s `Register` takes the same line this router does. Declare the same table on both, and `@k8ordo/state`’s links are checked against the table this router matches against — the two packages agree on what a path is.',
});

export const stateRouteOf = message({
  ja: '`RouteOf<typeof routes>` は表のリンク可能な pathname を union にした型です。`@k8ordo/state` は内部でこれを使っています。ほかに型付きのパスを受け取るものがあれば、同じ型を渡せます。',
  en: '`RouteOf<typeof routes>` is the table’s linkable pathname space as a union. `@k8ordo/state` derives its paths through it, and any other typed-path consumer can take the same type.',
});
