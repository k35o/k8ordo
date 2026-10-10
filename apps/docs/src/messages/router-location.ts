import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ブラウザが今開いているパスを読んで、現在のページへのリンクに`aria-current`を付けたり、読み込み中のページを表示したりします。',
  en: 'Read the path the browser is on, to set `aria-current` on the link to the current page or show which page is loading.',
});

export const pathnameTitle = message({
  ja: '今のパス',
  en: 'Current path',
});

export const pathnameReturns = message({
  ja: '`usePathname`は、ブラウザが今開いているパスを返します。末尾のスラッシュは取り除いて返します。パスはデコードしないので、日本語のような文字はパーセントエンコードされたまま返ります。',
  en: '`usePathname` returns the path the browser is on, with any trailing slash dropped. The path is not decoded: characters such as Japanese come back percent-encoded.',
});

export const pathnameQuery = message({
  ja: '再描画されるのはパスが変わったときだけです。クエリは返さず、クエリが変わっても再描画されません。クエリは',
  en: 'It re-renders only when the path changes. The query string is not returned, and a change to it does not re-render. Read the query with ',
});

export const pathnameQueryLink = message({
  ja: '`@k8ordo/state`',
  en: '`@k8ordo/state`',
});

export const pathnameQueryAfter = message({
  ja: 'で読みます。',
  en: '.',
});

export const pathnameFramework = message({
  ja: 'ルート表は要らないので、`@k8ordo/framework`の下でも同じように使えます。',
  en: 'It needs no route table, so it works the same under `@k8ordo/framework`.',
});

export const matchTitle = message({
  ja: 'ページの判定',
  en: 'Current page match',
});

export const matchReturns = message({
  ja: '`useMatch`は、今のパスがパターンに合えばそのparamを返します。合わなければ`null`を返します。ナビゲーションのリンクに`aria-current`を付けるときに使います。',
  en: '`useMatch` returns the params when the current path matches the pattern, and `null` when it does not. Use it to set `aria-current` on a navigation link.',
});

export const matchNoLink = message({
  ja: '`<Link>`のようなコンポーネントは無いので、`aria-current`はこのように自分で付けます。`useMatch`も、再描画されるのはパスが変わったときだけです。',
  en: 'There is no `<Link>` component, so you set `aria-current` yourself, as above. `useMatch` also re-renders only when the path changes.',
});

export const sectionTitle = message({
  ja: '`/*`のパターン',
  en: 'Patterns ending in `/*`',
});

export const sectionWildcard = message({
  ja: 'パターンの後ろに`/*`を付けると、そのパターンより下のパスに合います。サイドバーのように、どの節を開いているかを知りたいときに使います。',
  en: 'A pattern followed by `/*` matches every path below it. Use it when a sidebar needs to know which section is open.',
});

export const sectionInclusive = message({
  ja: '`/products/*`は、`/products`そのものには合いません。`/products`そのものにも合わせるときは、`{ inclusive: true }`を渡します。',
  en: '`/products/*` does not match `/products` itself. To match `/products` as well, pass `{ inclusive: true }`.',
});

export const sectionMatchPath = message({
  ja: '`matchPath`は、渡したパスに対して`useMatch`と同じ判定をする関数です。`/*`を付けられるのは、ルート表にあるパターンの後ろだけです。`Register`を拡張していれば、表に無いパターンは型エラーになります。',
  en: '`matchPath` makes the same check as `useMatch` against a path you pass in. `/*` can only follow a pattern in the route table. With `Register` augmented, a pattern the table lacks is a type error.',
});

export const demoTitle = message({
  ja: '照合のデモ',
  en: 'Matching demo',
});

export const demoDescription = message({
  ja: 'このページで`usePathname`が返したパスから始めて、`matchPath`の結果を確かめます。',
  en: 'Starts from the path `usePathname` returns on this page and shows what `matchPath` answers.',
});

export const demoSteps = [
  message({
    ja: "最初は、パターンが`/:locale/router/*`で、パスがこのページのパスです。結果は`{ locale: 'ja' }`で、`/*`に合った部分はparamに入りません。",
    en: "It starts with the pattern `/:locale/router/*` and this page’s path. The result is `{ locale: 'en' }`: what `/*` matched is not a param.",
  }),
  message({
    ja: 'パスを`/ja/router`に書き換えると、結果は`null`になります。`/*`は、パターン自身のページには合いません。',
    en: 'Change the path to `/en/router`. The result is `null`: `/*` does not match the pattern’s own page.',
  }),
  message({
    ja: "「inclusive」をオンにすると、結果が`{ locale: 'ja' }`に戻ります。",
    en: "Turn on “inclusive”. The result is `{ locale: 'en' }` again.",
  }),
  message({
    ja: 'パスの末尾に`/`を足しても、結果は変わりません。比べる前に末尾のスラッシュを取り除きます。',
    en: 'Add a `/` to the end of the path. The result does not change: the trailing slash is removed before comparing.',
  }),
] as const;

export const pendingTitle = message({
  ja: '読み込み中のパス',
  en: 'Pending path',
});

export const pendingReturns = message({
  ja: '`usePendingPathname`は、読み込み中のページのパスを返します。何も読み込んでいないときは`null`です。',
  en: '`usePendingPathname` returns the path of the page being loaded, or `null` when nothing is loading.',
});

export const pendingWhy = message({
  ja: 'ページを移るとき、URLが先に書き換わり、新しいページは準備ができてから画面に出ます。遅いナビゲーションでは、`usePathname`がもう新しいパスを返しているのに、画面には前のページが残っています。',
  en: 'On a page change the URL changes first, and the new page appears once it is ready. On a slow navigation, `usePathname` already returns the new path while the previous page is still on screen.',
});

export const pendingWhen = message({
  ja: '値はナビゲーションが始まった時点で入り、新しいページが画面に出ると`null`に戻ります。ナビゲーションの中断や読み込みの失敗でも`null`に戻ります。クエリだけを変える更新では、ページが読み込み直さない限り値は入りません。',
  en: 'It is set as the navigation starts and goes back to `null` once the new page is on screen, or when the navigation is abandoned or fails to load. An update that changes only the query does not set it, unless the page loads again for it.',
});

export const paramsTitle = message({
  ja: 'paramの読み取り',
  en: 'Reading params',
});

export const paramsHook = message({
  ja: '`<Router>`が表示するページは、`useParams`に自分のパターンを渡してparamを読みます。型はパターンの文字列から推論され、値はいつも文字列です。',
  en: 'A page rendered by `<Router>` reads its params by passing `useParams` its own pattern. The type is inferred from the pattern string, and every value is a string.',
});

export const paramsError = message({
  ja: '渡すパターンは、このコンポーネントがそのパターンのページとして表示されるという宣言でもあります。別のパターンのページの中で表示すると、次のエラーになります。',
  en: 'The pattern also declares that this component renders as the page at that pattern. Rendered under another pattern, it fails with this error:',
});

export const paramsRoute = message({
  ja: '複数のページで使い回すコンポーネントは、`useRoute`で、今選ばれているパターンとparamを型の無い形で受け取ります。',
  en: 'A component shared by several pages uses `useRoute` instead, which returns the matched pattern and its params, untyped.',
});

export const paramsFrameworkBefore = message({
  ja: '`@k8ordo/framework`の下では`useParams`と`useRoute`は使えず、ページは`params`をpropsで受け取ります（',
  en: 'Under `@k8ordo/framework`, `useParams` and `useRoute` do not work; a page receives `params` as a prop (see ',
});

export const paramsFrameworkAfter = message({
  ja: '）。',
  en: ').',
});

export const demoCurrent = message({
  ja: 'usePathname()の値',
  en: 'usePathname()',
});

export const demoPattern = message({
  ja: 'パターン',
  en: 'Pattern',
});

export const demoPath = message({
  ja: 'パス',
  en: 'Path',
});

export const demoInclusive = message({
  ja: 'inclusive',
  en: 'inclusive',
});

export const demoReset = message({
  ja: '最初の値に戻す',
  en: 'Reset',
});

export const demoCall = message({
  ja: '呼び出し',
  en: 'Call',
});

export const demoResult = message({
  ja: '結果',
  en: 'Result',
});

export const demoMiss = message({
  ja: '合わない',
  en: 'No match',
});

export const demoInvalid = message({
  ja: 'URLPatternがパターンを解釈できません',
  en: 'URLPattern cannot parse the pattern',
});
