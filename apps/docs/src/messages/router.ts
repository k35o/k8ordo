import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'URL の pathname 軸を所有します。ルート表がアプリの pathname スキーマそのもので、そこから型・マッチング・リンク・ナビゲーションのすべてが導かれます。search params と履歴エントリの状態は @k8ordo/state の担当で、この境界は URL の "?" と一致します。',
  en: "The URL's pathname axis, owned. The route table is the application's pathname schema, and from it come the types, the matching, the links and the navigation. Search params and history-entry state belong to @k8ordo/state — the division is the URL's own \"?\".",
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featureTable = message({
  ja: '表が pathname スキーマ',
  en: 'The table is the schema',
});

export const featureTableDescription = message({
  ja: 'leaf・branch・`:param`・ワイルドカード・URL に出ないグループを 1 つの表で書きます。照合は宣言順で先勝ち。特異度ランキングのような、あとから逆算しないと分からない規則を持ちません。',
  en: 'Leaves, branches, `:param` segments, wildcards and groups that structure without appearing in the URL, all in one table. Matching is in declaration order, first match wins — no specificity ranking to reason backwards from.',
});

export const featureTypes = message({
  ja: 'パターンから型が生える',
  en: 'Types come from the pattern',
});

export const featureTypesDescription = message({
  ja: 'params はパターン文字列から推論され、`Register` を宣言すれば表に無いパターンもコンパイルで落ちます。コード生成はありません。',
  en: 'Params are inferred from the pattern literal, and once `Register` is declared a pattern the table does not have fails to compile. No code generation.',
});

export const featureNavigation = message({
  ja: 'finished は「画面に出た」',
  en: 'finished means on screen',
});

export const featureNavigationDescription = message({
  ja: 'intercept のハンドラは React が新しい木を commit した後に解決します。search だけが変わったときはルート木に触れず、スクロールもフォーカスも動かしません。ページが変わったときは、先頭へ戻すのもルーターです。',
  en: 'The intercept handler resolves after React commits the new tree. When only the search moved, the route tree is left alone and neither scroll nor focus is disturbed; when the page changed, the router is what puts it at the top.',
});

export const featureNoLink = message({
  ja: 'Link を作らない',
  en: 'No Link component',
});

export const featureNoLinkDescription = message({
  ja: 'Navigation API の下では素の `<a>` がすでにクライアント遷移です。包んでも 2 つ目の書き方が増えるだけなので、型は `href` が守ります。',
  en: 'Under the Navigation API a plain `<a>` is already a client navigation. Wrapping it would add a second way to write the same thing; `href` is what makes it typed.',
});

export const featureMatch = message({
  ja: '今どこかは尋ねる',
  en: 'Ask where you are',
});

export const featureMatchDescription = message({
  ja: "`useMatch('/products/*')` で「この区画の配下が開いているか」を聞けます。ブラウザに表が無くても動くので、フレームワークの下のサイドナビもこれで書きます。",
  en: "`useMatch('/products/*')` answers whether a page under a section is showing. It needs no table in the browser, which is why a sidebar under the framework asks with it too.",
});

export const featureError = message({
  ja: 'エラー境界も表に書く',
  en: 'Error boundaries live in the table',
});

export const featureErrorDescription = message({
  ja: '`{ layout, error, children }` と並べれば、配下が throw したとき枠を残したまま error が描かれます。新しいページを先頭（または #fragment）へ戻すスクロールもルーターの仕事です。',
  en: 'Name an `error` beside a `layout` and, when what is below throws, it renders inside the layout with the frame intact. Scrolling a new page to the top — or to its #fragment — is the router’s job too.',
});

export const exampleTitle = message({
  ja: '表とリンク',
  en: 'The table, and a link',
});

export const exampleDescription = message({
  ja: '表は 1 か所。ページは表を import せず、パターン文字列だけで型付きのリンクを書きます。',
  en: 'The table lives in one place. Pages never import it — a typed link needs only the pattern string.',
});

export const docsTitle = message({
  ja: 'ドキュメント',
  en: 'Documentation',
});

export const docsDescription = message({
  ja: '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/router/docs/` からインストールした版そのものを読みます。',
  en: 'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/router/docs/`.',
});

export const navRoutes = message({
  ja: 'ルート表',
  en: 'Route table',
});

export const navLinks = message({
  ja: 'リンクと現在地',
  en: 'Links & location',
});

export const navNavigation = message({
  ja: 'ナビゲーション',
  en: 'Navigation',
});

export const navFramework = message({
  ja: 'フレームワーク配下',
  en: 'Under the framework',
});
