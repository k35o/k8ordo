import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`useAppState` はどの置き場所でも同じフックです。返ってくる `update()` は、書いた値をその場で検証して描画に反映し、書き込みをまとめ、フィールドごとに置き場所へ振り分けます。',
  en: '`useAppState` is the same hook for every place. The `update()` it returns validates what you write and renders it on the spot, collapses the writes, and routes each field to where it lives.',
});

export const hookTitle = message({
  ja: '`useAppState`',
  en: '`useAppState`',
});

export const hookDescription = message({
  ja: 'クライアントコンポーネントで呼び、`[state, update]` を返します。Provider は要りません。ブラウザのストアは最初に呼ばれたときに作られ、定義の種類とキーで登録されます。',
  en: 'Call it from a client component; it returns `[state, update]`. There is no Provider: the browser’s store is created on first use and registered under the definition’s kind and key.',
});

export const hookTable = {
  call: message({ ja: '呼び出し', en: 'Call' }),
  state: message({ ja: '返る状態', en: 'State' }),
  rerenders: message({ ja: '再描画されるとき', en: 'Re-renders when' }),
  allState: message({ ja: 'すべてのフィールド', en: 'Every field' }),
  allRerenders: message({
    ja: '宣言したどのフィールドが変わっても',
    en: 'Any declared field changes',
  }),
  keysState: message({
    ja: '列挙したフィールドだけ',
    en: 'The listed fields only',
  }),
  keysRerenders: message({
    ja: '列挙したフィールドが変わったとき',
    en: 'A listed field changes',
  }),
  noneRerenders: message({
    ja: '再描画されない（書き込み専用）',
    en: 'Never — write-only',
  }),
};

export const hookShape = message({
  ja: '状態の形は定義の種類で決まります。`definePageState` は `url` と `entry` を平らにマージしたもの、`defineLocalState`・`defineSessionState`・`defineCookieState` はスキーマの出力、`defineMemoryState` は初期値の型です。',
  en: 'The state’s shape follows the kind: the flat merge of `url` and `entry` for `definePageState`, the schema’s output for `defineLocalState`, `defineSessionState` and `defineCookieState`, the initial values’ type for `defineMemoryState`.',
});

export const hookFirstRender = message({
  ja: 'サーバーの描画とハイドレーションの描画は、ブラウザの値ではなく既定値で行われ（`defineMemoryState` は初期値、`initialUrl` を渡したときはその `url` の値、`initialCookie` を渡したときはその値）、その次の描画から実際の値になります。',
  en: 'The server render and the hydration render use the defaults rather than the browser’s values — the initial values for `defineMemoryState`, the passed `url` values when `initialUrl` is given, the passed values when `initialCookie` is — and the real values arrive in the render after.',
});

export const hookInitialUrl = message({
  ja: '3 つ目の引数（キーを省くときは 2 つ目）の `{ initialUrl }` は `url` スロットを持つ `definePageState` にだけ、`{ initialCookie }` は `defineCookieState` にだけ渡せます。ほかの種類に渡すと型エラーです。',
  en: 'The options object — the third argument, or the second when you leave out the keys — takes `{ initialUrl }` only for a `definePageState` with a `url` slot and `{ initialCookie }` only for a `defineCookieState`; passing either for any other kind is a type error.',
});

export const hookInitialUrlLink = message({
  ja: '読んだ値を最初の描画に渡す',
  en: 'Seeding the first render',
});

export const hookStable = message({
  ja: '定義をモジュールのトップレベルに置いている限り、`update` は描画をまたいで同じ関数なので、エフェクトの依存配列に入れても再実行を招きません。',
  en: 'As long as the definition lives at module scope, `update` stays the same function across renders, so listing it in an effect’s dependencies causes no re-runs.',
});

export const hookAnyState = message({
  ja: '`AnyState` は 3 種類の定義の union 型で、どの定義でも受け取るヘルパーの型付けに使えます。',
  en: '`AnyState` is the union of the three definition types, for typing a helper that takes any definition.',
});

export const updateTitle = message({
  ja: '`update(patch)`',
  en: '`update(patch)`',
});

export const updateDescription = message({
  ja: '変えたいフィールドだけのオブジェクトを渡します。今の状態から次の値を作るときは関数を渡します。その引数には、同じバッチでまだ書き込まれていない更新も反映した状態が入ります。',
  en: 'Pass an object holding only the fields to change. To derive the next value from the current one, pass a function: its argument is the state including updates from the same batch that have not been written yet.',
});

export const updateSync = message({
  ja: '`update()` は同期的に適用され、次の描画は新しい値を見ます。書き込み自体はその後にまとめて行われます。',
  en: '`update()` applies synchronously — the next render sees the new values — and the write itself follows, batched.',
});

export const updateValidate = message({
  ja: 'パッチはその場でスキーマを通ります。`url` のフィールドは URL から届くときと同じ道（クエリに書いて読み直す）を通るので、`z.gte(1)` の `page` に `update({ page: 0 })` を渡すと、`?page=0` と同じく既定値の `1` になります。スキーマが拒む値が描画に出ることはありません。',
  en: 'The patch goes through the schema on the spot. `url` fields take the road a URL arrival takes — written into a query and read back — so `update({ page: 0 })` on a `z.gte(1)` field lands on the default `1`, exactly as `?page=0` would. A value the schema rejects never renders.',
});

export const updateSalvageLink = message({
  ja: 'サルベージの規則',
  en: 'Salvage rules',
});

export const updateThrow = message({
  ja: 'URL に書けない値（`Date` など）は、何かを書き込む前に `update()` 自体が throw します。ハンドルを reject するだけでは、ハンドルを待たない普通の呼び方では誰も気づけないからです。',
  en: 'A value a URL cannot hold, such as a `Date`, makes `update()` itself throw before anything is written: a rejected handle would go unnoticed, since most callers never await it.',
});

export const updateUnknown = message({
  ja: '定義に無いフィールドは型エラーです。型を迂回して渡されたときは `TypeError` を throw します。',
  en: 'A field the definition does not have is a type error, and one that slips past the types throws a `TypeError`.',
});

export const updateMemory = message({
  ja: '`defineMemoryState` はスキーマを持たないので、渡した値がそのまま入ります。',
  en: '`defineMemoryState` has no schema, so what you pass is what it holds.',
});

export const batchTitle = message({
  ja: '書き込みのまとめ方',
  en: 'How writes are batched',
});

export const batchDescription = message({
  ja: '`definePageState`・`defineLocalState`・`defineSessionState`・`defineCookieState` では、同じハンドラの中で呼んだ `update()` が定義ごとに 1 回の書き込みにまとまり、すべて同じハンドルを返します。上の例の `Clear` にある 2 回の `update()` も、1 回の遷移になります。`defineMemoryState` にはまとめる書き込みが無く、呼び出しごとにその場で反映され、それぞれ解決済みのハンドルを返します。書き込み先は、バッチが実際に値を変えたフィールドで決まります。',
  en: 'On `definePageState`, `defineLocalState`, `defineSessionState` and `defineCookieState`, the `update()` calls made in one handler collapse into one write per definition, and they all return the same handle — the two calls behind `Clear` above make one navigation. `defineMemoryState` has no write to batch: each call applies on the spot and returns its own settled handle. Where the write goes depends on which fields the batch actually changed.',
});

export const batchTable = {
  changes: message({ ja: 'バッチが変えたもの', en: 'The batch changes' }),
  write: message({ ja: '書き込み', en: 'Write' }),
  router: message({ ja: '必要なルーター', en: 'Router needed' }),
  urlChanges: message({
    ja: '`url` のフィールド（`entry` を含んでもよい）',
    en: '`url` fields, with or without `entry` fields',
  }),
  urlRouter: message({
    ja: 'Navigation API を intercept するもの',
    en: 'One that intercepts the Navigation API',
  }),
  entryChanges: message({
    ja: '`entry` のフィールドだけ',
    en: '`entry` fields only',
  }),
  none: message({ ja: '不要', en: 'None' }),
  localWrite: message({
    ja: '`localStorage.setItem` を 1 回',
    en: 'One `localStorage.setItem`',
  }),
  sessionWrite: message({
    ja: '`sessionStorage.setItem` を 1 回',
    en: 'One `sessionStorage.setItem`',
  }),
  cookieWrite: message({
    ja: '`cookieStore.set()` を 1 回',
    en: 'One `cookieStore.set()`',
  }),
  memoryWrite: message({
    ja: 'その場で置き換え（まとめない）',
    en: 'Replaced on the spot, not batched',
  }),
};

export const batchAwait = message({
  ja: 'まとまるのは、同期的に続けて呼んだ `update()` です。間に `await` を挟むと、別々のバッチ（別々の書き込みとハンドル）になります。',
  en: 'What collapses is the `update()` calls made synchronously, one after another; an `await` between two calls makes them separate batches, with separate writes and handles.',
});

export const batchNoop = message({
  ja: '`definePageState` のバッチが今の値と同じところで終われば、遷移もエントリの書き換えも起きません。`defineLocalState`・`defineSessionState`・`defineCookieState` のバッチは、結果が同じでも行や Cookie を書き込みます（まだ無ければ作ります）。',
  en: 'A `definePageState` batch that ends where it started neither navigates nor touches the entry. A `defineLocalState`, `defineSessionState` or `defineCookieState` batch writes its row or cookie even then, creating it if none was stored.',
});

export const batchShared = message({
  ja: 'URL とエントリ状態は共有の場所です。書き換えるのは自分のパラメータと自分の名前空間だけで、ほかの定義のパラメータや、誰のものでもない `utm_source` のようなパラメータ、エントリ状態にあるほかの値は、どの書き込みでも残ります。',
  en: 'The URL and the entry state are shared ground. A write rewrites only its own params and its own namespace; params owned by other definitions or by nobody, like `utm_source`, and everything else in the entry state survive every write.',
});

export const batchLive = message({
  ja: '書き込む値は、描画に出した値ではなく、その時点のブラウザの値（URL・エントリ状態・Web Storage・Cookie）にバッチの変更を重ねて作ります。ほかのタブやほかの定義がその間に書いた値を巻き戻すことはありません。',
  en: 'What is written is built from what the browser holds at that moment — the URL, the entry state, Web Storage, the cookie — with the batch’s changes on top, not from the rendered snapshot, so it never rolls back what another tab or another definition wrote in between.',
});

export const handleTitle = message({
  ja: 'ハンドル: `committed` と `finished`',
  en: 'The handle: `committed` and `finished`',
});

export const handleDescription = message({
  ja: '`update()` は `navigation.navigate()` と同じ形の、2 つの Promise を持つオブジェクト（`UpdateHandle`）を返します。Promise そのものではないので、無視しても floating promise の lint に掛かりません。ハンドルを無視するのが普通の使い方です。',
  en: '`update()` returns the shape `navigation.navigate()` does: an object holding two promises, typed `UpdateHandle`. It is not a promise itself, so ignoring it — the normal case — trips no floating-promise lint.',
});

export const handleTable = {
  promise: message({ ja: 'Promise', en: 'Promise' }),
  resolves: message({ ja: '解決するとき', en: 'Resolves when' }),
  committed: message({
    ja: '書き込みが置き場所（履歴エントリ・Web Storage・Cookie・メモリ）に入ったとき',
    en: 'The write is in its home — the history entry, Web Storage, a cookie, memory',
  }),
  finished: message({
    ja: '書き込みの後にルーターが行う処理まで終わったとき',
    en: 'Whatever the router did after the write is done',
  }),
};

export const handleRouter = message({
  ja: '`@k8ordo/router` の下では、pathname が変わらない遷移に読み込みも描画も伴わないので、`finished` はその遷移が落ち着いた時点で解決します。新しい値は `update()` がすでに描画しています。',
  en: 'Under `@k8ordo/router` a navigation that keeps the pathname has no fetch or render behind it, so `finished` resolves once that navigation settles; `update()` already rendered the new values.',
});

export const handleSettled = message({
  ja: '遷移を伴わない書き込み（`entry` だけ・local・session・何も変わらない page のバッチ）のハンドルは、ハンドラの直後のマイクロタスクでバッチを書き込んだ時点で解決します。cookie のハンドルは、Cookie Store API が書き終えた時点で解決します。`defineMemoryState` のハンドルは、返った時点で解決済みです。',
  en: 'A write with no navigation behind it — entry-only, local, session, a page batch that changed nothing — settles its handle when the batch is flushed, in a microtask right after the handler; a cookie handle settles once the Cookie Store API has written it; a `defineMemoryState` handle is already settled when it is returned.',
});

export const handleReject = message({
  ja: 'あとから来た遷移に追い越された遷移のハンドルは、`AbortError` で reject します。Web Storage や Cookie への保存に失敗した（容量の超過、4 KB を超える Cookie など）ときも reject しますが、描画された値はそのまま残ります。どちらも、ハンドルを待っていなければ unhandled rejection にはなりません。',
  en: 'A navigation overtaken by a later one rejects its handle with an `AbortError`. A failed Web Storage or cookie write — a full quota, a cookie over 4 KB — rejects too, while the rendered value stays. Neither surfaces as an unhandled rejection when nobody awaits the handle.',
});

export const handleAwait = message({
  ja: '書き込みを待つ必要があるときは、`finished` を待ちます。以下の例は、次のページに移ったあとで見出しにフォーカスを移します。',
  en: 'Code that has to wait for the write awaits `finished`. The example below moves focus to the heading once the next page is in place.',
});

export const handleAbort = message({
  ja: '追い越されうる更新を待つときは、例のように `AbortError` だけを無視し、それ以外のエラーは投げ直します。',
  en: 'When the update you await can be overtaken, ignore its `AbortError` and rethrow anything else, as the example does.',
});

export const handleAsyncAction = message({
  ja: '非同期アクション（`startTransition(async …)`・`useTransition`・`@k8ordo/ui` の `Button` の `onAction`）の中でも同じように待てます。`@k8ordo/router` の下では、別のページの読み込み中に `url` の値を変える更新はページの切り替えになりますが、ページの切り替えはアクションに加わらないので、`finished` はそのページが画面に出た時点で解決します。',
  en: 'An async action — `startTransition(async …)`, `useTransition`’s included, or the `onAction` of `@k8ordo/ui`’s `Button` — can await it the same way. Under `@k8ordo/router` an update that changes a `url` value while another page is still loading is a page change, and a page change never joins the action, so `finished` settles once that page is on screen.',
});

export const historyTitle = message({
  ja: '`history`: `replace` と `push`',
  en: '`history`: `replace` and `push`',
});

export const historyDescription = message({
  ja: "既定は `replace` です。更新は今のエントリに手を入れるもので、戻るボタンで 1 つずつ取り消すものではないからです。戻るボタンで取り消せるべき更新（ページ送りや、手順として扱いたいタブの切り替え）にだけ `{ history: 'push' }` を渡します。",
  en: "The default is `replace`: an update refines the current entry, and the back button has no business undoing it step by step. Pass `{ history: 'push' }` only for updates the back button should undo — paging, or a tab switch you want treated as a step.",
});

export const historyPageOnly = message({
  ja: 'この引数（型は `UpdateOptions`）は `definePageState` にだけあります。遷移を伴うのはこの種類だけで、`defineLocalState`・`defineSessionState`・`defineCookieState`・`defineMemoryState` の `update()` に渡すと型エラーです。',
  en: 'The option — typed `UpdateOptions` — exists only on `definePageState`, the one kind with a navigation behind it; passing it to a local, session, cookie or memory `update()` is a type error.',
});

export const historyBatch = message({
  ja: '同じバッチの中で 1 回でも `push` が指定されれば、そのバッチの遷移は `push` になります。',
  en: 'If any call in a batch asks for `push`, the batch’s navigation pushes.',
});

export const historyEntryOnly = message({
  ja: '`entry` の値だけが変わるバッチは `updateCurrentEntry()` で書かれ、何も変わらないバッチは何も書き込まないので、どちらも `push` を指定しても新しいエントリは作られません。',
  en: 'A batch that changes `entry` values but no `url` value is written with `updateCurrentEntry()`, and a batch that changes nothing writes nothing, so neither creates a new entry when asked to `push`.',
});

export const historyNavigateTo = message({
  ja: 'ページの移動は `@k8ordo/router` の `navigateTo`（既定は `push`）、状態の変更は `update`（既定は `replace`）で行います。',
  en: 'Changing pages goes through `navigateTo` in `@k8ordo/router`, which pushes by default; changing state goes through `update`, which replaces.',
});

export const keysTitle = message({
  ja: '購読の粒度',
  en: 'Subscription granularity',
});

export const keysDescription = message({
  ja: "定義がキーの集合（スキーマのキー、メモリなら初期値のキー）を固定しているので、変更の検出はキー単位で正確です。`['q']` だけを購読するコンポーネントは、`page` が変わっても再描画されません。",
  en: "The definition fixes the key set — its schemas’ keys, or a memory state’s initial values — so change detection is exact, per key. A component subscribed to `['q']` never re-renders when `page` changes.",
});

export const keysInline = message({
  ja: 'キーの配列はインラインで書いてかまいません。内部で正規化されるので、`useMemo` は要りません。',
  en: 'Write the key array inline; it is normalized internally, so no `useMemo` is needed.',
});

export const keysEqual = message({
  ja: '「変わったか」は構造で比べます。配列とプレーンなオブジェクトは中身で、`Date`・`Map`・クラスのインスタンスは参照で比べます。変わらなかったフィールドは前と同じ参照を保つので、`memo` や依存配列にそのまま渡せます。',
  en: 'Whether a field changed is decided structurally: arrays and plain objects by their contents; `Date`, `Map` and class instances by reference. A field that did not change keeps its previous reference, so it is safe to hand to `memo` or a dependency array.',
});

export const keysBoundary = message({
  ja: '更新の頻度が大きく違う状態は、別々の定義に分けてください。定義が購読の境界です。',
  en: 'When two pieces of state update at very different rates, give them separate definitions: the definition is the subscription boundary.',
});

export const demoTitle = message({
  ja: '動きを確かめる',
  en: 'Watch it happen',
});

export const demoDescription = message({
  ja: '下のデモは本物の `definePageState` で、`a` と `b` を URL に、`c` を履歴エントリに置いています。ボタンは `useAppState(def, [])` で何も購読しない書き込み専用のコンポーネントにあり、その下に 3 つの購読それぞれの描画回数と、ブラウザが実際に受け取った書き込みを表示します。',
  en: 'The demo below is a real `definePageState` keeping `a` and `b` in the URL and `c` in the history entry. The buttons live in a write-only component that subscribes to nothing (`useAppState(def, [])`); below them are the render counts of three subscriptions and the writes the browser actually received.',
});

export const demoHint = message({
  ja: "`a + 1` を押しても、`['b']` の購読の描画回数は増えません。`a + 1 (×3)` は 3 回の `update()` ですが、ログに出る遷移は 1 回です。`c + 1` は遷移ではなく `updateCurrentEntry` になります。`a = -1` はスキーマ（`z.gte(0)`）に拒まれて既定値の `0` になり、`a` がすでに `0` なら何も書き込みません。",
  en: "`a + 1` leaves the render count of the `['b']` subscription alone. `a + 1 (×3)` is three `update()` calls but one navigation in the log. `c + 1` is an `updateCurrentEntry`, not a navigation. `a = -1` is rejected by the schema (`z.gte(0)`) and lands on the default `0` — and when `a` is already `0`, nothing is written at all.",
});

export const demoSubscription = message({
  ja: '購読',
  en: 'Subscription',
});

export const demoRenders = message({
  ja: '描画回数',
  en: 'Renders',
});

export const demoLog = message({
  ja: 'ブラウザへの書き込み（新しい順）',
  en: 'Writes to the browser, newest first',
});

export const demoLogEmpty = message({
  ja: 'まだありません',
  en: 'None yet',
});

export const demoNoQuery = message({
  ja: 'クエリなし',
  en: 'no query',
});

export const draftTitle = message({
  ja: '入力のたびに URL を書き換えない',
  en: 'Do not write every keystroke to the URL',
});

export const draftDescription = message({
  ja: '入力途中の値は DOM か React のローカルな状態に持たせ、送信・フォーカスが外れたとき・ページ送りのような区切りで `update()` を呼びます。`@k8ordo/form` と同じ線の引き方です。定義の値を React の状態に写して同期させることはしないでください。',
  en: 'Let the DOM or local React state hold a draft, and call `update()` at commit points — submit, blur, paging. It is the same line `@k8ordo/form` draws. Do not mirror a definition’s values into React state and keep the two in sync.',
});

export const draftKey = message({
  ja: '`key={q}` は、戻るボタンなど外から `q` が変わったときに、非制御の入力を新しい `defaultValue` で作り直すためのものです。',
  en: '`key={q}` rebuilds the uncontrolled input with the new `defaultValue` when `q` changes from outside — the back button, for instance.',
});
