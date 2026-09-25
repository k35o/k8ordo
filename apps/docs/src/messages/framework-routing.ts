import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-routing.ts / server-routing.ts が持つ。

export const treeTitle = message({
  ja: 'ディレクトリが pathname 空間',
  en: 'The directories are the pathname space',
});

export const treeDescription = message({
  ja: '`src/routes/` はアプリの pathname 空間で、それ以外のものは置けません。URL を増やすことはディレクトリを増やすことで、ある URL に答えるファイルはディレクトリ木を読めば 1 つに決まります。規約は覚えておく習慣ではなく、ビルドが検査する形です。',
  en: "`src/routes/` is the application's pathname space, and it holds nothing else. Adding a URL means adding a directory, and the file that answers a URL is found by reading the tree. The convention is not a habit to keep: it is a shape the build checks.",
});

export const urlTable = {
  file: message({ ja: 'ファイル', en: 'File' }),
  url: message({ ja: 'URL', en: 'URL' }),
  role: message({ ja: '役割', en: 'What it is' }),
  rootLayout: message({
    ja: 'すべてを包むルートレイアウト。文書そのもの',
    en: 'The root layout around everything — the document itself',
  }),
  rootPage: message({ ja: 'ルートのページ', en: 'The root page' }),
  notFound: message({
    ja: 'ほかのどれも答えなかった pathname',
    en: 'Any pathname nothing else answered',
  }),
  error: message({
    ja: '下で throw されたとき、代わりに描かれる',
    en: 'Shown in place of what is below it when that throws',
  }),
  redirect: message({
    ja: '訪問者を別の URL へ送る',
    en: 'Sends the visitor to another URL',
  }),
  literal: message({ ja: 'リテラルの区間', en: 'A literal segment' }),
  param: message({
    ja: 'パラメータ。値は `params.id` としてページに渡る',
    en: 'A parameter, handed to the page as `params.id`',
  }),
  groupLayout: message({
    ja: 'グループの中だけを包むレイアウト',
    en: 'A layout wrapping only what is inside the group',
  }),
  groupPage: message({
    ja: 'グループの中のページ。`(docs)` は URL に出ない',
    en: 'A page inside the group; `(docs)` never appears in the URL',
  }),
  private: message({
    ja: '私物。文法から見えない',
    en: 'Private; invisible to the grammar',
  }),
};

export const filesTitle = message({
  ja: '決まったファイル名だけ',
  en: 'A fixed set of filenames',
});

export const filesDescription = message({
  ja: 'ディレクトリの中で文法が受け付けるファイル名は `page.tsx`・`layout.tsx`・`not-found.tsx`・`error.tsx`・`loading.tsx`・`redirect.ts`・`route.ts`・`guard.ts` だけで、拡張子まで含めて完全に一致する必要があります。`page.ts` も `helpers.ts` もビルドが拒みます。それ以外のファイルは、`_` で始まるディレクトリに置きます。',
  en: 'Inside a directory the grammar accepts only `page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx`, `loading.tsx`, `redirect.ts`, `route.ts` and `guard.ts`, matched exactly, extension included, so `page.ts` fails the build as surely as `helpers.ts` does. Everything else goes under a directory whose name starts with `_`.',
});

export const filesTable = {
  file: message({ ja: 'ファイル', en: 'File' }),
  role: message({ ja: '役割', en: 'What it does' }),
  receives: message({ ja: '受け取る props', en: 'Props it receives' }),
  page: message({
    ja: 'そのディレクトリの URL を描く。default export がページ',
    en: "Renders its directory's URL; the default export is the page",
  }),
  layout: message({
    ja: 'その下で描かれるものすべてを `children` で包む',
    en: 'Wraps everything rendered below it, through `children`',
  }),
  notFound: message({
    ja: 'そのディレクトリ以下で、ほかのどれも答えなかった pathname に答える',
    en: 'Answers any pathname below its directory that nothing else did',
  }),
  error: message({
    ja: "`'use client'` のファイル。下で throw されたとき、代わりに描かれる",
    en: "A `'use client'` file, shown in place of what is below it when that throws",
  }),
  redirect: message({
    ja: 'ページの代わりに、行き先を default export する',
    en: 'Default-exports where to send the visitor, instead of a page',
  }),
  loading: message({
    ja: 'その下がサスペンドしている間に出す。その階層に `<Suspense>` が置かれる',
    en: 'Shown while what is below it suspends — a `<Suspense>` at that level',
  }),
  route: message({
    ja: 'ページの代わりに、export したメソッドの関数が `Response` で答える（フィードや JSON）',
    en: 'Answers with a `Response` from the function named after the request method, instead of a page — a feed, JSON',
  }),
  guard: message({
    ja: 'その下で答えるものの前に走る。`Response` を返せばそこで打ち切る（`@k8ordo/server` だけ。`@k8ordo/static` は拒む）',
    en: 'Runs before whatever answers below it; a returned `Response` ends the request — `@k8ordo/server` only, `@k8ordo/static` refuses it',
  }),
  nothing: message({ ja: 'なし（描画しない）', en: 'None — nothing renders' }),
  noProps: message({ ja: 'なし', en: 'None' }),
};

export const segmentsTitle = message({
  ja: 'ディレクトリ名の 4 つの形',
  en: 'Four kinds of directory name',
});

export const segmentsDescription = message({
  ja: 'ディレクトリの名前が、URL に何を足すか、何も足さないかを決めます。',
  en: "A directory's name decides what it adds to the URL, if anything.",
});

export const segmentsTable = {
  form: message({ ja: '名前', en: 'Name' }),
  adds: message({ ja: 'URL に足すもの', en: 'Adds to the URL' }),
  meaning: message({ ja: '意味', en: 'Meaning' }),
  none: message({ ja: 'なし', en: 'Nothing' }),
  literal: message({
    ja: '文字・数字・`.`・`_`・`~`・`-` だけの名前は、書いたとおり 1 つの区間になります。大文字も使えます。',
    en: 'A name of letters, digits, `.`, `_`, `~` and `-` is one URL segment, exactly as written. Upper-case letters are allowed.',
  }),
  param: message({
    ja: '1 区間を受け取るパラメータです。名前は文字か `_` で始まり、文字・数字・`_` が続きます。同じパスの上で同じ名前は 2 度使えません。',
    en: 'A parameter taking one segment. Its name starts with a letter or `_`, followed by letters, digits or `_`, and a name may appear only once along a path.',
  }),
  group: message({
    ja: '区間を足さないグループです。木の一部にだけ効くレイアウトやエラー境界を持たせるためにあります。名前には文字・数字・`_`・`-` を使います。',
    en: 'A group, adding no segment. It exists to give part of the tree its own layout or error boundary. Its name uses letters, digits, `_` and `-`.',
  }),
  private: message({
    ja: '`_` か `.` で始まる名前は、ディレクトリでもファイルでも文法から見えません。ルート専用の部品やデータはここに置きます。',
    en: 'A name starting with `_` or `.` — directory or file — is invisible to the grammar. Components and data private to a route live here.',
  }),
};

export const segmentsNoRest = message({
  ja: '可変長のパラメータ（`[...rest]` のような形）はありません。ワイルドカードは 1 つだけで、それが `not-found.tsx` です。`[...rest]` という名前のディレクトリは、不正なパラメータディレクトリとして拒まれます。',
  en: 'There is no variable-length parameter such as `[...rest]`. The grammar has one wildcard, and it is `not-found.tsx`; a directory named `[...rest]` is refused as an invalid param directory.',
});

export const propsTitle = message({
  ja: 'ページは params を、レイアウトは children を受け取る',
  en: 'A page receives params; a layout receives children',
});

export const propsDescription = message({
  ja: 'Server Component は context を読めないので、入れ子は props で渡ります。レイアウトは自分の下で描かれたものを `children` として受け取り、ページは自分のパターンのパラメータを `params` として受け取ります。どちらも `pathname`、つまりこの描画が対象にしている URL を受け取ります。パラメータより上にあるコンポーネントがその値を見る方法は、これしかありません。',
  en: "Server Components cannot read context, so nesting travels by prop: a layout receives what renders below it as `children`, and a page receives its pattern's parameters as `params`. Both receive `pathname`, the URL this render is for — the only way a component above a parameter can see the value that parameter names.",
});

export const propsTypes = message({
  ja: '`@k8ordo/router` の `PageProps<pattern>` と `LayoutProps<pattern>` は、この props をパターンで表した型です。生成された `Register` を読むので、ページはどちらのモードが入っているかに依存しません。props をインラインで書いても構いません。どちらの書き方でも、生成された表がコンポーネントを使う位置で `satisfies` によって検査し、それを報告するのは `tsc` です。',
  en: '`PageProps<pattern>` and `LayoutProps<pattern>` from `@k8ordo/router` are those props by pattern. They read the generated `Register`, so nothing in the page depends on which mode is installed. Declaring the props inline works as well: either way the generated table checks them where it uses the component (`satisfies`), and `tsc` is what reports it.',
});

export const propsSite = message({
  ja: 'このサイトのルートレイアウトは、`<html lang>` を `pathname` の先頭区間から決めています。ロケールは URL にしか無く、クローラや読み上げが読むのはサーバーが書いた HTML だからです。',
  en: "This site's root layout decides `<html lang>` from the first segment of `pathname`: the locale lives only in the URL, and crawlers and screen readers read the HTML the server wrote.",
});

export const orderTitle = message({
  ja: '照合の順序',
  en: 'The order patterns are tried in',
});

export const orderDescription = message({
  ja: 'ディレクトリ木そのものには順序が無いので、生成される表が順序を決めます。同じ階層ではリテラルの区間がパラメータより先に試され、`not-found.tsx` はその枝の最後に置かれます。`about/` と `[slug]/` が並んでいても、何も書かずに `/about` が届くのはこのためです。',
  en: 'A directory tree has no order of its own, so the generated table chooses one: at each level a literal segment is tried before a parameter, and `not-found.tsx` comes last in its branch. That is why `about/` beside `[slug]/` reaches `/about` without anything being said.',
});

export const orderGroups = message({
  ja: 'グループだけは例外になりえます。グループは両方の種類の URL を 1 つのキーの下にまとめるので、表はその境界をまたいで並べ替えられません。次の木では、グループの中にリテラルの `sale/` があるためにグループが `about/` と同じ順位になり、名前の並びで先に置かれたグループの `[id]/` が `/about` に先に答えてしまいます。宣言されたルートが決して描かれない形はここにしか生まれず、ビルドはそれを出荷せずに報告します。',
  en: "A group is the one exception. It holds URLs of both kinds under one key, and the table cannot interleave across it. In the tree below, the literal `sale/` inside the group ranks it level with `about/`, the group's name sorts first, and its `[id]/` then answers `/about` before `about/` is tried. This is the one shape where a declared route can never render, so the build reports it rather than shipping it.",
});

export const refusesTitle = message({
  ja: 'ビルドが拒むもの',
  en: 'What the build refuses',
});

export const refusesDescription = message({
  ja: '問題は最初の 1 件だけでなく全部報告され、どれもファイルを名指します。ビルドは `routes/ is not a valid pathname space:` に続けて 1 行ずつ並べて止まります。`vite dev` も、起動の時点で問題があれば同じエラーで起動しません。起動した後の変更が問題を生んだときは、サーバーを止めずに `routes/<path>: <message>` の行をログに出します。問題があるあいだ、`.k8ordo/` は書き直されません。',
  en: 'Every problem is reported, not just the first, and each names its file. The build stops with `routes/ is not a valid pathname space:` followed by one line per problem, and `vite dev` refuses to start with the same error when the problem is there at startup. A problem introduced while `vite dev` is running is logged as `routes/<path>: <message>`, and the server keeps running. While there are problems, `.k8ordo/` is not rewritten.',
});

export const refusesTable = {
  contains: message({ ja: 'routes/ にあるもの', en: 'routes/ contains' }),
  error: message({ ja: 'エラー', en: 'Error' }),
  noPageBelow: message({
    ja: '`orphan/layout.tsx` だけがあり、下にページが無い',
    en: '`orphan/layout.tsx` and no page below it',
  }),
  nothingBelow: message({
    ja: '`empty/error.tsx` だけがあり、下にページもリダイレクトも無い',
    en: '`empty/error.tsx` and no page or redirect below it',
  }),
  twoGroups: message({
    ja: '`(a)/page.tsx` と `(b)/page.tsx`',
    en: '`(a)/page.tsx` and `(b)/page.tsx`',
  }),
  pageAndRedirect: message({
    ja: '`old/page.tsx` と `old/redirect.ts`',
    en: '`old/page.tsx` and `old/redirect.ts`',
  }),
  pageAndRoute: message({
    ja: '`api/page.tsx` と `api/route.ts`',
    en: '`api/page.tsx` and `api/route.ts`',
  }),
  redirectAndRoute: message({
    ja: '`old/redirect.ts` と `old/route.ts`',
    en: '`old/redirect.ts` and `old/route.ts`',
  }),
  silentRoute: message({
    ja: 'メソッドを 1 つも export しない `api/route.ts`',
    en: '`api/route.ts` exporting no method',
  }),
  groupShadow: message({
    ja: '`(shop)/sale/page.tsx` と `(shop)/[id]/page.tsx` の横に `about/page.tsx`',
    en: '`(shop)/sale/page.tsx` and `(shop)/[id]/page.tsx` beside `about/page.tsx`',
  }),
  catchAllShadow: message({
    ja: '`(shell)/docs/page.tsx` と `(shell)/not-found.tsx` の横に `about/page.tsx`',
    en: '`(shell)/docs/page.tsx` and `(shell)/not-found.tsx` beside `about/page.tsx`',
  }),
};

export const refusesShadowing = message({
  ja: '隠されたルートの検査は、文法の問題が 1 つも無い木にだけ走ります。文法が拒んだ名前はパターンにならないからです。そのため、文法の問題を直した次の実行で、隠されたルートが初めて報告されることがあります。',
  en: 'The shadowing check runs only on a tree with no grammar problems, because a name the grammar refused is not a pattern. Fixing the grammar problems can therefore surface a shadowed route on the next run.',
});

export const generatedTitle = message({
  ja: '生成されるファイル',
  en: 'The generated files',
});

export const generatedDescription = message({
  ja: 'フレームワークは `.k8ordo/` を書き、ディレクトリと同期させ続けます。書かれるのは `vite dev` の起動時と `vite build` の開始時で、開発中は `routes/` の下のファイルが追加・削除・変更されるたびに書き直されます。生成物なので編集するものではありませんが、ルーターの公開 API だけを使ったただのソースなので、読むものではあります。',
  en: "The framework writes `.k8ordo/` and keeps it in step with the directories: when `vite dev` starts and when `vite build` begins, and again during development whenever a file under `routes/` is added, removed or changed. It is generated and not yours to edit — but it is ordinary source using only the router's public API, so it is yours to read.",
});

export const generatedTable = {
  file: message({ ja: 'ファイル', en: 'File' }),
  holds: message({ ja: '中身', en: 'What it holds' }),
  routes: message({
    ja: '表そのもの（`routes`）、ページのパターンごとに走るスキーマ（`paramSchemas`）、リダイレクト（`redirects`）。各ルートファイルは `satisfies` で、自分のディレクトリが置かれたパターンに対して検査されます。',
    en: 'The table itself (`routes`), the schemas that run per page pattern (`paramSchemas`), and the redirects (`redirects`). Each route file is checked with `satisfies` against the pattern its directory puts it under.',
  }),
  register: message({
    ja: '表を `@k8ordo/router` の `Register` に結び、アプリが `@k8ordo/state` に依存していればそちらにも結びます。`href` や `useMatch` のパターンが表に対して検査されるのはこのためです。',
    en: "Wires the table into `@k8ordo/router`'s `Register`, and into `@k8ordo/state`'s when the application depends on it — which is why the patterns `href` and `useMatch` take are checked against the table.",
  }),
  gitignore: message({
    ja: '中身は `*` です。ディレクトリが自分自身を git から外すので、アプリの `.gitignore` に足すものはありません。',
    en: "Contains `*`: the directory ignores itself, so there is nothing to add to the application's own `.gitignore`.",
  }),
};

export const generatedExample = message({
  ja: '次の木からは、下の 2 つのファイルが生成されます。どちらも抜粋で、`routes.gen.ts` は `routes` の export だけを、`register.gen.ts` はアプリが `@k8ordo/state` に依存しないときの宣言だけを示しています。実際のファイルはどちらも `// Generated by …` の行で始まり、どのモードのパッケージが生成したかを名乗ります。',
  en: 'This tree produces the two files below, both excerpted: `routes.gen.ts` down to its `routes` export, and `register.gen.ts` to its declaration for an application that does not depend on `@k8ordo/state`. The real files begin with a `// Generated by …` line naming the mode package that wrote them.',
});

export const generatedTsconfig = message({
  ja: '型の配線を効かせるには、`tsconfig.json` の `include` に `.k8ordo` をグロブで書きます。`.k8ordo` はドットで始まるので、ディレクトリ名だけを書いた `include` は黙ってそれを飛ばします。飛ばされてもビルドは通り、`href` が表に対して検査されなくなるだけです。',
  en: "For the type wiring to apply, list `.k8ordo` in `tsconfig.json`'s `include` with a glob. The name starts with a dot, and a bare directory entry silently skips it — the build still works, and `href` simply stops being checked against the table.",
});

export const generatedTypecheck = message({
  ja: '`vite build` は型を検査しません。`satisfies` による検査の結果を出すのは `tsc` です。`.k8ordo/` は git に入らないので、新しいチェックアウトでは `tsc` の前に一度 `vite dev` か `vite build` を走らせて書かせます。',
  en: '`vite build` does not type-check; the `satisfies` checks report through `tsc`. `.k8ordo/` is not in git, so on a fresh checkout run `vite dev` or `vite build` once before `tsc` to write it.',
});

export const titlesTitle = message({
  ja: 'タイトルとメタデータ',
  en: 'Titles and metadata',
});

export const titlesDescription = message({
  ja: 'メタデータの API はありません。React 19 は木のどこで描かれた `<title>`・`<meta>`・`<link>` も `<head>` へ持ち上げるので、ページは自分のタイトルを、ほかのものと同じ場所で描きます。',
  en: 'There is no metadata API: React 19 hoists a `<title>`, `<meta>` or `<link>` rendered anywhere in the tree into `<head>`, so a page renders its own title where it renders everything else.',
});

export const titlesOne = message({
  ja: '画面上の `<title>` は常に 1 つにします。ルートレイアウトは何も描かず、各ページと `not-found.tsx` が 1 つずつ描きます。2 つ描けば 2 つとも描かれるだけで、後のものが勝つ仕組みはありません。このサイトは、各ページのタイトルを `PageTitle` というコンポーネントを通して描いています。',
  en: "Keep one `<title>` on screen at a time: the root layout renders none, and each page and `not-found.tsx` renders its own. Two titles are two titles, not a fallback chain — React renders both. This site renders each page's through a `PageTitle` component.",
});

export const linksTitle = message({
  ja: 'リンクは表に対して型が付く',
  en: 'Links are checked against the table',
});

export const linksDescription = message({
  ja: 'ブラウザでのナビゲーションは `@k8ordo/router` が担います。Navigation API の下では素の `<a>` がそのままクライアント遷移になり、`href()` のパターンと params は生成された表に対して検査されます。',
  en: "Navigation in the browser is `@k8ordo/router`'s. Under the Navigation API a plain `<a>` is already a client navigation, and the pattern and params given to `href()` are checked against the generated table.",
});

export const linksMore = message({
  ja: 'フレームワークの下でルーターがどう振る舞うかは、リンク先にあります。',
  en: 'How the router behaves under the framework is covered here.',
});

export const prefetchTitle = message({
  ja: 'リンクに触れた時点で次のページを取りに行く',
  en: 'The next page is fetched when a link is touched',
});

export const prefetchDescription = message({
  ja: 'クライアントのランタイムは文書全体で、リンクへのポインターの乗り（`pointerover`）、フォーカス（`focusin`）、押し始め（`pointerdown`）を拾い、その先のページのペイロードをその場で取りに行きます。クリックが届く頃には、ページが手元にあることが多くなります。配線は要りません。コンポーネントライブラリが描く `<a>` も含め、どの `<a>` も対象です。取りに行くのは、クリックでその場に読み込まれるリンクだけです。',
  en: 'The client runtime listens on the whole document for a pointer moving onto a link (`pointerover`), a link taking focus (`focusin`) and a press starting on one (`pointerdown`), and fetches that page’s payload there and then — so a click often finds the page already in hand. Nothing needs wiring: any `<a>` counts, the ones a component library renders included. Only a link a click would load in place is fetched:',
});

export const prefetchSameOrigin = message({
  ja: '同じオリジンで、Vite の `base` の下にあるリンク',
  en: 'one to the same origin, below Vite’s `base`',
});

export const prefetchInPlace = message({
  ja: '`download` が無く、`target` が無いか `_self` のリンク',
  en: 'one with no `download`, and no `target` other than `_self`',
});

export const prefetchOnScreen = message({
  ja: '画面に出ているページ以外へのリンク。同じページへのリンクで変わるのは検索や fragment だけだからです',
  en: 'one to a page other than the one on screen, where only the search or the fragment would change',
});

export const prefetchStopTitle = message({
  ja: '止めたいリンク',
  en: 'Stopping it for a link',
});

export const prefetchStop = message({
  ja: '描くのが重いページへのリンクなどは、そのリンクか、それを囲むどれかの要素に `data-k8ordo-prefetch="false"` を付けると止まります。JSX の `data-k8ordo-prefetch={false}` も同じものを描きます。決めるのは、この属性を持ついちばん近い要素なので、止めた領域の中のリンクに `"true"` を付ければ、そのリンクだけ戻せます。',
  en: 'For a link whose page is expensive to render, say, mark the link — or any element around it — `data-k8ordo-prefetch="false"`; `data-k8ordo-prefetch={false}` in JSX renders the same. The nearest element carrying the attribute decides, so `"true"` opts a link back in inside a region that opted out.',
});

export const prefetchReuseTitle = message({
  ja: '取ったものを使う範囲',
  en: 'How long a prefetched page is used',
});

export const prefetchReuse = message({
  ja: '取ったページは、そのページへの次の遷移で 1 度だけ使われます。使われるのは、取りに行き始めてから 30 秒以内に遷移が始まったときだけです。それを過ぎたか、1 度使われた後は、先読みが無かったときと同じようにページを取り直します。ポインターを乗せたまま離れたページが、後になってそのときの姿で出てくることはありません。',
  en: 'A prefetched page is used by the next navigation to it, once, and only if that navigation starts within 30 seconds of the fetch starting. After that — or once a navigation has used it — the page is fetched afresh, as it would have been with nothing prefetched, so a page hovered and left alone never shows up later as it was then.',
});

export const prefetchDropped = message({
  ja: 'Server Action の答えが届くと、先読みしたものはすべて捨てます。アクションがそれらのページの中身を変えたかもしれないからです。失敗した先読みもその場で捨てるので、遷移はもう一度取りに行きます。遷移に使われる前に捨てた先読みは、まだ届いていなければ中断します。遷移が使った先読みは、その遷移が別の遷移に追い越されたときに一緒に中断します。遷移が自分で始めた fetch と同じ扱いです。',
  en: 'A Server Action’s answer drops everything prefetched, since the action may have changed what those pages show; a prefetch that failed is dropped at once, so the navigation asks again. A prefetch dropped before any navigation used it is cancelled if it is still on its way, and one a navigation took is cancelled with that navigation when another overtakes it — the same as a fetch the navigation had started itself.',
});

export const prefetchStatic = message({
  ja: 'このモードでは、先読みはファイルへのリクエストです。',
  en: 'In this mode a prefetch is a request for a file.',
});

export const prefetchServer = message({
  ja: 'このモードでは、先読みは遷移と同じくサーバーでの描画です。描くのが重いページへのリンクに属性を付けるのは、そのためです。',
  en: 'In this mode a prefetch is a render on the server, as a navigation is — the reason to mark a link to an expensive page.',
});

export const prefetchSpeculation = message({
  ja: 'プラットフォームの Speculation Rules は使いません。Chromium にしか無く、Baseline ではないからです。',
  en: 'The platform’s Speculation Rules are not used: they are Chromium’s alone, not Baseline.',
});

/** 両モードの「はじめに」が共有する、設定と最小のルートの説明。 */
export const setup = {
  configTitle: message({ ja: 'vite.config.ts', en: 'vite.config.ts' }),
  pluginsNote: message({
    ja: '`framework()` は Vite のプラグインの配列を返し、その中に React のプラグイン（Fast Refresh）と RSC のパイプラインがすでに入っています。`@vitejs/plugin-react` を自分で足す必要はありません。',
    en: "`framework()` returns an array of Vite plugins that already includes React's plugin (Fast Refresh) and the RSC pipeline, so there is no `@vitejs/plugin-react` to add yourself.",
  }),
  tsconfigTitle: message({ ja: 'tsconfig.json', en: 'tsconfig.json' }),
  routesTitle: message({ ja: '最小の routes/', en: 'The smallest routes/' }),
  routesDescription: message({
    ja: 'ルートレイアウトが `<html>` と `<body>` を描きます。フレームワークは文書のテンプレートを持ちません。見えないテンプレートは、変えられないテンプレートだからです。ディレクティブの無いファイルは Server Component です。',
    en: 'The root layout renders `<html>` and `<body>`. The framework has no document template of its own, because a template you cannot see is a template you cannot change. A file with no directive is a Server Component.',
  }),
  documentTitle: message({
    ja: 'ルートレイアウトは文書そのもの',
    en: 'The root layout is the document',
  }),
  documentDescription: message({
    ja: 'hydration は文書の全体を照合します。フレームワークが書いた HTML とブラウザのあいだで、HTML を書き換えるもの、たとえば Web フォントをインライン化したり、メールアドレスを難読化したり、スクリプトを遅延させたりする CDN は、React が照合しようとしている木を変えてしまい、その差分で hydration が失敗します。影響を受けない方法は、そうしたサービスに書き換える余地を与えないことです。アセットは別のオリジンから読まず、同じオリジンから配信します。',
    en: 'Hydration checks all of the document. Anything that rewrites the HTML between what the framework wrote and the browser — a CDN that inlines web fonts, obfuscates email addresses or defers scripts — changes a tree React is about to reconcile, and hydration fails on the difference. The way to be unaffected is to give such a service nothing to rewrite: serve the assets from the same origin rather than linking them from another one.',
  }),
  generatedTitle: message({
    ja: '生成されるもの',
    en: 'What gets generated',
  }),
  generatedDescription: message({
    ja: '最初の `vite dev` か `vite build` が `.k8ordo/` を書きます。ルート表（`routes.gen.ts`）、それを `@k8ordo/router` に結ぶ型の配線（`register.gen.ts`）、そして自分自身を git から外す `.gitignore` です。',
    en: 'The first `vite dev` or `vite build` writes `.k8ordo/`: the route table (`routes.gen.ts`), the type wiring that ties it into `@k8ordo/router` (`register.gen.ts`), and a `.gitignore` that keeps the directory out of git.',
  }),
  generatedMore: message({
    ja: '中身と、ビルドが拒むものは、リンク先にあります。',
    en: 'What is in them, and what the build refuses, is covered here.',
  }),
};

export const routeTitle = message({
  ja: '`route.ts` — ページではない答え',
  en: '`route.ts` — answers that are not pages',
});

export const routeDescription = message({
  ja: '`route.ts` は、そのディレクトリの URL にページではなく `Response` で答えます。RSS のフィード、`robots.txt`、JSON、webhook などです。答えるリクエストのメソッドごとに関数を export します。',
  en: 'A `route.ts` answers its directory’s URL with a `Response` rather than a page — an RSS feed, `robots.txt`, JSON, a webhook. It exports a function for each request method it answers.',
});

export const routeReceives = message({
  ja: 'ファイル名のようなディレクトリ名もただの区間なので、`feed.xml/route.ts` は `/feed.xml` に答えます。各関数は `{ request, params }` を受け取ります。`params` はページと同じく、スタックに沿った `paramsSchema` の出力で型が付きます（`route.ts` 自身も export できます）。型は `@k8ordo/router` の `RouteContext<P>` で、生成された表も各モジュールをパターンで検査します。メソッドを 1 つも export しない `route.ts` は拒みます。答えられるのは `405` だけになるからです。',
  en: 'A directory named like a file is an ordinary segment, so `feed.xml/route.ts` answers `/feed.xml`. Each export receives `{ request, params }`, with `params` typed by the `paramsSchema` exports along its stack as a page’s are — a `route.ts` may export one too. `RouteContext<P>` from `@k8ordo/router` is the type, and the generated table checks each module against its pattern. A `route.ts` exporting no method is refused, since it could only ever answer `405`.',
});

export const routeOrder = message({
  ja: '1 つのディレクトリは `route.ts` で答えるか `page.tsx` を描くか（またはリダイレクトするか）のどれか 1 つで、`route.ts` の上のレイアウトはそれを包みません。何も描かないからです。表の順番にはページと同じく並ぶので、`api/[id]/route.ts` の横の `api/latest/page.tsx` は `/api/latest` をページのまま受け持ちます。クライアント遷移で行き着くとペイロードは無く、文書の読み込みになります。',
  en: 'A directory answers from a `route.ts` or renders a `page.tsx` (or redirects), never two of them, and the layouts above a `route.ts` do not wrap it — nothing renders. It takes its place in the table’s order the way a page does, so `api/[id]/route.ts` beside `api/latest/page.tsx` leaves `/api/latest` to the page. A client navigation to it gets no payload, and loads the document instead.',
});

export const loadingTitle = message({
  ja: '`loading.tsx` — ページが来るまで',
  en: '`loading.tsx` — while a page loads',
});

export const loadingDescription = message({
  ja: 'レイアウト（またはページ）の横の `loading.tsx` は、その下がサスペンドしている間に出るものです。フレームワークがその階層に `<Suspense>` を置き、その階層の `error.tsx` の境界の内側に入れます。props は受け取りません。',
  en: 'A `loading.tsx` beside a `layout.tsx` (or a `page.tsx`) is what shows while what is below it suspends: a `<Suspense>` the framework puts at that level, inside its `error.tsx` boundary. It receives no props.',
});

export const loadingWhen = message({
  ja: 'クライアント遷移でそのディレクトリに入り、ページがまだ届いていないとき、そしてページの中がストリームの途中でサスペンドしたときに出ます。すでに画面にあるものの下でのページの切り替えは、ほかの切り替えと同じく、次のページが来るまで今のページを出したままにします。その待ちを見せるのが `@k8ordo/router` の `usePendingPathname()` です。',
  en: 'It shows when a client navigation enters its directory while the page there is still on its way, and for whatever inside the page suspends as it streams. A page change below one already on screen keeps the current page showing while the next one loads, as every page change does; `usePendingPathname()` from `@k8ordo/router` is how a link or a bar says that one is under way.',
});
