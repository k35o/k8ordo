import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくつまずく症状と、その原因、直し方をまとめています。エラーの文言で探すときは、ページの中を検索してください。',
  en: 'Common symptoms, what causes them, and how to fix them. To look up an error, search this page for its wording.',
});

export const absenceTitle = message({
  ja: 'モジュールを読み込むと「fields must tolerate absence」で投げる',
  en: 'Loading the module throws “fields must tolerate absence”',
});

export const absenceCause = message({
  ja: 'スキーマのフィールドに、`.default()`も`.optional()`も付いていません。URLのパラメータやストレージの行はいつでも欠けうるので、定義はそうしたフィールドを読み込みの時点で拒みます。',
  en: 'A field has neither `.default()` nor `.optional()`. A URL parameter or a stored row can always be missing, so the definition refuses such a field as the module loads.',
});

export const absenceFix = message({
  ja: 'エラーに挙がったフィールドに、`.default()`か`.optional()`を付けます。`zod/mini`なら`z._default()`か`z.optional()`です。エラーが`rejects its own defaults`なら、オブジェクト全体の`.refine()`が、すべてが既定値の状態を受け付けるようにします。',
  en: 'Give the fields the error names a `.default()` or an `.optional()` (`z._default()` or `z.optional()` in `zod/mini`). If the error says `rejects its own defaults` instead, make the object-level `.refine()` accept the all-defaults value.',
});

export const urlBooleanTitle = message({
  ja: '「url boolean fields must use z.stringbool()」で投げる',
  en: 'It throws “url boolean fields must use z.stringbool()”',
});

export const urlBooleanCause = message({
  ja: '`url`のフィールドか配列の要素に、`z.boolean()`か`z.coerce.boolean()`を書いています。URLの`"false"`を`false`として読めないので、読み込みの時点で拒まれます。',
  en: 'A `url` field or array item is `z.boolean()` or `z.coerce.boolean()`. Neither reads the URL’s `"false"` as `false`, so it is refused as the module loads.',
});

export const urlBooleanFix = message({
  ja: '`z.stringbool()`に書き換えます。',
  en: 'Write it as `z.stringbool()`.',
});

export const urlArrayTitle = message({
  ja: '「url array fields must default to []」で投げる',
  en: 'It throws “url array fields must default to []”',
});

export const urlArrayCause = message({
  ja: '`url`の配列が、`.optional()`か、`[]`以外の既定値を持っています。パラメータが無いことと空の配列は同じURLなので、空の配列を書けなくなります。',
  en: 'A `url` array is `.optional()` or defaults to something other than `[]`. An absent parameter and an empty list are the same URL, so it could never write an empty list.',
});

export const urlArrayFix = message({
  ja: '`.default([])`にします。',
  en: 'Give it `.default([])`.',
});

export const clientModuleTitle = message({
  ja: 'Server ComponentでhrefやparseUrlが呼べない',
  en: 'A Server Component cannot call href or parseUrl',
});

export const clientModuleCause = message({
  ja: "定義を`'use client'`のファイルからexportしています。Server Componentには、定義そのものではなくclient referenceが届きます。",
  en: "The definition is exported from a `'use client'` file, so a Server Component receives a client reference instead of the definition.",
});

export const clientModuleFix = message({
  ja: "定義を、`'use client'`の無いモジュールに移します。定義は純粋なので、サーバーとクライアントのどちらからimportしてもかまいません。",
  en: "Move the definition to a module without `'use client'`. It is pure, so both sides can import it.",
});

export const staticSearchTitle = message({
  ja: 'staticモードのビルドが「static build cannot hand a page the search」で止まる',
  en: 'A static-mode build stops with “static build cannot hand a page the search”',
});

export const staticSearchCause = message({
  ja: 'ページが`search`をexportしています。staticモードはページをファイルとして書き出すので、クエリごとに違う中身を返せません。',
  en: 'A page exports `search`. Static mode writes pages out as files, and a file cannot differ per query.',
});

export const staticSearchFix = message({
  ja: '`search`のexportを外し、クエリで変わる部分はクライアントコンポーネントで`useAppState`から読みます。サーバーで読む必要があるなら、serverモードに切り替えます。',
  en: 'Drop the `search` export, and read what depends on the query with `useAppState` in a client component. If the server really has to read it, switch to server mode.',
});

export const serializationTitle = message({
  ja: 'update()やhrefが「has no URL serialization」で投げる',
  en: 'update() or href throws “has no URL serialization”',
});

export const serializationCause = message({
  ja: '`url`のフィールドに、URLで表せない値を書こうとしています。たとえば`Date`です。',
  en: 'Something is writing a value no URL can spell, such as a `Date`, to a `url` field.',
});

export const serializationFix = message({
  ja: 'URLに置くのは、文字列と数、真偽値と、それらの配列だけにします。日付は、文字列のまま持ちます。',
  en: 'Keep `url` to strings, numbers, booleans and arrays of them. Hold a date as a string.',
});

export const fullLoadTitle = message({
  ja: 'URLを変えるupdate()で、ページ全体が読み込み直される',
  en: 'An update() that changes the URL reloads the whole page',
});

export const fullLoadCause = message({
  ja: 'ルーターが、Navigation APIの遷移を受け止めていません。今のNext.jsのように受け止めないルーターでは、`navigation.navigate()`がドキュメントの読み込みになります。',
  en: 'The router does not intercept Navigation API navigations. Under one that does not, Next.js today for example, `navigation.navigate()` is a document load.',
});

export const fullLoadFix = message({
  ja: 'そのルーターでは、URLの変更をリンクとGETフォームで行います。`@k8ordo/router`の上で動く`@k8ordo/framework`では、ドキュメントの読み込みにはなりません。',
  en: 'Under that router, change the URL with links and GET forms. On `@k8ordo/framework`, which runs on `@k8ordo/router`, it is never a document load.',
});

export const stringboolTitle = message({
  ja: 'entryやlocalStorageの真偽値が、書くたびに既定値に戻る',
  en: 'A boolean in entry or localStorage resets on every write',
});

export const stringboolCause = message({
  ja: '`entry`やWeb Storage、Cookieのスキーマに、`z.stringbool()`を書いています。そこでは書いた`true`が型の付いたままスキーマに戻り、文字列を待つ`z.stringbool()`が拒みます。',
  en: 'The schema of `entry`, Web Storage or a cookie uses `z.stringbool()`. There the written `true` comes back to the schema as it is, and `z.stringbool()`, which expects a string, rejects it.',
});

export const stringboolFix = message({
  ja: '`z.boolean()`に書き換えます。`url`から移したフィールドは、綴りも一緒に書き換えます。',
  en: 'Write it as `z.boolean()`. A field moved over from `url` needs its spelling changed along with it.',
});

export const dateTitle = message({
  ja: '再読み込みすると、localStorageの日付が既定値に戻る',
  en: 'A date in localStorage resets after a reload',
});

export const dateCause = message({
  ja: 'Web StorageとCookieの行はJSONで保存されるので、`Date`は文字列になって戻ります。`z.date()`は、その文字列を拒みます。書いた直後に表示されるのは、書き込みがJSONを通らずに描画へ出るからです。',
  en: 'Web Storage and cookie rows are JSON, so a `Date` comes back as a string, which `z.date()` rejects. It shows right after the write only because the echo never goes through JSON.',
});

export const dateFix = message({
  ja: 'フィールドを、JSONで表せる型にします。日付なら文字列で持ちます。',
  en: 'Keep the field to what JSON can hold; for a date, a string.',
});

export const sharedKeyTitle = message({
  ja: '別々のはずの2つの状態が、同じ値を見せる',
  en: 'Two states that should be separate show the same values',
});

export const sharedKeyCause = message({
  ja: '同じ種類の定義に、同じキーを付けています。同じキーの定義は、1つのストアを黙って共有します。`@k8ordo/color-scheme`も、`color-scheme`というキーでlocalStorageの状態を使っています。',
  en: 'Two definitions of the same kind share a key, and so silently share one store. `@k8ordo/color-scheme` also uses a local state keyed `color-scheme`.',
});

export const sharedKeyFix = message({
  ja: 'キーを、アプリの中で重ならない名前に変えます。キーを変えると保存された値の名前も変わるので、古いキーの値は読まれなくなります。',
  en: 'Rename one of them to a key nothing else in the app uses. Renaming the key renames the data, so values saved under the old key are no longer read.',
});

export const urlFlashTitle = message({
  ja: 'サーバーの描画で、URLの状態が一瞬既定値になる',
  en: 'URL state shows its defaults for a moment on the server render',
});

export const urlFlashCause = message({
  ja: 'サーバーの描画とハイドレーションの描画は、`initialUrl`を受け取らない限り、`url`の既定値で行われます。',
  en: 'Unless given `initialUrl`, the server render and the hydration render show the url slot’s defaults.',
});

export const urlFlashFix = message({
  ja: '`@k8ordo/framework`のserverモードなら、ページで`search`をexportし、受け取った値を`initialUrl`として渡します。ほかのフレームワークなら、`parseUrl`の結果を渡します。staticモードではサーバーがクエリを読めないので、この切り替わりは避けられません。',
  en: 'In `@k8ordo/framework`’s server mode, export `search` from the page and pass what it receives as `initialUrl`; elsewhere, pass what `parseUrl` returned. In static mode the server cannot read the query, so the switch cannot be avoided.',
});

export const cookieFlashTitle = message({
  ja: 'Cookieに置いた好みが、サーバーの描画に出ない',
  en: 'A preference in a cookie does not show in the server render',
});

export const cookieFlashCause = message({
  ja: '`initialCookie`が効くのは、渡した`useAppState`だけです。渡していないコンポーネントは、サーバーでは既定値を描きます。staticモードには、そもそもリクエストがありません。',
  en: '`initialCookie` seeds only the `useAppState` it is passed to, so a component without it renders the defaults on the server. And static mode has no request to read at all.',
});

export const cookieFlashFix = message({
  ja: 'レイアウトで一度だけ`parseCookies(request.cookies)`を呼び、Cookieの状態を使うすべてのコンポーネントへ`initialCookie`として渡します。',
  en: 'Call `parseCookies(request.cookies)` once, in a layout, and pass the result as `initialCookie` to every component that uses the cookie state.',
});

export const safariCookieTitle = message({
  ja: '開発中のSafariで、Cookieの状態が残らない',
  en: 'In Safari during development, the cookie state does not stick',
});

export const safariCookieCause = message({
  ja: 'Cookie Store APIは、Cookieに`Secure`を必ず付けます。Safariは、`http://localhost`でも`Secure`のCookieを捨てます。',
  en: 'The Cookie Store API always sets `Secure`, and Safari drops a `Secure` cookie even on `http://localhost`.',
});

export const safariCookieFix = message({
  ja: '開発中も、HTTPSで配信します。',
  en: 'Serve over HTTPS during development too.',
});

export const testLeakTitle = message({
  ja: 'テストで、前のテストの値が残っている',
  en: 'A test sees values from the previous test',
});

export const testLeakCause = message({
  ja: 'ストアはモジュールの中の登録表に残り、保存した行もブラウザに残ります。',
  en: 'Stores stay in a registry inside the module, and stored rows stay in the browser.',
});

export const testLeakFix = message({
  ja: 'コンポーネントをアンマウントしてから、`resetStateRegistry()`を呼びます。そのうえで、`storageKey`や`cookieName`で行を消します。',
  en: 'Unmount the components, call `resetStateRegistry()`, then delete the rows by `storageKey` or `cookieName`.',
});

export const testNavigatesTitle = message({
  ja: 'テストでURLを変える更新を呼ぶと、テストのページが移動してしまう',
  en: 'A URL update in a test navigates the test page away',
});

export const testNavigatesCause = message({
  ja: '誰も`navigate`イベントを受け止めていないので、`navigation.navigate()`がドキュメントの読み込みになっています。',
  en: 'Nothing intercepts the `navigate` event, so `navigation.navigate()` is a document load.',
});

export const testNavigatesFix = message({
  ja: 'ルーターの代わりに、テストの中で`navigate`イベントを受け止め、`event.intercept()`を呼びます。',
  en: 'Intercept the `navigate` event in the test itself, calling `event.intercept()` as a router would.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
