import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'URLのpathnameを受け持つルーターです。アプリが答えるpathnameをルート表に1度書けば、型もマッチングもリンクもナビゲーションも、そこから決まります。search paramsと履歴エントリの状態は@k8ordo/stateの受け持ちで、両者の境目はURLの`?`です。',
  en: "The URL's pathname axis, owned. The route table is the application's pathname schema, and from it come the types, the matching, the links and the navigation. Search params and history-entry state belong to @k8ordo/state — the division is the URL's own \"?\".",
});

export const tagline = message({
  ja: 'ルート表を1つ書くだけで、型の付いたリンクと画面遷移がそろう、Navigation APIのルーター。',
  en: 'A router on the Navigation API that derives typed links and navigation from one route table.',
});

export const claimAnchorTitle = message({
  ja: 'リンクは`<a>`のまま書く',
  en: 'Links stay plain `<a>` elements',
});

export const claimAnchorBody = [
  message({
    ja: '`<a>`がクリックされるとNavigation APIがそれを知らせ、ルート表にあるパスならブラウザの中で画面を切り替えます。そのため、`<Link>`のような専用のコンポーネントはありません。',
    en: 'The Navigation API hands the router every `<a>` click, and a path in the route table changes the page in the browser. There is no `<Link>` component.',
  }),
  message({
    ja: '表に無いパスへの移動は、ブラウザに任せます。再読み込みやPOSTの送信、ダウンロード、ページ内リンクも同じです。いまどのページにいるかは、`useMatch`で調べます。',
    en: 'Reloads, POST submissions, downloads, in-page links and paths outside the table are left to the browser. Where you are is a question for `useMatch`.',
  }),
] as const;

export const claimTypesTitle = message({
  ja: 'パスの書き間違いは型エラーになる',
  en: 'A mistyped path does not compile',
});

export const claimTypesBody = [
  message({
    ja: '`href`と`navigateTo`は、ルート表のパターンを文字列で受け取ります。`Register`にルート表を登録しておくと、表に無いパターンや足りないparamが型エラーになります。',
    en: '`href` and `navigateTo` take a pattern from the route table as a string. Register the table once, and a pattern it lacks or a missing param fails to compile.',
  }),
  message({
    ja: 'ページの側はルート表をimportせず、パターンの文字列だけで書きます。そのため、ルート表とページが互いを読み込み合う循環も起きません。',
    en: 'Pages never import the table. They work from the pattern string alone, so the table and its pages never import each other.',
  }),
] as const;

export const claimTypesTypo = message({
  ja: '表に無いパターンなので型エラーになる',
  en: 'Not a pattern in the table: a type error',
});

export const claimTypesMissing = message({
  ja: ':idが無いので型エラーになる',
  en: 'Missing :id: a type error',
});

export const claimNavigationTitle = message({
  ja: '新しいページが表示されるまで待てる',
  en: 'Wait until the new page is on screen',
});

export const claimNavigationBody = [
  message({
    ja: '`navigateTo`が返す`finished`は、新しいページが画面に表示されたときに解決します。`useTransition`の中でこれを待てば、`isPending`がちょうど切り替わっている間だけ`true`になります。',
    en: 'The `finished` promise from `navigateTo` resolves once the new page is on screen. Await it inside `useTransition`, and `isPending` covers exactly the switch.',
  }),
  message({
    ja: 'ページの切り替えには、`navigation`という種類が付きます。`<ViewTransition>`をこの種類に結びつければ、ページの切り替えだけにアニメーションを付けられます。',
    en: 'Every page change is tagged `navigation`. Key a `<ViewTransition>` on it, and only page changes animate.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'ルート表を書いてから、型で確かめたリンクを張るまでを、一通り作ります。',
  en: 'Build an app end to end, from the route table to links checked by the types.',
});

export const nextRoutes = message({
  ja: 'パターンの書き方と照合の順序、ページのまとめ方です。',
  en: 'How patterns are written, the order they match in, and how pages are grouped.',
});

export const nextLinks = message({
  ja: '`href`でリンクを作り、`navigateTo`でページを移ります。',
  en: 'Build links with `href`, and change pages with `navigateTo`.',
});

export const nextLocation = message({
  ja: '`useMatch`や`usePathname`で、いま開いているページを調べます。',
  en: 'Find the page you are on with `useMatch` and `usePathname`.',
});

export const nextFramework = message({
  ja: '`@k8ordo/static`や`@k8ordo/server`の下で使う部分と、propsの型です。',
  en: 'What you use under `@k8ordo/static` and `@k8ordo/server`, and the props types.',
});

export const nextReference = message({
  ja: 'すべての関数とコンポーネント、型の一覧です。',
  en: 'Every function, component and type.',
});

export const navRoutes = message({
  ja: 'ルート表を書く',
  en: 'Write the route table',
});

export const navBoundaries = message({
  ja: 'エラーと読み込み中の表示を出す',
  en: 'Errors and loading states',
});

export const navLinks = message({
  ja: 'リンクを張り、移動する',
  en: 'Link and navigate',
});

export const navLocation = message({
  ja: 'いまいる場所を調べる',
  en: 'Find where you are',
});

export const navBindParams = message({
  ja: 'すべてのリンクに共通のparamを束ねる',
  en: 'Bind a param every link shares',
});

export const navTypedPaths = message({
  ja: 'パスを型で確かめる',
  en: 'Check paths with types',
});

export const navBase = message({
  ja: 'サブパスの下で配信する',
  en: 'Serve under a base path',
});

export const navAnimate = message({
  ja: 'ページの切り替えをアニメーションする',
  en: 'Animate page changes',
});

export const navFramework = message({
  ja: 'フレームワークの下で使う',
  en: 'Use it under the framework',
});

export const navTesting = message({
  ja: 'テストする',
  en: 'Testing',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navReference = message({
  ja: 'API',
  en: 'API',
});
