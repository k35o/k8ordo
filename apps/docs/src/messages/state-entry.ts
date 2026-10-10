import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '開いている行や広げたパネルのように、戻るボタンでは元に戻したい一方で、リンクでは共有したくない状態があります。こうした状態は`entry`に置きます。',
  en: 'Some state should come back with the back button but stay out of a shared link: an open row, an expanded panel. That state goes in `entry`.',
});

export const defineTitle = message({
  ja: '`entry`のスキーマ',
  en: 'The `entry` schema',
});

export const defineWhere = message({
  ja: '`definePageState`に`entry`のスキーマを渡します。値はURLには含まれません。Navigation APIが履歴エントリごとに持つ状態の、定義のキーの下に保存されます。',
  en: 'Pass `definePageState` an `entry` schema. The values never appear in the URL. They are stored in the state the Navigation API keeps for each history entry, under the definition’s key.',
});

export const defineTyped = message({
  ja: '値は文字列にされず、型の付いたまま保存されます。真偽値は`z.boolean()`で、数値は`z.number()`で受けます。書いた値はそのままの型でもう一度スキーマで検証されます。`z.stringbool()`や型を変える`transform`は、書くたびに既定値に戻ります。',
  en: 'The values are stored typed, never turned into strings: a boolean is `z.boolean()` and a number is `z.number()`. A written value is validated by the schema again as the typed value it is. `z.stringbool()` or a type-changing `transform` lands on its default on every write.',
});

export const defineServer = message({
  ja: 'サーバーには履歴エントリが無いので、サーバーの描画とハイドレーションの描画は既定値で行われます。',
  en: 'The server has no history entry, so the server render and the hydration render show the defaults.',
});

export const bothTitle = message({
  ja: '`url`と`entry`の併用',
  en: '`url` and `entry` together',
});

export const bothFlat = message({
  ja: '1つの定義に`url`と`entry`の両方を書けます。`useAppState`は、2つを1つのオブジェクトにまとめて返します。',
  en: 'One definition can hold both `url` and `entry`. `useAppState` returns the two merged into one object.',
});

export const bothMove = message({
  ja: 'フィールドを`url`から`entry`へ移しても、呼び出す側のコードはそのまま動きます。ただし真偽値の書き方は変わります。`url`で`z.stringbool()`だった真偽値は、`entry`では`z.boolean()`にします。',
  en: 'Moving a field from `url` to `entry` changes nothing at the call sites. The spelling of a boolean does change: `z.stringbool()` in `url` becomes `z.boolean()` in `entry`.',
});

export const bothDisjoint = message({
  ja: '同じ名前のフィールドを両方に書くと、型エラーになります。実行時にも、`status`を両方に書けば`"orders" declares in both url and entry: status`というエラーになります。',
  en: 'Declaring the same field in both is a type error. At runtime, declaring `status` in both fails with `"orders" declares in both url and entry: status`.',
});

export const atomicTitle = message({
  ja: '書き込みの振り分け',
  en: 'Write routing',
});

export const atomicNavigateCallout = message({
  ja: 'navigation.navigate()が1回',
  en: 'One navigation.navigate()',
});

export const atomicEntryCallout = message({
  ja: 'updateCurrentEntry()で今の履歴エントリを書き換える',
  en: 'updateCurrentEntry() on the current history entry',
});

export const atomicIntro = message({
  ja: '1回の`update()`で、`url`と`entry`の両方を変えられます。`url`の値が変わるかどうかで、書き込み方が決まります。',
  en: 'One `update()` can change both `url` and `entry`. Whether a `url` value changed decides how it is written.',
});

export const atomicUrl = message({
  ja: '`url`の値が変わるとき：`navigation.navigate()`を1回呼び、新しいURLと`entry`の値を一緒に渡します。URLだけ、または`entry`だけが変わった状態が表示されることはありません。',
  en: 'When a `url` value changes: one `navigation.navigate()` carries the new URL and the `entry` values together. The page never renders with only one of the two changed.',
});

export const atomicEntryOnly = message({
  ja: "`entry`の値だけが変わるとき：`navigation.updateCurrentEntry()`で今の履歴エントリを書き換えます。遷移しないので、どのルーターの下でも動きます。`{ history: 'push' }`を付けても、新しい履歴エントリは作られません。",
  en: "When only `entry` values change: `navigation.updateCurrentEntry()` rewrites the current history entry. No navigation happens, so it works under any router, and `{ history: 'push' }` creates no new history entry.",
});

export const atomicCarry = message({
  ja: 'URLを変える書き込みは、今の`entry`の値を新しい履歴エントリへ持ち越します。ほかの定義が履歴エントリに保存した値も、そのまま残ります。',
  en: 'A write that changes the URL carries the current `entry` values over to the new history entry. Values other definitions keep on the history entry stay as they are.',
});

export const restoreTitle = message({
  ja: 'ブラウザ操作での復元',
  en: 'Restore on browser actions',
});

export const restoreIntro = message({
  ja: '`url`も`entry`も、ブラウザの履歴エントリにあります。ライブラリは別の記録を持ちません。ブラウザで戻る、進む、再読み込みをすると両方に同じように反映されます。',
  en: 'Both `url` and `entry` live on the browser’s history entry. The library keeps no record of its own. Back, forward and reload apply to both in the same way.',
});

export const restoreTraverse = message({
  ja: '戻る/進む：移った先の履歴エントリにあった`url`と`entry`が、一緒に戻ります。',
  en: 'Back and forward: the `url` and `entry` values of the history entry you land on come back together.',
});

export const restoreReload = message({
  ja: '再読み込み：同じ履歴エントリのまま読み込み直すので、どちらも残ります。',
  en: 'Reload: the page loads again on the same history entry, so both stay.',
});

export const restoreNewTab = message({
  ja: 'URLを新しいタブで開く：渡るのはURLだけです。`url`は同じ値になり、`entry`は既定値から始まります。',
  en: 'Opening the URL in a new tab: the new tab receives only the URL. `url` has the same values, and `entry` starts from its defaults.',
});

export const restoreLink = message({
  ja: 'リンクのクリック：新しい履歴エントリには`entry`の値がまだ無いので、既定値から始まります。',
  en: 'Following a link: the new history entry has no `entry` values yet, so they start from the defaults.',
});

export const restoreSession = message({
  ja: 'セッションの復元：古いスキーマが書いた値が戻ることがあります。スキーマに合わない値は、そのフィールドだけが既定値に戻ります。',
  en: 'Session restore: values an older schema wrote may come back. A value the schema rejects falls back to that field’s default alone.',
});

export const demoTitle = message({
  ja: '`url`と`entry`の比較',
  en: '`url` versus `entry`',
});

export const demoDescription = message({
  ja: '絞り込みを`url`に、開いている注文を`entry`に置いた`definePageState`で、このページのURLと履歴エントリを実際に書き換えます。',
  en: 'A `definePageState` with the filter in `url` and the open orders in `entry`, rewriting this page’s URL and history entry for real.',
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
