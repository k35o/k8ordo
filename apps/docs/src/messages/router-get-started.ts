import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '商品の一覧と商品ごとのページを持つ、ViteとReactのアプリを例にします。ルート表を書いてブラウザに表示し、ページ同士をリンクでつなぎます。',
  en: 'The example is a Vite and React shop with a product list and a page per product. Write a route table, render it in the browser, and link the pages together.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const platform = message({
  ja: 'ナビゲーションにはブラウザのNavigation APIを、パスの照合にはURLPatternを使います。polyfillもフォールバックもありません。',
  en: "Navigation goes through the browser's Navigation API and matching through URLPattern. There is no polyfill and no fallback.",
});

export const tableTitle = message({
  ja: 'ルート表の定義',
  en: 'Defining the route table',
});

export const tableParamCallout = message({
  ja: '`:id`はパスの1区間を受け取るparam',
  en: '`:id` is a param that takes one segment of the path',
});

export const tableWildcardCallout = message({
  ja: '上のどのパターンにも合わないパスを受ける',
  en: 'Takes any path no pattern above it matched',
});

export const tableShape = message({
  ja: 'アプリで開けるパスと、そのパスで表示するページを`defineRoutes`に書きます。キーがパスのパターンで、値がページのコンポーネントです。ページは`props`を受け取らないReactコンポーネントです。',
  en: 'List each path the app serves and the page shown there in `defineRoutes`. A key is a path pattern, and its value is the page component. A page is a React component that takes no `props`.',
});

export const tableMatch = message({
  ja: "`/products/42`を開くと`ProductPage`が表示され、`id`は`'42'`です。パターンは上から順に照合するので、`/*`は最後に置きます。",
  en: "At `/products/42`, `ProductPage` is shown and `id` is `'42'`. Patterns are tried from the top down, so `/*` goes last.",
});

export const tableMoreBefore = message({
  ja: 'ページを移ってもレイアウトは作り直されず、`<Outlet />`の中だけが切り替わります。レイアウトやルートグループの書き方は',
  en: 'Moving between pages keeps layouts mounted and swaps only what is inside `<Outlet />`. Layouts and route groups are covered in ',
});

export const tableMoreAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const mountTitle = message({
  ja: 'ルーターの設置',
  en: 'Mounting the router',
});

export const mountRouter = message({
  ja: '`createRoot`で描画する最上位に`<Router>`を置き、ルート表を渡します。`<Router>`はブラウザで開いているパスを表と照合し、合ったページを表示します。',
  en: "Render `<Router>` at the top of the app and hand it the route table. It matches the browser's current path against the table and shows the matching page.",
});

export const mountBrowserOnlyBefore = message({
  ja: '`<Router>`はブラウザの中で表示するアプリで使います。サーバーで描画する場合やビルド時に生成する場合は、',
  en: '`<Router>` is for an app that renders in the browser. To render on a server or generate pages at build time, use ',
});

export const mountBrowserOnlyAfter = message({
  ja: 'を使います。',
  en: '.',
});

export const linkTitle = message({
  ja: 'リンク',
  en: 'Links',
});

export const paramsTitle = message({
  ja: 'paramの読み取り',
  en: 'Reading params',
});

export const linkHrefCallout = message({
  ja: '`id`を渡し忘れると型エラーになる',
  en: 'Leaving out `id` is a type error',
});

export const linkParamsCallout = message({
  ja: '自分のパターンを渡してparamを読む',
  en: 'Reads the param by the page’s own pattern',
});

export const linkHref = message({
  ja: 'リンク先は`href`にパターンとparamを渡して作ります。paramの型はパターンの文字列から推論されます。',
  en: 'Build a link target by handing `href` the pattern and its params. The param types are inferred from the pattern string.',
});

export const linkAnchor = message({
  ja: 'リンクはただの`<a>`です。押されたときにブラウザが知らせるナビゲーションを`<Router>`が受け取るので、ページ全体は読み込み直されません。',
  en: 'A link is a plain `<a>`. `<Router>` intercepts the navigation the browser reports when it is followed, so the document is not reloaded.',
});

export const linkParams = message({
  ja: 'ページの側では、`useParams`に自分のパターンを渡してparamを読みます。どちらのファイルもルート表をimportしません。',
  en: 'The page reads its params by handing `useParams` its own pattern. Neither file imports the route table.',
});

export const linkRegisterBefore = message({
  ja: '表に無いパターンも型エラーにするには、ルート表を`Register`に登録します。書き方は',
  en: 'To make a pattern the table lacks a type error too, register the route table on `Register`. See ',
});

export const linkRegisterAfter = message({
  ja: 'を見てください。',
  en: '.',
});
