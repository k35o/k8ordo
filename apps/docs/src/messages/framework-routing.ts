import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`src/routes/`の下のディレクトリが、そのままアプリのURLになります。ディレクトリとファイルの決まりを覚えれば、ページもリダイレクトもフィードも、ファイルを置くだけで作れます。',
  en: 'The directories under `src/routes/` are the application’s URLs. Once you know the rules for directories and files, a page, a redirect or a feed is one file in the right place.',
});

export const treeTitle = message({
  ja: 'ディレクトリとURL',
  en: 'Directories and URLs',
});

export const treeMap = [
  message({
    ja: '`page.tsx`：`/`のページです。',
    en: '`page.tsx`: the page at `/`.',
  }),
  message({
    ja: '`products/page.tsx`：`/products`のページです。',
    en: '`products/page.tsx`: the page at `/products`.',
  }),
  message({
    ja: '`products/[id]/page.tsx`：`/products/:id`のページです。`/products/42`を開くと、ページは`params.id`に`42`を受け取ります。',
    en: '`products/[id]/page.tsx`: the page at `/products/:id`. Open `/products/42`, and the page receives `42` as `params.id`.',
  }),
  message({
    ja: '`(docs)/guide/page.tsx`：`/guide`のページです。',
    en: '`(docs)/guide/page.tsx`: the page at `/guide`.',
  }),
  message({
    ja: '`_parts/counter.tsx`：URLになりません。',
    en: '`_parts/counter.tsx`: no URL.',
  }),
] as const;

export const namesTitle = message({
  ja: 'ディレクトリ名の形',
  en: 'Directory name shapes',
});

export const namesLead = message({
  ja: 'ディレクトリ名の形によって、URLに足すものが変わります。',
  en: 'The shape of a directory name decides what it adds to the URL.',
});

export const namesList = [
  message({
    ja: '`products`：書いたとおりの区間を1つ足します。使える文字は英字と数字です。記号は`.`、`_`、`~`と`-`が使えます。',
    en: '`products`: adds one segment, exactly as written. Letters, digits, `.`, `_`, `~` and `-` are allowed.',
  }),
  message({
    ja: '`[id]`：区間を1つ受け取るパラメータです。名前は英字か`_`で始めます。',
    en: '`[id]`: a parameter that takes one segment. Its name starts with a letter or `_`.',
  }),
  message({
    ja: '`(docs)`：区間を足さないグループです。`routes/`の一部にだけレイアウトや`error.tsx`を持たせるときに使います。',
    en: '`(docs)`: a group, which adds no segment. Use it to give part of `routes/` a layout or an `error.tsx` of its own.',
  }),
  message({
    ja: '`_parts`：`_`か`.`で始まる名前は、ディレクトリでもファイルでもルートになりません。',
    en: '`_parts`: a name starting with `_` or `.`, directory or file, is never a route.',
  }),
] as const;

export const namesNoRest = message({
  ja: '`[...rest]`のように、複数の区間をまとめて受け取るパラメータはありません。',
  en: 'There is no parameter that takes several segments, such as `[...rest]`.',
});

export const filesTitle = message({
  ja: 'ルートのファイル',
  en: 'Route files',
});

export const filesLead = message({
  ja: 'ディレクトリに置けるのは、次の8つの名前のファイルだけです。拡張子まで一致させます。`page.ts`のように拡張子が違うだけでも、ビルドがエラーになります。',
  en: 'A directory may hold only files with these eight names, extension included. Even a `page.ts`, with only the extension wrong, fails the build.',
});

export const filesList = [
  message({
    ja: '`page.tsx`：そのディレクトリのURLで表示するページです。',
    en: '`page.tsx`: the page shown at the directory’s URL.',
  }),
  message({
    ja: '`layout.tsx`：その下で描かれるものを`children`として受け取り、包みます。',
    en: '`layout.tsx`: wraps whatever renders below it, received as `children`.',
  }),
  message({
    ja: '`not-found.tsx`：その下で、どのルートにも当たらなかったURLで表示します。',
    en: '`not-found.tsx`: shown for any URL below it that no route matched.',
  }),
  message({
    ja: '`error.tsx`：その下でエラーになったとき、代わりに描かれます。',
    en: '`error.tsx`: rendered in place of what is below it when that throws.',
  }),
  message({
    ja: '`loading.tsx`：その下のページを待つ間に描かれます。',
    en: '`loading.tsx`: rendered while the page below it loads.',
  }),
  message({
    ja: '`redirect.ts`：ページの代わりに、行き先をdefault exportします。',
    en: '`redirect.ts`: default-exports a destination, instead of a page.',
  }),
  message({
    ja: '`route.ts`：ページの代わりに`Response`を返します。',
    en: '`route.ts`: returns a `Response` instead of a page.',
  }),
] as const;

export const guardFile = message({
  ja: '`guard.ts`：その下のURLへのリクエストを処理する前に実行され、止めるか通すかを決めます。serverモードだけで使えます。',
  en: '`guard.ts`: runs before any request below it is handled, and stops it or lets it through. Server mode only.',
});

export const filesOther = message({
  ja: 'これ以外のファイルは、`_`で始まるディレクトリに置きます。',
  en: 'Anything else goes under a directory whose name starts with `_`.',
});

export const propsTitle = message({
  ja: 'ページとレイアウトのprops',
  en: 'Page and layout props',
});

export const propsReceive = message({
  ja: 'ページは`params`を、レイアウトは`children`を受け取ります。どちらも、描画しているURLを`pathname`で受け取ります。パラメータより上のレイアウトは、`pathname`からその値を読めます。',
  en: 'A page receives `params`, and a layout receives `children`. Both receive `pathname`, the URL being rendered. A layout above a parameter reads the value from `pathname`.',
});

export const propsTypes = message({
  ja: '`@k8ordo/framework`の`PageProps`と`LayoutProps`は、このpropsをパターンから引いた型です。生成されたルート表を読むので、型引数にはパターンの文字列だけを渡します。`LayoutProps`に渡せるのはページのあるパターンだけです。`products/page.tsx`が無いなら、`/products`のレイアウトはpropsの型を自分で書きます。',
  en: '`PageProps` and `LayoutProps` from `@k8ordo/framework` are these props looked up by pattern. They read the generated route table, so the pattern string is the only type argument. `LayoutProps` takes only a pattern that has a page: without `products/page.tsx`, the layout for `/products` writes its props type itself.',
});

export const propsRequest = message({
  ja: 'serverモードでは、ページとレイアウトは`request`も受け取ります。ヘッダーとCookieの読み方は',
  en: 'Under server mode a page and a layout also receive `request`. Reading its headers and cookies is covered in ',
});

export const routerTitle = message({
  ja: 'ルーターのAPI',
  en: 'Router API',
});

export const routerCarry = message({
  ja: '`href`や`useMatch`のような、リンクと現在のURLを扱うAPIは`@k8ordo/framework`からimportします。`@k8ordo/router`のAPIを名前で再exportしたもので、フックを使えるのはClient Componentの中だけです。',
  en: 'The APIs for links and the current URL, such as `href` and `useMatch`, are imported from `@k8ordo/framework`, which re-exports them from `@k8ordo/router` by name. The hooks work only in Client Components.',
});

export const routerNoMatch = message({
  ja: '`useParams`と`useRoute`は、`@k8ordo/framework`にはありません。ブラウザはルート表を持たないためです。代わりの読み方は',
  en: '`useParams` and `useRoute` are not in `@k8ordo/framework`: the browser holds no route table, so they would have no route to read. What to use instead is covered in ',
});

export const localeTitle = message({
  ja: 'ロケールの区間',
  en: 'The locale segment',
});

export const localeSchema = message({
  ja: '`[locale]`のレイアウトから、`defineLocales`で作った`locales`の`paramsSchema`をexportします。このスキーマは、`locales`にあるロケールだけを受け付けます。受け付けたロケールがどこで読まれるかは',
  en: 'From the `[locale]` layout, export the `paramsSchema` of the `locales` you defined with `defineLocales`. The schema accepts only the locales in the set. Where the accepted locale is read is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const localeRuns = message({
  ja: 'フレームワークは、ほかの`paramsSchema`と同じようにこのスキーマでパラメータを検証します。受け付けたロケールで、その下のページを描きます。`/`にはロケールが無いので、アプリが`/`で言語を選び、ロケール付きのURLへリダイレクトします。選び方は',
  en: 'The framework validates the parameter with this schema as it does with any `paramsSchema`, and renders the pages below in the accepted locale. `/` has no locale, so the application itself picks a language at `/` and redirects to a URL that has one. Picking it is covered in ',
});

export const localeStatic = message({
  ja: 'staticモードでは、ロケールの数だけページを書き出すので、`paths`に`locales.paths`を渡します。渡し方は',
  en: 'Under static mode a page is written per locale, so `paths` takes `locales.paths`. Passing it is covered in ',
});

export const orderTitle = message({
  ja: 'ルートの順番',
  en: 'Route order',
});

export const orderRule = message({
  ja: 'ディレクトリに順番は無いので、生成されるルート表が順番を決めます。同じ階層では、固定の区間がパラメータより先に試されます。`not-found.tsx`は最後です。`about/`のとなりに`[id]/`を直接置いても、`/about`は`about/`に当たります。',
  en: 'Directories have no order of their own, so the generated route table picks one. At each level a fixed segment is tried before a parameter, and `not-found.tsx` comes last. Put `[id]/` directly beside `about/`, and `/about` still reaches `about/`.',
});

export const orderGroup = message({
  ja: 'ただし、グループの中のルートは1か所にまとまって並びます。グループをまたいで順番は入れ替わりません。上の例では`(shop)`に固定の区間`sale/`があるので、`(shop)`は`about/`と同じ順位です。同じ順位では名前の順になり、`(shop)`が先に来ます。',
  en: 'A group, though, keeps its routes together in one place. The table does not reorder across groups. In the example above, `(shop)` holds the fixed segment `sale/`, so it ranks level with `about/`. At the same rank routes sort by name, which puts `(shop)` first.',
});

export const orderShadow = message({
  ja: 'すると`(shop)/[id]/`が`/about`に先に当たり、`about/page.tsx`は描かれません。この形があると、ビルドが`"/about" can never match`で始まるエラーになります。',
  en: 'So `(shop)/[id]/` answers `/about` first, and `about/page.tsx` never renders. This shape fails the build with an error that begins `"/about" can never match`.',
});

export const refusesTitle = message({
  ja: '拒まれる形',
  en: 'Refused shapes',
});

export const refusesLead = message({
  ja: '決まりに合わないファイルやディレクトリがあると、ビルドがエラーになります。エラー文は`routes/ is not a valid pathname space:`で始まり、問題を1行ずつ並べます。最初の1つだけでなく、見つけた問題をすべて挙げます。どの行も、原因のファイルを名指しします。',
  en: 'When a file or directory breaks the rules, the build fails. The error begins `routes/ is not a valid pathname space:` and lists one line per problem. It lists every problem it found, not just the first, and each line names the file.',
});

export const refusesList = [
  message({
    ja: 'ルートのファイル名ではないファイル（`products/helper.ts`）',
    en: 'A file that is not a route file (`products/helper.ts`)',
  }),
  message({
    ja: '形の正しくないディレクトリ名（`[123]`や`(docs`、`pro ducts`）',
    en: 'A malformed directory name (`[123]`, `(docs`, `pro ducts`)',
  }),
  message({
    ja: '上のディレクトリと同じ名前のパラメータ（`[id]/things/[id]/`）',
    en: 'A parameter named the same as one above it (`[id]/things/[id]/`)',
  }),
  message({
    ja: '下にページも`redirect.ts`も`route.ts`も無いディレクトリ（レイアウトや`error.tsx`だけがある、など）',
    en: 'A directory with no page, `redirect.ts` or `route.ts` anywhere below it (only a layout or an `error.tsx`, say)',
  }),
  message({
    ja: '別々のグループに置いた、同じURLのページ（`(a)/page.tsx`と`(b)/page.tsx`）',
    en: 'Pages at the same URL in different groups (`(a)/page.tsx` and `(b)/page.tsx`)',
  }),
  message({
    ja: '同じディレクトリに並んだ`page.tsx`と`redirect.ts`、`route.ts`のうちの2つ',
    en: 'Any two of `page.tsx`, `redirect.ts` and `route.ts` in one directory',
  }),
  message({
    ja: 'メソッドを1つもexportしない`route.ts`',
    en: 'A `route.ts` that exports no method',
  }),
  message({
    ja: 'グループの中のルートが先に当たって、表示されることのないページ',
    en: 'A page that never shows because a route inside a group answers first',
  }),
] as const;

export const refusesDev = message({
  ja: '`vite dev`も、起動時に問題があれば同じエラーで起動しません。起動後の変更で問題が生まれたときは、`routes/<path>: <message>`の行をログに出し、サーバーは動き続けます。問題が残っている間、`.k8ordo/`は書き直されません。',
  en: '`vite dev` refuses to start with the same error when a problem exists at startup. A problem introduced while it runs is logged as `routes/<path>: <message>`, and the server keeps going. While a problem remains, `.k8ordo/` is not rewritten.',
});

export const refusesMode = message({
  ja: 'staticモードでは、サーバーが要るものもビルドのエラーになります。どれがなぜエラーになるかは',
  en: 'Under static mode the build also fails on what needs a server. Which ones, and why, is covered in ',
});

export const loadingTitle = message({
  ja: '読み込み中の表示',
  en: 'Loading state',
});

export const loadingWhen = message({
  ja: '`layout.tsx`か`page.tsx`の横に`loading.tsx`を置くと、その下のページを待つ間に代わりに描かれます。`loading.tsx`はpropsを受け取りません。',
  en: 'A `loading.tsx` beside a `layout.tsx` or a `page.tsx` is rendered while the page below it loads. It receives no props.',
});

export const loadingStatic = message({
  ja: 'staticモードでは、ページを丸ごとファイルに書き出すので、HTMLに`loading.tsx`は出ません。ペイロードも1つのファイルでふつうは一度に受け取るので、クライアント側の遷移でもほとんど出ません。',
  en: 'Under static mode a page is written whole into a file, so its HTML never shows a `loading.tsx`. A client navigation rarely shows one either: the payload is a file too, and usually arrives in one piece.',
});

export const loadingServer = message({
  ja: 'serverモードでは、文書はページのコンポーネントを待ってから送るので、HTMLには出ません。JavaScriptを実行しない訪問者やクローラーにもページが見えます。ただし、ページの中のコンポーネントが自分の`<Suspense>`の外でデータを待つと、HTMLではページの代わりに出ます。クライアント側の遷移では、ペイロードを受け取り始めてから、サーバーがページを描き終えるまで出ます。',
  en: 'Under server mode a document waits for the page’s own component before it is sent, so its HTML does not show it, and a visitor without JavaScript, or a crawler, sees the page. The exception is a component inside the page that awaits data outside a `<Suspense>` of its own: the HTML then shows it in the page’s place. During a client navigation it shows from when the payload starts arriving until the server has finished rendering the page.',
});

export const loadingKeep = message({
  ja: 'すでに表示しているディレクトリの中で別のページへ移るときは、次のページを受け取るまで今のページを表示したままにします。その間に何かを出すには、`usePendingPathname()`で遷移中の行き先を読みます。',
  en: 'Moving to another page within a directory already on screen keeps the current page showing until the next one arrives. To show something meanwhile, read where the navigation is going with `usePendingPathname()`.',
});

export const routeTitle = message({
  ja: '`route.ts`',
  en: '`route.ts`',
});

export const routeLead = message({
  ja: 'RSSのフィードやJSONのように、ページでないものを返すURLには`route.ts`を置きます。扱うHTTPメソッドの名前で関数をexportし、その関数が`Response`を返します。関数は`{ request, params }`を受け取り、型は`RouteContext`です。`params`には、ページと同じくスキーマで型が付きます。',
  en: 'A URL that returns something other than a page, such as an RSS feed or JSON, gets a `route.ts`. It exports a function named after each HTTP method it handles, and that function returns a `Response`. The function receives `{ request, params }`, typed `RouteContext`. Its `params` are typed by the schemas, as a page’s are.',
});

export const routeName = message({
  ja: '`feed.xml`のようにファイル名に見えるディレクトリも、普通の区間です。`feed.xml/route.ts`は`/feed.xml`のURLになります。`route.ts`が返す`Response`には、上のレイアウトは付きません。クライアント側の遷移で`route.ts`のURLへ移ると、ページ全体を読み込み直します。',
  en: 'A directory named like a file, such as `feed.xml`, is an ordinary segment, so `feed.xml/route.ts` is the URL `/feed.xml`. The `Response` a `route.ts` returns gets none of the layouts above it. A client navigation to its URL reloads the whole page.',
});

export const routeStaticTitle = message({
  ja: 'staticモード',
  en: 'Static mode',
});

export const routeStatic = message({
  ja: 'ビルドがURLごとに`GET`を1回呼び、返った`Response`をそのURLのファイルとして書き出します。`feed.xml/route.ts`なら`dist/client/feed.xml`です。パラメータを持つ`route.ts`には、ページと同じく`paths`で値を渡します。`framework()`に`site`を渡していれば、`request.url`のoriginはその値です。',
  en: 'The build calls `GET` once per URL and writes the `Response` it returns as the file at that URL: `feed.xml/route.ts` becomes `dist/client/feed.xml`. A `route.ts` with parameters takes its values from `paths`, as a page does. With `site` given to `framework()`, the origin of `request.url` is that value.',
});

export const routeRefusedLead = message({
  ja: '次の`route.ts`はファイルにできないので、ビルドがエラーになります。',
  en: 'These `route.ts` files cannot become files, so they fail the build:',
});

export const routeRefused = [
  message({
    ja: '`GET`以外のメソッドをexportした`route.ts`（`vite dev`も拒みます）',
    en: 'A `route.ts` exporting a method other than `GET` (`vite dev` refuses it too)',
  }),
  message({
    ja: '`GET`が`200`以外を返した`route.ts`',
    en: 'A `route.ts` whose `GET` returns anything but `200`',
  }),
  message({
    ja: '`/`に置いた`route.ts`',
    en: 'A `route.ts` at `/`',
  }),
  message({
    ja: '下にページがある`route.ts`',
    en: 'A `route.ts` with pages below it',
  }),
] as const;

export const routeServerTitle = message({
  ja: 'serverモード',
  en: 'Server mode',
});

export const routeServer = message({
  ja: 'HTTPの7つのメソッドのどれでもexportできます。exportしていないメソッドには`405`を返し、`Allow`にexportしたメソッドを並べます。`HEAD`をexportしていなければ、`GET`の`Response`から本文を外して返します。',
  en: 'Any of the seven HTTP methods may be exported. A method it does not export gets a `405`, with the exported ones listed in `Allow`. Without a `HEAD` export, the `GET` response is returned without its body.',
});

export const routeServerGuard = message({
  ja: '上にある`guard.ts`は、`route.ts`より先に実行されます。`route.ts`の中では、`@k8ordo/framework/server`の`cookies()`と`responseHeaders()`、`requestHeaders()`も使えます。',
  en: 'The `guard.ts` files above it run first. `cookies()`, `responseHeaders()` and `requestHeaders()` from `@k8ordo/framework/server` work inside a `route.ts` too.',
});

export const routePost = message({
  ja: '`route.ts`への`POST`は、Server Actionと違って同じoriginからかどうかを確かめません。Webhookのように、別の場所から送られてくるものだからです。必要な検証は、`route.ts`の中に書きます。',
  en: 'A `POST` to a `route.ts` is not checked for the same origin, unlike a Server Action: what posts there, such as a webhook, comes from elsewhere. Write the checks you need inside the `route.ts`.',
});

export const generatedTitle = message({
  ja: '生成される`.k8ordo/`',
  en: 'The generated `.k8ordo/`',
});

export const generatedWhen = message({
  ja: 'フレームワークは、`routes/`から作ったルート表と型を`.k8ordo/`に書き出します。書くのは`vite dev`の起動時と`vite build`の開始時です。開発中は、`routes/`の下のファイルが変わるたびに書き直します。',
  en: 'The framework writes a route table and its types, made from `routes/`, into `.k8ordo/`. It writes when `vite dev` starts and when `vite build` begins, and during development whenever a file under `routes/` changes.',
});

export const generatedFiles = [
  message({
    ja: '`routes.gen.ts`：ルート表です。それぞれのルートのファイルを、そのディレクトリのパターンに対して`satisfies`で検査します。',
    en: '`routes.gen.ts`: the route table itself. It checks each route file against its directory’s pattern with `satisfies`.',
  }),
  message({
    ja: '`register.gen.ts`：ルート表をフレームワークに登録します。これで`href()`や`useMatch()`のパターンに型が付きます。serverモードでは、`PageProps`と`LayoutProps`に`request`も足します。アプリが`@k8ordo/state`に依存していれば、そちらにも登録します。',
    en: '`register.gen.ts`: registers the table with the framework, which types the patterns `href()` and `useMatch()` take. Under server mode it also adds `request` to `PageProps` and `LayoutProps`. When the application depends on `@k8ordo/state`, it registers the table there too.',
  }),
  message({
    ja: '`.gitignore`：`*`で中身をすべて無視します。`.k8ordo/`はこれでgitの管理から外れるので、アプリの`.gitignore`に足すものはありません。',
    en: '`.gitignore`: ignores everything in it with `*`. That keeps `.k8ordo/` out of git, so nothing goes into the application’s own `.gitignore`.',
  }),
] as const;

export const generatedRead = message({
  ja: '生成物なので編集しません。中身は普通のTypeScriptで、`@k8ordo/framework/generated`からimportしています。読めば、何を検査しているかが分かります。',
  en: 'It is generated, so do not edit it. It is plain TypeScript importing from `@k8ordo/framework/generated`, and reading it shows what is checked.',
});

export const generatedTsc = message({
  ja: '`vite build`は型を検査しないので、`satisfies`の結果は`tsc`で確かめます。cloneした直後は、`tsc`の前に一度`vite dev`か`vite build`を実行します。',
  en: '`vite build` does not type-check, so run `tsc` to see the `satisfies` checks. In a fresh clone, run `vite dev` or `vite build` once before `tsc`.',
});

export const titlesTitle = message({
  ja: 'タイトルとメタデータ',
  en: 'Titles and metadata',
});

export const titlesApi = message({
  ja: 'メタデータのためのAPIはありません。React 19は、どのコンポーネントで描いた`<title>`や`<meta>`、`<link>`も`<head>`へ移します。ページは自分のタイトルを、本文と同じ場所で描きます。',
  en: 'There is no metadata API. React 19 moves a `<title>`, `<meta>` or `<link>` rendered in any component into `<head>`. A page renders its title where it renders everything else.',
});

export const titlesOne = message({
  ja: '画面に出る`<title>`は、いつも1つにします。ルートレイアウトでは描かず、各ページと`not-found.tsx`がそれぞれ1つずつ描きます。2つ描くと2つとも出力され、後のものが優先されることはありません。',
  en: 'Keep one `<title>` on screen at a time. The root layout renders none, and each page and `not-found.tsx` renders its own. Render two and both are output; the later one does not replace the earlier.',
});

export const prefetchTitle = message({
  ja: 'リンク先の先読み',
  en: 'Prefetching links',
});

export const prefetchWhen = message({
  ja: 'リンクにポインターを合わせると、クライアントのランタイムがリンク先のペイロードを取得します。リンクにフォーカスが移ったときと、押し始めたときも同じです。設定は要りません。コンポーネントライブラリが描いた`<a>`も含めて、ページの中のすべての`<a>`が対象です。次のリンクは先読みしません。',
  en: 'When a pointer moves onto a link, the client runtime fetches the payload of the page it points to. Focusing the link or starting a press on it does the same. There is nothing to set up: every `<a>` on the page counts, including the ones a component library renders. These links are not prefetched:',
});

export const prefetchSkipped = [
  message({
    ja: '別のoriginや、Viteの`base`の外へのリンク',
    en: 'one to another origin, or outside Vite’s `base`',
  }),
  message({
    ja: '`download`が付いたリンクと、`_self`以外の`target`が付いたリンク',
    en: 'one with `download`, or with a `target` other than `_self`',
  }),
  message({
    ja: '今表示しているページへのリンク',
    en: 'one to the page on screen',
  }),
] as const;

export const prefetchStop = message({
  ja: '先読みを止めるには、リンクかそれを囲む要素に`data-k8ordo-prefetch="false"`を付けます。描画の重いページへのリンクに使います。いちばん近い要素の値が使われるので、止めた範囲の中のリンクに`"true"`を付ければ、そのリンクだけを先読みに戻せます。',
  en: 'To stop prefetching, mark the link or any element around it `data-k8ordo-prefetch="false"`. Use it for links to pages that are expensive to render. The nearest element carrying the attribute decides, so `"true"` brings one link back inside a region that opted out.',
});

export const prefetchOnce = message({
  ja: '先読みしたページは、そのページへの次の遷移で1回だけ使われます。使えるのは取得を始めてから30秒以内で、過ぎると遷移のときに取り直します。Server Actionの結果を受け取ったときも、先読みしたものはすべて捨てます。',
  en: 'A prefetched page is used once, by the next navigation to it, and only within 30 seconds of the fetch starting. After that the navigation fetches it again. A Server Action’s result drops everything prefetched too.',
});

export const prefetchSpeculation = message({
  ja: 'ブラウザのSpeculation Rulesは使いません。Baselineに入っていないためです。',
  en: 'The browser’s Speculation Rules are not used, since they are not Baseline.',
});

export const demoTitle = message({
  ja: '先読みのデモ',
  en: 'Prefetch demo',
});

export const demoDescription = message({
  ja: 'このサイトは`@k8ordo/framework`のstaticモードで動いているので、リンクにポインターを合わせると`index.rsc`を実際に取得し、下の一覧に表示します。',
  en: 'This site runs on `@k8ordo/framework` in static mode, so pointing at a link really fetches its `index.rsc` and shows it in the list below.',
});

export const demoFetched = message({
  ja: '取りに行ったペイロード',
  en: 'Payloads fetched',
});

export const demoNone = message({
  ja: 'まだありません',
  en: 'None yet',
});

export const demoOptedOut = message({
  ja: 'この中のリンクは先読みしません',
  en: 'Links in here are not prefetched',
});

export const demoLinkFetched = message({
  ja: 'パラメータのページ',
  en: 'The parameters page',
});

export const demoLinkSkipped = message({
  ja: 'デプロイのページ',
  en: 'The deploy page',
});

export const demoSteps = [
  message({
    ja: '「パラメータのページ」にポインターを合わせると、一覧にそのページの`index.rsc`が加わります。',
    en: 'Point at “The parameters page”. Its `index.rsc` joins the list.',
  }),
  message({
    ja: '「デプロイのページ」は`data-k8ordo-prefetch="false"`の中にあるので、ポインターを合わせても一覧は増えません。',
    en: '“The deploy page” sits inside `data-k8ordo-prefetch="false"`, so pointing at it adds nothing.',
  }),
  message({
    ja: '「パラメータのページ」にもう一度合わせても、最初に取得してから30秒たつまでは一覧に加わりません。',
    en: 'Point at “The parameters page” again. Nothing is added until 30 seconds after the first fetch.',
  }),
  message({
    ja: 'ヘッダーやサイドバーにある、ほかのページへのリンクに合わせても、同じように一覧に加わります。',
    en: 'Point at a link to another page in the header or the sidebar. It joins the list the same way.',
  }),
] as const;
