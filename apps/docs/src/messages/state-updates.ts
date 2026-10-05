import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`useAppState`が返す`update()`は、どの置き場所でも同じ書き方で状態を変えます。このページでは、書いた値がいつ画面に出て、いつ置き場所に書き込まれるのかと、それに合わせた書き方を説明します。',
  en: 'The `update()` that `useAppState` returns changes state the same way, wherever it lives. This page covers when a value shows on screen, when it is written to its place, and how to write updates around that.',
});

export const patchTitle = message({
  ja: '変えたいフィールドだけを渡す',
  en: 'Pass only the fields that change',
});

export const patchDescription = message({
  ja: '`update()`には、変えたいフィールドだけのオブジェクトを渡します。渡さなかったフィールドは、今の値のまま残ります。',
  en: 'Hand `update()` an object with just the fields to change. Every field you leave out keeps its current value.',
});

export const patchSync = message({
  ja: '渡した値は、`update()`を呼んだその場で状態に入り、次の描画に出ます。置き場所への書き込みはそのあとで行われるので、画面がURLやストレージへの書き込みを待つことはありません。',
  en: 'The values enter the state the moment `update()` is called, and the next render shows them. The write to the place comes afterwards, so the screen never waits for the URL or storage.',
});

export const patchUnknown = message({
  ja: '定義に無いフィールドは型エラーになります。型を迂回して渡されたときは、`"product-list" has no field "sort"`のような`TypeError`を投げます。',
  en: 'A field the definition does not declare is a type error. Slipped past the types, it throws a `TypeError` such as `"product-list" has no field "sort"`.',
});

export const validateTitle = message({
  ja: '書いた値もスキーマを通る',
  en: 'What you write passes the schema too',
});

export const validateDescription = message({
  ja: '`update()`は、まとめた状態をその場でスキーマに通してから描画に出します。そのため、スキーマが拒む値が画面に出ることはありません。',
  en: '`update()` runs the merged state through the schema before rendering it, so a value the schema rejects never reaches the screen.',
});

export const validateUrl = message({
  ja: '`url`のフィールドは、URLから届く値と同じ道を通ります。`page`が`.min(1)`なら、`update({ page: 0 })`は`?page=0`を開いたときと同じく、既定値の`1`になります。',
  en: 'A `url` field takes the same road as a value arriving from the URL. With `page` at `.min(1)`, `update({ page: 0 })` lands on the default `1`, exactly as opening `?page=0` would.',
});

export const validateThrow = message({
  ja: 'URLで表せない値を渡すと、何も書き込む前に`update()`そのものが投げます。ハンドルをrejectするだけでは、ハンドルを待たない普通の呼び方では誰も気づけないからです。',
  en: 'A value no URL can spell makes `update()` itself throw before anything is written. A rejected handle would go unnoticed by the usual caller, who never awaits it.',
});

export const validateMemory = message({
  ja: 'メモリの状態にはスキーマが無いので、渡した値がそのまま入ります。',
  en: 'A memory state has no schema, so whatever you pass goes in as it is.',
});

export const historyTitle = message({
  ja: '履歴に積むかどうかを決める',
  en: 'Decide whether it goes in the history',
});

export const historyDescription = message({
  ja: '`update()`は、既定では今の履歴エントリを書き換えます。状態の変更は、今いる画面を少し変えるものだからです。',
  en: 'By default `update()` rewrites the current history entry, because a state change refines the screen you are on.',
});

export const historyReplaceCallout = message({
  ja: '今のエントリを書き換える',
  en: 'Rewrites the current entry',
});

export const historyPushCallout = message({
  ja: '新しいエントリを積む',
  en: 'Adds a new entry',
});

export const historyPush = message({
  ja: "ブラウザの戻るで取り消したい更新にだけ、`{ history: 'push' }`を付けます。ページ送りがその例です。同じバッチの中で1回でも`push`を指定すれば、そのバッチの遷移は`push`になります。",
  en: "Pass `{ history: 'push' }` only for an update the back button should undo, such as paging. If any call in a batch asks for `push`, the batch’s navigation is a push.",
});

export const historyPageOnly = message({
  ja: 'このオプションは、`definePageState`の`update()`にしかありません。遷移を伴うのはページの状態だけだからです。また、効くのは`url`の値が変わるときだけです。`entry`の値だけを変える更新は、今のエントリをその場で書き換えます。',
  en: 'The option exists only on `definePageState`’s `update()`, the one kind with a navigation behind it, and it takes effect only when a `url` value changes. An update that changes only `entry` values rewrites the current entry in place.',
});

export const historyNavigateTo = message({
  ja: 'ページを移るときは、`update()`ではなく`@k8ordo/router`の`navigateTo`を使います。こちらは既定で`push`です。',
  en: 'To move to another page, use `@k8ordo/router`’s `navigateTo` rather than `update()`. It pushes by default.',
});

export const batchTitle = message({
  ja: '1つのハンドラで、書き込みは1回',
  en: 'One handler, one write',
});

export const batchDescription = message({
  ja: '同じハンドラの中で続けて呼んだ`update()`は、定義ごとに1回の書き込みにまとまります。どの呼び出しも、同じハンドルを返します。',
  en: 'Calls to `update()` made one after another in the same handler go out as one write per definition, and every one of them returns the same handle.',
});

export const batchAwait = message({
  ja: '上の2回の呼び出しは、1回の書き込みになります。間に`await`を挟むと、そこから先は別のバッチになり、書き込みもハンドルも別々になります。1回の書き込みが何になるかは、置き場所と変わった値で決まります。',
  en: 'The two calls above make one write. An `await` between them starts a new batch, with a write and a handle of its own. What that one write is depends on the place, and on what changed.',
});

export const batchUrl = message({
  ja: '`url`の値が変わるとき：`navigation.navigate()`を1回呼びます。`entry`の変更も一緒に運びます。',
  en: 'A `url` value changes: one `navigation.navigate()`, carrying any `entry` changes with it.',
});

export const batchEntry = message({
  ja: '`entry`の値だけが変わるとき：`navigation.updateCurrentEntry()`を1回呼びます。',
  en: 'Only `entry` values change: one `navigation.updateCurrentEntry()`.',
});

export const batchStorage = message({
  ja: 'localStorageとsessionStorage：`setItem`を1回呼びます。',
  en: 'localStorage and sessionStorage: one `setItem`.',
});

export const batchCookie = message({
  ja: 'Cookie：`cookieStore.set()`を1回呼びます。',
  en: 'A cookie: one `cookieStore.set()`.',
});

export const batchMemory = message({
  ja: 'メモリ：まとめずに、呼ぶたびにその場で置き換えます。ハンドルも呼ぶたびに作られます。',
  en: 'Memory: nothing is batched. Each call applies on the spot and returns a handle of its own.',
});

export const batchSame = message({
  ja: 'ページの状態のバッチが、今の値と同じところで終われば、遷移もエントリの書き換えも起きません。一方でlocalStorageとsessionStorage、Cookieは、値が変わらなくても行を書き直し、まだ行が無ければ作ります。',
  en: 'A page state batch that ends where it started neither navigates nor touches the entry. localStorage, sessionStorage and cookies still write their row, creating it if none was stored.',
});

export const batchShared = message({
  ja: 'URLとエントリの状態は、ほかの定義と分け合う場所です。書き換えるのは自分のパラメータと自分の名前空間だけなので、`utm_source`のように誰のものでもないパラメータも残ります。',
  en: 'The URL and the entry state are shared ground. A write touches only its own parameters and its own namespace, so a parameter nobody owns, such as `utm_source`, survives it.',
});

export const handleTitle = message({
  ja: '書き込みを待つ',
  en: 'Wait for the write',
});

export const handleDescription = message({
  ja: '`update()`は、`navigation.navigate()`と同じ形の、2つのPromiseを持つオブジェクトを返します。',
  en: '`update()` returns an object holding two promises, the same shape `navigation.navigate()` returns.',
});

export const handleCommitted = message({
  ja: '`committed`：書き込みが置き場所に入ったときに解決します。',
  en: '`committed`: settles once the write is in its place.',
});

export const handleFinished = message({
  ja: '`finished`：書き込みのあとでルーターがする処理まで、すべて終わったときに解決します。',
  en: '`finished`: settles once whatever the router does after the write is done too.',
});

export const handleIgnore = message({
  ja: 'Promiseそのものではないので、無視してもfloating promiseのlintに掛かりません。ハンドルは無視するのが普通の使い方です。',
  en: 'It is not a promise itself, so ignoring it trips no floating-promise lint. Ignoring it is the normal case.',
});

export const handleWait = message({
  ja: '書き込みを待ちたいときは、`finished`を待ちます。次の例では、次のページに移ったあとで見出しにフォーカスを移しています。',
  en: 'When you do need to wait, await `finished`. Here, focus moves to the heading once the next page is in place.',
});

export const handleAbort = message({
  ja: 'あとから来た遷移に追い越された遷移のハンドルは、`AbortError`でrejectします。たとえば、同じハンドラで別のページの状態も書いたときです。ハンドルを待たない呼び方では、このrejectは表に出ません。',
  en: 'A navigation overtaken by a later one, such as another page state’s write from the same handler, rejects its handle with an `AbortError`. A caller that never awaits the handle never sees it.',
});

export const handleSettle = message({
  ja: '遷移を伴わない書き込みも、同じ形のハンドルを返します。`entry`だけの書き込みとlocalStorage、sessionStorage、変わる値の無いページの状態は、バッチを書き込んだ時点で解決します。Cookieは、Cookie Store APIが書き終えた時点です。メモリは、その場で解決します。',
  en: 'Writes with no navigation behind them return the same shape. Entry-only, local, session and no-change page handles settle once the batch is written, cookie handles once the Cookie Store API has written it, and memory handles on the spot.',
});

export const handleFail = message({
  ja: 'localStorageやsessionStorage、Cookieへの書き込みが失敗すると、ハンドルはそのエラーでrejectします。容量の上限に達したときや、4KBを超えるCookie、書き込む値でスキーマが投げたときです。描画した値はそのまま残ります。',
  en: 'When a local, session or cookie write fails, the handle rejects with that error: a full quota, a cookie over 4 KB, a schema that throws on the values it was about to write. The rendered value stays.',
});

export const handleAction = message({
  ja: '非同期のアクションの中でも、同じように待てます。`startTransition(async …)`や`useTransition`、`@k8ordo/ui`の`Button`の`onAction`がそうです。ただし`@k8ordo/router`の下では、別のページを読み込んでいる最中の`url`の更新はページの切り替えになり、アクションには加わりません。そのため`finished`は、アクションの終わりを待たずに、そのページが表示された時点で解決します。',
  en: 'An async action can await it the same way: `startTransition(async …)`, `useTransition`, or `@k8ordo/ui`’s `Button` `onAction`. Under `@k8ordo/router`, though, a url update issued while another page is still loading is a page change, which never joins the action, so `finished` settles once that page is on screen rather than when the action ends.',
});

export const functionalTitle = message({
  ja: '今の値から次の値を作る',
  en: 'Derive the next value from the current one',
});

export const functionalDescription = message({
  ja: '今の値をもとに次の値を作るときは、`update()`に関数を渡します。',
  en: 'To derive the next value from the current one, hand `update()` a function.',
});

export const functionalBatch = message({
  ja: '関数が受け取るのは、同じバッチでまだ書き込まれていない更新も反映した状態です。描画のときに読んだ値で`update({ page: page + 1 })`を同じハンドラで2回呼ぶと、1つしか増えません。関数で書けば、2つ増えます。',
  en: 'The function receives the batched state, including updates not yet written. Calling `update({ page: page + 1 })` twice in one handler with the value read during render adds one; written as a function, it adds two.',
});

export const keysTitle = message({
  ja: '一部のキーだけを購読する',
  en: 'Subscribe to some keys only',
});

export const keysDescription = message({
  ja: '`useAppState`の2つ目の引数にキーの配列を渡すと、そのキーが変わったときだけ再描画されます。',
  en: 'Pass `useAppState` an array of keys as its second argument, and it re-renders only when one of those keys changes.',
});

export const keysAllCallout = message({
  ja: 'どのフィールドが変わっても再描画',
  en: 'Any field re-renders it',
});

export const keysPageCallout = message({
  ja: 'pageが変わったときだけ再描画',
  en: 'Only page re-renders it',
});

export const keysNoneCallout = message({
  ja: '何も購読しない（書き込み専用）',
  en: 'Subscribes to nothing (write-only)',
});

export const keysInline = message({
  ja: '配列はインラインで書いてかまいません。内部でそろえてから比べるので、`useMemo`は要りません。`initialUrl`や`initialCookie`は、キーの配列のあとの3つ目の引数に渡します。',
  en: 'Write the array inline; it is normalized internally, so there is no need for `useMemo`. With a key array, `initialUrl` or `initialCookie` goes in the third argument.',
});

export const keysCompare = message({
  ja: '変わったかどうかは、フィールドごとに比べて決めます。配列とプレーンなオブジェクトは中身を、`Date`や`Map`、クラスのインスタンスは参照を比べます。変わらなかったフィールドは前と同じ参照を保つので、`memo`や依存配列にそのまま渡せます。',
  en: 'Change is decided per field. Arrays and plain objects compare by content; a `Date`, a `Map` or a class instance by reference. A field that did not change keeps its previous reference, so it goes straight into `memo` or a dependency array.',
});

export const keysSplit = message({
  ja: '更新の頻度が大きく違う状態は、定義を分けてください。購読の境目は定義です。',
  en: 'When two pieces of state change at very different rates, give them separate definitions: the definition is the subscription boundary.',
});

export const draftsTitle = message({
  ja: '入力のたびに書き込まない',
  en: 'Do not write on every keystroke',
});

export const draftsDescription = message({
  ja: 'キーを押すたびに`update()`を呼ぶと、URLの書き換えも1文字ごとに起きます。入力中の値はDOMかReactのローカルな状態に任せ、送信やページ送りのような区切りで`update()`を呼びます。`@k8ordo/form`と同じ線の引き方です。',
  en: 'Calling `update()` on every keystroke rewrites the URL once per character. Let the DOM or local React state hold the draft, and call `update()` at commit points such as submit or paging, the same line `@k8ordo/form` draws.',
});

export const draftsKey = message({
  ja: '`key={q}`は、戻るボタンなどで外から`q`が変わったときに、入力欄を新しい`defaultValue`で作り直すためのものです。',
  en: '`key={q}` remounts the input with the new `defaultValue` when `q` changes from outside, through the back button for example.',
});

export const draftsGetBefore = message({
  ja: 'JavaScriptが届く前から動かしたいなら、GETフォームでURLを書き換えます。`@k8ordo/form`と組み合わせる書き方は、「',
  en: 'For a form that works before JavaScript arrives, let a GET form write the URL. Pairing it with `@k8ordo/form` is covered in “',
});

export const draftsGetAfter = message({
  ja: '」で説明しています。',
  en: '”.',
});

export const draftsMirror = message({
  ja: '定義の値を`useState`に写して、同期させようとしないでください。写した値は、戻るボタンやほかのタブの書き込みに追いつきません。値が要るところで`useAppState`を呼びます。',
  en: 'Never copy a definition’s values into `useState` to keep them in sync: the copy falls behind the back button and other tabs’ writes. Call `useAppState` wherever the value is needed.',
});

export const demoTitle = message({
  ja: '書き込みを見る',
  en: 'Watch the writes',
});

export const demoDescription = message({
  ja: 'このページのURLと履歴エントリを実際に書き換える、本物の`definePageState`です。`a`と`b`はURLに、`c`は履歴エントリに置いています。ボタンは何も購読しないコンポーネントにあり、その下に購読ごとの描画回数と、ブラウザが受け取った書き込みを新しい順に並べています。',
  en: 'A real `definePageState` that rewrites this page’s URL and history entry, with `a` and `b` in the URL and `c` in the entry. The buttons sit in a component that subscribes to nothing; below them are the render counts of three subscriptions, and the writes the browser received, newest first.',
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
