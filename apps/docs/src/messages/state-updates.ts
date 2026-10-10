import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`useAppState`が返す`update()`は、どの置き場所でも同じ書き方で状態を変えます。値が画面に反映される時点と置き場所に書き込まれる時点を知り、それに合わせた書き方ができるようになります。',
  en: 'The `update()` that `useAppState` returns changes state the same way in every place. You will know when a value reaches the next render and when it is written to its place, and write updates accordingly.',
});

export const patchTitle = message({
  ja: '変えるフィールドだけ',
  en: 'Changed fields only',
});

export const patchObject = message({
  ja: '`update()`には、変えるフィールドだけのオブジェクトを渡します。渡さなかったフィールドは今の値のまま残ります。',
  en: 'Pass `update()` an object with only the fields to change. Every field you leave out keeps its current value.',
});

export const patchSync = message({
  ja: '渡した値はその場で状態に入り、次の描画に反映されます。置き場所への書き込みはそのあとに行われるので、画面がURLやストレージの書き込みを待つことはありません。',
  en: 'The values enter the state at once, and the next render shows them. The write to the place happens afterwards, so the screen never waits for the URL or storage.',
});

export const patchUnknown = message({
  ja: '定義に無いフィールドは型エラーになります。型チェックを通さずに渡すと、`"product-list" has no field "sort"`のような`TypeError`になります。',
  en: 'A field the definition does not declare is a type error. Passed in a way that bypasses the type check, it raises a `TypeError` such as `"product-list" has no field "sort"`.',
});

export const validateTitle = message({
  ja: '書き込みの検証',
  en: 'Validation on write',
});

export const validateCallout = message({
  ja: '`page`が`.min(1)`なら、既定値の`1`になる',
  en: 'With `page` at `.min(1)`, lands on the default `1`',
});

export const validateSchema = message({
  ja: '`update()`は、まとめた状態をスキーマに通してから次の描画に反映します。`url`のフィールドはURLから読むときと同じ手順で検証されるので、`update({ page: 0 })`は`?page=0`を開いたときと同じ結果になります。',
  en: '`update()` runs the merged state through the schema before the next render. A `url` field is validated the same way as a value read from the URL, so `update({ page: 0 })` ends up where opening `?page=0` would.',
});

export const validateThrow = message({
  ja: 'URLで表せない値を渡すと、`update()`の呼び出しそのものが`has no URL serialization`で終わる`TypeError`になります。何も書き込まれません。',
  en: 'A value no URL can carry makes the `update()` call itself fail with a `TypeError` ending in `has no URL serialization`. Nothing is written.',
});

export const validateMemory = message({
  ja: 'メモリの状態にはスキーマが無いので、渡した値がそのまま入ります。',
  en: 'A memory state has no schema, so whatever you pass goes in as it is.',
});

export const historyTitle = message({
  ja: '`replace`と`push`',
  en: '`replace` and `push`',
});

export const historyReplaceCallout = message({
  ja: '今の履歴エントリを書き換える',
  en: 'Rewrites the current history entry',
});

export const historyPushCallout = message({
  ja: '新しい履歴エントリを追加する',
  en: 'Adds a new history entry',
});

export const historyPush = message({
  ja: "`update()`は、既定では今の履歴エントリを書き換えます。ブラウザの戻るで取り消したい更新にだけ、`{ history: 'push' }`を付けます。ページ送りがその例です。",
  en: "By default `update()` rewrites the current history entry. Pass `{ history: 'push' }` only for an update the back button should undo, such as paging.",
});

export const historyPageOnly = message({
  ja: 'このオプションは`definePageState`の`update()`にだけあり、`url`の値が変わるときにだけ効きます。`entry`の値だけを変える更新は、今の履歴エントリをその場で書き換えます。同じバッチで1回でも`push`を指定すれば、そのバッチの遷移は`push`になります。',
  en: 'The option exists only on `definePageState`’s `update()`, and takes effect only when a `url` value changes. An update that changes only `entry` values rewrites the current history entry in place. If any call in a batch asks for `push`, the batch’s navigation is a push.',
});

export const historyNavigateTo = message({
  ja: 'ページを移るときは、`@k8ordo/router`の`navigateTo`を使います。こちらは既定で`push`です。',
  en: 'To move to another page, use `@k8ordo/router`’s `navigateTo`. It pushes by default.',
});

export const batchTitle = message({
  ja: '書き込みのまとめ',
  en: 'Writes in one handler',
});

export const batchOne = message({
  ja: '同じハンドラの中で続けて呼んだ`update()`は、Reactの`setState`と同じように1回にまとまります。上の2回の呼び出しも、書き込みは1回です。',
  en: 'Several `update()` calls in one handler are batched, as `setState` calls are. The two calls above are one write.',
});

export const batchBy = message({
  ja: '1回の書き込みが何になるかは、置き場所と変わった値で決まります。',
  en: 'What that one write is depends on the place and on what changed.',
});

export const batchUrl = message({
  ja: '`url`の値が変わるとき：`navigation.navigate()`を1回。`entry`の変更も一緒に書き込みます。',
  en: 'A `url` value changes: one `navigation.navigate()`, carrying any `entry` changes with it.',
});

export const batchEntry = message({
  ja: '`entry`の値だけが変わるとき：`navigation.updateCurrentEntry()`を1回。',
  en: 'Only `entry` values change: one `navigation.updateCurrentEntry()`.',
});

export const batchStorage = message({
  ja: 'localStorageとsessionStorage：`setItem`を1回。',
  en: 'localStorage and sessionStorage: one `setItem`.',
});

export const batchCookie = message({
  ja: 'Cookie：`cookieStore.set()`を1回。',
  en: 'A cookie: one `cookieStore.set()`.',
});

export const batchMemory = message({
  ja: 'メモリ：まとめません。呼ぶたびにその場で置き換え、呼ぶたびに解決済みのハンドルを返します。',
  en: 'Memory: nothing is batched. Each call applies on the spot and returns a handle of its own, already settled.',
});

export const batchSame = message({
  ja: 'ページの状態のバッチの結果が今の値と同じなら、遷移も履歴エントリの書き換えも起きません。localStorageとsessionStorage、Cookieは、値が変わらなくても保存した値を書き直します。ほかの定義やルーターのパラメータが残る仕組みは',
  en: 'A page state batch whose result equals the current values neither navigates nor rewrites the history entry. localStorage, sessionStorage and cookies rewrite their stored value even when nothing changed. How parameters of other definitions and of the router are kept is explained on ',
});

export const handleTitle = message({
  ja: '`committed`と`finished`',
  en: '`committed` and `finished`',
});

export const handleShape = message({
  ja: '`update()`は、`navigation.navigate()`と同じ形の、2つのPromiseを持つオブジェクトを返します。Promiseそのものではないので、無視しても`no-floating-promises`のlintには掛かりません。無視するのが普通の使い方です。',
  en: '`update()` returns an object holding two promises, the same shape `navigation.navigate()` returns. It is not a promise itself, so ignoring it does not trip `no-floating-promises`. Ignoring it is the normal case.',
});

export const handleCommitted = message({
  ja: '`committed`：書き込みが置き場所に入ったときに解決します。',
  en: '`committed`: settles once the write is in its place.',
});

export const handleFinished = message({
  ja: '`finished`：書き込みのあとにルーターが行う処理まで終わったときに解決します。',
  en: '`finished`: settles once the router has finished whatever follows the write.',
});

export const handleWait = message({
  ja: '書き込みを待つときは`finished`を待ちます。下の例では、ページ送りのあとに見出しへフォーカスを移しています。',
  en: 'To wait for the write, await `finished`. Here, focus moves to the heading once the next page is in place.',
});

export const handleSettle = message({
  ja: '遷移を伴わない書き込みのハンドルは、バッチを書き込んだ時点で解決します。Cookieは、Cookie Store APIが書き終えた時点です。ハンドルがrejectするのは次の2つの場合です。',
  en: 'A handle for a write with no navigation behind it settles once the batch is written; a cookie handle once the Cookie Store API has written it. A handle rejects in two cases.',
});

export const handleAbort = message({
  ja: 'あとから来た遷移に追い越された遷移：`AbortError`。たとえば同じハンドラで別のページの状態も書いたときです。ハンドルを待たなければ気づくことはありません。',
  en: 'A navigation overtaken by a later one: an `AbortError`, for example when the same handler also writes another page state. A caller that never awaits the handle never sees it.',
});

export const handleFail = message({
  ja: 'localStorage、sessionStorage、Cookieへの書き込みの失敗：その書き込みのエラーでrejectします。容量の上限、4KBを超えるCookie、書き込む値でスキーマが例外を出したときです。描画した値はそのまま残ります。',
  en: 'A failed localStorage, sessionStorage or cookie write: the handle rejects with that error. A full quota, a cookie over 4 KB, or a schema that throws on the values about to be written. The rendered value stays.',
});

export const handleAction = message({
  ja: '非同期のアクションの中でも同じように待てます。`startTransition(async …)`や`useTransition`、`@k8ordo/ui`の`Button`の`onAction`がそうです。ただし`@k8ordo/router`の下では、別のページを読み込んでいる最中の`url`の更新はページの切り替えになります。その`finished`は、アクションの終わりを待たずに、そのページが表示された時点で解決します。',
  en: 'An async action can await it the same way: `startTransition(async …)`, `useTransition`, or `@k8ordo/ui`’s `Button` `onAction`. Under `@k8ordo/router`, though, a `url` update issued while another page is still loading is a page change. Its `finished` settles once that page is on screen, without waiting for the action to end.',
});

export const functionalTitle = message({
  ja: '関数形式の更新',
  en: 'Functional updates',
});

export const functionalBatch = message({
  ja: '今の値を元に次の値を作るときは、`update()`に関数を渡します。関数が受け取るのは、同じバッチでまだ書き込まれていない更新も反映した状態です。',
  en: 'To derive the next value from the current one, pass `update()` a function. The function receives the batched state, including updates not yet written.',
});

export const functionalTwice = message({
  ja: '描画で読んだ`page`を使って`update({ page: page + 1 })`を同じハンドラで2回呼ぶと、1つしか増えません。関数で書けば2つ増えます。',
  en: 'Calling `update({ page: page + 1 })` twice in one handler with the `page` read during render adds one. Written as a function, it adds two.',
});

export const keysTitle = message({
  ja: 'キーの購読',
  en: 'Key subscriptions',
});

export const keysAllCallout = message({
  ja: 'どのフィールドが変わっても再描画',
  en: 'Any field re-renders it',
});

export const keysPageCallout = message({
  ja: '`page`が変わったときだけ再描画',
  en: 'Only `page` re-renders it',
});

export const keysNoneCallout = message({
  ja: '何も購読しない（書き込み専用）',
  en: 'Subscribes to nothing (write-only)',
});

export const keysOptionsCallout = message({
  ja: 'オプションはキーの配列のあと',
  en: 'Options come after the key array',
});

export const keysInline = message({
  ja: '`useAppState`の2つ目の引数にキーの配列を渡すと、そのキーが変わったときだけ再描画されます。配列はインラインで書いてかまいません。内部で正規化してから比べるので、`useMemo`は要りません。',
  en: 'Pass `useAppState` an array of keys as its second argument, and it re-renders only when one of those keys changes. The array can be written inline. It is normalized internally, so `useMemo` is not needed.',
});

export const keysCompare = message({
  ja: '変わらなかったフィールドは前と同じ参照を保つので、`memo`や依存配列にそのまま渡せます。フィールドの比べ方は',
  en: 'A field that did not change keeps its previous reference, so it goes straight into `memo` or a dependency array. How fields are compared is explained on ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const keysSplit = message({
  ja: '更新の頻度が大きく違う状態は、定義を分けます。再描画は定義の単位で決まるからです。',
  en: 'Give state that changes at very different rates separate definitions. Re-rendering is decided per definition.',
});

export const draftsTitle = message({
  ja: '入力中の値',
  en: 'Drafts',
});

export const draftsCommit = message({
  ja: 'キーを押すたびに`update()`を呼ぶと、URLの書き換えも1文字ごとに起きます。入力中の値はDOMかReactのローカルな状態に持たせ、送信やページ送りの区切りで`update()`を呼びます。',
  en: 'Calling `update()` on every keystroke rewrites the URL once per character. Keep the draft in the DOM or in local React state, and call `update()` at a commit point such as submit or paging.',
});

export const draftsKey = message({
  ja: '`key={q}`は、戻るボタンなどで外から`q`が変わったときに、入力欄を新しい`defaultValue`で作り直します。',
  en: '`key={q}` remounts the input with the new `defaultValue` when `q` changes from outside, through the back button for example.',
});

export const draftsGetBefore = message({
  ja: 'JavaScriptが読み込まれる前から動かすなら、GETフォームでURLを書き換えます。`@k8ordo/form`と組み合わせる書き方は「',
  en: 'For a form that works before JavaScript loads, let a GET form write the URL. Pairing it with `@k8ordo/form` is covered in “',
});

export const draftsGetAfter = message({
  ja: '」にあります。',
  en: '”.',
});

export const draftsMirror = message({
  ja: '定義の値を`useState`に写して同期させないでください。写した値は、戻るボタンやほかのタブの書き込みで更新されません。値が要るところで`useAppState`を呼びます。',
  en: 'Do not copy a definition’s values into `useState` and try to keep them in sync. The copy is not updated by the back button or by other tabs’ writes. Call `useAppState` wherever the value is needed.',
});

export const demoTitle = message({
  ja: '書き込みの記録',
  en: 'Write log',
});

export const demoDescription = message({
  ja: 'このページのURLと履歴エントリを実際に書き換える`definePageState`で、`a`と`b`はURLに、`c`は履歴エントリに置いています。',
  en: 'A real `definePageState` that rewrites this page’s URL and history entry, with `a` and `b` in the URL and `c` in the entry.',
});

export const demoSteps = [
  message({
    ja: '「a + 1」を押すと、記録に`navigate · replace`で始まる行が1つ足されます。続けて「a + 1を3回」を押すと、`a`は3増えますが、足される行は1つだけです。',
    en: 'Press “a + 1”. One line starting with `navigate · replace` is added to the log. Then press “a + 1, three times”: `a` goes up by 3, yet only one line is added.',
  }),
  message({
    ja: '「c + 1」を押すと、URLは変わらず、記録には`updateCurrentEntry`が足されます。',
    en: 'Press “c + 1”. The URL stays as it is, and `updateCurrentEntry` is added to the log.',
  }),
  message({
    ja: "「b + 1」を押すと、`['a']`を購読している行の描画回数は増えず、ほかの2行だけが増えます。",
    en: "Press “b + 1”. The render count of the `['a']` subscription stays the same, and only the other two go up.",
  }),
  message({
    ja: '「a = -1」を押すと、`a`は既定値の`0`になります。スキーマが負の数を拒むからです。',
    en: 'Press “a = -1”. `a` becomes its default `0`, because the schema rejects negative numbers.',
  }),
  message({
    ja: '「a + 1（push）」を押してから、ブラウザの戻るを押します。`a`が1つ前の値に戻ります。',
    en: 'Press “a + 1 (push)”, then the browser’s back button. `a` returns to its previous value.',
  }),
] as const;

export const demoThrice = message({
  ja: 'a + 1を3回',
  en: 'a + 1, three times',
});

export const demoPush = message({
  ja: 'a + 1（push）',
  en: 'a + 1 (push)',
});

export const demoRenders = message({
  ja: '描画回数',
  en: 'Renders',
});

export const demoLog = message({
  ja: 'ブラウザが受け取った書き込み（新しい順）',
  en: 'Writes the browser received (newest first)',
});

export const demoLogEmpty = message({
  ja: 'まだありません',
  en: 'None yet',
});

export const demoNoQuery = message({
  ja: 'クエリなし',
  en: 'no query',
});
