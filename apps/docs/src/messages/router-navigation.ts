import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`<Router>` は Navigation API の navigate イベントを受け取り、表が答える移動をブラウザの中で処理します。このページでは、どの移動を引き受けるか、引き受けた移動が何を保証するか、ページ切り替えのアニメーション、`<Router>` の土台になっている `useInterceptedNavigation`、そしてテストの書き方を扱います。',
  en: '`<Router>` listens to the Navigation API’s navigate event and handles the navigations its table answers inside the browser. This page covers which navigations it takes, what a navigation it takes guarantees, animating page changes, `useInterceptedNavigation` — the primitive `<Router>` is built on — and how to test it all.',
});

export const claimTitle = message({
  ja: '引き受ける移動',
  en: 'Which navigations are handled',
});

export const claimDescription = message({
  ja: '同一オリジンのリンクのクリック、`navigateTo`、`navigation.navigate()`、戻る・進む、GET フォームの送信は、どれも同じ navigate イベントとして届きます。ルーターはそのうち、表が行き先の pathname に答えるものを intercept します。',
  en: 'A same-origin link click, `navigateTo`, `navigation.navigate()`, back and forward, and a GET form submission all arrive as the same navigate event. The router intercepts the ones whose destination pathname the table answers.',
});

export const claimTable = {
  navigation: message({ ja: '移動', en: 'Navigation' }),
  handling: message({ ja: '扱い', en: 'Handled as' }),
  pageChange: message({
    ja: '表が答える別の pathname への移動',
    en: 'To another pathname the table answers',
  }),
  pageChangeHandling: message({
    ja: 'ページの切り替え。新しい木を transition で適用する',
    en: 'A page change: the new tree is applied in a transition',
  }),
  stateChange: message({
    ja: '今表示しているページと同じ pathname への移動（search や履歴エントリの状態だけが変わる）',
    en: 'To the pathname of the page showing (only the search or the entry state moves)',
  }),
  stateChangeHandling: message({
    ja: '状態の変更。読み込みも再マウントもしない',
    en: 'A state change: nothing loads, nothing remounts',
  }),
  unclaimed: message({
    ja: '表が答えない pathname への移動',
    en: 'To a pathname the table does not answer',
  }),
  unclaimedHandling: message({
    ja: 'intercept しない。ブラウザの文書読み込みになり、404 もサーバーの本物の答えになる',
    en: 'Not intercepted: a document load, so a 404 is the server’s real answer',
  }),
  reload: message({ ja: 'リロード', en: 'A reload' }),
  post: message({
    ja: '本文を持つフォームの送信（POST）',
    en: 'A form submitted with a body (POST)',
  }),
  download: message({
    ja: 'ダウンロード（`download` 属性の付いたリンク）',
    en: 'A download (a link with `download`)',
  }),
  fragment: message({
    ja: 'fragment だけの変更（`#section`）',
    en: 'A fragment-only change (`#section`)',
  }),
  cannotIntercept: message({
    ja: 'プラットフォームが intercept できないと言うもの（別オリジンなど）',
    en: 'Anything the platform says cannot be intercepted, such as another origin',
  }),
  neverOurs: message({
    ja: '表にかかわらず intercept しない。ブラウザに任せる',
    en: 'Never intercepted, whatever the table says: left to the browser',
  }),
};

export const claimWhy = message({
  ja: 'リロード・POST・ダウンロード・fragment だけの変更を intercept すると、プラットフォームなら当然そうする動作の代わりに、何も起きなくなります。POST の本文を扱えるのはサーバーだけですし、F5 を押しても再読み込みされなくなります。GET フォームは本文を持たないので、`@k8ordo/state` が組み立てる search の形の送信は引き受けます。',
  en: 'Intercepting a reload, a POST, a download or a fragment-only change would silently do nothing where the platform would have done the obvious thing: a POST body only the server can act on, an F5 that stops reloading. A GET form carries no body, so the search-shaped submissions `@k8ordo/state` builds still come through.',
});

export const claimMount = message({
  ja: '表が答えない pathname で `<Router>` をマウントすると、推測で何かを描くことはせず、何も描きません。何にでも合う `/*` を表の最後に置けば、その pathname も表が答えるものになります。その代わり、ホストが配るファイル（`/report.pdf` など）へのリンクも表が答えるものになり、ファイルは開かれずに `/*` のコンポーネントが描かれます。そうしたリンクには `download` 属性を付けます。',
  en: 'Mounted on a pathname the table does not answer, `<Router>` renders nothing rather than guessing. A `/*` at the end of the table makes every pathname one the table answers. In exchange, a link to a file the host serves, such as `/report.pdf`, is claimed too and renders the `/*` component instead of opening the file; mark such links with `download`.',
});

export const timelineTitle = message({
  ja: 'ページが切り替わるまで',
  en: 'How a page change unfolds',
});

export const timelineDescription = message({
  ja: '表が答える別の pathname への移動は、次の順で進みます。',
  en: 'A navigation to another pathname the table answers goes through these steps, in order:',
});

export const timelineClaim = message({
  ja: 'navigate イベントで、ルーターは自分が扱う移動か、表が行き先に答えるかを同期的に判断します。intercept できるのはこの瞬間だけです。',
  en: 'On the navigate event, the router decides — synchronously, the only moment interception is possible — whether the navigation is its to handle and whether the table answers the destination.',
});

export const timelineCommit = message({
  ja: 'URL が確定します。`committed` が解決し、`usePathname` が新しい pathname を返します。画面はまだ前のページです。',
  en: 'The URL commits. `committed` resolves and `usePathname` returns the new pathname; the previous page is still on screen.',
});

export const timelineApply = message({
  ja: '新しい照合結果を `startTransition` の中で適用します。transition には `navigation` と `navigation-push` などの型が付きます。',
  en: 'The new match is applied inside `startTransition`, tagged with `navigation` and a type such as `navigation-push`.',
});

export const timelineLayoutEffect = message({
  ja: 'React が新しい木を commit します。描画の前の layout effect で、ルーターがスクロール位置を決めます。',
  en: 'React commits the new tree. In a layout effect, before the browser paints, the router places the viewport.',
});

export const timelineFinished = message({
  ja: '`finished` が解決します。',
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
  ja: '`finished` は「画面に出た」',
  en: '`finished` means on screen',
});

export const finishedDescription = message({
  ja: 'intercept のハンドラは、React が新しい木を commit した後、ブラウザが描画する前の layout effect で解決します。`finished` を待つコードは URL の書き換えではなく描画を待っています。待つのは新しい木の最初の commit なので、ナビゲーションで新しくマウントされた `<Suspense>` に `React.lazy` のページがサスペンドした場合は、chunk が届く前、fallback が commit された時点で解決します。',
  en: 'The intercept handler resolves in a layout effect, once React has committed the new tree and before the browser paints it. Code awaiting `finished` is awaiting the render, not the URL write. The render it waits for is the new tree’s first commit: a `React.lazy` page that suspends into a `<Suspense>` the navigation mounts anew commits its fallback first, and `finished` resolves then, before the chunk is in.',
});

export const finishedPitfall = message({
  ja: 'ただし、`startTransition` の非同期アクションの中で `finished` を待つと止まります。ルーターが新しいページを適用する transition が、そのアクションの終わりを待つからです。待ちはイベントハンドラで行います。`finished` を待たない場合でも、どこかの非同期アクションが保留中の間に始まったページの切り替えは、そのアクションが終わるまで画面に出ません。',
  en: 'Awaiting `finished` inside an async `startTransition` action stalls, though: the transition that applies the new page waits for that action to end. Await it in an event handler instead. Even without awaiting it, a page change that starts while any async action is pending does not reach the screen until that action ends.',
});

export const stateTitle = message({
  ja: '状態の変更はページの切り替えではない',
  en: 'A state change is not a page change',
});

export const stateDescription = message({
  ja: 'search か履歴エントリの状態だけが変わった移動では、pathname は画面に出ているページのものと同じです。ルーターはハンドラを付けずに intercept し、ルートの木に触れません。何も再マウントされず、スクロール位置もフォーカスも動きません。search を更新してもページが先頭に戻らないのはこのためです。待つべき描画が無いので、その `finished`（`@k8ordo/state` の `update().finished` を含む）は移動が確定した時点で解決します。',
  en: 'When only the search or the entry state moved, the pathname is that of the page on screen. The router intercepts with no handler and leaves the route tree alone: nothing remounts, and neither scroll nor focus is disturbed. This is why a search update never scrolls the page back to the top. With no render to wait for, its `finished` — `@k8ordo/state`’s `update().finished` included — settles as soon as the navigation commits.',
});

export const stateShown = message({
  ja: '比べる相手はアドレスバーではなく、画面に出ているページです。intercept では URL が先に確定するので、別のページの読み込み中にその URL へ状態の更新が来た場合はページの切り替えとして扱います。そのページが届くのを止めず、その `finished` もそのページの描画を待ちます。元のページ移動の `finished` は abort で reject し、ページは状態の更新の側のナビゲーションで届きます。',
  en: 'The comparison is against the page showing, not the address bar. Interception commits the URL first, so a state update issued while another page is still loading is treated as a page change: it lets that page finish arriving, and its `finished` waits for that render. The original navigation’s `finished` still rejects with the abort; the page arrives through the state update’s navigation.',
});

export const scrollTitle = message({
  ja: '新しいページは先頭から',
  en: 'A new page starts at the top',
});

export const scrollDescription = message({
  ja: '新しい木が画面に出ると、文書の読み込みと同じ位置にスクロールします。URL に `#fragment` があればその要素（`id` か、古い綴りの `<a name>` と同じ `name` 属性で探す）へ、無いか見つからなければ先頭へ移ります。fragment はデコードしてから探すので、`#%E5%B0%8E%E5%85%A5` は `id="導入"` の要素を指します。',
  en: 'Once the new tree is on screen, the viewport goes where a document load would put it: to the element a `#fragment` names — found by `id`, or by `name` the way an old-style `<a name>` is — or to the top when there is no fragment or nothing answers it. The fragment is decoded before the lookup, so `#%E5%B0%8E%E5%85%A5` finds `id="導入"`.',
});

export const scrollTraverse = message({
  ja: '戻る・進むの位置はブラウザが保存したものを復元します。ルーターは触れません。フォーカスは、ページの切り替えではプラットフォームの既定のリセットに任せ、状態の変更では動かしません。',
  en: 'On back and forward the browser restores the position it saved; the router stays out of it. Focus follows the platform’s default reset on a page change and is left where it is on a state change.',
});

export const transitionTitle = message({
  ja: 'ページの切り替えは transition',
  en: 'Page changes run in a transition',
});

export const transitionDescription = message({
  ja: '新しい木は `startTransition` の中で適用されるので、次のページの準備ができるまで React は前のページを操作できる状態で保てます。`React.lazy` の chunk を待つ間も同じです。',
  en: 'The new tree is applied inside `startTransition`, so React can keep the previous page interactive while the next one prepares — while a `React.lazy` chunk arrives, for instance.',
});

export const abortTitle = message({
  ja: '追い越されたナビゲーションは abort される',
  en: 'Superseded navigations abort',
});

export const abortDescription = message({
  ja: '2 つ目のナビゲーションは、プラットフォーム自身の signal で 1 つ目を abort します。追い越された側の `finished` は abort の理由で reject し、その読み込みがすでに終わっていても、その木は画面に出ません。`load` はその signal を受け取るので、フレームワークの下ではペイロードの fetch ごと取り消されます。`React.lazy` の chunk は取り消せない（動的 import は signal を取らない）ので裏で読み込みを終え、次の訪問のために残りますが、そのページは表示されません。',
  en: 'A second navigation aborts the first through the platform’s own signal. The overtaken `finished` rejects with the abort reason, and its tree never reaches the screen even if its load had already come back. `load` receives that signal, so under the framework the payload fetch is cancelled outright. A `React.lazy` chunk cannot be — a dynamic import takes no signal — so it finishes in the background and is kept for the next visit, while the page it belonged to is never shown.',
});

export const historyTitle = message({
  ja: 'push・replace・traverse',
  en: 'Push, replace and traverse',
});

export const historyDescription = message({
  ja: 'ルーターは移動の種類をプラットフォームの `navigationType` から受け取り、transition の型として伝えます。どのページの切り替えも 1 つ目の型は `navigation` です。',
  en: 'The router takes the kind of navigation from the platform’s `navigationType` and passes it on as a transition type. Every page change is tagged `navigation` first.',
});

export const historyTable = {
  type: message({ ja: '2 つ目の型', en: 'Second type' }),
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
    ja: '戻る・進む、`navigation.back()` / `navigation.forward()` / `navigation.traverseTo()`',
    en: 'Back and forward: `navigation.back()`, `navigation.forward()`, `navigation.traverseTo()`',
  }),
};

export const historyEntryState = message({
  ja: '履歴エントリに状態を載せるのは `@k8ordo/state` の仕事です。`navigateTo` のオプションは `history` だけです。',
  en: 'Putting state on a history entry is `@k8ordo/state`’s job; `navigateTo`’s only option is `history`.',
});

export const animateTitle = message({
  ja: 'ページの切り替えをアニメーションする',
  en: 'Animating page changes',
});

export const animateDescription = message({
  ja: 'ページの切り替えは transition なので、React の `<ViewTransition>` でアニメーションできます。ページが描かれる穴を `<ViewTransition>` で包み、ルーターの transition の型をキーにします。',
  en: 'A page change is a transition, and React’s `<ViewTransition>` animates what a transition changes. Wrap the hole the pages render into, and key it on the router’s transition types.',
});

export const animateWhy = message({
  ja: '型で絞るのは、ページの切り替え以外にも transition があるからです。ボタンの保留中のアクションも transition で、型で絞らなければボタンを押すたびにページ全体がクロスフェードします。`update` を使うのは、境界そのものは残り、中身だけが入れ替わるからです。`auto` はブラウザ既定のクロスフェードです。',
  en: 'The types matter because page changes are not the only transitions: a button’s pending action is one too, and without the filter every press would cross-fade the whole page. It is `update` because the boundary stays and its content changes; `auto` is the browser’s own cross-fade.',
});

export const animateThisSite = message({
  ja: "今読んでいるこのサイトが、まさにこの形です。ロケール配下のレイアウトがページを `update={{ navigation: 'auto', default: 'none' }}` の `<ViewTransition>` で包んでいるので、サイト内でページを移るたびにクロスフェードします。",
  en: "The site you are reading does exactly this: its locale layout wraps every page in a `<ViewTransition>` with `update={{ navigation: 'auto', default: 'none' }}`, which is why moving between pages here cross-fades.",
});

export const animateDirection = message({
  ja: '2 つ目の型を使えば、戻るボタンをリンクと逆向きにスライドさせられます。',
  en: 'The second type lets a back button slide the other way from a link:',
});

export const animateDirectionCss = message({
  ja: '各クラスは `::view-transition-old(.slide-back)` と `::view-transition-new(.slide-back)` で装飾します。',
  en: 'Style each class through `::view-transition-old(.slide-back)` and `::view-transition-new(.slide-back)`:',
});

export const animateStateChange = message({
  ja: '状態の変更（`@k8ordo/state` の `update()`）は木を変えないので、アニメーションしません。',
  en: 'A state change — `@k8ordo/state`’s `update()` — never changes the tree, so it never animates.',
});

export const animateReducedMotion = message({
  ja: '`@k8ordo/ui` のスタイルシートは `prefers-reduced-motion` のときに view transition のアニメーションを止めます。使っていないアプリは同じ規則を自分で足します。',
  en: '`@k8ordo/ui`’s stylesheet turns view-transition animations off under `prefers-reduced-motion`; an application without it adds that rule itself:',
});

export const animateFramework = message({
  ja: 'フレームワークの下では、同じ `<ViewTransition>` でレイアウトの `children` を包みます。Server Component のレイアウトがそのまま描けます。',
  en: 'Under the framework the same `<ViewTransition>` wraps a layout’s `children`, and a Server Component layout can render it directly.',
});

export const primitiveTitle = message({
  ja: '`useInterceptedNavigation`',
  en: '`useInterceptedNavigation`',
});

export const primitiveDescription = message({
  ja: '`<Router>` のナビゲーションの部分は、単独のフックとして公開されています。intercept して読み込み、transition の中で適用し、新しい木が画面に出てからプラットフォームのハンドラを解決します。上の保証はすべてこのフックによるものです。何を読み込むかは呼び出し側が決めます。',
  en: 'The navigation half of `<Router>` is exported as a hook of its own: intercept, load, apply in a transition, and resolve the platform’s handler only once the new tree is on screen. Every guarantee above belongs to this hook. What gets loaded is the caller’s business.',
});

export const primitiveHandler = message({
  ja: '引数は `NavigationHandler<T>` です。',
  en: 'It takes a `NavigationHandler<T>`:',
});

export const handlerClaim = message({
  ja: '`claim(url)`：この移動をアプリが扱うか。intercept できるのはこの瞬間だけなので同期的に答えます。`false` を返すと文書読み込みになります。',
  en: '`claim(url)` — whether this navigation is the application’s to handle. It answers synchronously, because that is the only moment interception is possible; `false` leaves a document load.',
});

export const handlerLoad = message({
  ja: '`load(url, signal)`：この URL で描くものを作ります。値か Promise を返します。`signal` は追い越されたときに abort されます。',
  en: '`load(url, signal)` — produces what the application renders for this URL, as a value or a promise. `signal` aborts when the navigation is overtaken.',
});

export const handlerApply = message({
  ja: '`apply(value)`：それを適用します。transition の中で呼ばれます。',
  en: '`apply(value)` — applies it. It is called inside a transition.',
});

export const primitiveEventTime = message({
  ja: 'ハンドラは描画時ではなくイベントの時点で読まれるので、描画のたびに新しいオブジェクトを渡してもメモ化は要りません。pathname が画面のページと同じ移動（状態の変更）では、`claim` も `load` も呼ばれません。',
  en: 'The handler is read at event time, not at render time, so a new object on every render needs no memoization. A navigation to the pathname of the page showing — a state change — calls neither `claim` nor `load`.',
});

export const primitiveRouter = message({
  ja: '`<Router>` はこのフックに `claim` として「表が合うか」、`load` として照合結果、`apply` として state の更新を渡したものです。フレームワークのランタイムは、同一オリジンの URL をすべて引き受け、`load` でサーバーの RSC ペイロードを取得します。',
  en: '`<Router>` is this hook given “does the table match” as `claim`, the match as `load`, and a state setter as `apply`. The framework’s runtime claims every same-origin URL and fetches the server’s RSC payload in `load`.',
});

export const primitiveGeneration = message({
  ja: '戻り値の `generation` は、URL が動いたときではなく新しい木が適用されたときにだけ変わる番号です。ホストはこれを `<NavigationGeneration value>` で配り、表の `error` 境界が失敗を手放す時を知らせます。サーバーでの描画とハイドレーションに備えて `<PathnameProvider pathname>` もホストがマウントします。`<Router>` もフレームワークのランタイムもこの 2 つを自分で置くので、アプリがこのフックを使うのは、自分で遷移の継ぎ目を作るときだけです。',
  en: 'The `generation` it returns is a number that changes exactly when a new tree is applied, not when the URL moved. A host provides it through `<NavigationGeneration value>` so the table’s `error` boundaries know when to let a failure go, and mounts `<PathnameProvider pathname>` for server renders and hydration. `<Router>` and the framework’s runtime both do this themselves, so an application reaches for this hook only when it builds its own navigation seam.',
});

export const testingTitle = message({
  ja: 'テスト',
  en: 'Testing',
});

export const testingDescription = message({
  ja: 'このパッケージは何もモックしないので、ナビゲーションのテストには本物のブラウザ環境が要ります。パッケージ自身のテストは Vitest の browser mode を Chromium で動かしています。',
  en: 'Nothing here is mocked, so a test of navigation needs a real browser environment. The package’s own suite runs in Vitest’s browser mode on Chromium.',
});

export const testingPure = message({
  ja: '表の形・params・優先順位は、ブラウザなしで `routes.match()` に直接問えます。`matchPath` も純粋関数です。',
  en: 'A table’s shape, params and precedence need no browser: ask `routes.match()` directly. `matchPath` is a pure function too.',
});

export const testingRender = message({
  ja: '`<Router>` をマウントしたテストは、表が答えるパスへの移動をすでに intercept しています。`finished` は新しい木が画面に出たときに解決するので、待った直後に `waitFor` なしで画面を確かめられます。ページの passive effect はその後に走るので、effect の結果はリトライしながら確かめます。',
  en: 'A test that mounts `<Router>` already intercepts navigations to paths the table answers. `finished` resolves when the new tree is on screen, so the screen can be asserted right after awaiting it, with no `waitFor`. A page’s passive effects run after that, so assert their results with a retry.',
});

export const testingIntercept = message({
  ja: '注意が 1 つあります。マウントした `<Router>` が intercept しない移動（表に無い URL への移動や、ルーターが無い状態でテストランナーの URL へ戻す処理など）は、テスト自身が intercept しなければなりません。誰も intercept しない `navigation.navigate()` は文書読み込みになり、テストランナーごと別のページへ移ってしまいます。下の例は、表が何に答えるかにかかわらず後片付けが効くように、ランナーの URL へ戻す移動を自分で intercept しています。',
  en: 'One thing to know: a navigation no mounted `<Router>` intercepts — to a URL outside the table, or back to the runner’s URL when no router is there — has to be intercepted by the test itself. A `navigation.navigate()` nobody intercepts is a cross-document load that takes the test runner with it. The example below intercepts its own return to the runner’s URL, so the clean-up works whatever the table answers.',
});
