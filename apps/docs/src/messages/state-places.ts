import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '定義はそれぞれ 1 つの置き場所を名指しします。値がいつまで残るか、誰に見えるか、サーバーから読めるかを決めるのは置き場所です。このページでは 4 つの置き場所の違いと、置き場所ごとのスキーマの書き方を説明します。',
  en: 'Each definition names one place, and the place decides how long the values live, who sees them and whether the server can read them. This page covers how the four places differ and how to write the schema for each.',
});

export const overviewTitle = message({
  ja: '4 つの置き場所',
  en: 'The four places',
});

export const overviewDescription = message({
  ja: '`url` と `entry` は同じ履歴エントリの 2 つの面（見えて共有できる面と、隠れた面）なので、1 つの定義にまとまり、原子的に更新されます。localStorage とメモリはページではなくアプリ全体に属するので、別の種類の定義になっています。',
  en: '`url` and `entry` are the two faces of one history entry — one visible and shareable, one hidden — so they share a definition and update atomically. localStorage and memory belong to the app rather than the page, which is why they are definition kinds of their own.',
});

export const overviewTable = {
  definition: message({ ja: '定義', en: 'Definition' }),
  livesIn: message({ ja: '置き場所', en: 'Lives in' }),
  survives: message({ ja: '残る期間', en: 'Survives' }),
  sharedWith: message({ ja: '共有される範囲', en: 'Shared with' }),
  server: message({ ja: 'サーバー', en: 'Server' }),
  urlLivesIn: message({ ja: 'search params', en: 'search params' }),
  urlSurvives: message({
    ja: '戻る・進む、リンクの共有',
    en: 'back/forward, shared links',
  }),
  urlSharedWith: message({
    ja: 'URL を受け取った人',
    en: 'anyone given the URL',
  }),
  urlServer: message({
    ja: '`parseUrl` で読める（search を渡すルーターのとき）',
    en: 'reads it with `parseUrl` (under a router that hands it the search)',
  }),
  entryLivesIn: message({
    ja: '履歴エントリの state',
    en: 'history entry state',
  }),
  entrySurvives: message({
    ja: '戻る・進む、リロード',
    en: 'back/forward, reload',
  }),
  entrySharedWith: message({
    ja: 'そのタブのそのエントリ',
    en: 'that entry of that tab',
  }),
  defaultsServer: message({ ja: '既定値で描画', en: 'renders the defaults' }),
  localSurvives: message({ ja: '消されるまで', en: 'until deleted' }),
  localSharedWith: message({
    ja: '同じブラウザで開いたサイトのすべてのタブ',
    en: 'every tab of the site in the same browser',
  }),
  memoryLivesIn: message({
    ja: 'JavaScript の実行環境',
    en: 'the JavaScript runtime',
  }),
  memorySurvives: message({ ja: 'リロードまで', en: 'until reload' }),
  memorySharedWith: message({ ja: 'そのタブ', en: 'that tab' }),
  memoryServer: message({
    ja: '初期値で描画',
    en: 'renders the initial values',
  }),
};

export const chooseTitle = message({
  ja: 'どれを選ぶか',
  en: 'Choosing',
});

export const chooseUrl = message({
  ja: 'URL — リンクで開いたときに再現されるべきもの。検索語、絞り込み、ページ番号、選択中のタブ。サーバーが描画に使う値もここに置きます。',
  en: 'URL — whatever a link should reproduce: a search term, filters, a page number, the selected tab. Values the server renders from go here too.',
});

export const chooseEntry = message({
  ja: 'エントリ — 戻る・進むで元に戻ってほしいが、共有するリンクには載せたくないもの。開いている行、詳細表示の有無など、そのページを見ている間だけの UI の状態。',
  en: 'Entry — whatever back and forward should bring back but a shared link should not carry: which rows are expanded, whether details are showing, UI state that belongs to this visit of the page.',
});

export const chooseLocal = message({
  ja: 'localStorage — その端末を使う人の好み。表示形式、1 ページの件数、カラースキーム。',
  en: 'localStorage — the preferences of whoever uses the device: a view mode, a page size, a colour scheme.',
});

export const chooseMemory = message({
  ja: 'メモリ — 離れたコンポーネントどうしで共有したいが、リロードで消えてよいもの。コマンドパレットの開閉、デバッグ用のパネル。',
  en: 'Memory — whatever distant components share but a reload may discard: whether a command palette is open, a debug panel.',
});

export const demoTitle = message({
  ja: '2 つの面を触って確かめる',
  en: 'Try both faces',
});

export const demoDescription = message({
  ja: '下のデモは本物の `definePageState` で、`scope` を URL に、開いている行を履歴エントリに置いています。',
  en: 'The demo below is a real `definePageState` that keeps `scope` in the URL and the open rows in the history entry.',
});

export const demoHint = message({
  ja: '行を開いても URL は変わりません（`updateCurrentEntry` で現在のエントリに書かれます）。`scope` を切り替えると push で新しいエントリが作られ、開いていた行もそのエントリに持ち越されます。ブラウザの戻るで、`scope` と開いていた行が一緒に戻ります。リロードしても両方残りますが、URL を新しいタブに貼ると残るのは `scope` だけです。',
  en: 'Opening a row leaves the URL alone — it is written into the current entry with `updateCurrentEntry`. Switching `scope` pushes a new entry and carries the open rows into it. Press back and `scope` and the rows you had open come back together. Both survive a reload, but paste the URL into a new tab and only `scope` comes along.',
});

export const demoRowUrl = message({
  ja: 'search params。共有でき、search を渡すルーターならサーバーで読めます。',
  en: 'Search params. Shareable, and readable on the server under a router that hands it the search.',
});

export const demoRowEntry = message({
  ja: '履歴エントリの隠れた状態。戻る・進む・リロードで残ります。',
  en: 'Hidden history-entry state. Survives back, forward and reload.',
});

export const demoRowLocal = message({
  ja: 'localStorage。タブ間で共有され、消すまで残ります。',
  en: 'localStorage. Shared across tabs, kept until deleted.',
});

export const demoRowMemory = message({
  ja: 'メモリ。そのタブだけで、リロードで消えます。',
  en: 'Memory. That tab only, gone on reload.',
});

export const demoUrlEmpty = message({
  ja: 'クエリなし（既定値）',
  en: 'no query (the default)',
});

export const urlTitle = message({
  ja: '`url` スロット',
  en: 'The `url` slot',
});

export const urlDescription = message({
  ja: 'search params に置く状態です。URL は文字列しか運ばないので、スキーマは文字列から自分の型を読み出せる書き方にします。',
  en: 'State kept in the search params. A URL carries only strings, so the schema has to be one that reads its own types back out of a string.',
});

export const urlRuleNumber = message({
  ja: '数値は `z.coerce.number()`。`?page=2` の `"2"` が `2` になります。',
  en: 'Numbers: `z.coerce.number()`, so the `"2"` of `?page=2` becomes `2`.',
});

export const urlRuleBoolean = message({
  ja: '真偽値は `z.stringbool()`。`"false"` を `false` として読み、`false` を `"false"` と書きます。',
  en: 'Booleans: `z.stringbool()`, which reads `"false"` as `false` and writes `false` as `"false"`.',
});

export const urlRuleArray = message({
  ja: '配列は同じ名前のパラメータの繰り返し（`?tags=sale&tags=new`）で、既定値は `[]` だけが許されます。',
  en: 'Arrays: the param repeated (`?tags=sale&tags=new`), and the only default allowed is `[]`.',
});

export const urlRuleScalar = message({
  ja: '配列でないフィールドのパラメータが繰り返されたら、最初の値を読みます。',
  en: 'A param repeated on a non-array field reads its first value.',
});

export const urlRuleSerialize = message({
  ja: 'URL に書ける値は、文字列・数値・bigint・真偽値と、それらの配列です。',
  en: 'What a URL can hold: strings, numbers, bigints, booleans, and arrays of those.',
});

export const urlRuleDefault = message({
  ja: '既定値のフィールドはクエリに書かれません。誰かが `?page=1` と書いても、`url` のフィールドを変える次の `update()` で省かれます。',
  en: 'A field at its default is never written into the query: even if someone types `?page=1`, the next `update()` that changes a `url` field leaves it out.',
});

export const urlMoreTypes = message({
  ja: '真偽値・配列の列挙値・日付を持つ定義は、たとえば次のように書きます。',
  en: 'A definition holding a boolean, an array of enum values and a date looks like this:',
});

export const refusalsTitle = message({
  ja: '拒まれる書き方',
  en: 'Spellings that are refused',
});

export const refusalsDescription = message({
  ja: '`update()` は書いた値を、URL から戻ってくるのと同じ道（クエリ文字列に書いて読み直す）で確かめます。自分が書いたクエリ文字列を読み戻せないフィールドは、書き込むたびに既定値に落ちます。そうなることが確実な書き方は、最初のクリックを待たずにモジュールの読み込み時に拒まれます。',
  en: '`update()` checks the values it writes by the road they will come back on: written into a query string and read again. A field that cannot read back its own query-string spelling would land on its default after every write, so the spellings certain to do that are refused when the module loads rather than at the first click.',
});

export const refusalsTable = {
  written: message({ ja: '書いたもの', en: 'Written' }),
  instead: message({ ja: '代わりに', en: 'Use instead' }),
  why: message({ ja: '理由', en: 'Why' }),
  booleanWhy: message({
    ja: 'URL は文字列を運び、`"false"` は `z.boolean()` にとって `false` ではありません（`z.coerce.boolean()` では `true` になります）',
    en: 'A URL carries strings, and `"false"` is not `false` to `z.boolean()` — `z.coerce.boolean()` reads it as `true`',
  }),
  arrayWritten: message({
    ja: '既定値が `[]` でない配列、`z.optional()` の配列',
    en: 'An array defaulting to anything but `[]`, or a `z.optional()` array',
  }),
  arrayWhy: message({
    ja: 'パラメータが無いことと空の配列は同じ URL なので、既定値が `[]` でなければ `[]` を書けません',
    en: 'An absent param and an empty list are the same URL, so with any other default `[]` could never be written',
  }),
  absenceWritten: message({
    ja: '`z._default()` も `z.optional()` も無いフィールド',
    en: 'A field with neither `z._default()` nor `z.optional()`',
  }),
  absenceWhy: message({
    ja: 'パラメータはいつでも欠けえます。`url` に限らず、スキーマを持つすべての置き場所の規則です',
    en: 'A param can always be missing. This rule holds for every place with a schema, not just `url`',
  }),
  dateInstead: message({
    ja: '`z.iso.date()` などの文字列のフィールド',
    en: 'A string field such as `z.iso.date()`',
  }),
  dateWhy: message({
    ja: 'URL に綴りがありません。これだけは定義時ではなく、値を書こうとしたとき（`href`・`search`・`update()`）に throw します',
    en: 'A URL has no spelling for it. This one throws when something writes a value (`href`, `search`, `update()`), not at definition time',
  }),
};

export const entryTitle = message({
  ja: '`entry` スロット',
  en: 'The `entry` slot',
});

export const entryDescription = message({
  ja: '履歴エントリに付く隠れた状態です。URL には出ず、Navigation API のエントリ状態（`navigation.currentEntry.getState()`）の中に、定義のキーを名前空間として保存されます。',
  en: 'Hidden state attached to the history entry. It never shows in the URL; it is stored in the Navigation API’s entry state (`navigation.currentEntry.getState()`) under the definition’s key as its namespace.',
});

export const entryTypes = message({
  ja: '値は文字列にされず、エントリにそのまま保存されるので、`z.number()` や `z.boolean()` を書いたとおりに使えます。`url` スロットのような書き方の制限はありません。ただし、スキーマは自分の出力を入力として受け付けなければなりません（下の「スキーマの規則」）。',
  en: 'Values are not turned into strings — the entry keeps them as they are — so `z.number()` and `z.boolean()` work as written, with none of the `url` slot’s spelling restrictions. The schema must still accept its own output (see Schema rules below).',
});

export const entryHistory = message({
  ja: "エントリの値だけを変える `update()` は遷移を起こさず、`navigation.updateCurrentEntry()` で現在のエントリを書き換えるので、どのルーターの下でも動きます。その代わり新しい履歴エントリは作られず、`{ history: 'push' }` を渡しても無視されます。戻るボタンで 1 段ずつ戻したい状態（ウィザードの手順など）は `url` に置きます。",
  en: "An `update()` that changes only entry fields does not navigate: it rewrites the current entry with `navigation.updateCurrentEntry()`, which is why it works under any router. It also never creates a history entry, and `{ history: 'push' }` is ignored there. State the back button should step back through — the steps of a wizard, say — belongs in `url`.",
});

export const entryServer = message({
  ja: 'サーバーにはエントリ状態が存在しないので、サーバーの描画とハイドレーションの描画は既定値で行われます。',
  en: 'Entry state does not exist on the server, so the server render and the hydration render use the defaults.',
});

export const entryStale = message({
  ja: 'セッション復元で戻ってきた、古いスキーマが書いた値も入力として扱われ、受け付けられないフィールドは既定値に戻ります。',
  en: 'Values an older schema wrote, brought back by a session restore, are treated as input too: any field the schema rejects falls back to its default.',
});

export const bothTitle = message({
  ja: '`url` と `entry` を 1 つの定義に',
  en: 'Both in one definition',
});

export const bothDescription = message({
  ja: '1 つの定義に両方を書くと、`useAppState` が返す状態は 2 つのスロットを平らにマージしたものになります。フィールドをスロット間で移しても、変わるのは定義だけで、呼び出し側は変わりません。',
  en: 'Declare both in one definition and the state `useAppState` returns is the flat merge of the two slots. Moving a field from one slot to the other changes only the definition, and nothing at the call sites.',
});

export const bothAtomic = message({
  ja: '両方のスロットにまたがる更新は、1 回の `navigation.navigate()` に URL とエントリ状態をまとめて渡すので、片方だけが反映された状態は見えません。戻るボタンでも両方が一緒に戻ります。',
  en: 'An update that spans both slots hands the URL and the entry state to a single `navigation.navigate()`, so a half-applied state is never visible, and the back button restores both together.',
});

export const bothCarry = message({
  ja: '`update()` が URL を書き換える遷移は、そのときのエントリ状態を新しいエントリに持ち越します。ほかの定義の名前空間など、エントリ状態にあるほかの値も残ります。',
  en: 'A navigation `update()` makes to rewrite the URL carries the current entry state into the new entry, including other definitions’ namespaces and anything else the entry state holds.',
});

export const bothDisjoint = message({
  ja: '同じ名前のフィールドを両方に書くと型エラーになり（メッセージにフィールド名が出ます）、実行時にも throw します。どちらのスロットも持たない定義も同様です。',
  en: 'Declaring a field name in both slots is a type error that names the field, and it throws at runtime too. So does a definition with neither slot.',
});

export const bothCaveat = message({
  ja: 'ただし、スロットごとの規則はフィールドに付いて回ります。`entry` で `z.boolean()` だったフィールドを `url` に移すなら `z.stringbool()` に、`url` から `entry` に移すなら `z.boolean()` に書き換えます。`entry` は型付きの値をそのままスキーマに戻すので、`z.stringbool()` のままでは `update()` のたびに既定値に戻ります。',
  en: 'The per-slot rules do follow the field, though: `z.boolean()` in `entry` becomes `z.stringbool()` in `url`, and back to `z.boolean()` when it moves to `entry`. `entry` hands the typed value straight back to the schema, so a `z.stringbool()` left there lands on its default on every `update()`.',
});

export const localTitle = message({
  ja: '`defineLocalState`',
  en: '`defineLocalState`',
});

export const localDescription = message({
  ja: 'localStorage に置く、アプリ全体の状態です。同じブラウザのタブ間で共有され、消されるまで残ります。',
  en: 'App-wide state kept in localStorage: shared by the tabs of the same browser and kept until deleted.',
});

export const localStorageKey = message({
  ja: '値は `k8ordo-state:<key>`（定義の `storageKey`）の 1 行に、スキーマが宣言したフィールドだけの JSON として保存されます。上の定義なら、`k8ordo-state:prefs` に `{"view":"grid","pageSize":20}` のような行です。',
  en: 'The values are stored as one row under `k8ordo-state:<key>` — the definition’s `storageKey` — as JSON holding only the fields the schema declares. For the definition above, that is `k8ordo-state:prefs` with a row like `{"view":"grid","pageSize":20}`.',
});

export const localJson = message({
  ja: '保存は JSON を通るので、フィールドは JSON で表せる型にします。`z.date()` の値は書き込みの直後には表示されますが、次に読み込んだときには文字列になっていて、既定値に戻ります。`entry` と同じく、スキーマは自分の出力を入力として受け付けなければなりません。',
  en: 'Storage goes through JSON, so keep the fields to types JSON can represent. A `z.date()` value shows right after the write, but the next load finds a string and falls back to the default. As in `entry`, the schema must accept its own output.',
});

export const localTabs = message({
  ja: 'ほかのタブの書き込みは `storage` イベントで届き、変わったキーを購読しているコンポーネントだけが再描画されます。',
  en: 'Writes from other tabs arrive through the `storage` event, and only components subscribed to a changed key re-render.',
});

export const localStale = message({
  ja: '古いスキーマが書いた行はフィールドごとにサルベージされ、壊れた JSON は既定値から始まります。',
  en: 'A row an older schema wrote is salvaged field by field, and corrupt JSON starts from the defaults.',
});

export const localServer = message({
  ja: 'サーバーには localStorage が無いので、サーバーの描画とハイドレーションの描画は既定値です。最初の描画より前に値が要るなら、ハイドレーションの前に読みます。',
  en: 'The server has no localStorage, so the server render and the hydration render use the defaults. When a value is needed before the first paint, read it before hydration.',
});

export const localServerLink = message({
  ja: 'ハイドレーション前に読む',
  en: 'Reading before hydration',
});

export const memoryTitle = message({
  ja: '`defineMemoryState`',
  en: '`defineMemoryState`',
});

export const memoryDescription = message({
  ja: 'JavaScript の実行環境に置く、型付きの共有の箱です。そのタブの中だけで共有され、リロードで初期値に戻ります。',
  en: 'A typed shared box that lives in the JavaScript runtime: shared within the tab, back to its initial values on reload.',
});

export const memoryNoSchema = message({
  ja: 'スキーマを持たない唯一の種類です。値が境界を越えて戻ってくることがなく、型付きの `update()` だけが書き手なので、検証し直すものがありません。型は初期値から推論されます。ユニオン型のように初期値から推論できない型は、上の例のように型引数で書きます。',
  en: 'The one kind without a schema: its values never come back across a boundary, and the typed `update()` is the only writer, so there is nothing to re-validate. The type is inferred from the initial values; a type they cannot express, such as a union, goes in the type argument as above.',
});

export const memoryImmutable = message({
  ja: '値は不変として扱ってください。変更の検出は `update()` に渡されたフィールドを前の値と比べて行うので、ネストしたオブジェクトをその場で書き換えても誰にも通知されません。',
  en: 'Treat the values as immutable. Change detection compares the fields `update()` receives with the previous values, so mutating a nested object in place notifies nobody.',
});

export const memoryDetails = message({
  ja: 'フィールドは初期値のキーで固定されます。`update()` はすぐに反映され、まとめられることはありません。サーバーの描画は初期値で行われます。',
  en: 'The field set is fixed by the keys of the initial values. `update()` applies immediately, with no batching, and the server renders the initial values.',
});

export const keyTitle = message({
  ja: 'キーは識別子',
  en: 'The key is the identity',
});

export const keyDescription = message({
  ja: '定義の第 1 引数は、その状態の識別子です。',
  en: 'A definition’s first argument is the identity of the state.',
});

export const keyRegistry = message({
  ja: 'ブラウザのストアはこの文字列で登録されます。定義オブジェクトではなく文字列で引くので、HMR でモジュールが評価し直されても、同じ状態につながります。',
  en: 'The browser’s store is registered under this string. Because it is looked up by the string rather than by the definition object, a module re-evaluated by HMR reconnects to the state it already had.',
});

export const keyEntry = message({
  ja: '`definePageState` では、エントリ状態の中の名前空間です。',
  en: 'For `definePageState`, it is the namespace inside the entry state.',
});

export const keyLocal = message({
  ja: '`defineLocalState` では、localStorage のキー `k8ordo-state:<key>` になります。',
  en: 'For `defineLocalState`, it becomes the localStorage key `k8ordo-state:<key>`.',
});

export const keyRename = message({
  ja: 'キーを変えると、保存されたデータの名前も変わります。同じ種類の定義が同じキーを使うと、1 つのストア（local なら 1 つの行）を黙って共有します。モジュールシステムはこれを検出できないので、アプリ全体のグローバル名として扱ってください。',
  en: 'Renaming the key renames the data. Two definitions of the same kind that share a key silently share one store — and, for local state, one storage row. The module system cannot catch this, so treat the key as an app-wide global name.',
});

export const schemaTitle = message({
  ja: 'スキーマの規則',
  en: 'Schema rules',
});

export const schemaDescription = message({
  ja: 'スキーマが要るのは、データが境界を越えて戻ってくる場所だけです。利用者が書き換えられる URL、古いスキーマが書いた localStorage、セッション復元で戻ってきたエントリ状態。そこから来る値は、信頼済みの状態ではなく入力として扱われます。',
  en: 'Schemas appear exactly where data comes back across a boundary: a URL the user can edit, localStorage an older schema wrote, entry state a session restore brought back. What comes from there is treated as input, not as trusted state.',
});

export const schemaObject = message({
  ja: 'スキーマは `z.object()` です。`zod` と `zod/mini` のどちらで書いてもかまいません。',
  en: 'A schema is a `z.object()`, written with either `zod` or `zod/mini`.',
});

export const schemaAbsence = message({
  ja: 'どのフィールドも、欠けたまま読めなければなりません。`z._default()`（`.default()`）も `z.optional()` も無いフィールドは、定義時にフィールド名付きで throw します。`z.optional()` のフィールドの既定値は `undefined` です。',
  en: 'Every field must parse from nothing. A field with neither `z._default()` (`.default()`) nor `z.optional()` throws at definition time, naming the field. The default of a `z.optional()` field is `undefined`.',
});

export const schemaRefine = message({
  ja: 'オブジェクト全体への `refine` は、すべてのフィールドが既定値の状態を受け付けなければなりません。受け付けないと定義時に throw します。',
  en: 'An object-level `refine` must accept the value where every field is at its default, or the definition throws.',
});

export const schemaOwnOutput = message({
  ja: '`entry` と localStorage のスキーマは、自分の出力をそのまま入力として受け付けなければなりません。保存された値は型付きのまま戻ってきてスキーマを通り直すので、`z.stringbool()` や型を変える変換は、書き込むたびに既定値に戻ります。`url` では値がクエリ文字列を通って戻るので、`z.stringbool()` が使えます。',
  en: 'In `entry` and localStorage the schema must accept its own output as input: stored values come back typed and go through the schema again, so a `z.stringbool()` or a type-changing transform lands on its default on every write. In `url` the values come back through the query string, which is why `z.stringbool()` works there.',
});

export const schemaSalvage = message({
  ja: 'スキーマが受け付けない値はそのフィールドだけが既定値に戻り、読み取りが throw することはありません。',
  en: 'A value the schema rejects falls back to that field’s own default, and reading never throws.',
});

export const schemaSalvageLink = message({
  ja: 'サルベージの具体例',
  en: 'Worked salvage examples',
});

export const zodTitle = message({
  ja: '`zod` と `zod/mini`',
  en: '`zod` or `zod/mini`',
});

export const zodDescription = message({
  ja: '解析は zod の共通のコアで行うので、どちらの入口で書いたスキーマでも動きます。クライアントはスキーマそのもので解析と書き出しを行い、スキーマを持つモジュールはブラウザにも届きます。アプリがすでに classic の `zod` を読み込んでいるのでなければ、`zod/mini` を選んでください。スキーマがサーバーに留まる `@k8ordo/form` とは、ここが違います。',
  en: 'Parsing runs on zod’s shared core, so a schema written with either entry works. The client parses and serializes with the schema itself, so the module holding it ships to the browser: choose `zod/mini` unless the app already pays for classic `zod`. This is where it differs from `@k8ordo/form`, whose schema stays on the server.',
});

export const zodCompare = message({
  ja: '同じ定義を両方の書き方で並べると、次のようになります。',
  en: 'The same definition, written both ways:',
});

export const typesTitle = message({
  ja: '定義の中身',
  en: 'What a definition holds',
});

export const typesDescription = message({
  ja: '定義は、スキーマ（メモリなら初期値）と純粋な関数だけのオブジェクトです。型はすべて `@k8ordo/state` から export されています。',
  en: 'A definition is an object of schemas (initial values, for memory) and pure functions. Every type below is exported from `@k8ordo/state`.',
});

export const typesTable = {
  type: message({ ja: '型', en: 'Type' }),
  holds: message({ ja: '中身', en: 'Holds' }),
  pageState: message({
    ja: "`kind: 'page'`・`key`・`url`・`entry`・`parseUrl`・`href`・`search`。`url` と `entry` は渡したスキーマそのもの（書かなかった方は `undefined`）",
    en: "`kind: 'page'`, `key`, `url`, `entry`, `parseUrl`, `href`, `search`. `url` and `entry` are the schemas as passed (`undefined` for the one left out)",
  }),
  localState: message({
    ja: "`kind: 'local'`・`key`・`schema`・`storageKey`・`inlineRead`",
    en: "`kind: 'local'`, `key`, `schema`, `storageKey`, `inlineRead`",
  }),
  memoryState: message({
    ja: "`kind: 'memory'`・`key`・`initial`。`initial` は渡した初期値の浅いコピー",
    en: "`kind: 'memory'`, `key`, `initial`. `initial` is a shallow copy of the values passed",
  }),
  stateSchema: message({
    ja: '`url`・`entry`・`defineLocalState` が受け取るスキーマの型。`zod` と `zod/mini` の `z.object()` に共通する部分です',
    en: 'The schema type `url`, `entry` and `defineLocalState` accept: what a `z.object()` from `zod` and one from `zod/mini` have in common',
  }),
  outputOf: message({
    ja: 'スキーマの出力型（`undefined` なら空のオブジェクト型）。props の型に `OutputOf<typeof catalogState.url>` のように使います',
    en: 'A schema’s output type, or an empty object type for `undefined`. Use it for props: `OutputOf<typeof catalogState.url>`',
  }),
};
