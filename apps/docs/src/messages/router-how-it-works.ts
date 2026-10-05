import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/router`がナビゲーションをどう扱っているかを説明します。使い方を覚えるのに必要な内容ではありませんが、なぜそう動くのかが分かると、思ったとおりに動かないときに原因を探しやすくなります。',
  en: 'How `@k8ordo/router` handles navigation. None of it is needed to use the package, but knowing why it behaves as it does makes it easier to find the cause when something does not.',
});

export const claimTitle = message({
  ja: 'ルーターが引き受けるナビゲーション',
  en: 'Which navigations the router takes',
});

export const claimDescription = message({
  ja: 'リンクのクリックも`navigateTo`も、ブラウザの戻ると進むも、GETのフォームの送信も、ブラウザは同じ`navigate`イベントで知らせます。ルーターはこのイベントを受け取り、行き先のパスにルート表が答えるものだけをインターセプトします。',
  en: 'A link click, `navigateTo`, the browser’s back and forward, and a GET form submission all reach the page as the same `navigate` event. The router takes that event and intercepts only the navigations whose destination the route table answers.',
});

export const claimNever = message({
  ja: '次の4つは、ルート表に何が書いてあっても引き受けず、ブラウザに任せます。',
  en: 'These four it never takes, whatever the route table says, and leaves to the browser.',
});

export const claimReload = message({
  ja: '再読み込み：新しいページの取得を求める操作だからです',
  en: 'A reload: it asks for a fresh copy of the page',
});

export const claimPost = message({
  ja: '本文を持つフォームの送信（POST）：本文を扱えるのはサーバーだけだからです',
  en: 'A form submitted with a body (POST): only the server can act on the body',
});

export const claimDownload = message({
  ja: 'ダウンロード：ファイルを保存する操作だからです',
  en: 'A download: it saves a file',
});

export const claimFragment = message({
  ja: 'フラグメント（URLの`#`より後ろ）だけの変更：同じページの中の移動だからです',
  en: 'A change to the fragment alone (what follows `#`): it moves within the same page',
});

export const claimWhy = message({
  ja: 'これらを引き受けると、ブラウザなら当然そうする動作の代わりに、何も起きなくなってしまいます。別のオリジンへの移動のように、ブラウザがインターセプトを許さないナビゲーションも引き受けません。',
  en: 'Taking any of them would make nothing happen where the browser would have done the obvious thing. Navigations the browser does not let a page intercept, such as one to another origin, are not taken either.',
});

export const claimGet = message({
  ja: 'GETのフォームは本文を持たないので引き受けます。`@k8ordo/state`が組み立てる、クエリ文字列を書き換えるだけの送信も、ここを通ります。',
  en: 'A GET form carries no body, so it is taken. The submissions `@k8ordo/state` builds, which only rewrite the query string, come through here too.',
});

export const finishedTitle = message({
  ja: '`finished`はページが画面に出たときに解決する',
  en: '`finished` means the page is on screen',
});

export const finishedDescription = message({
  ja: 'ルーターは、インターセプトしたナビゲーションを、新しいページが画面に出るまで終わらせません。そのため、`navigateTo`が返す`finished`は、URLが書き換わったときではなく、ページが描かれたときに解決します。',
  en: 'The router does not let an intercepted navigation finish until the new page is on screen. So the `finished` that `navigateTo` returns resolves when the page has rendered, not when the URL changed.',
});

export const finishedPaint = message({
  ja: '正確には、Reactが新しいページを反映したあと、ブラウザがそれを描く前に解決します。描く前なので、新しいページが前のスクロール位置で1フレームだけ見えることもありません。',
  en: 'Precisely, it resolves after React has committed the new page and before the browser paints it, which also means the new page never shows for a frame at the old scroll position.',
});

export const finishedLazy = message({
  ja: '待つのは新しいページの最初の反映です。ナビゲーションで新しく現れた`<Suspense>`の中で`React.lazy`のページがサスペンドしたときは、fallbackが描かれた時点で解決し、コードが届くのは待ちません。',
  en: 'What it waits for is the new page’s first commit. When a `React.lazy` page suspends into a `<Suspense>` the navigation newly mounted, `finished` resolves once the fallback is drawn, without waiting for the code.',
});

export const stateTitle = message({
  ja: '状態の更新はページの切り替えではない',
  en: 'A state update is not a page change',
});

export const stateDescription = message({
  ja: 'クエリ文字列や履歴エントリの状態だけが変わったナビゲーションでは、パスは画面に出ているページと同じです。ルーターはこれをページの切り替えとは扱わず、何も読み込まずにインターセプトします。',
  en: 'When only the query string or the history entry’s state changes, the path is that of the page on screen. The router does not treat this as a page change, and intercepts it without loading anything.',
});

export const stateKeep = message({
  ja: 'ページは作り直されず、スクロールの位置もフォーカスもそのままです。検索の条件を変えてもページの先頭に戻らないのは、このためです。待つ描画が無いので、`finished`はURLが書き換わった時点で解決します。`@k8ordo/state`の`update()`が返す`finished`も同じです。',
  en: 'Nothing remounts, and neither scroll nor focus moves; this is why changing a search does not jump back to the top. With no render to wait for, `finished` resolves as soon as the URL changes, and so does the one `@k8ordo/state`’s `update()` returns.',
});

export const stateShown = message({
  ja: '比べる相手は、アドレスバーのパスではなく、画面に出ているページのパスです。別のページを読み込んでいる最中に、そのページのURLへ状態の更新が来たときは、ページの切り替えとして扱います。読み込み中のページはそのまま届き、その`finished`もページの描画を待ちます。',
  en: 'The comparison is with the page on screen, not with the address bar. A state update aimed at a page that is still loading counts as a page change: that page still arrives, and the update’s `finished` waits for it to render.',
});

export const backgroundTitle = message({
  ja: '次のページは背景で描く',
  en: 'The next page renders in the background',
});

export const backgroundDescription = message({
  ja: '新しいページは、`useDeferredValue`の優先度で描かれます。そのため、次のページの準備ができるまで前のページが画面に残り、操作もできます。',
  en: 'The new page renders at the priority `useDeferredValue` gives it, so the previous page stays on screen, and stays usable, until the next one is ready.',
});

export const backgroundWhy = message({
  ja: 'transitionにしないのは、非同期のアクションが保留中の間、Reactがすべてのtransitionをそのアクションが終わるまで止めるからです。transitionにすると、アクションの中で`finished`を待ったときに互いを待ち合って止まります。関係のないアクションが保留中のときも、ページの切り替えが遅れます。',
  en: 'It is not a transition because React holds every transition while an async action is pending, until that action ends. As a transition, an action awaiting `finished` would wait on itself, and a page change would also wait for any unrelated action.',
});

export const backgroundTypes = message({
  ja: 'この描画には、`navigation`と`navigation-push`などの種類を付けます。`<ViewTransition>`がページの切り替えだけをアニメーションできるのは、この種類があるからです。',
  en: 'The render is tagged `navigation` and a kind such as `navigation-push`, which is what lets a `<ViewTransition>` animate page changes and nothing else.',
});

export const scrollTitle = message({
  ja: '新しいページはどこから始まるか',
  en: 'Where a new page starts',
});

export const scrollDescription = message({
  ja: '新しいページが画面に出ると、ルーターはスクロールの位置を、ページを読み込んだときと同じ場所に動かします。URLにフラグメントがあればその要素へ、無ければページの先頭へ移ります。',
  en: 'Once the new page is on screen, the router scrolls to where a page load would have: to the element the fragment names, or to the top when there is none.',
});

export const scrollFragment = message({
  ja: 'フラグメントの要素は、`id`か`name`属性が一致するもので探します。デコードしてから探すので、`#%E5%B0%8E%E5%85%A5`は`id="導入"`の要素を指します。見つからなければ先頭へ移ります。',
  en: 'The fragment’s element is the one whose `id` or `name` attribute matches. The fragment is decoded first, so `#%E5%B0%8E%E5%85%A5` finds `id="導入"`, and the page goes to the top when nothing matches.',
});

export const scrollTraverse = message({
  ja: 'ブラウザの戻ると進むでは、ルーターはスクロールに触れず、ブラウザが覚えていた位置に任せます。',
  en: 'On the browser’s back and forward, the router leaves scrolling alone, and the browser restores the position it saved.',
});

export const scrollFocus = message({
  ja: 'フォーカスも、ページを読み込んだときと同じく`<body>`に戻ります。状態の更新では、スクロールと同じくフォーカスも動きません。',
  en: 'Focus also goes back to `<body>`, as on a page load. A state update moves focus no more than it moves the scroll position.',
});

export const abortTitle = message({
  ja: '追い越されたナビゲーションは中断される',
  en: 'A superseded navigation is abandoned',
});

export const abortDescription = message({
  ja: '読み込みの途中で次のナビゲーションが始まると、前のナビゲーションは中断されます。中断には、ブラウザ自身の`AbortSignal`を使います。',
  en: 'When the next navigation starts while one is still loading, the earlier one is abandoned, through the browser’s own `AbortSignal`.',
});

export const abortRejects = message({
  ja: '追い越された側の`finished`は、中断の理由でrejectします。読み込みがすでに終わっていても、そのページは画面に出ません。',
  en: 'The overtaken navigation’s `finished` rejects with the abort reason, and its page never reaches the screen, even when its load had already come back.',
});

export const abortLazy = message({
  ja: '`React.lazy`のコードの読み込みは、動的importが`AbortSignal`を受け取らないので取り消せません。読み込みはそのまま終わり、次に開いたときのために残りますが、追い越されたページは表示されません。フレームワークの下では、次のページのデータの取得ごと取り消されます。',
  en: 'A `React.lazy` chunk cannot be cancelled, since a dynamic import takes no `AbortSignal`: it finishes and is kept for the next visit, while the overtaken page is never shown. Under the framework, the fetch for the next page’s data is cancelled outright.',
});

export const hookTitle = message({
  ja: '`useInterceptedNavigation`で自分の仕組みを作る',
  en: 'Build your own host with `useInterceptedNavigation`',
});

export const hookDescription = message({
  ja: 'ここまでの動きは、すべて`useInterceptedNavigation`というフックが受け持っています。`<Router>`はこのフックにルート表をつないだもので、フレームワークのランタイムは、同じフックにサーバーから届くページをつないでいます。',
  en: 'Everything above is the work of one hook, `useInterceptedNavigation`. `<Router>` is that hook wired to a route table, and the framework’s runtime is the same hook wired to pages arriving from the server.',
});

export const hookHandler = message({
  ja: 'フックには、次の関数をまとめたオブジェクトを渡します。',
  en: 'The hook takes an object with these functions.',
});

export const hookClaim = message({
  ja: '`claim(url)`：このナビゲーションを引き受けるかどうか。インターセプトできるのはイベントの間だけなので、同期的に答えます。',
  en: '`claim(url)`: whether to take this navigation. Interception is only possible during the event, so it answers synchronously.',
});

export const hookLoad = message({
  ja: '`load(url, signal)`：そのURLで描くものを作ります。値かPromiseを返し、追い越されると`signal`が中断されます。',
  en: '`load(url, signal)`: produces what to render for the URL, as a value or a promise. `signal` aborts when the navigation is overtaken.',
});

export const hookApply = message({
  ja: '`apply(value)`：作ったものを反映します。transitionの外で、ふつうの更新として呼ばれます。',
  en: '`apply(value)`: applies it, as an ordinary update outside any transition.',
});

export const hookRefresh = message({
  ja: '`refresh(url)`：省略できます。パスが変わらないナビゲーションでも、読み込み直すかどうかを答えます。',
  en: '`refresh(url)`: optional. Whether a navigation that keeps the path should still load.',
});

export const hookDeferred = message({
  ja: '`apply`で入れた値は、フックを呼んだのと同じコンポーネントの中で、`useDeferredValue`を通して描きます。こうすると新しいページが背景で描かれ、`generation`と`finished`も同じ反映で進みます。',
  en: 'Render what `apply` set through `useDeferredValue`, in the same component that calls the hook. The new page then renders in the background, and `generation` and `finished` move in that same commit.',
});

export const hookGeneration = message({
  ja: '`generation`は、新しいページが画面に出たときにだけ変わる番号です。`<NavigationGeneration>`で配ると、ルート表の`error`がエラーの表示を消す時を知ります。`<PathnameProvider>`は、サーバーでの描画とハイドレーションの間に、`usePathname`が返すパスを渡します。',
  en: '`generation` is a number that changes only when a new page is on screen. Provided through `<NavigationGeneration>`, it tells the route table’s `error` when to let a failure go. `<PathnameProvider>` gives `usePathname` its path during a server render and hydration.',
});

export const hookWho = message({
  ja: 'どちらも`<Router>`とフレームワークのランタイムが自分で置くので、アプリが書くのは、自分でこのフックを使うときだけです。',
  en: '`<Router>` and the framework’s runtime both provide them themselves, so an app writes them only when it uses this hook directly.',
});

export const hookRefreshDetail = message({
  ja: '`refresh`が`true`を返すと、パスが同じでもページの切り替えと同じように読み込んで反映します。ただし、スクロールとフォーカスは動かさず、ナビゲーションの種類も付けません。フレームワークは、`search`をexportしたページでクエリ文字列が変わったときに`true`を返します。',
  en: 'When `refresh` returns `true`, a navigation that keeps the path loads and applies like a page change, but moves neither scroll nor focus and carries no navigation types. The framework returns `true` for a page that exports `search` when the query string changes.',
});
