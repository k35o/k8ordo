import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '状態をどこに置くかで、保存される期間と共有される範囲が決まります。6つの置き場所の違いを知り、選べるようになります。',
  en: 'Where a state lives decides how long it lasts and who shares it. Knowing the six places lets you choose where each state belongs.',
});

export const sixTitle = message({
  ja: '6つの置き場所',
  en: 'Six places',
});

export const sixFunction = message({
  ja: '状態を定義する関数が、そのまま置き場所を表します。',
  en: 'The function that defines a state names the place it lives in.',
});

export const sixUrl = message({
  ja: '`definePageState`の`url`：URLのクエリに置きます。戻る/進むで元に戻り、リンクを受け取った人にも同じ値が見えます。`@k8ordo/framework`のserverモードで`search`をexportしたページなら、サーバーでも読めます。',
  en: '`url` of `definePageState`: the query string of the URL. Back and forward restore it, and anyone given the link sees the same values. A page that exports `search` in `@k8ordo/framework`’s server mode can read it on the server too.',
});

export const sixEntry = message({
  ja: '`definePageState`の`entry`：履歴エントリの状態に置きます。戻る/進むと再読み込みでは残ります。URLには出ないので、共有したリンクには含まれません。',
  en: '`entry` of `definePageState`: the state of the history entry. It survives back, forward and reload. It never shows in the URL, so a shared link does not carry it.',
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
  ja: '`defineCookieState`：Cookieに置きます。最後に書いてから400日残り、同じ端末のすべてのタブに同じ値が見えます。リクエストのたびにサーバーへ送られるので、サーバーでも読めます。',
  en: '`defineCookieState`: a cookie. It lasts 400 days from the last write, and every tab on the device sees the same values. It is sent with every request, so the server can read it too.',
});

export const sixMemory = message({
  ja: '`defineMemoryState`：JavaScriptの実行環境に置きます。そのタブの中だけで共有され、再読み込みで初期値に戻ります。',
  en: '`defineMemoryState`: the JavaScript runtime. It is shared within the tab, and returns to its initial values on reload.',
});

export const sixSameHook = message({
  ja: 'どこに置いた状態も、読み書きには同じ`useAppState`を使います。',
  en: 'Whichever place a state lives in, `useAppState` reads and updates it.',
});

export const scopeTitle = message({
  ja: 'ページ単位とアプリ単位',
  en: 'Page scope and app scope',
});

export const scopePage = message({
  ja: '`url`と`entry`は、同じ履歴エントリに属します。1つの定義にまとめて書き、両方にまたがる更新は一度に反映されます。',
  en: '`url` and `entry` belong to the same history entry. They share one definition, and an update that spans both is applied at once.',
});

export const scopeApp = message({
  ja: 'Web StorageとCookie、メモリはアプリ全体に属します。どのページから読んでも同じ値です。ページに属さないので、`definePageState`とは別の関数で定義します。',
  en: 'Web Storage, cookies and memory belong to the whole app. Every page reads the same values. They do not belong to a page, so each has a define function of its own instead of `definePageState`.',
});

export const chooseTitle = message({
  ja: '置き場所の選び方',
  en: 'Choosing a place',
});

export const chooseOrder = message({
  ja: '次の問いを上から順に当てはめ、最初に当てはまったものを置き場所にします。',
  en: 'Go through these questions in order. The first one that fits is the place.',
});

export const chooseUrl = message({
  ja: 'リンクを開いた人にも同じ画面を見せたいなら、`url`です。検索語や絞り込み、ページ番号、選んでいるタブが当てはまります。サーバーが描画に使う値もここに置きます。',
  en: 'Should someone opening the link see the same screen? Then `url`: a search term, filters, the page number, the selected tab. Values the server renders with go here too.',
});

export const chooseEntry = message({
  ja: '戻るボタンでは戻ってほしいが、リンクには含めたくないなら`entry`です。開いている行や広げたパネルのように、その画面を見ている間だけの状態が当てはまります。',
  en: 'Should the back button restore it, but a shared link leave it out? Then `entry`: an open row, an expanded panel, state that matters only while that screen is open.',
});

export const choosePreference = message({
  ja: 'その端末を使う人の好みなら、localStorageかCookieです。表示密度のように、サーバーの描画が既定値のままだと困るものはCookieに置きます。そうでなければlocalStorageで足ります。',
  en: 'Is it a preference of whoever uses the device? Then localStorage or a cookie. If the server render must not show the default, as with display density, use a cookie. Otherwise localStorage is enough.',
});

export const chooseSession = message({
  ja: 'そのタブを使っている間だけ覚えておけばよいなら、sessionStorageです。閉じたお知らせや、そのタブで書きかけの下書きが当てはまります。',
  en: 'Does it only need remembering while the tab is open? Then sessionStorage: a dismissed notice, a draft being written in that tab.',
});

export const chooseMemory = message({
  ja: '再読み込みで消えてよく、離れたコンポーネントの間で共有したいだけなら、メモリです。たとえばコマンドパレットの開閉です。',
  en: 'Can it vanish on reload, and does it only need sharing between distant components? Then memory, such as whether the command palette is open.',
});

export const chooseSecret = message({
  ja: 'セッションやトークンのような秘密は、どの置き場所にも置かないでください。Cookieを`HttpOnly`にできない理由は',
  en: 'Keep secrets such as sessions and tokens out of every place here. Why a cookie state can never be `HttpOnly` is explained on ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const keyTitle = message({
  ja: '状態のキー',
  en: 'The key',
});

export const keyFirstArgument = message({
  ja: 'どの定義も、1つ目の引数に文字列のキーを取ります。このキーが、その状態を保存する名前になります。',
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
  ja: 'どの種類でも：ブラウザの中でストアを登録する名前',
  en: 'Every kind: the name its store is registered under in the browser',
});

export const keyRename = message({
  ja: 'キーを変えると、保存されるデータの名前も変わります。古いキーで保存した値は、新しい定義からは読めません。',
  en: 'Renaming the key renames the data. The new definition cannot read values saved under the old key.',
});

export const keyShared = message({
  ja: '同じ種類の定義が同じキーを使うと、同じストアを共有します。localStorageやsessionStorage、Cookieなら、保存した値も1つです。種類が違えば、同じキーでも別の状態です。モジュールの仕組みでは重なりを見つけられないので、キーはアプリ全体で重ならない名前にしてください。',
  en: 'Two definitions of the same kind under one key share one store, and for localStorage, sessionStorage and cookies one stored value too. Different kinds never collide, even under the same key. Nothing in the module system can catch an overlap, so give each key a name that is unique across the app.',
});

export const keyColorScheme = message({
  ja: '`@k8ordo/color-scheme`は、`color-scheme`というキーの`defineLocalState`で好みを保存しています。同じアプリでは、このキーをlocalStorageの状態に使わないでください。',
  en: '`@k8ordo/color-scheme` keeps its preference in a `defineLocalState` keyed `color-scheme`. In the same app, do not give a local state that key.',
});

export const schemaTitle = message({
  ja: 'スキーマの要る置き場所',
  en: 'Where schemas go',
});

export const schemaInput = message({
  ja: 'スキーマを持つのは、URLやストレージ、履歴エントリから値を読み戻す置き場所です。読み戻す値には、利用者が書き換えたURLや古いスキーマが書いたストレージ、セッションの復元で戻った履歴エントリの状態があります。こうした値は入力として扱われ、読むたびにスキーマを通ります。',
  en: 'A schema belongs to the places that read values back from the URL, storage or the history entry. Such values include a URL a visitor edited, Web Storage or a cookie an older schema wrote, and entry state a session restore revived. They are treated as input and pass the schema on every read.',
});

export const schemaAbsence = message({
  ja: 'どのフィールドも、値が無くても読めるようにします。ハイライトした`page`のように`.default()`も`.optional()`も無いフィールドがあると、モジュールの読み込みの時点でエラーになります。エラー文は`url fields must tolerate absence — add .default() or .optional() to: page`のように、フィールド名を挙げます。',
  en: 'Every field must accept a missing value. A field with neither `.default()` nor `.optional()`, like the highlighted `page`, makes the definition throw as the module loads. The error names the field: `url fields must tolerate absence — add .default() or .optional() to: page`.',
});

export const schemaMemory = message({
  ja: 'メモリだけはスキーマを持ちません。値が実行環境の外へ出ず、型の付いた`update()`だけが書き込むので、確かめ直すものがありません。',
  en: 'Memory alone has no schema. Its values never leave the runtime and the typed `update()` is their only writer, so there is nothing to check again.',
});

export const miniTitle = message({
  ja: 'zod/mini',
  en: 'zod/mini',
});

export const miniBundle = message({
  ja: 'スキーマは`zod`と`zod/mini`のどちらで書いても動きます。ブラウザがスキーマで値を読み書きするので、スキーマはバンドルに入ります。アプリがほかで`zod`を使っていなければ、`zod/mini`を選んでください。ふつうの定義のモジュールなら、gzipした大きさは`zod`のおよそ3分の1で済みます。',
  en: 'A schema written with `zod` or `zod/mini` works the same. The browser reads and writes values with the schema, so the schema ends up in the bundle. Unless the app already uses `zod` elsewhere, pick `zod/mini`: a typical definition module gzips to about a third of the size.',
});

export const miniSpelling = message({
  ja: '`zod/mini`では、`.default()`を`z._default()`と、`.int().min(1)`を`.check(z.int(), z.gte(1))`と書きます。どちらで書いても、URLに書かれる値も読み方も変わりません。',
  en: 'In `zod/mini`, `.default()` is spelled `z._default()` and `.int().min(1)` is `.check(z.int(), z.gte(1))`. Either way the URL holds the same values and reads them back the same way.',
});
