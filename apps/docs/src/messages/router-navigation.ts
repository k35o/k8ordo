import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`<Router>`はNavigation APIのnavigateイベントを受け取り、表が答える移動をブラウザの中で処理します。このページでは、どの移動を引き受けるか、引き受けた移動が何を保証するか、ページ切り替えのアニメーション、`<Router>`の土台になっている`useInterceptedNavigation`、そしてテストの書き方を扱います。',
  en: '`<Router>` listens to the Navigation API’s navigate event and handles the navigations its table answers inside the browser. This page covers which navigations it takes, what a navigation it takes guarantees, animating page changes, `useInterceptedNavigation` — the primitive `<Router>` is built on — and how to test it all.',
});

export const claimTitle = message({
  ja: '引き受ける移動',
  en: 'Which navigations are handled',
});

export const claimDescription = message({
  ja: '同一オリジンのリンクのクリック、`navigateTo`、`navigation.navigate()`、戻る/進む、GETフォームの送信は、どれも同じnavigateイベントとして届きます。ルーターはそのうち、表が行き先のpathnameに答えるものをinterceptします。',
  en: 'A same-origin link click, `navigateTo`, `navigation.navigate()`, back and forward, and a GET form submission all arrive as the same navigate event. The router intercepts the ones whose destination pathname the table answers.',
});

export const claimTable = {
  navigation: message({ ja: '移動', en: 'Navigation' }),
  handling: message({ ja: '扱い', en: 'Handled as' }),
  pageChange: message({
    ja: '表が答える別のpathnameへの移動',
    en: 'To another pathname the table answers',
  }),
  pageChangeHandling: message({
    ja: 'ページの切り替え。新しい木を`useDeferredValue`で背景に描く',
    en: 'A page change: the new tree renders in the background through `useDeferredValue`',
  }),
  stateChange: message({
    ja: '今表示しているページと同じpathnameへの移動（searchや履歴エントリの状態だけが変わる）',
    en: 'To the pathname of the page showing (only the search or the entry state moves)',
  }),
  stateChangeHandling: message({
    ja: '状態の変更。読み込みも再マウントもしない',
    en: 'A state change: nothing loads, nothing remounts',
  }),
  unclaimed: message({
    ja: '表が答えないpathnameへの移動',
    en: 'To a pathname the table does not answer',
  }),
  unclaimedHandling: message({
    ja: 'interceptしない。ブラウザの文書読み込みになり、404もサーバーの本物の答えになる',
    en: 'Not intercepted: a document load, so a 404 is the server’s real answer',
  }),
  reload: message({ ja: 'リロード', en: 'A reload' }),
  post: message({
    ja: '本文を持つフォームの送信（POST）',
    en: 'A form submitted with a body (POST)',
  }),
  download: message({
    ja: 'ダウンロード（`download`属性の付いたリンク）',
    en: 'A download (a link with `download`)',
  }),
  fragment: message({
    ja: 'fragmentだけの変更（`#section`）',
    en: 'A fragment-only change (`#section`)',
  }),
  cannotIntercept: message({
    ja: 'プラットフォームがinterceptできないと言うもの（別オリジンなど）',
    en: 'Anything the platform says cannot be intercepted, such as another origin',
  }),
  neverOurs: message({
    ja: '表にかかわらずinterceptしない。ブラウザに任せる',
    en: 'Never intercepted, whatever the table says: left to the browser',
  }),
};

export const claimWhy = message({
  ja: 'リロード、POST、ダウンロード、fragmentだけの変更をinterceptすると、プラットフォームなら当然そうする動作の代わりに、何も起きなくなります。POSTの本文を扱えるのはサーバーだけですし、F5を押しても再読み込みされなくなります。GETフォームは本文を持たないので、`@k8ordo/state`が組み立てるsearchの形の送信は引き受けます。',
  en: 'Intercepting a reload, a POST, a download or a fragment-only change would silently do nothing where the platform would have done the obvious thing: a POST body only the server can act on, an F5 that stops reloading. A GET form carries no body, so the search-shaped submissions `@k8ordo/state` builds still come through.',
});

export const claimMount = message({
  ja: '表が答えないpathnameで`<Router>`をマウントすると、推測で何かを描くことはせず、何も描きません。何にでも合う`/*`を表の最後に置けば、そのpathnameも表が答えるものになります。その代わり、ホストが配るファイル（`/report.pdf`など）へのリンクも表が答えるものになり、ファイルは開かれずに`/*`のコンポーネントが描かれます。そうしたリンクには`download`属性を付けます。',
  en: 'Mounted on a pathname the table does not answer, `<Router>` renders nothing rather than guessing. A `/*` at the end of the table makes every pathname one the table answers. In exchange, a link to a file the host serves, such as `/report.pdf`, is claimed too and renders the `/*` component instead of opening the file; mark such links with `download`.',
});

export const timelineTitle = message({
  ja: 'ページが切り替わるまで',
  en: 'How a page change unfolds',
});

export const timelineDescription = message({
  ja: '表が答える別のpathnameへの移動は、次の順で進みます。',
  en: 'A navigation to another pathname the table answers goes through these steps, in order:',
});

export const timelineClaim = message({
  ja: 'navigateイベントで、ルーターは自分が扱う移動か、表が行き先に答えるかを同期的に判断します。interceptできるのはこの瞬間だけです。',
  en: 'On the navigate event, the router decides — synchronously, the only moment interception is possible — whether the navigation is its to handle and whether the table answers the destination.',
});

export const timelineCommit = message({
  ja: 'URLが確定します。`committed`が解決し、`usePathname`が新しいpathnameを返します。画面はまだ前のページです。',
  en: 'The URL commits. `committed` resolves and `usePathname` returns the new pathname; the previous page is still on screen.',
});

export const timelineApply = message({
  ja: '新しい照合結果を通常の更新として適用し、`useDeferredValue`を通して背景で描きます。そのcommitには`navigation`と`navigation-push`などの型が付きます。',
  en: 'The new match is applied as an ordinary update and rendered in the background through `useDeferredValue`; that commit is tagged with `navigation` and a type such as `navigation-push`.',
});

export const timelineLayoutEffect = message({
  ja: 'Reactが新しい木をcommitします。描画の前のlayout effectで、ルーターがスクロール位置を決めます。',
  en: 'React commits the new tree. In a layout effect, before the browser paints, the router places the viewport.',
});

export const timelineFinished = message({
  ja: '`finished`が解決します。',
  en: '`finished` resolves.',
});

export const guaranteesTitle = message({
  ja: 'ナビゲーションが保証すること',
  en: 'What navigation guarantees',
});

export const guaranteesDescription = message({
  ja: '上の流れから、アプリが頼ってよい性質がいくつか決まります。',
  en: 'That sequence gives an application a few properties it can rely on.',
});

export const finishedTitle = message({
  ja: '`finished`は「画面に出た」',
  en: '`finished` means on screen',
});

export const finishedDescription = message({
  ja: 'interceptのハンドラは、Reactが新しい木をcommitした後、ブラウザが描画する前のlayout effectで解決します。`finished`を待つコードはURLの書き換えではなく描画を待っています。待つのは新しい木の最初のcommitなので、ナビゲーションで新しくマウントされた`<Suspense>`に`React.lazy`のページがサスペンドした場合は、chunkが届く前、fallbackがcommitされた時点で解決します。',
  en: 'The intercept handler resolves in a layout effect, once React has committed the new tree and before the browser paints it. Code awaiting `finished` is awaiting the render, not the URL write. The render it waits for is the new tree’s first commit: a `React.lazy` page that suspends into a `<Suspense>` the navigation mounts anew commits its fallback first, and `finished` resolves then, before the chunk is in.',
});

export const finishedInAction = message({
  ja: '`startTransition`の非同期アクションの中で待っても止まりません。ページの切り替えはアクションに加わらないので、`finished`はページが画面に出た時点で解決し、アクションの終わりを待ちません。どこかの非同期アクションが保留中の間に始まったページの切り替えも、そのアクションを待たずに画面に出ます。',
  en: 'Awaiting it inside an async `startTransition` action does not stall: a page change never joins the action, so `finished` resolves once the page is on screen instead of waiting for the action to end. A page change that starts while any async action is pending reaches the screen without waiting for that action either.',
});

export const stateTitle = message({
  ja: '状態の変更はページの切り替えではない',
  en: 'A state change is not a page change',
});

export const stateDescription = message({
  ja: 'searchか履歴エントリの状態だけが変わった移動では、pathnameは画面に出ているページのものと同じです。ルーターはハンドラを付けずにinterceptし、ルートの木に触れません。何も再マウントされず、スクロール位置もフォーカスも動きません。searchを更新してもページが先頭に戻らないのはこのためです。待つべき描画が無いので、その`finished`（`@k8ordo/state`の`update().finished`を含む）は移動が確定した時点で解決します。例外は、ホストがハンドラの`refresh(url)`で「画面のページは動いた部分を読む」と答えたときで、そのときはページの切り替えと同じように読み込んで差し替えます。スクロールとフォーカスはそのままで、トランジションの種類も付けません。フレームワークは`search`をexportしたページについてそう答えます。',
  en: 'When only the search or the entry state moved, the pathname is that of the page on screen. The router intercepts with no handler and leaves the route tree alone: nothing remounts, and neither scroll nor focus is disturbed. This is why a search update never scrolls the page back to the top. With no render to wait for, its `finished` — `@k8ordo/state`’s `update().finished` included — settles as soon as the navigation commits. The exception is a host whose handler answers `refresh(url)` with “the page showing reads what moved”: then it loads and applies like a page change, with scroll and focus left alone and no transition types. The framework answers so for a page that exports `search`.',
});

export const stateShown = message({
  ja: '比べる相手はアドレスバーではなく、画面に出ているページです。interceptではURLが先に確定するので、別のページの読み込み中にそのURLへ状態の更新が来た場合はページの切り替えとして扱います。そのページが届くのを止めず、その`finished`もそのページの描画を待ちます。元のページ移動の`finished`はabortでrejectし、ページは状態の更新の側のナビゲーションで届きます。',
  en: 'The comparison is against the page showing, not the address bar. Interception commits the URL first, so a state update issued while another page is still loading is treated as a page change: it lets that page finish arriving, and its `finished` waits for that render. The original navigation’s `finished` still rejects with the abort; the page arrives through the state update’s navigation.',
});

export const scrollTitle = message({
  ja: '新しいページは先頭から',
  en: 'A new page starts at the top',
});

export const scrollDescription = message({
  ja: '新しい木が画面に出ると、文書の読み込みと同じ位置にスクロールします。URLに`#fragment`があればその要素（`id`か、古い綴りの`<a name>`と同じ`name`属性で探す）へ、無いか見つからなければ先頭へ移ります。fragmentはデコードしてから探すので、`#%E5%B0%8E%E5%85%A5`は`id="導入"`の要素を指します。',
  en: 'Once the new tree is on screen, the viewport goes where a document load would put it: to the element a `#fragment` names — found by `id`, or by `name` the way an old-style `<a name>` is — or to the top when there is no fragment or nothing answers it. The fragment is decoded before the lookup, so `#%E5%B0%8E%E5%85%A5` finds `id="導入"`.',
});

export const scrollTraverse = message({
  ja: '戻る/進むの位置はブラウザが保存したものを復元します。ルーターは触れません。フォーカスは、ページの切り替えではプラットフォームの既定のリセットに任せ、状態の変更では動かしません。',
  en: 'On back and forward the browser restores the position it saved; the router stays out of it. Focus follows the platform’s default reset on a page change and is left where it is on a state change.',
});

export const transitionTitle = message({
  ja: 'ページの切り替えは背景で描く',
  en: 'Page changes render in the background',
});

export const transitionDescription = message({
  ja: '新しい木は`useDeferredValue`の優先度で描かれるので、次のページの準備ができるまでReactは前のページを操作できる状態で保てます。`React.lazy`のchunkを待つ間も同じです。transitionにしないのは、非同期アクションが保留中の間、Reactがすべてのtransitionをそのアクションの終わりまで止めるからです。',
  en: 'The new tree renders at the priority `useDeferredValue` gives it, so React can keep the previous page interactive while the next one prepares — while a `React.lazy` chunk arrives, for instance. It is not a transition because React holds every transition until any pending async action ends.',
});

export const abortTitle = message({
  ja: '追い越されたナビゲーションはabortされる',
  en: 'Superseded navigations abort',
});

export const abortDescription = message({
  ja: '2つ目のナビゲーションは、プラットフォーム自身のsignalで1つ目をabortします。追い越された側の`finished`はabortの理由でrejectし、その読み込みがすでに終わっていても、その木は画面に出ません。`load`はそのsignalを受け取るので、フレームワークの下ではペイロードのfetchごと取り消されます。`React.lazy`のchunkは取り消せない（動的importはsignalを取らない）ので裏で読み込みを終え、次の訪問のために残りますが、そのページは表示されません。',
  en: 'A second navigation aborts the first through the platform’s own signal. The overtaken `finished` rejects with the abort reason, and its tree never reaches the screen even if its load had already come back. `load` receives that signal, so under the framework the payload fetch is cancelled outright. A `React.lazy` chunk cannot be — a dynamic import takes no signal — so it finishes in the background and is kept for the next visit, while the page it belonged to is never shown.',
});

export const historyTitle = message({
  ja: 'push、replace、traverse',
  en: 'Push, replace and traverse',
});

export const historyDescription = message({
  ja: 'ルーターは移動の種類をプラットフォームの`navigationType`から受け取り、transitionの型として伝えます。どのページの切り替えも1つ目の型は`navigation`です。',
  en: 'The router takes the kind of navigation from the platform’s `navigationType` and passes it on as a transition type. Every page change is tagged `navigation` first.',
});

export const historyTable = {
  type: message({ ja: '2つ目の型', en: 'Second type' }),
  when: message({ ja: 'いつ', en: 'When' }),
  push: message({
    ja: 'リンクのクリック、`navigateTo`（既定）',
    en: 'A link click, `navigateTo` (the default)',
  }),
  replace: message({
    ja: "`navigateTo(…, { history: 'replace' })`、`navigation.navigate(url, { history: 'replace' })`",
    en: "`navigateTo(…, { history: 'replace' })`, `navigation.navigate(url, { history: 'replace' })`",
  }),
  traverse: message({
    ja: '戻る/進む、`navigation.back()` / `navigation.forward()` / `navigation.traverseTo()`',
    en: 'Back and forward: `navigation.back()`, `navigation.forward()`, `navigation.traverseTo()`',
  }),
};

export const historyEntryState = message({
  ja: '履歴エントリに状態を載せるのは`@k8ordo/state`の仕事です。`navigateTo`のオプションは`history`だけです。',
  en: 'Putting state on a history entry is `@k8ordo/state`’s job; `navigateTo`’s only option is `history`.',
});

export const animateTitle = message({
  ja: 'ページの切り替えをアニメーションする',
  en: 'Animating page changes',
});

export const animateDescription = message({
  ja: 'ページの切り替えは背景での描画なので、transitionと同じくReactの`<ViewTransition>`でアニメーションできます。ページが描かれる穴を`<ViewTransition>`で包み、ルーターのtransitionの型をキーにします。',
  en: 'A page change renders in the background, and React’s `<ViewTransition>` animates what such a render changes, as it does a transition. Wrap the hole the pages render into, and key it on the router’s transition types.',
});

export const animateWhy = message({
  ja: '型で絞るのは、ページの切り替え以外にも`<ViewTransition>`を動かす更新があるからです。ボタンの保留中のアクションはtransitionで、型で絞らなければボタンを押すたびにページ全体がクロスフェードします。`update`を使うのは、境界そのものは残り、中身だけが入れ替わるからです。`auto`はブラウザ既定のクロスフェードです。',
  en: 'The types matter because page changes are not the only updates a `<ViewTransition>` animates: a button’s pending action is a transition, and without the filter every press would cross-fade the whole page. It is `update` because the boundary stays and its content changes; `auto` is the browser’s own cross-fade.',
});

export const animateThisSite = message({
  ja: "今読んでいるこのサイトが、まさにこの形です。ロケール配下のレイアウトがページを`update={{ navigation: 'auto', default: 'none' }}`の`<ViewTransition>`で包んでいるので、サイト内でページを移るたびにクロスフェードします。",
  en: "The site you are reading does exactly this: its locale layout wraps every page in a `<ViewTransition>` with `update={{ navigation: 'auto', default: 'none' }}`, which is why moving between pages here cross-fades.",
});

export const animateDirection = message({
  ja: '2つ目の型を使えば、戻るボタンをリンクと逆向きにスライドさせられます。',
  en: 'The second type lets a back button slide the other way from a link:',
});

export const animateDirectionCss = message({
  ja: '各クラスは`::view-transition-old(.slide-back)`と`::view-transition-new(.slide-back)`で装飾します。',
  en: 'Style each class through `::view-transition-old(.slide-back)` and `::view-transition-new(.slide-back)`:',
});

export const animateStateChange = message({
  ja: '状態の変更（`@k8ordo/state`の`update()`）は木を変えないので、アニメーションしません。',
  en: 'A state change — `@k8ordo/state`’s `update()` — never changes the tree, so it never animates.',
});

export const animateReducedMotion = message({
  ja: '`@k8ordo/ui`のスタイルシートは`prefers-reduced-motion`のときにview transitionのアニメーションを止めます。使っていないアプリは同じ規則を自分で足します。',
  en: '`@k8ordo/ui`’s stylesheet turns view-transition animations off under `prefers-reduced-motion`; an application without it adds that rule itself:',
});

export const animateFramework = message({
  ja: 'フレームワークの下では、同じ`<ViewTransition>`でレイアウトの`children`を包みます。Server Componentのレイアウトがそのまま描けます。',
  en: 'Under the framework the same `<ViewTransition>` wraps a layout’s `children`, and a Server Component layout can render it directly.',
});

export const primitiveTitle = message({
  ja: '`useInterceptedNavigation`',
  en: '`useInterceptedNavigation`',
});

export const primitiveDescription = message({
  ja: '`<Router>`のナビゲーションの部分は、単独のフックとして公開されています。interceptして読み込み、適用し、新しい木が画面に出てからプラットフォームのハンドラを解決します。上の保証はすべてこのフックによるものです。何を読み込むかは呼び出し側が決めます。',
  en: 'The navigation half of `<Router>` is exported as a hook of its own: intercept, load, apply, and resolve the platform’s handler only once the new tree is on screen. Every guarantee above belongs to this hook. What gets loaded is the caller’s business.',
});

export const primitiveHandler = message({
  ja: '引数は`NavigationHandler<T>`です。',
  en: 'It takes a `NavigationHandler<T>`:',
});

export const handlerClaim = message({
  ja: '`claim(url)`：この移動をアプリが扱うか。interceptできるのはこの瞬間だけなので同期的に答えます。`false`を返すと文書読み込みになります。',
  en: '`claim(url)` — whether this navigation is the application’s to handle. It answers synchronously, because that is the only moment interception is possible; `false` leaves a document load.',
});

export const handlerLoad = message({
  ja: '`load(url, signal)`：このURLで描くものを作ります。値かPromiseを返します。`signal`は追い越されたときにabortされます。',
  en: '`load(url, signal)` — produces what the application renders for this URL, as a value or a promise. `signal` aborts when the navigation is overtaken.',
});

export const handlerApply = message({
  ja: '`apply(value)`：それを適用します。transitionの外で、通常の更新として呼ばれます。ホストは設定した値を`useDeferredValue`を通して描きます。そうすると新しいページが背景で描かれ、その間は前のページが画面に残り、`generation`と`finished`も同じcommitで進みます。',
  en: '`apply(value)` — applies it, as an ordinary update outside any transition. The host renders what it set through `useDeferredValue`: the new page then renders in the background with the previous one still on screen, and `generation` and `finished` move in that same commit.',
});

export const primitiveEventTime = message({
  ja: 'ハンドラは描画時ではなくイベントの時点で読まれるので、描画のたびに新しいオブジェクトを渡してもメモ化は要りません。pathnameが画面のページと同じ移動（状態の変更）では、`claim`も`load`も呼ばれません。',
  en: 'The handler is read at event time, not at render time, so a new object on every render needs no memoization. A navigation to the pathname of the page showing — a state change — calls neither `claim` nor `load`.',
});

export const primitiveRouter = message({
  ja: '`<Router>`はこのフックに`claim`として「表が合うか」、`load`として照合結果、`apply`としてstateの更新を渡したものです。フレームワークのランタイムは、同一オリジンのURLをすべて引き受け、`load`でサーバーのRSCペイロードを取得します。',
  en: '`<Router>` is this hook given “does the table match” as `claim`, the match as `load`, and a state setter as `apply`. The framework’s runtime claims every same-origin URL and fetches the server’s RSC payload in `load`.',
});

export const primitiveGeneration = message({
  ja: '戻り値の`generation`は、URLが動いたときではなく新しい木が画面に出たときにだけ変わる番号です。ホストはこれを`<NavigationGeneration value>`で配り、表の`error`境界が失敗を手放す時を知らせます。サーバーでの描画とハイドレーションに備えて`<PathnameProvider pathname>`もホストがマウントします。`<Router>`もフレームワークのランタイムもこの2つを自分で置くので、アプリがこのフックを使うのは、自分で遷移の継ぎ目を作るときだけです。',
  en: 'The `generation` it returns is a number that changes exactly when a new tree is put on screen, not when the URL moved. A host provides it through `<NavigationGeneration value>` so the table’s `error` boundaries know when to let a failure go, and mounts `<PathnameProvider pathname>` for server renders and hydration. `<Router>` and the framework’s runtime both do this themselves, so an application reaches for this hook only when it builds its own navigation seam.',
});

export const testingTitle = message({
  ja: 'テスト',
  en: 'Testing',
});

export const testingDescription = message({
  ja: 'このパッケージは何もモックしないので、ナビゲーションのテストには本物のブラウザ環境が要ります。パッケージ自身のテストはVitestのbrowser modeをChromium、Firefox、WebKitで動かしています。ただしbrowser modeはテストをiframeの中で動かし、FirefoxとWebKitはiframeの中では戻る/進むでスクロール位置を正しく戻しません（Firefoxは戻る遷移のhandlerも2回走らせます）。そのため戻る/進むは、Playwrightでトップレベルに開いたページで確かめています。',
  en: 'Nothing here is mocked, so a test of navigation needs a real browser environment. The package’s own suite runs in Vitest’s browser mode on Chromium, Firefox and WebKit. Browser mode runs a test inside an iframe, though, where Firefox and WebKit do not restore the scroll position on back and forward (Firefox also runs a traversal’s handler twice), so going back and forward is checked in a top-level page opened with Playwright.',
});

export const testingPure = message({
  ja: '表の形、params、優先順位は、ブラウザなしで`routes.match()`に直接問えます。`matchPath`も純粋関数です。',
  en: 'A table’s shape, params and precedence need no browser: ask `routes.match()` directly. `matchPath` is a pure function too.',
});

export const testingRender = message({
  ja: '`<Router>`をマウントしたテストは、表が答えるパスへの移動をすでにinterceptしています。`finished`は新しい木が画面に出たときに解決するので、待った直後に`waitFor`なしで画面を確かめられます。ページのpassive effectはその後に走るので、effectの結果はリトライしながら確かめます。',
  en: 'A test that mounts `<Router>` already intercepts navigations to paths the table answers. `finished` resolves when the new tree is on screen, so the screen can be asserted right after awaiting it, with no `waitFor`. A page’s passive effects run after that, so assert their results with a retry.',
});

export const testingIntercept = message({
  ja: '注意が1つあります。マウントした`<Router>`がinterceptしない移動（表に無いURLへの移動や、ルーターが無い状態でテストランナーのURLへ戻す処理など）は、テスト自身がinterceptしなければなりません。誰もinterceptしない`navigation.navigate()`は文書読み込みになり、テストランナーごと別のページへ移ってしまいます。下の例は、表が何に答えるかにかかわらず後片付けが効くように、ランナーのURLへ戻す移動を自分でinterceptしています。',
  en: 'One thing to know: a navigation no mounted `<Router>` intercepts — to a URL outside the table, or back to the runner’s URL when no router is there — has to be intercepted by the test itself. A `navigation.navigate()` nobody intercepts is a cross-document load that takes the test runner with it. The example below intercepts its own return to the runner’s URL, so the clean-up works whatever the table answers.',
});

export const pendingTitle = message({
  ja: '読み込み中を見せる',
  en: 'Showing that a page is loading',
});

export const pendingDescription = message({
  ja: 'ページの切り替えは裏で描かれ、新しいページが来るまで前のページが画面に残ります。`usePendingPathname()`は、進行中のページの切り替えの行き先（表の書き方のpathname）で、何も進行していなければ`null`です。遷移が始まった時点で入り、新しいページが画面に出たとき、または遷移が諦められたときに消えます。状態の変更（searchやentry）はページの切り替えではないので、何も入れません。ただし、ホストがその場で読み込み直す場合（searchを読むフレームワークのページ）は、ほかと同じ読み込み中として入ります。',
  en: 'A page change renders in the background, so the previous page stays on screen until the next one is ready. `usePendingPathname()` is where a page change in progress is going — a pathname in the table’s terms — or `null` when none is. It is set as the navigation starts and cleared once the new page is on screen, or when the navigation is given up; a state change (the search, the entry) is not a page change and sets nothing, unless the host loads the page again for it (a framework page that reads the search), which is a load in progress like any other.',
});

export const pendingLoading = message({
  ja: '枝の`loading`は、その下がサスペンドしている間に出すコンポーネントです。その場所に`<Suspense>`が置かれます。すでに画面にあるものの下でのページの切り替えは、ほかの切り替えと同じく前のページを残すので、その待ちを見せるのが`usePendingPathname()`です。',
  en: 'A branch’s `loading` is a component to show while what is below it suspends — a `<Suspense>` at that place. A page change below one already on screen keeps the previous page, as every page change does; `usePendingPathname()` is what shows that wait.',
});
