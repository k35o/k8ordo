import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'URL の pathname 軸を所有します。ルート表がアプリの pathname スキーマそのもので、そこから型・マッチング・リンク・ナビゲーションのすべてが導かれます。search params と履歴エントリの状態は @k8ordo/state の担当で、この境界は URL の "?" と一致します。',
  en: "The URL's pathname axis, owned. The route table is the application's pathname schema, and from it come the types, the matching, the links and the navigation. Search params and history-entry state belong to @k8ordo/state — the division is the URL's own \"?\".",
});

export const tagline = message({
  ja: 'ルート表 1 つから、リンクの型と画面遷移までを導く、Navigation API のルーター。',
  en: 'A router on the Navigation API that derives typed links and navigation from one route table.',
});

export const claimAnchorTitle = message({
  ja: 'リンクは `<a>` のまま書く',
  en: 'Links stay plain `<a>` elements',
});

export const claimAnchorBody = [
  message({
    ja: 'Navigation API が `<a>` のクリックを受け取り、ルート表にあるパスならブラウザの中で画面を切り替えます。`<Link>` 部品はありません。',
    en: 'The Navigation API hands the router every `<a>` click, and a path in the route table changes the page in the browser. There is no `<Link>` component.',
  }),
  message({
    ja: '再読み込み・POST の送信・ダウンロード・ページ内リンクと、表に無いパスはブラウザに任せます。今いる場所は `useMatch` に問い合わせます。',
    en: 'Reloads, POST submissions, downloads, in-page links and paths outside the table are left to the browser. Where you are is a question for `useMatch`.',
  }),
] as const;

export const claimTypesTitle = message({
  ja: 'パスの書き間違いは型エラーになる',
  en: 'A mistyped path does not compile',
});

export const claimTypesBody = [
  message({
    ja: '`href` と `navigateTo` は、ルート表のパターンを文字列で受け取ります。`Register` に表を登録すると、表に無いパターンや足りない param が型エラーになります。',
    en: '`href` and `navigateTo` take a pattern from the route table as a string. Register the table once, and a pattern it lacks or a missing param fails to compile.',
  }),
  message({
    ja: 'ページはルート表を import しません。パターンの文字列だけで書くので、表とページが互いを読み込む循環が起きません。',
    en: 'Pages never import the table. They work from the pattern string alone, so the table and its pages never import each other.',
  }),
] as const;

export const claimTypesTypo = message({
  ja: '表に無いパターンなので型エラー',
  en: 'Not a pattern in the table: a type error',
});

export const claimTypesMissing = message({
  ja: ':id が無いので型エラー',
  en: 'Missing :id: a type error',
});

export const claimNavigationTitle = message({
  ja: '新しいページが出るまで待てる',
  en: 'Wait until the new page is on screen',
});

export const claimNavigationBody = [
  message({
    ja: '`navigateTo` が返す `finished` は、新しいページが画面に出たときに解決します。`useTransition` の中で待てば、`isPending` が切り替えの間だけ立ちます。',
    en: 'The `finished` promise from `navigateTo` resolves once the new page is on screen. Await it inside `useTransition`, and `isPending` covers exactly the switch.',
  }),
  message({
    ja: 'ページの切り替えには `navigation` という種類が付きます。`<ViewTransition>` をそれに結びつければ、ページの切り替えだけをアニメーションできます。',
    en: 'Every page change is tagged `navigation`. Key a `<ViewTransition>` on it, and only page changes animate.',
  }),
] as const;

export const nextGetStarted = message({
  ja: '表を書き、ブラウザでマウントし、リンクを表で確かめるまでを作ります。',
  en: 'Write a table, mount it in the browser, and check links against it.',
});

export const nextRoutes = message({
  ja: '表の文法、照合の順序、エラー境界と読み込み中の表示です。',
  en: 'The table’s grammar, matching order, error boundaries and loading states.',
});

export const nextLinks = message({
  ja: '`href`・`navigateTo`・`bindParams` と、現在地を読むフックです。',
  en: '`href`, `navigateTo`, `bindParams`, and the hooks that read where you are.',
});

export const nextNavigation = message({
  ja: 'どの移動を引き受けるか、何を保証するか、アニメーションとテストです。',
  en: 'Which navigations it takes, what it guarantees, animation and testing.',
});

export const nextFramework = message({
  ja: '`@k8ordo/static`・`@k8ordo/server` の下で使う部分と、生成される型です。',
  en: 'What you use under `@k8ordo/static` and `@k8ordo/server`, and the generated types.',
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
