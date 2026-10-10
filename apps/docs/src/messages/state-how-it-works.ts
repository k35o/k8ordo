import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/state`が状態の読み書きをいつ、どこで行うかと、保証することとしないことが分かります。',
  en: 'When and where `@k8ordo/state` reads and writes state, and what it does and does not guarantee.',
});

export const shapeTitle = message({
  ja: '定義とストア',
  en: 'Definitions and stores',
});

export const shapeDefinition = message({
  ja: '定義は、スキーマと純粋な関数だけを持つデータです。メモリの状態はスキーマの代わりに初期値を持ちます。モジュールを読み込んでも`navigation`や`localStorage`、`document.cookie`には触れません。定義はサーバーでもテストでもそのままimportできます。',
  en: 'A definition is plain data: schemas and pure functions, or initial values in place of schemas for memory state. Loading the module touches neither `navigation`, `localStorage` nor `document.cookie`, so a definition imports as is on the server and in tests.',
});

export const shapeStore = message({
  ja: 'ストアは、`useAppState`が最初に呼ばれたときにブラウザで作られます。登録のキーは、置き場所の種類と定義の文字列のキーの組です。HMRで定義のモジュールが評価し直されても、キーが同じなら同じストアにつながります。',
  en: 'The store is created in the browser by the first `useAppState` call and registered under the place’s kind and the definition’s string key. An HMR re-evaluation of the definition module reconnects to the same store as long as the key is the same.',
});

export const shapeServer = message({
  ja: 'サーバーではストアを作りません。サーバーの描画とハイドレーションの描画では、`useAppState`は既定値を返します。メモリの状態なら初期値です。`initialUrl`や`initialCookie`で渡したフィールドだけは、渡した値になります。ブラウザの値に切り替わるのは、ハイドレーションのあとです。',
  en: 'No store is created on the server. In the server render and the hydration render, `useAppState` returns the defaults, or a memory state’s initial values. Only the fields handed in through `initialUrl` or `initialCookie` take the values passed. The browser’s values take over after hydration.',
});

export const providerTitle = message({
  ja: 'Providerが無い理由',
  en: 'No Provider',
});

export const providerSingleton = message({
  ja: 'URLと履歴エントリ、Web StorageとCookieは、どれもブラウザに1つずつしかありません。ストアはそれをそのまま読み書きするので、Providerで範囲を分ける必要がありません。',
  en: 'The URL, the history entry, Web Storage and the cookie jar each exist once in the browser. The stores read and write them directly, so there is nothing for a Provider to scope.',
});

export const providerTestsBefore = message({
  ja: 'その代わり、ストアはテストをまたいで残ります。テストごとに`resetStateRegistry()`で消す手順は「',
  en: 'The flip side is that a store outlives each test. Clearing it with `resetStateRegistry()` after every test is covered in “',
});

export const providerTestsAfter = message({
  ja: '」にあります。',
  en: '”.',
});

export const routerTitle = message({
  ja: 'ルーターに求めること',
  en: 'Router requirements',
});

export const routerTwo = message({
  ja: 'ルーターに左右されるのは、URLを変える`update()`だけです。`navigate`イベントを`intercept()`するルーターが要ります。リンクとGETフォーム、URLを変えない`update()`には何も要りません。',
  en: 'Only an `update()` that changes the URL depends on the router: it needs one that calls `intercept()` on the `navigate` event. Links, GET forms and an `update()` that leaves the URL alone need nothing.',
});

export const routerStateChange = message({
  ja: 'URLを変える`update()`は`navigation.navigate()`を呼びます。`@k8ordo/router`の下では、pathnameが同じ遷移は状態の変更として扱われます。`@k8ordo/framework`のページもその下にあります。再マウントは起きず、スクロールとフォーカスもそのままです。`update()`が新しい値を描画済みなので、`finished`はその遷移が終わると解決します。',
  en: 'An `update()` that changes the URL calls `navigation.navigate()`. Under `@k8ordo/router`, which includes every page rendered by `@k8ordo/framework`, a navigation that keeps the pathname is treated as a state change. Nothing remounts, and scroll and focus stay where they are. `update()` has already rendered the new values, so `finished` settles once that navigation does.',
});

export const routerSearchBefore = message({
  ja: '`@k8ordo/framework`のserverモードで`search`をexportしたページだけは、クエリが変わると読み込み直され、`finished`はその表示を待ちます（詳しくは「',
  en: 'Only a page that exports `search` under `@k8ordo/framework`’s server mode loads again when the query moves, and `finished` waits until it is on screen (see “',
});

export const routerSearchAfter = message({
  ja: '」）。',
  en: '”).',
});

export const salvageTitle = message({
  ja: 'スキーマに合わない値',
  en: 'Values the schema rejects',
});

export const salvageInput = message({
  ja: 'URLや履歴エントリ、Web Storage、Cookieから読み戻した値は入力として扱います。次の順に読みます。',
  en: 'A value read back from the URL, the history entry, Web Storage or a cookie is treated as input. It is read in these steps.',
});

export const salvageWhole = message({
  ja: 'スキーマ全体で読みます。通ればそれで終わりです。',
  en: 'Parse with the whole schema. If that passes, it is done.',
});

export const salvageFields = message({
  ja: '通らなければ、各フィールドをそのフィールドのスキーマで読み、読めたものだけを残します。',
  en: 'If not, read each field with its own schema, and keep the ones that pass.',
});

export const salvageAgain = message({
  ja: '残したフィールドで、もう一度スキーマ全体を通します。オブジェクト全体の`.refine()`はここで走ります。',
  en: 'Run what was kept through the whole schema again. An object-level `.refine()` runs here.',
});

export const salvageDefaults = message({
  ja: 'それでも通らなければ、すべてを既定値に戻します。すべてが既定値の状態は、定義の時点でスキーマを通ることを確かめてあります。',
  en: 'If that still fails, everything falls back to the defaults, which the definition already checked against the whole schema.',
});

export const salvageRaw = message({
  ja: '2回目の全体の読み込みには、各フィールドの出力でなく、読み戻したときの入力を渡します。`z.stringbool()`のように、出力をもう一度入力にできないフィールドがあるからです。',
  en: 'The second whole parse is handed the fields as they were read, not their outputs, because a field such as `z.stringbool()` cannot take its own output as input.',
});

export const salvageUrlBefore = message({
  ja: '`update()`で書いた`url`の値は、クエリ文字列にしてから訪問者のURLと同じ手順で読み直します（詳しくは「',
  en: 'A `url` value written by `update()` is turned into a query string and read again, the same way a visitor’s URL is read (see “',
});

export const salvageUrlAfter = message({
  ja: '」）。`entry`とWeb Storage、Cookieは、書いた値を文字列にせずそのままスキーマに渡します。そこではスキーマが自分の出力を受け付ける必要があります。',
  en: '”). `entry`, Web Storage and cookies hand the written values to the schema as they are, without a string in between. There the schema must accept its own output.',
});

export const changeTitle = message({
  ja: '変更の検出',
  en: 'Change detection',
});

export const changeKeys = message({
  ja: '比べるキーは定義が持っています。スキーマのキーか、メモリの状態なら初期値のキーです。変更の有無はキーごとに判定します。',
  en: 'The keys to compare come from the definition: the schema’s keys, or a memory state’s initial values. Whether something changed is decided key by key.',
});

export const changeCompare = message({
  ja: '配列とプレーンなオブジェクトは中身を、それ以外は`Object.is`で比べます。`Date`や`Map`、クラスのインスタンスは参照で比べるので、同じ時刻を指す新しい`Date`も変わったものとして扱います。',
  en: 'Arrays and plain objects are compared by content, everything else with `Object.is`. A `Date`, a `Map` or a class instance compares by reference, so a new `Date` for the same moment still counts as a change.',
});

export const sharedTitle = message({
  ja: '共有される置き場所',
  en: 'Shared places',
});

export const sharedOwn = message({
  ja: 'URLと履歴エントリは、ほかの定義やルーター、計測用のパラメータとも共有しています。ページの状態が書き換えるのは、自分のパラメータと、履歴エントリの中の自分の名前空間だけです。ほかの値は書き込みのたびに引き継ぎます。',
  en: 'The URL and the history entry are shared with other definitions, the router and tracking parameters. A page state rewrites only its own parameters, and only its own namespace in the entry state. Every other value is carried over with each write.',
});

export const sharedLive = message({
  ja: '書き込む値は、その時点のブラウザの値にバッチの変更を重ねて作ります。描画した値から作ると、ほかのタブやほかの定義がその間に書いた値を消してしまいます。書き込み前のバッチがある間にほかの書き込みが入っても、バッチの変更はその上に残ります。',
  en: 'What is written is built from the browser’s values at that moment with the batch on top. Building it from the rendered values would erase what another tab or another definition wrote in between. When another write lands while a batch is still pending, the batch stays on top of it.',
});

export const sharedCookie = message({
  ja: 'Cookieの書き込みは非同期なので、1つずつ順に行います。次の書き込みは、前の書き込みが終わってから今の値を読みます。2つのバッチが互いのフィールドを古い値で上書きすることはありません。',
  en: 'Cookie writes are asynchronous, so they run one at a time. The next write reads the cookie only after the previous one has landed. Two batches never overwrite each other’s fields with stale values.',
});

export const guaranteesTitle = message({
  ja: '保証すること',
  en: 'Guarantees',
});

export const guaranteeRead = message({
  ja: '置き場所から読み戻した値がスキーマに合わなくても、読むときにエラーにはなりません。合わない値は既定値に戻ります。',
  en: 'Reading a value back from its place never throws, even when the schema rejects it. A rejected value falls back to its default.',
});

export const guaranteeEcho = message({
  ja: 'スキーマを持つ置き場所では、`update()`が次の描画に反映する値はスキーマを通った値です。',
  en: 'In every place with a schema, the values `update()` hands the next render have passed it.',
});

export const guaranteeEntry = message({
  ja: '`url`と`entry`を両方変える`update()`は、1回の`navigation.navigate()`で同じ履歴エントリに書き込みます。戻る/進むでは、両方が一緒に戻ります。',
  en: 'An `update()` that changes both `url` and `entry` writes them to one history entry in a single `navigation.navigate()`. Back and forward bring both back together.',
});

export const guaranteeCarry = message({
  ja: '書き込みは、そのバッチで変えたフィールドだけを今のブラウザの値に重ねます。それ以外の値は、その間にほかのタブやほかの定義が書いたもののまま残ります。',
  en: 'A write lays only the fields its batch changed over the browser’s current values. Everything else keeps what another tab or another definition wrote in the meantime.',
});

export const guaranteeIdentity = message({
  ja: '変わらなかったフィールドは前と同じ参照を保ちます。キーを指定した購読は、そのキーが変わったときだけ再描画します。',
  en: 'A field that did not change keeps its previous reference. A subscription to some keys re-renders only when one of those keys changed.',
});

export const guaranteeHydration = message({
  ja: 'サーバーの描画とハイドレーションの描画は、いつも同じ値で行います。',
  en: 'The server render and the hydration render always show the same values.',
});

export const nonGuaranteesTitle = message({
  ja: '保証しないこと',
  en: 'Not guaranteed',
});

export const nonKey = message({
  ja: '同じ種類の定義が同じキーを使っても、エラーにも警告にもなりません。2つの定義は同じストアを共有します。',
  en: 'Two definitions of the same kind under one key raise no error and no warning. They share one store.',
});

export const nonServer = message({
  ja: 'サーバーの描画は、localStorageとsessionStorage、`entry`の値を反映しません。サーバーはこれらの置き場所を読めません。',
  en: 'The server render never reflects localStorage, sessionStorage or `entry` values. The server cannot read those places.',
});

export const nonRouter = message({
  ja: '`navigate`イベントを`intercept()`しないルーターの下では、URLを変える`update()`がドキュメント全体の読み込みになります。History APIで代わりに書く仕組みはありません。',
  en: 'Under a router that does not call `intercept()` on the `navigate` event, an `update()` that changes the URL is a full document load. There is no History API fallback.',
});

export const nonRouterNextjsBefore = message({
  ja: '今のNext.jsがこれに当たります。詳しくは「',
  en: ' Next.js is one today; see “',
});

export const nonRouterNextjsAfter = message({
  ja: '」を見てください。',
  en: '”.',
});

export const nonMutation = message({
  ja: 'その場で書き換えた値は、変更として検出しません。入れ子のオブジェクトを書き換えても、再描画は起きません。',
  en: 'A value mutated in place is not detected as a change. Mutating a nested object re-renders nothing.',
});

export const nonMemory = message({
  ja: 'メモリの状態の値は検証しません。スキーマを持たないので、`update()`に渡した値がそのまま入ります。',
  en: 'Memory state values are not validated. With no schema, whatever `update()` receives goes in as it is.',
});

export const nonWrite = message({
  ja: 'Web StorageとCookieへの書き込みは、容量の上限や4KBを超えるCookieで拒まれることがあります。そのときも描画した値は残り、`update()`のハンドルがrejectします。',
  en: 'A write to Web Storage or a cookie can be refused, by a full quota or a cookie over 4 KB. The rendered value stays, and the `update()` handle rejects.',
});
