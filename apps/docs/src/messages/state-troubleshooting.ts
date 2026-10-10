import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくある症状の原因と直し方です。エラー文で探すときは、ページの中を検索してください。',
  en: 'Common symptoms, their causes and their fixes. To look up an error, search this page for its wording.',
});

export const absenceTitle = message({
  ja: '`fields must tolerate absence`',
  en: '`fields must tolerate absence`',
});

export const absenceCause = message({
  ja: 'スキーマのフィールドに`.default()`も`.optional()`も付いていません。URLのパラメータやストレージの値はいつでも欠けうるので、定義はモジュールの読み込みの時点でエラーになります。',
  en: 'A field has neither `.default()` nor `.optional()`. A URL parameter or a stored value can always be missing, so the definition throws as the module loads.',
});

export const absenceFix = message({
  ja: 'エラーに挙がったフィールドに、`.default()`か`.optional()`を付けます。`zod/mini`なら`z._default()`か`z.optional()`です。エラー文が`rejects its own defaults`なら、オブジェクト全体の`.refine()`がすべて既定値の状態を受け付けるようにします。',
  en: 'Add `.default()` or `.optional()` to the fields the error names (`z._default()` or `z.optional()` in `zod/mini`). If the error says `rejects its own defaults`, make the object-level `.refine()` accept the all-defaults value.',
});

export const urlBooleanTitle = message({
  ja: '`url boolean fields must use z.stringbool()`',
  en: '`url boolean fields must use z.stringbool()`',
});

export const urlBooleanCause = message({
  ja: '`url`のフィールドか配列の要素に、`z.boolean()`か`z.coerce.boolean()`を書いています。どちらもURLの`"false"`を`false`として読めないので、定義はモジュールの読み込みの時点でエラーになります。',
  en: 'A `url` field or array item is `z.boolean()` or `z.coerce.boolean()`. Neither reads the URL’s `"false"` as `false`, so the definition throws as the module loads.',
});

export const urlBooleanFix = message({
  ja: '`z.stringbool()`に書き換えます。',
  en: 'Use `z.stringbool()`.',
});

export const urlArrayTitle = message({
  ja: '`url array fields must default to []`',
  en: '`url array fields must default to []`',
});

export const urlArrayCause = message({
  ja: '`url`の配列が`.optional()`か、`[]`以外の既定値を持っています。パラメータの無いURLと、空の配列を書いたURLは同じです。既定値が`[]`でないと、空の配列を書けません。',
  en: 'A `url` array is `.optional()` or defaults to something other than `[]`. A URL without the parameter and a URL written with an empty array are the same. Unless the default is `[]`, an empty array can never be written.',
});

export const urlArrayFix = message({
  ja: '`.default([])`にします。',
  en: 'Give it `.default([])`.',
});

export const clientModuleTitle = message({
  ja: 'Server Componentで呼べない`href`',
  en: '`href` not callable in a Server Component',
});

export const clientModuleCause = message({
  ja: "定義を`'use client'`のファイルからexportしています。Server Componentには定義の代わりにclient referenceが渡るので、`href`や`parseUrl`を呼べません。",
  en: "The definition is exported from a `'use client'` file. A Server Component receives a client reference in its place, so `href` and `parseUrl` are not there to call.",
});

export const clientModuleFix = message({
  ja: "定義を`'use client'`の無いモジュールに移します。定義は純粋なので、サーバーとクライアントのどちらからもimportできます。",
  en: "Move the definition to a module without `'use client'`. The definition is pure, so both the server and the client can import it.",
});

export const serializationTitle = message({
  ja: '`has no URL serialization`',
  en: '`has no URL serialization`',
});

export const serializationCause = message({
  ja: '`url`のフィールドに、`Date`のようにURLで表せない値を書いています。',
  en: 'A value no URL can hold, such as a `Date`, is being written to a `url` field.',
});

export const serializationFix = message({
  ja: 'URLに置けるのは文字列と数値と真偽値、およびそれらの配列だけです。日付は文字列で持ちます。',
  en: 'Keep `url` fields to strings, numbers, booleans and arrays of them. Hold a date as a string.',
});

export const fullLoadTitle = message({
  ja: '`update()`でのページ全体の再読み込み',
  en: 'Full page reload on `update()`',
});

export const fullLoadCause = message({
  ja: 'ルーターが`navigate`イベントを`intercept()`していません。今のNext.jsがそうで、`navigation.navigate()`はページ全体の読み込みになります。',
  en: 'The router does not intercept Navigation API navigations. Next.js today is one, and there `navigation.navigate()` is a full page load.',
});

export const fullLoadFix = message({
  ja: 'そのルーターでは、URLの変更をリンクとGETフォームで行います。`@k8ordo/framework`は`@k8ordo/router`の上で動くので、ページ全体の読み込みにはなりません。',
  en: 'Under that router, change the URL with links and GET forms. `@k8ordo/framework` runs on `@k8ordo/router`, where it is never a full page load.',
});

export const stringboolTitle = message({
  ja: '書くたびに既定値に戻る真偽値',
  en: 'A boolean that resets on every write',
});

export const stringboolCause = message({
  ja: '`entry`やWeb Storage、Cookieのスキーマに`z.stringbool()`を書いています。これらの置き場所では、書いた`true`が真偽値のままスキーマに渡ります。`z.stringbool()`は文字列しか受け付けないので、その`true`を拒み、フィールドは既定値に戻ります。',
  en: 'The schema of `entry`, Web Storage or a cookie uses `z.stringbool()`. In those places the written `true` reaches the schema as a boolean. `z.stringbool()` accepts only a string, so it rejects that `true` and the field falls back to its default.',
});

export const stringboolFix = message({
  ja: '`z.boolean()`に書き換えます。`url`から`entry`へ移したフィールドも、同じように書き換えます。',
  en: 'Use `z.boolean()`. A field moved from `url` to `entry` needs the same change.',
});

export const dateTitle = message({
  ja: '再読み込みで既定値に戻る日付',
  en: 'A date that resets after a reload',
});

export const dateCause = message({
  ja: 'Web StorageとCookieの値はJSONで保存されます。読み戻した`Date`は文字列になり、`z.date()`はその文字列を拒みます。フィールドは既定値に戻ります。`update()`はJSONを経由せずに値を反映するため、書いた直後だけ`Date`のまま表示されます。',
  en: 'Web Storage and cookie values are stored as JSON. A `Date` comes back as a string, which `z.date()` rejects, so the field falls back to its default. The `Date` shows right after the write because `update()` applies the value without going through JSON.',
});

export const dateFix = message({
  ja: 'フィールドをJSONで表せる型にします。日付は文字列で持ちます。',
  en: 'Keep the field to a type JSON can hold. Hold a date as a string.',
});

export const sharedKeyTitle = message({
  ja: '同じ値になる2つの状態',
  en: 'Two states with the same values',
});

export const sharedKeyCause = message({
  ja: '同じ種類の定義に同じキーを付けています。同じキーの定義は1つのストアを共有します。`@k8ordo/color-scheme`も、`color-scheme`というキーでlocalStorageの状態を定義しています。',
  en: 'Two definitions of the same kind use the same key, and so share one store. `@k8ordo/color-scheme` also defines a local state under the key `color-scheme`.',
});

export const sharedKeyFix = message({
  ja: 'キーを、アプリの中で重ならない名前に変えます。キーを変えると保存した値の名前も変わるので、古いキーの値は読まれなくなります。',
  en: 'Change the key to a name nothing else in the app uses. Renaming the key renames the stored data, so values saved under the old key are no longer read.',
});

export const safariCookieTitle = message({
  ja: 'Safariで消えるCookie',
  en: 'A cookie Safari drops',
});

export const safariCookieCause = message({
  ja: 'Cookie Store APIはCookieに必ず`Secure`を付けます。Safariは`http://localhost`でも`Secure`のCookieを捨てます。',
  en: 'The Cookie Store API always sets `Secure`, and Safari drops a `Secure` cookie even on `http://localhost`.',
});

export const safariCookieFix = message({
  ja: '開発中もHTTPSで配信します。',
  en: 'Serve over HTTPS during development too.',
});

export const testLeakTitle = message({
  ja: 'テストをまたいで残る値',
  en: 'Values leaking between tests',
});

export const testLeakCause = message({
  ja: 'ストアはモジュールの中の登録表に残り、保存した値もブラウザに残ります。',
  en: 'Stores stay in the module’s registry, and stored values stay in the browser.',
});

export const testLeakFix = message({
  ja: 'コンポーネントをアンマウントしてから`resetStateRegistry()`を呼びます。そのうえで、`storageKey`や`cookieName`で保存した値を消します。',
  en: 'Unmount the components, then call `resetStateRegistry()`. After that, delete the stored values by `storageKey` or `cookieName`.',
});

export const testNavigatesTitle = message({
  ja: 'テスト中のページ移動',
  en: 'Navigation away during a test',
});

export const testNavigatesCause = message({
  ja: '`navigate`イベントを`intercept()`するものが無いので、`navigation.navigate()`がページ全体の読み込みになります。',
  en: 'Nothing intercepts the `navigate` event, so `navigation.navigate()` is a full page load.',
});

export const testNavigatesFix = message({
  ja: 'ルーターの代わりに、テストの中で`navigate`イベントを受け取って`event.intercept()`を呼びます。',
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
