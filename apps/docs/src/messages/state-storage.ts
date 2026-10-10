import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ブラウザの中に状態を置く定義は3つあり、保存される期間と共有される範囲が違います。違いを元に、表示形式のような好みをどこに置くかを決められます。',
  en: 'Three definitions keep state inside the browser, and they differ in how long the values last and who shares them. The difference tells you where a preference such as a view mode belongs.',
});

export const localTitle = message({
  ja: 'localStorage',
  en: 'localStorage',
});

export const localRow = message({
  ja: '`defineLocalState`は、状態をlocalStorageに置きます。`useAppState`で読み、`update()`で書きます。値は消すまで残り、同じブラウザのすべてのタブで同じ値が見えます。保存先は`k8ordo-state:prefs`というキーで、定義の`storageKey`で読めます。入るのは`{"view":"table","pageSize":20}`のような、スキーマに書いたフィールドだけのJSONです。',
  en: '`defineLocalState` keeps state in localStorage. `useAppState` reads it and `update()` writes it. The values stay until deleted, and every tab of the same browser sees the same ones. They are saved under the key `k8ordo-state:prefs`, which the definition exposes as `storageKey`. The saved value is the JSON of the declared fields alone, such as `{"view":"table","pageSize":20}`.',
});

export const localJson = message({
  ja: 'フィールドはJSONで表せる型にします。`z.date()`の値は、書いた直後は表示されますが、次に読み込んだときに既定値に戻ります。スキーマは自分が書いた値も読む必要があるので、真偽値は`z.boolean()`で書きます。`z.stringbool()`は使えません。',
  en: 'Keep the fields to what JSON can hold: a `z.date()` value shows right after the write and falls back to its default on the next load. The schema also has to read what it wrote, so a boolean is `z.boolean()`; `z.stringbool()` does not work here.',
});

export const localServer = message({
  ja: 'サーバーにはlocalStorageが無いので、サーバーの描画とハイドレーションの描画は既定値で行われます。保存した値に切り替わるのは、そのあとです。',
  en: 'The server has no localStorage, so the server render and the hydration render show the defaults. The saved values take over after that.',
});

export const localServerCookie = message({
  ja: 'サーバーの描画から保存した値を出すなら、',
  en: ' To render the saved value on the server, see ',
});

export const localServerHydration = message({
  ja: '最初の描画より前に`<html>`へ反映するなら、',
  en: ' To apply it to `<html>` before the first paint, see ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const tabsTitle = message({
  ja: 'ほかのタブとの同期',
  en: 'Other tabs',
});

export const tabsKeys = message({
  ja: "ほかのタブがこの状態の値を書き換えると、`storage`イベントが発火し、ストアが保存した値を読み直します。再描画されるのは、変わったキーを購読しているコンポーネントだけです。ほかのタブが`pageSize`だけを変えたなら、`['view']`だけを購読しているコンポーネントは再描画されません。",
  en: "When another tab changes this state's values, the browser fires a `storage` event and the store reads the saved value again. Only the components subscribed to a key that changed re-render: when the other tab changes only `pageSize`, a component subscribed to `['view']` alone stays as it is.",
});

export const sessionTitle = message({
  ja: 'sessionStorage',
  en: 'sessionStorage',
});

export const sessionLifetime = message({
  ja: '`defineSessionState`は`defineLocalState`と同じ作りで、置き場所だけがsessionStorageになります。値は再読み込みでは残り、タブを閉じると消えます。ほかのタブとは共有しないので、`storage`イベントが発火するのは同じタブの中のほかのフレームだけです。',
  en: '`defineSessionState` works like `defineLocalState`; only the place differs, and it is sessionStorage. The values survive a reload and are deleted when the tab closes. No other tab shares them, so the `storage` event fires only in other frames of the same tab.',
});

export const sessionSame = message({
  ja: '`version`と`migrate`は取りません。詳しくは',
  en: 'It takes no `version` or `migrate`; see ',
});

export const sessionKinds = message({
  ja: "同じ`'prefs'`を付けた`defineLocalState`とは別の状態で、保存した値も共有しません。キーの決まりは",
  en: "A `defineLocalState` also named `'prefs'` is a different state that shares no saved value. The rules for keys are on ",
});

export const memoryTitle = message({
  ja: 'メモリ',
  en: 'Memory',
});

export const memoryNoSchema = message({
  ja: '`defineMemoryState`は、状態をJavaScriptの実行環境に置きます。離れたコンポーネントどうしで同じ値を読み書きでき、再読み込みで初期値に戻ります。スキーマは無く、型は初期値から推論されます。unionのように初期値から推論できない型は、型引数で書きます。',
  en: '`defineMemoryState` keeps state in the JavaScript runtime. Components far apart read and write the same values, and a reload puts them back to the initial ones. There is no schema: the type is inferred from the initial values. A type they cannot infer, such as a union, goes in the type argument.',
});

export const memoryEach = message({
  ja: '`update()`は呼ぶたびにその場で反映されます。ほかの置き場所のような書き込みのまとめは起きません。詳しくは',
  en: '`update()` applies each call on the spot. There is no write batching as in the other places; see ',
});

export const memoryServer = message({
  ja: 'サーバーの描画は初期値で行われます。',
  en: ' The server renders the initial values.',
});

export const memoryImmutable = message({
  ja: '値はその場で書き換えず、`update()`で置き換えてください。変わったかどうかは、`update()`が受け取った値を前の値と比べて決めます。入れ子のオブジェクトをその場で書き換えても、どのコンポーネントも再描画されません。',
  en: 'Replace values through `update()`; never mutate them in place. Whether something changed is decided by comparing what `update()` received with the previous value, so a nested object mutated in place re-renders no component.',
});

export const demoTitle = message({
  ja: '再読み込み後に残る値',
  en: 'Values that survive a reload',
});

export const demoDescription = message({
  ja: 'localStorageとsessionStorageとメモリに1つずつ数を置いた、置き場所だけが違う同じ形の定義です。',
  en: 'Three definitions of the same shape that differ only in their place, each keeping one number: in localStorage, in sessionStorage and in memory.',
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

export const demoIncrement = message({
  ja: (place: string) => `${place}の数を1増やす`,
  en: (place) => `Add 1 to the ${place} count`,
});

export const demoReset = message({
  ja: 'すべて0に戻す',
  en: 'Reset all to 0',
});
