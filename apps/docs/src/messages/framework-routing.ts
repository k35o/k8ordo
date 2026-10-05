import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-routing.ts / server-routing.ts が持つ。

export const treeTitle = message({
  ja: 'ディレクトリがURLになる',
  en: 'Directories are URLs',
});

export const treeDescription = message({
  ja: '`src/routes/`の下のディレクトリが、そのままアプリのURLになります。どのURLにどのファイルが答えるかは、ディレクトリをたどれば1つに決まります。',
  en: 'The directories under `src/routes/` are the application’s URLs. Follow the directories, and you find the one file that answers a URL.',
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
    ja: '`products/[id]/page.tsx`：`/products/:id`のページです。`/products/42`を開くと、`42`が`params.id`としてページに渡ります。',
    en: '`products/[id]/page.tsx`: the page at `/products/:id`. Open `/products/42`, and the page receives `42` as `params.id`.',
  }),
  message({
    ja: '`(docs)/guide/page.tsx`：`/guide`のページです。かっこで囲んだ`(docs)`はURLに出ません。',
    en: '`(docs)/guide/page.tsx`: the page at `/guide`. The parenthesised `(docs)` never shows in the URL.',
  }),
  message({
    ja: '`_parts/counter.tsx`：URLになりません。ページで使う部品は、こうした`_`で始まるディレクトリに置きます。',
    en: '`_parts/counter.tsx`: no URL. Components a page uses live under a directory like this, whose name starts with `_`.',
  }),
] as const;

export const treeChecked = message({
  ja: 'この決まりは、覚えておく約束ではなくビルドが検査する形です。決まりに合わないファイルを置くと、ビルドがそのファイルを名指しして止まります。',
  en: 'This is not a convention to remember but a shape the build checks: a file that does not fit stops the build, named.',
});

export const namesTitle = message({
  ja: 'ディレクトリ名の4つの形',
  en: 'Four kinds of directory name',
});

export const namesDescription = message({
  ja: 'ディレクトリの名前の形によって、URLに何を足すかが決まります。',
  en: 'The shape of a directory’s name decides what it adds to the URL.',
});

export const namesList = [
  message({
    ja: '`products`：書いたとおりの区間を1つ足します。使える文字は英字と数字のほか、`.`と`_`、`~`、`-`です。',
    en: '`products`: adds one segment, exactly as written. Letters, digits, `.`, `_`, `~` and `-` are allowed.',
  }),
  message({
    ja: '`[id]`：区間を1つ受け取るパラメータです。名前は英字か`_`で始め、同じパスの上で同じ名前は2回使えません。',
    en: '`[id]`: a parameter that takes one segment. Its name starts with a letter or `_`, and may appear only once along a path.',
  }),
  message({
    ja: '`(docs)`：区間を足さないグループです。木の一部にだけレイアウトや`error.tsx`を持たせたいときに使います。',
    en: '`(docs)`: a group, which adds no segment. Use it to give part of the tree a layout or an `error.tsx` of its own.',
  }),
  message({
    ja: '`_parts`：`_`か`.`で始まる名前は、ディレクトリでもファイルでもルートとして読まれません。',
    en: '`_parts`: a name starting with `_` or `.`, directory or file, is never read as a route.',
  }),
] as const;

export const namesNoRest = message({
  ja: '`[...rest]`のように、いくつもの区間をまとめて受け取るパラメータはありません。どのルートにも当たらなかったURLを受け取れるのは、`not-found.tsx`だけです。',
  en: 'There is no parameter that takes several segments, such as `[...rest]`. Only a `not-found.tsx` receives a URL no route matched.',
});

export const filesTitle = message({
  ja: '置けるファイル',
  en: 'The files a directory may hold',
});

export const filesDescription = message({
  ja: 'ディレクトリに置けるのは、次の8つの名前のファイルだけです。拡張子まで一致している必要があり、`page.ts`のように拡張子が違うだけでもビルドが止まります。',
  en: 'A directory may hold only files with these eight names, extension included: a `page.ts` stops the build as surely as anything else.',
});

export const filesList = [
  message({
    ja: '`page.tsx`：そのディレクトリのURLに答えるページです。',
    en: '`page.tsx`: the page that answers its directory’s URL.',
  }),
  message({
    ja: '`layout.tsx`：その下で描かれるものを`children`として受け取り、まわりを包みます。',
    en: '`layout.tsx`: wraps whatever renders below it, received as `children`.',
  }),
  message({
    ja: '`not-found.tsx`：その下で、どのルートにも当たらなかったURLに答えます。',
    en: '`not-found.tsx`: answers any URL below it that no route matched.',
  }),
  message({
    ja: '`error.tsx`：その下で例外が投げられたとき、代わりに描かれます。',
    en: '`error.tsx`: rendered in place of what is below it when that throws.',
  }),
  message({
    ja: '`loading.tsx`：その下のページを待っている間に描かれます。',
    en: '`loading.tsx`: rendered while the page below it loads.',
  }),
  message({
    ja: '`redirect.ts`：ページの代わりに、行き先をdefault exportします。',
    en: '`redirect.ts`: default-exports where to send the visitor, instead of a page.',
  }),
  message({
    ja: '`route.ts`：ページの代わりに、`Response`で答えます。',
    en: '`route.ts`: answers with a `Response`, instead of a page.',
  }),
] as const;

export const filesOther = message({
  ja: 'これ以外のファイルは、`_`で始まるディレクトリに置きます。',
  en: 'Anything else goes under a directory whose name starts with `_`.',
});

export const propsTitle = message({
  ja: 'ページとレイアウトが受け取るもの',
  en: 'What a page and a layout receive',
});

export const propsDescription = message({
  ja: 'Server Componentはcontextを読めないので、ルートの情報はpropsで渡ります。ページはパラメータを`params`で、レイアウトは下で描かれるものを`children`で受け取ります。',
  en: 'Server Components cannot read context, so what a route knows arrives as props: a page receives its parameters as `params`, and a layout what renders below it as `children`.',
});

export const propsPathname = message({
  ja: 'どちらも`pathname`を受け取ります。この描画がどのURLのためのものかを表す値で、パラメータより上にあるレイアウトがその値を知るには、これを読みます。',
  en: 'Both receive `pathname`, the URL this render is for. A layout above a parameter reads it to learn the parameter’s value.',
});

export const propsTypes = message({
  ja: '`@k8ordo/router`の`PageProps`と`LayoutProps`は、このpropsをパターンから引いた型です。生成されたルート表を読むので、型引数にパターンの文字列を渡すだけで済みます。',
  en: '`PageProps` and `LayoutProps` from `@k8ordo/router` are these props looked up by pattern. They read the generated route table, so the pattern string is all you pass.',
});

export const orderTitle = message({
  ja: 'どのルートが先に試されるか',
  en: 'Which route is tried first',
});

export const orderDescription = message({
  ja: 'ディレクトリそのものには順番が無いので、生成されるルート表が順番を決めます。同じ階層では文字どおりの区間がパラメータより先に試され、`not-found.tsx`は最後です。そのため`about/`と`[slug]/`が並んでいても、`/about`は何も書かずに`about/`へ届きます。',
  en: 'Directories have no order of their own, so the generated route table picks one: at each level a literal segment is tried before a parameter, and `not-found.tsx` comes last. That is why `/about` reaches `about/` beside `[slug]/` without anything being said.',
});

export const orderGroup = message({
  ja: 'ただし、グループの中のルートは1か所にまとめて並ぶので、グループをまたいで順番を入れ替えることはできません。下の木では、`(shop)`が中の`sale/`のために`about/`と同じ順位になり、名前の順で先に並びます。',
  en: 'A group, though, holds its routes together in one place, and the table cannot reorder across it. In the tree below, the `sale/` inside `(shop)` ranks the group level with `about/`, and its name sorts first.',
});

export const orderShadow = message({
  ja: 'すると`(shop)/[id]/`が`/about`に先に答えてしまい、`about/page.tsx`は決して描かれません。ビルドはこの形を見つけると、`"/about" can never match`で始まるエラーで止まります。',
  en: 'So `(shop)/[id]/` answers `/about` first, and `about/page.tsx` can never render. The build reports this shape with an error that begins `"/about" can never match`.',
});

export const refusesTitle = message({
  ja: 'ビルドが受け付けない形',
  en: 'Shapes the build refuses',
});

export const refusesDescription = message({
  ja: '決まりに合わないファイルやディレクトリがあると、ビルドは`routes/ is not a valid pathname space:`に続けて、問題を1行ずつ並べて止まります。最初の1つだけでなく見つけた問題をすべて挙げ、どの行も原因のファイルを名指しします。',
  en: 'When files or directories break the rules, the build stops with `routes/ is not a valid pathname space:`, followed by one line per problem. It lists every problem it found, not just the first, and each line names the file.',
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
    ja: 'レイアウトや`error.tsx`だけがあり、下にページが1つも無いディレクトリ',
    en: 'A directory with a layout or an `error.tsx` and no page anywhere below it',
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
    ja: 'グループに隠されて、決して描かれないページ',
    en: 'A page a group shadows, which can never render',
  }),
] as const;

export const refusesDev = message({
  ja: '`vite dev`も、起動したときに問題があれば同じエラーで起動しません。起動した後の変更で問題が生まれたときは、`routes/<path>: <message>`の行をログに出し、サーバーは動き続けます。問題が残っている間、`.k8ordo/`は書き直されません。',
  en: '`vite dev` refuses to start with the same error when a problem is there at startup. A problem introduced while it runs is logged as `routes/<path>: <message>`, and the server keeps going. While a problem remains, `.k8ordo/` is not rewritten.',
});

export const loadingTitle = message({
  ja: '読み込み中の表示を出す',
  en: 'Show something while a page loads',
});

export const loadingDescription = message({
  ja: '`layout.tsx`か`page.tsx`の横に`loading.tsx`を置くと、その下のページを待っている間に代わりに描かれます。フレームワークがその階層に`<Suspense>`を置き、`loading.tsx`をそのfallbackにします。',
  en: 'A `loading.tsx` beside a `layout.tsx` or a `page.tsx` is rendered while the page below it loads: the framework puts a `<Suspense>` at that level, with `loading.tsx` as its fallback.',
});

export const loadingWhen = message({
  ja: '`loading.tsx`はpropsを受け取りません。描かれるのは、クライアント側の遷移でそのディレクトリに入ったとき、次のページがまだ届いていない間です。',
  en: 'It receives no props. It shows when a client navigation enters its directory and the page there has not arrived yet.',
});

export const loadingKeep = message({
  ja: 'すでに表示しているディレクトリの中で別のページへ移るときは、次のページが届くまで今のページを出したままにします。その間に何かを出したいときは、`@k8ordo/router`の`usePendingPathname()`で遷移中の行き先を読みます。',
  en: 'Moving to another page within a directory already on screen keeps the current page showing until the next one arrives. To show something meanwhile, read where the navigation is going with `usePendingPathname()` from `@k8ordo/router`.',
});

export const routeTitle = message({
  ja: 'ページ以外のものを返す',
  en: 'Answer with something other than a page',
});

export const routeDescription = message({
  ja: 'RSSのフィードやJSONのように、ページではないものを返すURLには`route.ts`を置きます。答えるメソッドの名前で関数をexportし、その関数が`Response`を返します。',
  en: 'A URL that answers with something other than a page — an RSS feed, JSON — gets a `route.ts`. It exports a function named after each method it answers, and that function returns a `Response`.',
});

export const routeContext = message({
  ja: '関数は`{ request, params }`を受け取り、その型は`@k8ordo/router`の`RouteContext`です。`params`には、ページと同じくスキーマで型が付きます。',
  en: 'The function receives `{ request, params }`, typed `RouteContext` from `@k8ordo/router`, and its `params` are typed by the schemas just as a page’s are.',
});

export const routeName = message({
  ja: '`feed.xml`のようにファイル名に見えるディレクトリも、普通の区間です。`feed.xml/route.ts`は`/feed.xml`に答えます。',
  en: 'A directory named like a file is an ordinary segment, so `feed.xml/route.ts` answers `/feed.xml`.',
});

export const routeAlone = message({
  ja: '`route.ts`の答えは、上のレイアウトに包まれません。描くものが無いからです。クライアント側の遷移で`route.ts`のURLへ移るときは、文書の読み込みになります。',
  en: 'The layouts above a `route.ts` do not wrap its answer, since nothing renders. A client navigation to its URL becomes a document load.',
});

export const generatedTitle = message({
  ja: '生成される`.k8ordo/`',
  en: 'The generated `.k8ordo/`',
});

export const generatedDescription = message({
  ja: 'フレームワークは、`routes/`から作ったルート表と型を`.k8ordo/`に書き出します。書くのは`vite dev`の起動時と`vite build`の開始時で、開発中は`routes/`の下のファイルが変わるたびに書き直します。',
  en: 'The framework writes a route table and its types, made from `routes/`, into `.k8ordo/`: when `vite dev` starts, when `vite build` begins, and during development whenever a file under `routes/` changes.',
});

export const generatedFiles = [
  message({
    ja: '`routes.gen.ts`：ルート表そのものです。それぞれのルートのファイルを、そのディレクトリのパターンに対して`satisfies`で検査します。',
    en: '`routes.gen.ts`: the route table itself. It checks each route file against its directory’s pattern with `satisfies`.',
  }),
  message({
    ja: '`register.gen.ts`：ルート表を`@k8ordo/router`の`Register`につなぎます。`href()`や`useMatch()`のパターンが型で検査されるのは、このためです。アプリが`@k8ordo/state`に依存していれば、そちらにもつなぎます。',
    en: '`register.gen.ts`: wires the table into `@k8ordo/router`’s `Register`, which is why the patterns `href()` and `useMatch()` take are type-checked — and into `@k8ordo/state`’s when the application depends on it.',
  }),
  message({
    ja: '`.gitignore`：中身は`*`です。ディレクトリが自分をgitから外すので、アプリの`.gitignore`に足すものはありません。',
    en: '`.gitignore`: holds `*`. The directory keeps itself out of git, so nothing goes into the application’s own.',
  }),
] as const;

export const generatedRead = message({
  ja: '生成物なので編集はしません。ただし`@k8ordo/router`の公開APIだけで書かれた普通のTypeScriptなので、開いて読めば何が検査されているかが分かります。',
  en: 'It is generated, so do not edit it. It is ordinary TypeScript using only `@k8ordo/router`’s public API, though, so reading it shows what is checked.',
});

export const generatedTsc = message({
  ja: '`vite build`は型を検査しないので、`satisfies`の結果は`tsc`で確かめます。`.k8ordo/`はgitに入らないため、cloneしたばかりのリポジトリでは、`tsc`の前に一度`vite dev`か`vite build`を動かします。',
  en: '`vite build` does not type-check, so `tsc` is what reports the `satisfies` checks. `.k8ordo/` is not in git, so in a fresh clone run `vite dev` or `vite build` once before `tsc`.',
});

export const titlesTitle = message({
  ja: 'タイトルとメタデータを書く',
  en: 'Write titles and metadata',
});

export const titlesDescription = message({
  ja: 'メタデータのためのAPIはありません。React 19は木のどこで描かれた`<title>`や`<meta>`、`<link>`も`<head>`へ移すので、ページは自分のタイトルを本文と同じ場所で描きます。',
  en: 'There is no metadata API. React 19 moves a `<title>`, `<meta>` or `<link>` rendered anywhere in the tree into `<head>`, so a page renders its title where it renders everything else.',
});

export const titlesOne = message({
  ja: '画面に出る`<title>`は、いつも1つにします。ルートレイアウトでは描かず、各ページと`not-found.tsx`がそれぞれ1つずつ描きます。2つ描くと2つとも描かれ、後のほうが勝つような仕組みはありません。',
  en: 'Keep one `<title>` on screen at a time: the root layout renders none, and each page and `not-found.tsx` renders its own. Two titles are two titles; nothing makes the later one win.',
});

export const prefetchTitle = message({
  ja: '次のページを先読みする',
  en: 'Fetch the next page ahead',
});

export const prefetchDescription = message({
  ja: 'リンクにポインターが乗ったとき、フォーカスが移ったとき、押され始めたときに、クライアントのランタイムがそのリンク先のペイロードを取りに行きます。クリックした時点で、次のページがもう手元にあることが多くなります。',
  en: 'When a pointer moves onto a link, the link takes focus, or a press starts on it, the client runtime fetches the payload of the page it points to. By the time of the click, the next page is often already in hand.',
});

export const prefetchAny = message({
  ja: '設定は要りません。コンポーネントライブラリが描いた`<a>`も含めて、ページの中のどの`<a>`も対象です。ただし、クリックしてもその場で読み込まないリンクは先読みしません。',
  en: 'There is nothing to set up: every `<a>` counts, the ones a component library renders included. A link a click would not load in place is left alone, though:',
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
  ja: '描くのが重いページへのリンクなどで先読みを止めたいときは、そのリンクか、それを囲む要素に`data-k8ordo-prefetch="false"`を付けます。いちばん近い要素の値が使われるので、止めた範囲の中のリンクに`"true"`を付ければ、そのリンクだけを先読みに戻せます。',
  en: 'To stop it for a link — one to a page that is expensive to render, say — mark the link, or any element around it, `data-k8ordo-prefetch="false"`. The nearest element carrying the attribute decides, so `"true"` brings one link back inside a region that opted out.',
});

export const prefetchOnce = message({
  ja: '先読みしたページは、そのページへの次の遷移で1回だけ使われます。使えるのは取りに行き始めてから30秒以内で、それを過ぎると遷移のときに取り直します。Server Actionの答えが届いたときも、先読みしたものはすべて捨てます。',
  en: 'A prefetched page is used once, by the next navigation to it, and only within 30 seconds of the fetch starting; after that the navigation fetches it again. A Server Action’s answer drops everything prefetched too.',
});

export const prefetchSpeculation = message({
  ja: 'ブラウザのSpeculation Rulesは使いません。Chromiumにしか無く、Baselineに入っていないからです。',
  en: 'The browser’s Speculation Rules are not used: only Chromium has them, and they are not Baseline.',
});

export const demoTitle = message({
  ja: '先読みを確かめる',
  en: 'Watch a prefetch happen',
});

export const demoDescription = message({
  ja: 'このサイトは`@k8ordo/static`で動いているので、リンクに触れると実際にペイロードを取りに行きます。下の一覧には、このページを開いてから取りに行った`index.rsc`を順に出します。',
  en: 'This site runs on `@k8ordo/static`, so touching a link really fetches its payload. The list below shows each `index.rsc` this page fetched since it opened.',
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
    ja: '「パラメータのページ」にポインターを乗せると、一覧にそのページの`index.rsc`が加わります。',
    en: 'Point at “The parameters page”. Its `index.rsc` joins the list.',
  }),
  message({
    ja: '「デプロイのページ」は`data-k8ordo-prefetch="false"`の中にあるので、ポインターを乗せても一覧は増えません。',
    en: '“The deploy page” sits inside `data-k8ordo-prefetch="false"`, so pointing at it adds nothing.',
  }),
  message({
    ja: '「パラメータのページ」にもう一度乗せても、最初に取りに行ってから30秒たつまでは一覧に加わりません。',
    en: 'Point at “The parameters page” again. Nothing is added until 30 seconds after the first fetch.',
  }),
  message({
    ja: 'ヘッダーやサイドバーにある、ほかのページへのリンクに乗せても、同じように一覧に加わります。',
    en: 'Point at a link to another page in the header or the sidebar. It joins the list the same way.',
  }),
] as const;
