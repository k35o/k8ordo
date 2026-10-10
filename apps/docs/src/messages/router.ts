import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'Navigation APIでページを切り替えるReactのルーターです。`href`と`navigateTo`はルート表の型で検査され、リンクは`<a>`のまま書けます。',
  en: 'A React router that switches pages through the Navigation API. `href` and `navigateTo` are typed by the route table, and links stay plain `<a>` elements.',
});

export const tagline = message({
  ja: 'Navigation APIと`<a>`で画面を切り替える、型の付いたReactのルーター',
  en: 'A typed React router that switches pages through the Navigation API and plain `<a>` links',
});

export const claimAnchorTitle = message({
  ja: '`<a>`のままのリンク',
  en: 'Links as plain `<a>`',
});

export const claimAnchorBody = [
  message({
    ja: '`<Router>`は`<a>`のクリックをNavigation APIで受け取り、ルート表にあるパスならページを読み込み直さずに画面を切り替えます。`<Link>`のような専用のコンポーネントはありません。',
    en: '`<Router>` receives clicks on `<a>` through the Navigation API. For a path in the route table, it changes the page without a full reload. There is no `<Link>` component.',
  }),
  message({
    ja: '表に無いパスや再読み込み、POSTの送信、ダウンロードはブラウザに任せます。今どのページにいるかは`useMatch`で調べます。',
    en: 'A path outside the table, a reload, a POST submission and a download are left to the browser. `useMatch` tells you which page is showing.',
  }),
] as const;

export const claimTypesTitle = message({
  ja: 'ルート表で検査されるパス',
  en: 'Paths checked against the table',
});

export const claimTypesBody = [
  message({
    ja: '`href`と`navigateTo`は、ルート表のパターンを文字列で受け取ります。足りないparamは設定なしでも型エラーになり、`Register`にルート表を登録すると表に無いパターンも型エラーになります。',
    en: '`href` and `navigateTo` take a pattern from the route table as a string. A missing param is a type error with no setup, and once the table is registered in `Register`, so is a pattern the table lacks.',
  }),
  message({
    ja: 'ページはルート表をimportせず、リンク先をパターンの文字列だけで書きます。ルート表とページが互いにimportし合う循環は起きません。',
    en: 'A page never imports the table. It names its links by pattern string alone, so the table and its pages never import each other.',
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
  ja: 'ページの切り替えの待機とアニメーション',
  en: 'Awaiting and animating page changes',
});

export const claimNavigationBody = [
  message({
    ja: '`navigateTo`が返す`finished`は、新しいページが画面に表示されたときに解決します。`useTransition`の中で待てば、`isPending`は切り替えの間だけ`true`になります。',
    en: 'The `finished` promise from `navigateTo` resolves once the new page is on screen. Await it inside `useTransition`, and `isPending` is `true` only while the page changes.',
  }),
  message({
    ja: "ページの切り替えには、Reactのトランジションの種類として`navigation`が付きます。`<ViewTransition>`の`update`で`navigation`だけを`'auto'`にすると、ページを切り替えるときだけアニメーションします。",
    en: "Every page change carries the React transition type `navigation`. Set `navigation` to `'auto'` in the `update` prop of `<ViewTransition>`, and only page changes animate.",
  }),
] as const;

export const navRoutes = message({
  ja: 'ルート表',
  en: 'Route table',
});

export const navBoundaries = message({
  ja: 'エラーと読み込み中',
  en: 'Errors and loading',
});

export const navLinks = message({
  ja: 'リンクと遷移',
  en: 'Links and navigation',
});

export const navLocation = message({
  ja: '現在地',
  en: 'Location',
});

export const navBindParams = message({
  ja: '共通のparam',
  en: 'Bound params',
});

export const navTypedPaths = message({
  ja: 'パスの型検査',
  en: 'Typed paths',
});

export const navBase = message({
  ja: 'ベースパス',
  en: 'Base path',
});

export const navAnimate = message({
  ja: '切り替えのアニメーション',
  en: 'Transitions',
});

export const navTesting = message({
  ja: 'テスト',
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

export const navTroubleshooting = message({
  ja: 'トラブルシューティング',
  en: 'Troubleshooting',
});
