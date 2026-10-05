import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '商品の一覧と商品ごとのページを持つ小さなアプリを作りながら、`@k8ordo/router`の使い方を最初から最後までたどります。アプリが答えるパスはルート表に1度だけ書き、リンクとその型の検査はルート表から作ります。ここで作るのは、ViteとReactでブラウザの中だけで動くアプリです。',
  en: 'Build a small shop with a product list and a page per product, and follow `@k8ordo/router` from start to finish. Every path the app answers is written once, in a route table, and the links and their type checks come from it. The app here runs entirely in the browser, on Vite and React.',
});

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const installDescription = message({
  ja: 'ViteとReactで作ったアプリに、`@k8ordo/router`を追加します。',
  en: 'Add `@k8ordo/router` to an app built with Vite and React.',
});

export const peersDescription = message({
  ja: 'このほかに、次のパッケージをpeer dependenciesとして使います。',
  en: 'It also relies on these peer dependencies.',
});

export const peerReact = message({
  ja: '`<Router>`と、`usePathname`などのフック',
  en: '`<Router>` and the hooks, such as `usePathname`',
});

export const peerTypes = message({
  ja: '同梱している型定義',
  en: 'The type declarations it ships',
});

export const platform = message({
  ja: 'ナビゲーションにはブラウザのNavigation APIを、パスの照合にはURLPatternを、そのまま使います。どちらもBaselineのNewly availableに達しているので、polyfillは同梱していません。',
  en: 'Navigation runs on the browser’s Navigation API and matching on URLPattern, both used as they are. Both have reached Baseline Newly available, so no polyfill ships with the package.',
});

export const tableTitle = message({
  ja: 'ルート表を作る',
  en: 'Write the route table',
});

export const tableDescription = message({
  ja: 'まず、アプリが答えるパスと、そのパスで描くページの対応を`defineRoutes`で書きます。キーがパスのパターンで、値がページのコンポーネントです。',
  en: 'First, use `defineRoutes` to pair each path the app answers with the page it renders. A key is a path pattern, and its value is the page component.',
});

export const tableParam = message({
  ja: "`:id`は、パスのその位置にある1区間を受け取るparamです。`/products/42`を開くと、`id`は`'42'`になります。",
  en: "`:id` is a param that takes the one segment at that place in the path. At `/products/42`, `id` is `'42'`.",
});

export const tableWildcard = message({
  ja: '`/*`は、それより前のどのパターンにも合わなかったパスを受けます。パターンは上から順に照合するので、`/*`は最後に置きます。',
  en: '`/*` takes whatever path no pattern above it matched. Patterns are tried from the top down, so `/*` goes last.',
});

export const tablePages = message({
  ja: 'ページはふつうのReactコンポーネントで、propsは受け取りません。',
  en: 'A page is an ordinary React component, and it receives no props.',
});

export const mountTitle = message({
  ja: 'ブラウザに表示する',
  en: 'Show it in the browser',
});

export const mountDescription = message({
  ja: '次に、アプリの根で`<Router>`にルート表を渡します。`<Router>`はブラウザがいま開いているパスを表と照合し、合ったページを描きます。',
  en: 'Next, hand the route table to `<Router>` at the root of the app. `<Router>` matches the path the browser is on against the table, and renders the page that fits.',
});

export const mountResult = message({
  ja: 'これで、`/products`を開くと`ProductList`が描かれます。`/nowhere`のように、ほかのどのパターンにも合わないパスを開くと`NotFound`が描かれます。',
  en: 'Now `/products` renders `ProductList`, and a path no other pattern fits, such as `/nowhere`, renders `NotFound`.',
});

export const mountBrowserOnly = message({
  ja: '`<Router>`は、ブラウザの中で描くアプリのためのものです。サーバーやビルドの時点でページを描くなら、`@k8ordo/static`か`@k8ordo/server`を使います。',
  en: '`<Router>` is for an app that renders in the browser. To render pages on a server or at build time, use `@k8ordo/static` or `@k8ordo/server`.',
});

export const layoutTitle = message({
  ja: 'レイアウトで包む',
  en: 'Wrap the pages in a layout',
});

export const layoutDescription = message({
  ja: 'ヘッダーのように、どのページにも出す部分はレイアウトに書きます。ルート表では、ページを`children`にまとめ、それを包むコンポーネントを`layout`に書いたオブジェクトにします。',
  en: 'What every page shows, such as a header, goes in a layout. In the route table, the pages move into `children`, and the component that wraps them goes in `layout`.',
});

export const layoutOutlet = message({
  ja: 'レイアウトは、自分が包むページを`<Outlet />`の位置に描きます。',
  en: 'A layout renders the page it wraps where it puts `<Outlet />`.',
});

export const layoutRoot = message({
  ja: '`/`のキーに置いたオブジェクトは、パスに何も足しません。そのため、`children`の中のパターンは、そのまま`/products`や`/products/:id`として照合されます。',
  en: 'An object under the `/` key adds nothing to the path, so the patterns in its `children` still match as `/products` and `/products/:id`.',
});

export const layoutAnchor = message({
  ja: 'ヘッダーのリンクはただの`<a>`です。リンクを押すとブラウザが知らせるナビゲーションを`<Router>`が受け取るので、ページ全体は読み込み直されません。レイアウトはそのまま残り、`<Outlet />`の中だけが切り替わります。',
  en: 'The header’s links are plain `<a>` elements. `<Router>` receives the navigation the browser announces for a click, so the document is never reloaded: the layout stays, and only what is inside `<Outlet />` changes.',
});

export const linkTitle = message({
  ja: 'paramを含むリンクを張る',
  en: 'Link to a page with a param',
});

export const linkDescription = message({
  ja: '商品ごとのページへのリンクは、`href`にパターンとparamを渡して作ります。パターンの文字列からparamの型が決まるので、`id`を渡し忘れると型エラーになります。',
  en: 'A link to a product’s page is built by handing `href` the pattern and its param. The param’s type comes from the pattern string, so leaving out `id` is a type error.',
});

export const linkParams = message({
  ja: 'ページの側では、`useParams`に自分のパターンを渡してparamを読みます。',
  en: 'The page reads its param by handing `useParams` its own pattern.',
});

export const linkNoImport = message({
  ja: 'どちらのファイルも、ルート表をimportしていません。パターンの文字列だけで書くので、ルート表とページが互いをimportし合うことはありません。',
  en: 'Neither file imports the route table. They work from the pattern string alone, so the table and its pages never import each other.',
});

export const registerTitle = message({
  ja: '表にあるパターンだけを受け付ける',
  en: 'Accept only patterns in the table',
});

export const registerDescription = message({
  ja: 'ここまででも、paramの渡し忘れは型エラーになります。ただし、パターンそのものの書き間違いはまだ通ります。ルート表を`Register`に登録すると、表に無いパターンも型エラーになります。',
  en: 'A missing param is already a type error, but a typo in the pattern itself still passes. Register the route table on `Register`, and a pattern the table lacks fails to compile too.',
});

export const registerTypo = message({
  ja: '表に無いパターンなので型エラーになる',
  en: 'Not a pattern in the table: a type error',
});

export const registerMissing = message({
  ja: ':idが無いので型エラーになる',
  en: 'No :id: a type error',
});

export const registerOnce = message({
  ja: '登録は、アプリの中で1度だけ行います。ライブラリで登録すると、そのライブラリを使うすべてのアプリに、自分のルート表を押し付けることになるからです。',
  en: 'Register once, in the app. A library that registered would impose its route table on every app that uses it.',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextRoutes = message({
  ja: 'ページのまとめ方や照合の順序など、ルート表の書き方を詳しく知る。',
  en: 'Learn the route table in depth: grouping pages, and the order patterns match in.',
});

export const nextLinks = message({
  ja: '`navigateTo`でページを移り、移り終わるのを待つ。',
  en: 'Change pages with `navigateTo`, and wait until the new page is on screen.',
});

export const nextLocation = message({
  ja: 'いま開いているページに合わせて、リンクに印を付ける。',
  en: 'Mark the link to the page you are on.',
});
