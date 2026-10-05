import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '開いている行や広げたパネルのように、戻るボタンでは元に戻ってほしいけれど、リンクには載せたくない状態があります。こうした状態は、履歴エントリの隠れた面である`entry`に置きます。',
  en: 'Some state should come back with the back button, yet stay out of a shared link: an open row, an expanded panel. That state goes in `entry`, the hidden face of the history entry.',
});

export const defineTitle = message({
  ja: 'entryに書く',
  en: 'Write it in entry',
});

export const defineDescription = message({
  ja: '`definePageState`に`entry`のスキーマを渡します。値はURLには出ず、Navigation APIが履歴エントリごとに持つ状態の中に、定義のキーを名前空間にして保存されます。',
  en: 'Hand `definePageState` an `entry` schema. The values never show in the URL: they are kept in the state the Navigation API holds for each history entry, under the definition’s key.',
});

export const defineTyped = message({
  ja: '値は文字列にされず、型の付いたまま保存されます。そのため、真偽値は`z.boolean()`で、数は`z.number()`で、書いたとおりの型のまま受けます。',
  en: 'The values are kept typed, never turned into strings, so a boolean is a plain `z.boolean()` and a number a plain `z.number()`.',
});

export const defineOwnOutput = message({
  ja: 'ただし、スキーマは自分が出した値をもう一度受け付けなければなりません。書いた値は、型の付いたままスキーマを通り直すからです。`z.stringbool()`や型を変える変換は、書くたびに既定値へ戻ってしまいます。',
  en: 'The schema must accept its own output, though, because a written value passes the schema again as the typed value it is. A `z.stringbool()` or a type-changing transform lands on its default on every write.',
});

export const defineServer = message({
  ja: 'サーバーには履歴エントリが無いので、サーバーの描画とハイドレーションの描画は既定値で行われます。',
  en: 'The server has no history entry, so the server render and the hydration render show the defaults.',
});

export const bothTitle = message({
  ja: 'urlとentryを1つの定義にまとめる',
  en: 'Put url and entry in one definition',
});

export const bothDescription = message({
  ja: '1つの定義に、`url`と`entry`の両方を書けます。`useAppState`が返す状態は、2つを平らにまとめたものです。',
  en: 'One definition can hold both `url` and `entry`. The state `useAppState` returns is the two merged flat.',
});

export const bothMove = message({
  ja: 'フィールドを`url`から`entry`へ移しても、変わるのは定義だけで、呼び出す側のコードはそのまま動きます。ただし綴りはフィールドについて回ります。`url`で`z.stringbool()`だった真偽値は、`entry`では`z.boolean()`に書き換えます。',
  en: 'Moving a field from `url` to `entry` changes the definition and nothing at the call sites. The spelling follows the slot, though: a boolean that was `z.stringbool()` in `url` becomes `z.boolean()` in `entry`.',
});

export const bothDisjoint = message({
  ja: '同じ名前のフィールドを両方に書くと、型エラーになります。実行時にも、`"orders" declares in both url and entry: status`のように投げます。',
  en: 'Declaring the same field in both is a type error, and at runtime it throws: `"orders" declares in both url and entry: status`.',
});

export const atomicTitle = message({
  ja: '2つの面は一度に書き込まれる',
  en: 'Both faces are written at once',
});

export const atomicDescription = message({
  ja: '1回の`update()`で、`url`と`entry`の両方を変えられます。2つの面は同じ履歴エントリにあるので、何が変わったかで書き込み方が決まります。',
  en: 'One `update()` can change both `url` and `entry`. The two faces sit on the same history entry, so what changed decides how it is written.',
});

export const atomicNavigateCallout = message({
  ja: 'navigation.navigate()が1回',
  en: 'One navigation.navigate()',
});

export const atomicEntryCallout = message({
  ja: 'updateCurrentEntry()で今のエントリを書き換える',
  en: 'updateCurrentEntry() on the current entry',
});

export const atomicUrl = message({
  ja: '`url`の値が変わるとき：`navigation.navigate()`を1回呼び、新しいURLとエントリの状態を一緒に渡します。片方だけが変わった画面が見えることはありません。',
  en: 'When a `url` value changes: one `navigation.navigate()` carries the new URL and the entry state together, so a screen with only one of them changed is never seen.',
});

export const atomicEntryOnly = message({
  ja: "`entry`の値だけが変わるとき：`navigation.updateCurrentEntry()`で今のエントリを書き換えます。遷移を伴わないので、どのルーターの下でも動きます。`{ history: 'push' }`を付けても、新しいエントリは作られません。",
  en: "When only `entry` values change: `navigation.updateCurrentEntry()` rewrites the current entry. No navigation is involved, so it works under any router, and `{ history: 'push' }` creates no new entry.",
});

export const atomicCarry = message({
  ja: 'URLを変える書き込みは、今の`entry`の値を新しいエントリへ持ち越します。エントリの状態にほかの定義の名前空間があれば、それもそのまま残ります。',
  en: 'A write that changes the URL carries the current `entry` values over to the new entry, along with whatever other definitions keep in the entry’s state.',
});

export const restoreTitle = message({
  ja: '戻る、進む、再読み込みで戻るもの',
  en: 'What back, forward and reload bring back',
});

export const restoreDescription = message({
  ja: '2つの面は、どちらもブラウザの履歴エントリに載っています。ライブラリが別に記録を取っているわけではないので、ブラウザの操作がそのまま両方に効きます。',
  en: 'Both faces live on the browser’s history entry, not in a record the library keeps on the side, so what the browser does applies to both.',
});

export const restoreTraverse = message({
  ja: '戻る/進む：移った先のエントリにあった`url`と`entry`が、一緒に戻ります。',
  en: 'Back and forward: the `url` and `entry` of the entry you land on come back together.',
});

export const restoreReload = message({
  ja: '再読み込み：同じエントリのまま読み込み直すので、どちらも残ります。',
  en: 'Reload: the page loads again on the same entry, so both stay.',
});

export const restoreNewTab = message({
  ja: 'URLを新しいタブで開く：渡るのはURLだけです。`url`は同じ値になり、`entry`は既定値から始まります。',
  en: 'Opening the URL in a new tab: only the URL travels. `url` has the same values, and `entry` starts from its defaults.',
});

export const restoreLink = message({
  ja: 'リンクのクリック：新しいエントリには`entry`の値がまだ無いので、既定値から始まります。',
  en: 'Following a link: the new entry has no `entry` values yet, so they start from the defaults.',
});

export const restoreSession = message({
  ja: 'セッションの復元：古いスキーマが書いた値が戻ってくることもあります。スキーマに合わない値は、そのフィールドだけが既定値に戻ります。',
  en: 'Session restore: values an older schema wrote may come back. A value the schema rejects falls back to that field’s default alone.',
});

export const demoTitle = message({
  ja: '2つの面を見比べる',
  en: 'Compare the two faces',
});

export const demoDescription = message({
  ja: 'このページのURLと履歴エントリを実際に書き換える、本物の`definePageState`です。絞り込みは`url`に、開いている注文は`entry`に置いています。',
  en: 'A real `definePageState` that rewrites this page’s URL and history entry. The filter lives in `url`, and the open orders in `entry`.',
});

export const demoSteps = [
  message({
    ja: '「A-102」を開きます。`entry`の値は変わりますが、URLのクエリは変わりません。',
    en: 'Open “A-102”. The `entry` value changes, and the URL’s query does not.',
  }),
  message({
    ja: '絞り込みを「未発送」に切り替えます。クエリが`?status=pending`になり、「A-102」は開いたまま残ります。',
    en: 'Switch the filter to “Pending”. The query becomes `?status=pending`, and “A-102” stays open.',
  }),
  message({
    ja: '「A-103」も開いてから、ブラウザの戻るを押します。絞り込みが「すべて」に戻り、開いている注文も「A-102」だけに戻ります。',
    en: 'Open “A-103” too, then press the browser’s back button. The filter returns to “All”, and only “A-102” is open again.',
  }),
  message({
    ja: 'ページを再読み込みしても、絞り込みと開いている注文はそのまま残ります。',
    en: 'Reload the page. The filter and the open orders are still there.',
  }),
] as const;

export const demoFilter = message({
  ja: '絞り込み',
  en: 'Filter',
});

export const demoAll = message({
  ja: 'すべて',
  en: 'All',
});

export const demoPending = message({
  ja: '未発送',
  en: 'Pending',
});

export const demoShipped = message({
  ja: '発送済み',
  en: 'Shipped',
});

export const demoDetail101 = message({
  ja: 'ノート3冊、ボールペン1本',
  en: 'Three notebooks, one ballpoint pen',
});

export const demoDetail102 = message({
  ja: 'マグカップ2個',
  en: 'Two mugs',
});

export const demoDetail103 = message({
  ja: 'デスクライト1台',
  en: 'One desk lamp',
});

export const demoQueryEmpty = message({
  ja: 'クエリなし',
  en: 'no query',
});
