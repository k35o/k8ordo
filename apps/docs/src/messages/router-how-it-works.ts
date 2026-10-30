import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/router`がナビゲーションの処理をいつ、どこで行うかと、保証することとしないことが分かります。',
  en: 'When and where `@k8ordo/router` handles a navigation, and what it does and does not guarantee.',
});

export const whereTitle = message({
  ja: '処理する場所',
  en: 'Where it runs',
});

export const whereHook = message({
  ja: 'ナビゲーションを処理するのは、`useInterceptedNavigation`というフックです。`<Router>`はルート表を使ってこのフックを呼びます。`@k8ordo/framework`のランタイムも、同じフックを呼びます。',
  en: 'Navigations are handled by one hook, `useInterceptedNavigation`. `<Router>` calls it with its route table, and the runtime of `@k8ordo/framework` calls the same hook.',
});

export const whereSame = message({
  ja: '2つで違うのは、どのナビゲーションを扱うかと、何を読み込むかだけです。このページのほかの動きは、どちらの下でも同じです。',
  en: 'The two differ only in which navigations they handle and what they load. Everything else on this page holds under both.',
});

export const whereOwnBefore = message({
  ja: 'このフックで自分のホストを作るときの書き方は、',
  en: 'To build a host of your own on this hook, see ',
});

export const claimTitle = message({
  ja: 'インターセプトの対象',
  en: 'Intercepted navigations',
});

export const claimEvent = message({
  ja: 'リンクのクリックや`navigateTo`、戻る操作と進む操作は、どれも同じ`navigate`イベントを発火させます。`<Router>`はこのイベントを受け取り、行き先のパスがルート表にあるものだけをインターセプトします。',
  en: 'A link click, `navigateTo`, and the browser’s back and forward all reach the page as the same `navigate` event. `<Router>` listens to it and intercepts only the navigations whose destination path is in the route table.',
});

export const claimNever = message({
  ja: '次の4つは、フックがインターセプトしません。ルート表に何が書いてあっても、ブラウザがそのまま処理します。',
  en: 'The hook never intercepts these four. Whatever the route table says, the browser handles them as usual.',
});

export const claimReload = message({
  ja: '再読み込み：新しいページをサーバーから取得する操作',
  en: 'A reload: it fetches a fresh page from the server',
});

export const claimPost = message({
  ja: '本文を持つフォームの送信（POST）：本文を扱えるのはサーバーだけ',
  en: 'A form submitted with a body (POST): only the server can act on the body',
});

export const claimDownload = message({
  ja: 'ダウンロード：ファイルを保存する操作',
  en: 'A download: it saves a file',
});

export const claimFragment = message({
  ja: 'フラグメント（URLの`#`より後ろ）だけの変更：同じページの中の移動',
  en: 'A change to the fragment alone (what follows `#`): it moves within the same page',
});

export const claimOther = message({
  ja: '別のオリジンへの移動のように、ブラウザがインターセプトを許さないナビゲーションも対象外です。',
  en: 'A navigation the browser does not allow a page to intercept, such as one to another origin, is not intercepted either.',
});

export const claimGet = message({
  ja: 'GETのフォームは本文を持たないので、インターセプトします。',
  en: ' A GET form carries no body, so it is intercepted.',
});

export const claimStateBefore = message({
  ja: '`@k8ordo/state`の`update()`によるURLの書き換えも、同じイベントで処理されます。詳しくは',
  en: ' URL rewrites by `@k8ordo/state`’s `update()` go through the same event. See ',
});

export const finishedTitle = message({
  ja: '`finished`の解決',
  en: 'When `finished` resolves',
});

export const finishedScreen = message({
  ja: '`navigateTo`が返す`finished`は、URLが書き換わったあと、新しいページが描画された時点で解決します。',
  en: 'The `finished` promise that `navigateTo` returns resolves when the new page has rendered, not when the URL changed.',
});

export const finishedPaint = message({
  ja: '正確には、Reactが新しいページをコミットしたあと、ブラウザが画面に描く前です。前のスクロール位置で新しいページが1フレーム見えることはありません。',
  en: 'More precisely, after React commits the new page and before the browser paints it, so the new page never shows for a frame at the old scroll position.',
});

export const finishedLazy = message({
  ja: '待つのは新しいページの最初のコミットです。ナビゲーションで新しくマウントされた`<Suspense>`の中で`React.lazy`のページがサスペンドすると、fallbackをコミットした時点で解決します。コードの読み込みは待ちません。',
  en: 'What it waits for is the new page’s first commit. When a `React.lazy` page suspends inside a `<Suspense>` the navigation newly mounted, `finished` resolves once the fallback is committed. It does not wait for the code to load.',
});

export const stateTitle = message({
  ja: '状態だけの更新',
  en: 'State-only updates',
});

export const stateInPlace = message({
  ja: 'クエリや履歴エントリの状態だけが変わるナビゲーションでは、パスは画面に出ているページと同じです。ルーターはこれをページの切り替えとして扱わず、何も読み込まずにインターセプトします。ページは作り直されず、フォーカスも動きません。戻ると進むを除けば、スクロール位置も動かず、`finished`はURLが書き換わった時点で解決します。',
  en: 'When only the query or the history entry’s state changes, the path is that of the page on screen. The router does not treat this as a page change, and intercepts it without loading anything. Nothing remounts and focus stays where it is. Except on back and forward, scroll stays put too, and `finished` resolves as soon as the URL changes.',
});

export const stateTraverse = message({
  ja: '戻ると進むでは、その履歴エントリを離れたときの位置に戻ります。ページがそのエントリの値で描き終わってから戻すので、`useDeferredValue`で遅らせて描く一覧でも、離れたときの位置に戻ります。`finished`はその描画を待ちます。',
  en: 'On back and forward, the scroll position returns to where the history entry was left. It does so once the page has rendered that entry’s values, so a list rendered late through `useDeferredValue` comes back to where it was left too, and `finished` waits for that render.',
});

export const stateRefresh = message({
  ja: '例外は、`useInterceptedNavigation`に渡した`refresh`が`true`を返したときです。同じパスのページを読み込み直し、`finished`はその描画を待ちます。フォーカスは動かさず、トランジションの種類も付けません。スクロール位置は、戻ると進むでだけ、読み込み直したページが出てから戻ります。`<Router>`は読み込み直しませんが、`@k8ordo/framework`は`search`をexportしたページを読み込み直します。',
  en: 'The exception is a `refresh` passed to `useInterceptedNavigation` that returns `true`. The page at the same path then loads again, and `finished` waits for it to render. Focus stays put, and no transition types are added. Only on back and forward does the scroll position come back, once the page loaded again is on screen. `<Router>` never loads again in place, while `@k8ordo/framework` does for a page that exports `search`.',
});

export const stateShown = message({
  ja: '比べる相手は画面に出ているページのパスで、アドレスバーのパスとは限りません。読み込み中のページのURLで状態だけを更新すると、ルーターはページの切り替えとして扱います。そのページの読み込みはそのまま続き、更新の`finished`もそのページの描画を待ちます。読み込み中に画面のページの履歴エントリへ戻ると、ページの切り替えの取り消しとして扱い、スクロール位置はそのままです。',
  en: 'The comparison is with the page on screen, which is not always what the address bar shows. A state-only update to the URL of a page that is still loading counts as a page change. That page still arrives, and the update’s `finished` waits for it to render. Going back, while it loads, to the entry of the page on screen calls the page change off, and the scroll position stays.',
});

export const backgroundTitle = message({
  ja: '描画の優先度',
  en: 'Render priority',
});

export const backgroundDeferred = message({
  ja: '新しいページは、`useDeferredValue`と同じ優先度で描画されます。次のページの準備ができるまで前のページが画面に残り、操作もできます。',
  en: 'The new page renders at the priority `useDeferredValue` gives it. The previous page stays on screen, and stays usable, until the next one is ready.',
});

export const backgroundNotTransition = message({
  ja: 'この描画はトランジションにしません。そのため、アクションの中で`finished`を待っても止まらず、ほかのアクションが保留中でもページの切り替えは遅れません。',
  en: 'It is not a transition, so an action can await `finished` without stalling, and a pending action elsewhere does not delay a page change.',
});

export const backgroundTypesBefore = message({
  ja: 'この描画には、`navigation`と`navigation-push`のようなトランジションの種類を付けます。`<ViewTransition>`での使い方は',
  en: 'The render carries the transition types `navigation` and a kind such as `navigation-push`. For using them with `<ViewTransition>`, see ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const scrollTitle = message({
  ja: 'スクロールとフォーカス',
  en: 'Scroll and focus',
});

export const scrollTop = message({
  ja: '新しいページが画面に出ると、フォーカスはページを読み込んだときと同じ場所に移ります。`autofocus`の要素があればその要素へ、無ければ`<body>`へ移ります。スクロール位置も、URLにフラグメントがあればその要素へ、無ければページの先頭へ移ります。',
  en: 'Once the new page is on screen, focus goes where a page load would put it: to the element with `autofocus`, or to `<body>` when there is none. Scroll goes the same way, to the element the fragment names, or to the top when there is no fragment.',
});

export const scrollFragment = message({
  ja: 'フラグメントの要素は、`id`か`name`属性が一致するもので探します。デコードしてから探すので、`#%E5%B0%8E%E5%85%A5`は`id="導入"`の要素を指します。見つからなければ先頭へ移ります。',
  en: 'The fragment’s element is the one whose `id` or `name` attribute matches. The fragment is decoded first, so `#%E5%B0%8E%E5%85%A5` finds `id="導入"`. When nothing matches, the page goes to the top.',
});

export const scrollTraverse = message({
  ja: 'ブラウザの戻ると進むでは、その履歴エントリを離れたときの位置に戻ります。戻すのはブラウザでなくルーターで、ページが画面に出るときに一度に置きます。読み込みの間に前のページをスクロールしても、戻る位置は変わりません。読み込み中に取り消したページのように、一度も画面に出なかった履歴エントリへ進んだときは、フラグメントの要素か先頭へ移ります。',
  en: 'On the browser’s back and forward, the scroll position returns to where the history entry was left. The router puts it there, not the browser, and at once, as the page comes on screen. Scrolling the previous page while the next one loads does not change where it lands. An entry that never reached the screen, such as a page change called off while it loaded, goes to the fragment’s element or to the top.',
});

export const scrollTraverseKeyless = message({
  ja: '例外はWebKitです。別のオリジンから戻って読み直した文書から、それより前の履歴エントリへ戻ると、WebKitは行き先のキーを渡しません。このときはルーターでなくブラウザが位置を戻します。読み込みの間に前のページをスクロールすると、ブラウザは位置を戻さず、スクロールした位置に残ります。',
  en: 'WebKit is the exception. In a document it loaded again on coming back from another origin, it gives a traversal to an earlier history entry no key, so the browser restores the position instead of the router. If the visitor scrolled the previous page while the next one loaded, the browser does not restore it, and the page stays where they scrolled it.',
});

export const scrollTraverseReload = message({
  ja: '別のサイトから戻ったときは、WebKitが戻る操作を知らせないので、ルーターがページを再読み込みします。サーバーで描いたページはブラウザが位置を戻し、クライアントで描いたページは先頭に着きます。',
  en: 'Coming back from another site, WebKit does not report that traversal at all, so the router reloads the page. The browser restores the position of a page rendered on the server, and a page rendered on the client starts at the top.',
});

export const abortTitle = message({
  ja: 'ナビゲーションの追い越し',
  en: 'Superseded navigations',
});

export const abortSignal = message({
  ja: '読み込みの途中で次のナビゲーションが始まると、前のナビゲーションは中断されます。中断にはブラウザの`AbortSignal`を使います。追い越された側の`finished`は、中断の理由でrejectします。そのページは、あとから読み込みが終わっても画面に出ません。',
  en: 'When the next navigation starts while one is still loading, the earlier one is aborted through the browser’s own `AbortSignal`. The overtaken navigation’s `finished` rejects with the abort reason. Its page never reaches the screen, even if its load completes afterwards.',
});

export const abortLazy = message({
  ja: '`React.lazy`のコードの読み込みは取り消せません。動的importは`AbortSignal`を受け取らないので、読み込みは最後まで進み、次に開いたときに使われます。',
  en: 'A `React.lazy` chunk cannot be cancelled. A dynamic import takes no `AbortSignal`, so the load runs to the end and is reused on the next visit.',
});

export const guaranteesTitle = message({
  ja: '保証すること',
  en: 'Guarantees',
});

export const guarantees = [
  message({
    ja: '再読み込みとダウンロード、本文を持つフォームの送信とフラグメントだけの変更は、インターセプトしません。',
    en: 'A reload, a download, a form submitted with a body and a change to the fragment alone are never intercepted.',
  }),
  message({
    ja: '`finished`は、Reactが新しいページをコミットしたあと、ブラウザが画面に描く前に解決します。',
    en: '`finished` resolves after React commits the new page and before the browser paints it.',
  }),
  message({
    ja: 'ページの切り替えは、保留中のアクションに待たされません。アクションの中で`finished`を待っても止まりません。',
    en: 'A page change is never held back by a pending action, and an action that awaits `finished` does not stall.',
  }),
  message({
    ja: 'クエリや履歴エントリの状態だけが変わるナビゲーションでは、フォーカスを動かしません。戻ると進むを除いて、スクロール位置も動かしません。',
    en: 'A navigation that changes only the query or the entry’s state does not move focus, nor, except on back and forward, the scroll position.',
  }),
  message({
    ja: '戻ると進むでは、同じページの中でも、ページがそのエントリを描き終えてから、そのエントリを離れたときの位置に戻します。',
    en: 'On back and forward, within one page too, the scroll position returns to where the entry was left once the page has rendered that entry.',
  }),
  message({
    ja: '読み込み中に、画面に残るページの履歴エントリへ戻ると、スクロール位置はそのままです。',
    en: 'Going back while a page loads, to the entry of the page still on screen, leaves the scroll position where it is.',
  }),
  message({
    ja: 'ページを切り替えると、戻ると進むを除いて、フラグメントの要素かページの先頭へスクロールします。新しいページが前のスクロール位置で描かれることはありません。',
    en: 'A page change other than back and forward scrolls to the fragment’s element or to the top. The new page is never painted at the old scroll position.',
  }),
  message({
    ja: '読み込みの途中で追い越されたナビゲーションは、`finished`が中断の理由でrejectし、そのページは画面に出ません。',
    en: 'A navigation overtaken while loading has its `finished` reject with the abort reason, and its page never reaches the screen.',
  }),
  message({
    ja: 'ページを切り替える描画には、`navigation`と`navigation-push`のような種類を付けます。同じパスでの更新には付けません。',
    en: 'The render of a page change carries `navigation` and a kind such as `navigation-push`. An update at the same path carries none.',
  }),
] as const;

export const nonGuaranteesTitle = message({
  ja: '保証しないこと',
  en: 'Not guaranteed',
});

export const nonGuarantees = [
  message({
    ja: 'URLと画面のページは、読み込みの間は一致しません。URLが先に書き換わり、前のページが画面に残ります。',
    en: 'The URL and the page on screen do not agree while the next page loads. The URL changes first, and the previous page stays on screen.',
  }),
  message({
    ja: '`finished`は、`React.lazy`のページのコードの読み込みを待ちません。',
    en: '`finished` does not wait for a `React.lazy` page’s code to load.',
  }),
  message({
    ja: '戻ると進むで戻すのは、文書のスクロール位置だけです。ページの中でスクロールする要素の位置と、ピンチズームの倍率は戻しません。',
    en: 'On back and forward, only the document’s scroll position comes back, not that of an element scrolling inside the page, nor the pinch-zoom scale.',
  }),
  message({
    ja: 'WebKitで別のオリジンや別のサイトから戻った文書では、離れたときの位置に戻らないことがあります。',
    en: 'In a document WebKit loaded again on coming back from another origin or site, the position may not return to where the entry was left.',
  }),
  message({
    ja: '追い越されたナビゲーションでも、`React.lazy`のコードの読み込みは止めません。',
    en: 'An overtaken navigation does not stop the load of its `React.lazy` chunk.',
  }),
] as const;
