import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '状態をどこに置くかで、いつまで残るか、誰に見えるか、サーバーが読めるかが決まります。このページでは、6つの置き場所の違いと、どれを選ぶかの考え方を説明します。',
  en: 'Where state lives decides how long it lasts, who sees it, and whether the server can read it. This page covers the six places, how they differ, and how to choose between them.',
});

export const sixTitle = message({
  ja: '6つの置き場所',
  en: 'The six places',
});

export const sixDescription = message({
  ja: '`@k8ordo/state`では、状態を定義する関数がそのまま置き場所を表します。ストアを選んでから保存の仕組みを足すのではなく、最初に置き場所を決めて書きます。',
  en: 'In `@k8ordo/state`, the function that defines a state names where it lives. Rather than picking a store and adding persistence later, you name the place first.',
});

export const sixUrl = message({
  ja: '`definePageState`の`url`：URLのクエリに置きます。戻る/進むで元に戻り、リンクを受け取った人にも同じ値が見えます。`@k8ordo/framework`のserverモードなら、サーバーでも読めます。',
  en: 'The `url` slot of `definePageState`: the URL’s query. Back and forward bring it back, and anyone given the link sees the same values. A page in `@k8ordo/framework`’s server mode can read it on the server too.',
});

export const sixEntry = message({
  ja: '`definePageState`の`entry`：履歴エントリの隠れた状態に置きます。戻る/進むと再読み込みでは残りますが、URLには出ないので、共有したリンクには載りません。',
  en: 'The `entry` slot of `definePageState`: the history entry’s hidden state. It survives back, forward and reload, but it never shows in the URL, so a shared link does not carry it.',
});

export const sixLocal = message({
  ja: '`defineLocalState`：localStorageに置きます。消すまで残り、同じ端末のすべてのタブに同じ値が見えます。',
  en: '`defineLocalState`: localStorage. It stays until deleted, and every tab on the device sees the same values.',
});

export const sixSession = message({
  ja: '`defineSessionState`：sessionStorageに置きます。再読み込みでは残り、タブを閉じると消えます。ほかのタブからは見えません。',
  en: '`defineSessionState`: sessionStorage. It survives a reload and goes when the tab closes. No other tab sees it.',
});

export const sixCookie = message({
  ja: '`defineCookieState`：Cookieに置きます。最後に書いてから400日残り、すべてのタブに同じ値が見えます。リクエストのたびにサーバーへ届くので、サーバーも読めます。',
  en: '`defineCookieState`: a cookie. It lasts 400 days from the last write, and every tab sees the same values. It goes with every request, so the server can read it too.',
});

export const sixMemory = message({
  ja: '`defineMemoryState`：JavaScriptの実行環境に置きます。そのタブの中だけで共有され、再読み込みで初期値に戻ります。',
  en: '`defineMemoryState`: the JavaScript runtime. It is shared within the tab, and goes back to its initial values on reload.',
});

export const sixSameHook = message({
  ja: 'どこに置いた状態も、読み書きには同じ`useAppState`を使います。',
  en: 'Wherever a state lives, `useAppState` reads and updates it.',
});

export const scopeTitle = message({
  ja: 'ページの状態と、アプリの状態',
  en: 'Page state and app state',
});

export const scopeDescription = message({
  ja: '6つの置き場所は、ページに属するものと、アプリ全体に属するものに分かれます。',
  en: 'The six places split into those that belong to a page and those that belong to the whole app.',
});

export const scopePage = message({
  ja: '`url`と`entry`は、1つの履歴エントリの2つの面です。片方は見えて共有でき、もう片方は隠れています。そのため1つの定義にまとめて書き、2つにまたがる更新は一度に反映されます。',
  en: '`url` and `entry` are the two faces of one history entry, one visible and shareable, the other hidden. That is why they share a definition, and an update that spans both lands at once.',
});

export const scopeApp = message({
  ja: 'Web StorageとCookie、メモリは、ページではなくアプリ全体に属します。どのページから読んでも同じ値なので、それぞれが別の種類の定義になっています。',
  en: 'Web Storage, cookies and memory belong to the app rather than to a page. Every page reads the same values, which is why each is a definition kind of its own.',
});

export const chooseTitle = message({
  ja: 'どこに置くかを決める',
  en: 'Choose a place',
});

export const chooseDescription = message({
  ja: '迷ったときは、次の問いを上から順に当てはめてください。最初に当てはまったものが置き場所です。',
  en: 'When in doubt, run down these questions in order. The first one that fits is the place.',
});

export const chooseUrl = message({
  ja: 'リンクを開いた人にも同じ画面を見せたいなら、`url`に置きます。検索語や絞り込み、ページ番号、選んでいるタブが当てはまります。サーバーが描画に使う値もここに置きます。',
  en: 'Should someone opening the link see the same screen? Then it goes in `url`: a search term, filters, the page number, the selected tab. Values the server renders with belong here too.',
});

export const chooseEntry = message({
  ja: '戻るボタンでは戻ってほしいけれど、リンクには載せたくないなら`entry`です。開いている行や、広げたパネルのように、その画面を見ている間だけの状態が当てはまります。',
  en: 'Should the back button restore it, but a shared link leave it out? Then `entry`: an open row, an expanded panel, state that matters only while that screen is in front of you.',
});

export const choosePreference = message({
  ja: 'その端末を使う人の好みなら、localStorageかCookieです。表示密度のように、サーバーの描画に既定値が出ると困るものはCookieに置きます。そうでなければlocalStorageで足ります。',
  en: 'Is it a preference of whoever uses the device? Then localStorage or a cookie. If the server render must not show the default, as with display density, use a cookie; otherwise localStorage is enough.',
});

export const chooseSession = message({
  ja: 'そのタブを使っている間だけ覚えておけばよいなら、sessionStorageです。閉じたお知らせや、そのタブで書きかけの下書きが当てはまります。',
  en: 'Does it only need remembering while the tab is open? Then sessionStorage: a dismissed notice, a draft half-written in that tab.',
});

export const chooseMemory = message({
  ja: '再読み込みで消えてよく、離れたコンポーネントどうしで分け合いたいだけなら、メモリに置きます。たとえばコマンドパレットの開閉です。',
  en: 'Can it vanish on reload, and does it only need sharing between distant components? Then memory, such as whether the command palette is open.',
});

export const chooseSecret = message({
  ja: 'Cookieに置いた状態はブラウザのスクリプトが書くので、`HttpOnly`にできません。セッションやトークンのような秘密は、どの置き場所にも置かないでください。',
  en: 'A cookie state is written by script in the browser, so it can never be `HttpOnly`. Keep secrets such as sessions and tokens out of every place here.',
});

export const keyTitle = message({
  ja: '1つ目の引数は状態の名前',
  en: 'The first argument names the state',
});

export const keyDescription = message({
  ja: 'どの定義も、1つ目の引数に文字列のキーを取ります。このキーが、その状態をどこに保存するかの名前になります。',
  en: 'Every definition takes a string key as its first argument. The key is the name the state is kept under.',
});

export const keyPage = message({
  ja: '`definePageState`：履歴エントリの状態の中で、`entry`の値を置く名前空間',
  en: '`definePageState`: the namespace its `entry` values take inside the history entry’s state',
});

export const keyStorage = message({
  ja: '`defineLocalState`と`defineSessionState`：Web Storageのキー`k8ordo-state:<key>`。定義の`storageKey`で読めます',
  en: '`defineLocalState` and `defineSessionState`: the Web Storage key `k8ordo-state:<key>`, exposed as the definition’s `storageKey`',
});

export const keyCookie = message({
  ja: '`defineCookieState`：Cookieの名前`k8ordo-state.<key>`。定義の`cookieName`で読めます',
  en: '`defineCookieState`: the cookie name `k8ordo-state.<key>`, exposed as the definition’s `cookieName`',
});

export const keyRegistry = message({
  ja: 'どの種類でも：ブラウザの中でストアを登録するときの名前',
  en: 'Every kind: the name its store is registered under in the browser',
});

export const keyRename = message({
  ja: 'キーを変えると、保存されたデータの名前も変わります。古いキーで保存された値は、新しい定義からは読めません。',
  en: 'Renaming the key renames the data: values saved under the old key are out of the new definition’s reach.',
});

export const keyShared = message({
  ja: '同じ種類の定義が同じキーを使うと、1つのストアを黙って共有します。localStorageやsessionStorage、Cookieなら、保存される行も1つです。一方で種類が違えば、同じキーでも別の状態です。モジュールの仕組みでは重なりを見つけられないので、キーはアプリ全体で重ならない名前にしてください。',
  en: 'Two definitions of the same kind under one key silently share one store, and for localStorage, sessionStorage and cookies one stored row too. Different kinds never collide, even under the same key. Nothing in the module system can catch an overlap, so treat each key as an app-wide name.',
});

export const keyColorScheme = message({
  ja: '`@k8ordo/color-scheme`は、`color-scheme`というキーの`defineLocalState`で好みを保存しています。同じアプリでは、このキーをlocalStorageの状態に使わないでください。',
  en: '`@k8ordo/color-scheme` keeps its preference in a `defineLocalState` keyed `color-scheme`. In the same app, do not give a local state that key.',
});

export const schemaTitle = message({
  ja: 'スキーマを書く場所、書かない場所',
  en: 'Where schemas go, and where they do not',
});

export const schemaDescription = message({
  ja: 'スキーマを持つのは、値が境界を越えて戻ってくる置き場所だけです。',
  en: 'Only the places where values come back across a boundary have a schema.',
});

export const schemaInput = message({
  ja: '利用者が書き換えたURL、古いスキーマが書いたWeb StorageやCookie、セッションの復元で戻ってきたエントリの状態がそうです。こうした値は、信頼できる状態ではなく入力として扱われ、読むたびにスキーマを通ります。',
  en: 'A URL a visitor edited, a Web Storage row or a cookie an older schema wrote, entry state revived by a session restore. Such values are treated as input, not as trusted state, and pass the schema on every read.',
});

export const schemaAbsence = message({
  ja: 'そのため、どのフィールドも値が無いまま読めなければなりません。`.default()`も`.optional()`も無いフィールドがあると、定義はモジュールの読み込みの時点で、`url fields must tolerate absence — add .default() or .optional() to: page`のようにフィールド名を挙げて投げます。',
  en: 'So every field must read from nothing. A field with neither `.default()` nor `.optional()` makes the definition throw as the module loads, naming the field: `url fields must tolerate absence — add .default() or .optional() to: page`.',
});

export const schemaMemory = message({
  ja: 'メモリだけはスキーマを持ちません。値が実行環境の外へ出ることがなく、型の付いた`update()`だけが書き手なので、確かめ直すものが無いからです。',
  en: 'Memory alone has no schema. Its values never leave the runtime and the typed `update()` is their only writer, so there is nothing to check again.',
});

export const miniTitle = message({
  ja: 'zod/miniで書く',
  en: 'Write it with zod/mini',
});

export const miniDescription = message({
  ja: 'スキーマは`zod`と`zod/mini`のどちらで書いても動きます。ただし`@k8ordo/form`と違って、ブラウザもスキーマで値を読み書きするので、スキーマはバンドルに入ります。アプリがほかで`zod`を使っていなければ、`zod/mini`を選んでください。',
  en: 'A schema written with `zod` or `zod/mini` works the same. Unlike `@k8ordo/form`, though, the browser reads and writes values with the schema, so the schema ends up in the bundle. Unless the app already uses `zod` elsewhere, pick `zod/mini`.',
});

export const miniSpelling = message({
  ja: '`zod/mini`では、`.default()`を`z._default()`と、`.int().min(1)`を`.check(z.int(), z.gte(1))`と書きます。どちらで書いても、URLに書かれる値も読み方も変わりません。',
  en: 'In `zod/mini`, `.default()` is spelled `z._default()` and `.int().min(1)` is `.check(z.int(), z.gte(1))`. Either way the URL holds the same values and reads them back the same way.',
});
