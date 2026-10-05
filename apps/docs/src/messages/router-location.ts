import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'いま開いているページのリンクに印を付けたり、次のページを読み込んでいることを見せたりするには、ブラウザがいまどのパスにいるかを調べます。このページでは、そのためのフックと関数を紹介します。',
  en: 'To mark the link to the page you are on, or to show that the next page is loading, you ask where the browser is. This page covers the hooks and functions that answer.',
});

export const pathnameTitle = message({
  ja: 'いまのパスを読む',
  en: 'Read the current path',
});

export const pathnameDescription = message({
  ja: '`usePathname`は、ブラウザがいま開いているパスを返します。末尾のスラッシュは落とした形で返ります。',
  en: '`usePathname` returns the path the browser is on, with any trailing slash dropped.',
});

export const pathnameQuery = message({
  ja: '再描画されるのはパスが変わったときだけで、クエリ文字列が変わっても再描画されません。クエリ文字列を返さないのは、その値を読むのが`@k8ordo/state`の役割だからです。`@k8ordo/state`では、コンポーネントが読んでいる値が変わったときだけ再描画されます。',
  en: 'It re-renders when the path changes and never when the query string does. The query string is left out because reading it is `@k8ordo/state`’s job, where a component re-renders only when a value it reads changes.',
});

export const pathnameEncoded = message({
  ja: 'パスはURLでの書き方のままで、デコードはしません。日本語のような文字は、パーセントエンコードされた形で返ります。',
  en: 'The path is spelled as the URL spells it, not decoded: characters such as Japanese come back percent-encoded.',
});

export const pathnameFramework = message({
  ja: '`usePathname`はルート表ではなくブラウザのURLを読むので、`@k8ordo/static`や`@k8ordo/server`の下でも同じように使えます。',
  en: '`usePathname` reads the browser’s URL rather than the route table, so it works the same under `@k8ordo/static` and `@k8ordo/server`.',
});

export const matchTitle = message({
  ja: 'あるページを開いているか調べる',
  en: 'Check whether a page is open',
});

export const matchDescription = message({
  ja: '`useMatch`は、いまのパスがパターンに合えばそのparamsを、合わなければ`null`を返します。ナビゲーションのリンクに印を付けるときは、これを使います。',
  en: '`useMatch` returns the params when the current path fits a pattern, and `null` when it does not. It is what marks a link in a navigation.',
});

export const matchNoProp = message({
  ja: 'リンクが選ばれているかどうかは、リンクに渡すpropsではなく、こうして尋ねて決めます。`<Link>`のようなコンポーネントが無いので、印の付け方も自分で選べます。',
  en: 'Whether a link is current is something you ask, not a prop you pass it. With no `<Link>` component in between, how the link is marked is up to you.',
});

export const sectionTitle = message({
  ja: 'あるまとまりの下にいるか調べる',
  en: 'Check whether you are inside a section',
});

export const sectionDescription = message({
  ja: 'パターンの後ろに`/*`を付けると、「そのパターンより下のどこか」という意味になります。サイドバーのように、どのまとまりを開いているかを知りたいときに使います。',
  en: 'A pattern followed by `/*` means “anywhere below it”. Use it to know which section is open, as a sidebar does.',
});

export const sectionMatchPath = message({
  ja: '`matchPath`は、`useMatch`と同じ判定を、手元にあるパスに対して行う関数です。上の例では、判定の違いが見えるようにこちらを使っています。',
  en: '`matchPath` makes the same check as `useMatch` against a path you have in hand; the example uses it to show the cases side by side.',
});

export const sectionOwnPage = message({
  ja: '`/products/*`は、`/products`そのものには合いません。まとまりの入口のページでも印を付けたいときは、`{ inclusive: true }`を渡します。',
  en: '`/products/*` does not match `/products` itself. To mark the section’s own entry page as well, pass `{ inclusive: true }`.',
});

export const sectionPatterns = message({
  ja: '`/*`を付けられるのは、ルート表にあるパターンの後ろだけです。`Register`を登録していれば、表に無いパターンは型エラーになります。',
  en: '`/*` can only follow a pattern in the route table. With `Register` augmented, a pattern the table lacks is a type error.',
});

export const sectionCost = message({
  ja: '`useMatch`は`usePathname`の上に作られているので、再描画されるのはパスが変わったときだけです。ルート表も要らないので、フレームワークの下でも使えます。このサイトのヘッダーも、パッケージのランディングとその下のページのどちらでもパッケージ名に印が付くよう、`inclusive`を付けて判定しています。',
  en: '`useMatch` is built on `usePathname`, so it re-renders only when the path changes, and it needs no route table, so it works under the framework too. This site’s header makes the same check with `inclusive`, marking a package on its landing page and on every page below it.',
});

export const pendingTitle = message({
  ja: '読み込み中のページを知る',
  en: 'Know which page is loading',
});

export const pendingDescription = message({
  ja: 'ページを移るとき、URLが先に書き換わり、新しいページは準備ができてから画面に出ます。そのため遅いナビゲーションでは、`usePathname`がもう新しいパスを返しているのに、画面には前のページが残っています。',
  en: 'On a page change the URL changes first, and the new page appears once it is ready. On a slow navigation, then, `usePathname` already returns the new path while the previous page is still on screen.',
});

export const pendingHook = message({
  ja: '`usePendingPathname`は、読み込み中のページのパスを返します。何も読み込んでいないときは`null`です。',
  en: '`usePendingPathname` returns the path of the page being loaded, or `null` when nothing is.',
});

export const pendingWhen = message({
  ja: '値はナビゲーションが始まった時点で入り、新しいページが画面に出たときに`null`に戻ります。ナビゲーションが中断されたときや、読み込みに失敗したときも`null`に戻ります。',
  en: 'It is set as the navigation starts, and goes back to `null` once the new page is on screen. It also goes back to `null` when the navigation is abandoned or its load fails.',
});

export const pendingState = message({
  ja: 'クエリ文字列だけを変える状態の更新は、ページの切り替えではないので値が入りません。ただし、フレームワークのページがクエリ文字列を読んでいて、その場で読み込み直すときは、ほかの読み込みと同じように値が入ります。',
  en: 'An update that changes only the query string is not a page change and sets nothing. A framework page that reads the query string and loads again for it is the exception: that is a load in progress like any other.',
});

export const paramsTitle = message({
  ja: 'ページのparamを読む',
  en: 'Read a page’s params',
});

export const paramsDescription = message({
  ja: '`<Router>`で描くページは、`useParams`に自分のパターンを渡してparamを読みます。返る値の型はパターンの文字列から決まり、値はいつも文字列です。',
  en: 'A page rendered by `<Router>` reads its params by handing `useParams` its own pattern. The type comes from the pattern string, and every value is a string.',
});

export const paramsBelief = message({
  ja: '渡すパターンは、「このコンポーネントはこのパターンのページとして描かれる」という宣言でもあります。別のパターンのページの中で描かれると、形の違うparamsを返す代わりに、次の例外を投げます。',
  en: 'The pattern also says “this component renders as the page at this pattern”. Rendered under another pattern, it throws this instead of returning params of the wrong shape:',
});

export const paramsRoute = message({
  ja: 'いくつものページで使い回すコンポーネントなら、`useRoute`で、いま選ばれているパターンとparamsを型の無い形で受け取れます。',
  en: 'A component shared by several pages can use `useRoute` instead, which returns the pattern that won and its params, untyped.',
});

export const paramsFramework = message({
  ja: '`useParams`と`useRoute`は、`<Router>`が持つ照合の結果を読みます。`@k8ordo/static`や`@k8ordo/server`の下ではブラウザにルート表が無いので、どちらも使えません。ページは`params`をpropsで受け取ります。',
  en: '`useParams` and `useRoute` read the match `<Router>` holds. Under `@k8ordo/static` and `@k8ordo/server` the browser has no route table, so neither works there; a page receives `params` as a prop.',
});

export const demoTitle = message({
  ja: 'パターンとパスの照合を試す',
  en: 'Try matching a pattern',
});

export const demoDescription = message({
  ja: 'このサイトも`@k8ordo/router`の上で動いています。最初の値は、このページで`usePathname`を呼んで読んだパスです。書き換えると、`matchPath`の結果がその場で変わります。',
  en: 'This site runs on `@k8ordo/router` too. The demo starts from the path `usePathname` reads on this page, and `matchPath` answers again as you edit.',
});

export const demoSteps = [
  message({
    ja: '最初は、パターンが`/:locale/router/*`で、パスがこのページのパスです。結果は`{"locale":"ja"}`で、`/*`が受けた部分はparamsに入りません。',
    en: 'It starts with the pattern `/:locale/router/*` and this page’s path. The result is `{"locale":"en"}`: what `/*` took is not a param.',
  }),
  message({
    ja: 'パスを`/ja/router`に書き換えると、結果は`null`になります。`/*`は、パターン自身のページには合わないからです。',
    en: 'Change the path to `/en/router`. The result is `null`, because `/*` does not match the pattern’s own page.',
  }),
  message({
    ja: '「inclusive」をオンにすると、結果が`{"locale":"ja"}`に戻ります。',
    en: 'Turn on “inclusive”. The result is `{"locale":"en"}` again.',
  }),
  message({
    ja: 'パスの末尾に`/`を足しても、結果は変わりません。比べる前に、末尾のスラッシュを落とすからです。',
    en: 'Add a `/` to the end of the path. The result does not change, because the trailing slash is dropped before comparing.',
  }),
] as const;

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
