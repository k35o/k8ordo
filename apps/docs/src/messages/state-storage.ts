import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '表示形式や1ページの件数のような好みは、別のページに移っても、次に開いたときにも残っていてほしいものです。ブラウザの中に状態を置く定義は3つあり、残り方が違います。このページでは、`defineLocalState`と`defineSessionState`、`defineMemoryState`の使い分けを説明します。',
  en: 'A preference such as a view mode or a page size should stay when you move to another page, and still be there next time. Three definitions keep state inside the browser, each lasting differently. This page covers when to use `defineLocalState`, `defineSessionState` and `defineMemoryState`.',
});

export const localTitle = message({
  ja: 'localStorageに置く',
  en: 'Keep it in localStorage',
});

export const localDescription = message({
  ja: '`defineLocalState`は、状態をlocalStorageに置きます。消すまで残り、同じ端末のすべてのタブに同じ値が見えます。',
  en: '`defineLocalState` keeps state in localStorage. It stays until deleted, and every tab on the device sees the same values.',
});

export const localRow = message({
  ja: '値は`k8ordo-state:prefs`というキーの1行に、スキーマに書いたフィールドだけのJSONとして保存されます。たとえば`{"view":"table","pageSize":20}`のような行です。このキーは、定義の`storageKey`で読めます。',
  en: 'The values are kept as one row under the key `k8ordo-state:prefs`, holding the JSON of the declared fields alone, such as `{"view":"table","pageSize":20}`. The definition exposes that key as `storageKey`.',
});

export const localJson = message({
  ja: 'JSONを通して保存するので、フィールドはJSONで表せる型にします。`z.date()`の値は、書いた直後には表示されますが、次に読み込んだときには既定値に戻ります。また`entry`と同じく、スキーマは自分が出した値を受け付けなければなりません。真偽値は`z.stringbool()`ではなく`z.boolean()`で書きます。',
  en: 'The row goes through JSON, so keep the fields to what JSON can hold: a `z.date()` value shows right after the write and falls back to its default on the next load. As with `entry`, the schema must also accept its own output, so a boolean is `z.boolean()`, not `z.stringbool()`.',
});

export const localServer = message({
  ja: 'サーバーにはlocalStorageが無いので、サーバーの描画とハイドレーションの描画は既定値で行われ、そのあとで保存した値に切り替わります。サーバーの描画から好みを出したいなら、「サーバーが読む設定をCookieに置く」を見てください。最初の描画より前に`<html>`へ反映したいなら、「ハイドレーションの前に読む」を見てください。',
  en: 'The server has no localStorage, so the server render and the hydration render show the defaults before the saved values take over. To render the preference on the server, see “Preferences the server renders”. To apply it to `<html>` before the first paint, see “Read before hydration”.',
});

export const tabsTitle = message({
  ja: 'ほかのタブと値をそろえる',
  en: 'Keep tabs in step',
});

export const tabsDescription = message({
  ja: 'localStorageの状態は、同じ端末で開いているほかのタブにも届きます。ほかのタブが書き込むとブラウザが`storage`イベントを出し、ストアがその行を読み直すからです。',
  en: 'A local state reaches the other tabs open on the device: when one of them writes, the browser fires a `storage` event and the store reads the row again.',
});

export const tabsKeys = message({
  ja: "読み直したときに再描画されるのは、変わったキーを購読しているコンポーネントだけです。ほかのタブが`pageSize`だけを変えたなら、`['view']`だけを購読しているコンポーネントは描き直されません。",
  en: "Only the components subscribed to a key that changed re-render. When another tab changes only `pageSize`, a component subscribed to `['view']` alone is left as it is.",
});

export const sessionTitle = message({
  ja: 'タブを閉じるまでの値をsessionStorageに置く',
  en: 'Keep it in sessionStorage until the tab closes',
});

export const sessionDescription = message({
  ja: '`defineSessionState`は`defineLocalState`と同じ作りで、置き場所だけがsessionStorageに変わります。',
  en: '`defineSessionState` is built the same way as `defineLocalState`, over sessionStorage instead.',
});

export const sessionLifetime = message({
  ja: '再読み込みでは残り、タブを閉じると消えます。ほかのタブとは共有しないので、`storage`イベントが届くのは同じタブの中のほかのフレームだけです。',
  en: 'It survives a reload and goes when the tab closes. No other tab shares it, so the `storage` event only reaches other frames within the same tab.',
});

export const sessionSame = message({
  ja: '保存の形と読み方はlocalStorageと同じで、`storageKey`も`inlineRead()`もあります。ただし`version`と`migrate`は取りません。行はタブと一緒に消えるので、デプロイをまたいで開いていたタブの行も、フィールドごとに拾えば足りるからです。',
  en: 'The row and the way it is read are the same as localStorage’s, `storageKey` and `inlineRead()` included. It takes no `version` or `migrate`, though: rows go with the tab, and field-by-field salvage covers the rare one kept open across a deploy.',
});

export const sessionKinds = message({
  ja: "種類が違えば、キーが同じでも別の状態です。`defineLocalState`と`defineSessionState`に同じ`'prefs'`を付けても、行も値も共有しません。",
  en: "Different kinds are different states, even under the same key. A `defineLocalState` and a `defineSessionState` both named `'prefs'` share neither a row nor a value.",
});

export const memoryTitle = message({
  ja: '再読み込みで消えてよい値をメモリに置く',
  en: 'Keep it in memory until the next reload',
});

export const memoryDescription = message({
  ja: '`defineMemoryState`は、JavaScriptの実行環境に置く、型の付いた共有の箱です。離れたコンポーネントどうしで値を分け合い、再読み込みで初期値に戻ります。',
  en: '`defineMemoryState` is a typed shared box in the JavaScript runtime. Distant components share its values, and a reload puts them back to the initial ones.',
});

export const memoryNoSchema = message({
  ja: 'スキーマはありません。値が実行環境の外へ出ることがなく、型の付いた`update()`だけが書き手なので、確かめ直すものが無いからです。型は初期値から推論されます。ユニオン型のように初期値から推論できない型は、型引数で書きます。',
  en: 'There is no schema. The values never leave the runtime, and the typed `update()` is their only writer, so there is nothing to check again. The type is inferred from the initial values; one they cannot tell, such as a union, goes in the type argument.',
});

export const memoryEach = message({
  ja: '`update()`はまとめられず、呼ぶたびにその場で反映されます。サーバーの描画は初期値で行われます。',
  en: '`update()` is never batched: each call applies on the spot. The server renders the initial values.',
});

export const memoryImmutable = message({
  ja: '値は書き換えずに、`update()`で置き換えてください。変わったかどうかは、`update()`で受け取った値を前の値と比べて決めます。そのため、入れ子のオブジェクトをその場で書き換えても、どのコンポーネントにも知らされません。',
  en: 'Replace values through `update()`; never mutate them. Whether something changed is decided by comparing what `update()` received with the previous value, so a nested object changed in place reaches no component.',
});

export const demoTitle = message({
  ja: 'どれが残るか試す',
  en: 'See which ones stay',
});

export const demoDescription = message({
  ja: 'localStorageとsessionStorage、メモリに1つずつ数を置いた、本物の定義です。3つとも同じ形で、違うのは置き場所だけです。',
  en: 'Real definitions, each keeping one number: in localStorage, in sessionStorage and in memory. All three have the same shape; only the place differs.',
});

export const demoSteps = [
  message({
    ja: '3つの数をそれぞれ何度か増やしてから、ページを再読み込みします。localStorageとsessionStorageの数は残り、メモリの数は0に戻ります。',
    en: 'Raise each number a few times, then reload the page. The localStorage and sessionStorage numbers stay, and the memory one goes back to 0.',
  }),
  message({
    ja: 'アドレスバーのURLをコピーし、新しいタブに貼り付けて開きます。引き継がれるのはlocalStorageの数だけで、sessionStorageの数は0から始まります。',
    en: 'Copy the URL from the address bar and open it in a new tab. Only the localStorage number carries over; sessionStorage starts from 0.',
  }),
  message({
    ja: '新しいタブでlocalStorageの数を増やしてから、元のタブに戻ります。元のタブの数も、同じ値に変わっています。',
    en: 'Raise the localStorage number in the new tab, then go back to the first one. Its number has changed to the same value.',
  }),
] as const;

export const demoMemory = message({
  ja: 'メモリ',
  en: 'Memory',
});

export const demoNoKey = message({
  ja: '保存しない',
  en: 'not stored',
});

export const demoReset = message({
  ja: 'すべて0に戻す',
  en: 'Reset all to 0',
});
