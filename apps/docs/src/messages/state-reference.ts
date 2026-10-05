import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/state`がexportする関数と型の一覧です。`useAppState`だけはClient Componentの中で使うフックで、ほかの関数はサーバーでもクライアントでも呼べます。',
  en: 'The functions and types `@k8ordo/state` exports. `useAppState` is a hook for Client Components; every other function runs on the server and the client alike.',
});

export const fieldKind = message({
  ja: '定義の種類。`useAppState`は、これを見てストアを選びます。',
  en: 'The kind of definition, which `useAppState` reads to pick the store.',
});

export const fieldKey = message({
  ja: '1つ目の引数に渡したキー。',
  en: 'The key passed as the first argument.',
});

export const fieldSchema = message({
  ja: '渡したスキーマ。',
  en: 'The schema as passed.',
});

export const schemaParam = message({
  ja: '保存する値のスキーマ。どのフィールドも`.default()`か`.optional()`を持たなければなりません。',
  en: 'The schema of the stored values. Every field needs a `.default()` or an `.optional()`.',
});

export const versioningParam = message({
  ja: '保存した形を変えたときの`version`と`migrate`。省くと、行は値のオブジェクトそのものになります。',
  en: 'The `version` and `migrate` for a stored shape that changed. Without it, a row is the bare values object.',
});

export const pageSummary = message({
  ja: 'ページの状態を定義します。`url`はURLのクエリに、`entry`は履歴エントリの隠れた状態に置きます。',
  en: 'Defines page state: `url` in the URL’s query, `entry` in the history entry’s hidden state.',
});

export const pageKeyParam = message({
  ja: '状態の名前。`entry`の値を置く名前空間と、ストアの登録に使います。',
  en: 'The state’s name: the namespace its `entry` values take, and the store’s registry slot.',
});

export const pageConfig = message({
  ja: '`url`と`entry`のスキーマ。少なくともどちらか1つを渡します。',
  en: 'The `url` and `entry` schemas. Pass at least one.',
});

export const pageReturns = message({
  ja: 'サーバーからもクライアントからもimportできる、純粋な定義。',
  en: 'A pure definition that both server and client code import.',
});

export const pageUrl = message({
  ja: '渡した`url`のスキーマ。`@k8ordo/server`の`search`や、`@k8ordo/form`の`formFields`に渡します。',
  en: 'The `url` schema as passed, for `@k8ordo/server`’s `search` export or `@k8ordo/form`’s `formFields`.',
});

export const pageEntry = message({
  ja: '渡した`entry`のスキーマ。',
  en: 'The `entry` schema as passed.',
});

export const pageParseUrl = message({
  ja: '`url`を読みます。欠けたパラメータには既定値を入れ、スキーマに合わない値はフィールドごとに既定値に戻します。投げることはありません。',
  en: 'Reads the url slot: defaults for missing parameters, and a field the schema rejects falls back to its default. It never throws.',
});

export const pageHref = message({
  ja: 'リンクを作ります。指定しなかったフィールドは既定値として扱い、既定値と同じフィールドはクエリから省きます。Viteの`base`を前に付けます。',
  en: 'Builds a link. A field left out means its default, fields at their default are left out of the query, and Vite’s `base` goes in front.',
});

export const pageSearch = message({
  ja: 'クエリ文字列だけを、`?`を付けずに返します。',
  en: 'Returns the query string alone, without the `?`.',
});

export const pageCaveats = [
  message({
    ja: 'どのフィールドも`.default()`か`.optional()`を持たなければなりません。無いと、モジュールの読み込みで投げます。',
    en: 'Every field needs a `.default()` or an `.optional()`; without one, the module throws as it loads.',
  }),
  message({
    ja: '`url`の真偽値は`z.stringbool()`で、配列は`.default([])`で書きます。ほかの綴りは、読み込みで拒まれます。',
    en: 'A `url` boolean is `z.stringbool()` and a `url` array defaults to `[]`; other spellings are refused as the module loads.',
  }),
  message({
    ja: '同じフィールドを`url`と`entry`の両方に書くと、型エラーになり、実行時にも投げます。どちらも渡さないときも投げます。',
    en: 'A field declared in both `url` and `entry` is a type error and throws at runtime; so does passing neither.',
  }),
  message({
    ja: '戻り値の型は`PageState`としてexportしています。',
    en: 'The return type is exported as `PageState`.',
  }),
] as const;

export const readerSummary = message({
  ja: '`url`のスキーマだけから、`parseUrl`と同じ読み方をする関数を作ります。定義ではなく、スキーマだけを渡されたコードのためのものです。',
  en: 'Builds, from a url schema alone, a function that reads the way `parseUrl` does, for code handed the schema without its definition.',
});

export const readerSchema = message({
  ja: '`url`のスキーマ。',
  en: 'A url schema.',
});

export const readerReturns = message({
  ja: 'クエリを読む関数。読み方を組み立てるのは、`urlReader`を呼んだときの1回だけです。',
  en: 'A function that reads a query. The reader is built once, when `urlReader` is called.',
});

export const readerCaveats = [
  message({
    ja: '`@k8ordo/server`は、`search`をexportしたページのクエリをこれで読んでいます。',
    en: '`@k8ordo/server` reads the query of a page that exports `search` through it.',
  }),
] as const;

export const localSummary = message({
  ja: 'localStorageに置く状態を定義します。消すまで残り、同じ端末のすべてのタブで共有されます。',
  en: 'Defines state in localStorage: kept until deleted, shared by every tab on the device.',
});

export const localKeyParam = message({
  ja: '状態の名前。localStorageのキーは`k8ordo-state:<key>`になります。',
  en: 'The state’s name. The localStorage key becomes `k8ordo-state:<key>`.',
});

export const localReturns = message({
  ja: 'localStorageの状態の定義。',
  en: 'The local state’s definition.',
});

export const localStorageKey = message({
  ja: '値を保存するlocalStorageのキー。`k8ordo-state:<key>`です。',
  en: 'The localStorage key the values are written under: `k8ordo-state:<key>`.',
});

export const localInlineRead = message({
  ja: 'インラインの`<script>`に埋め込むJavaScriptの式。ブラウザで評価すると、保存された行のオブジェクトか`null`になります。',
  en: 'A JavaScript expression for an inline `<script>`, which evaluates in the browser to the stored object or `null`.',
});

export const localCaveats = [
  message({
    ja: '値はJSONで保存するので、フィールドはJSONで表せる型にします。スキーマは、自分の出力を受け付けなければなりません。',
    en: 'Values are stored as JSON, so keep fields to what JSON holds, and the schema must accept its own output.',
  }),
  message({
    ja: 'ほかのタブの書き込みは、`storage`イベントで届きます。',
    en: 'Other tabs’ writes arrive through the `storage` event.',
  }),
  message({
    ja: '戻り値の型は`LocalState`としてexportしています。',
    en: 'The return type is exported as `LocalState`.',
  }),
] as const;

export const sessionSummary = message({
  ja: 'sessionStorageに置く状態を定義します。再読み込みでは残り、タブを閉じると消えます。',
  en: 'Defines state in sessionStorage: kept through a reload, gone with the tab.',
});

export const sessionKeyParam = message({
  ja: '状態の名前。sessionStorageのキーは`k8ordo-state:<key>`になります。',
  en: 'The state’s name. The sessionStorage key becomes `k8ordo-state:<key>`.',
});

export const sessionReturns = message({
  ja: 'sessionStorageの状態の定義。',
  en: 'The session state’s definition.',
});

export const sessionStorageKey = message({
  ja: '値を保存するsessionStorageのキー。`k8ordo-state:<key>`です。',
  en: 'The sessionStorage key the values are written under: `k8ordo-state:<key>`.',
});

export const sessionInlineRead = message({
  ja: 'インラインの`<script>`に埋め込むJavaScriptの式。sessionStorageを読みます。',
  en: 'A JavaScript expression for an inline `<script>`, reading sessionStorage.',
});

export const sessionCaveats = [
  message({
    ja: '`version`と`migrate`は取りません。',
    en: 'It takes no `version` or `migrate`.',
  }),
  message({
    ja: '同じキーの`defineLocalState`とは、別の状態です。',
    en: 'A `defineLocalState` under the same key is a different state.',
  }),
  message({
    ja: '戻り値の型は`SessionState`としてexportしています。',
    en: 'The return type is exported as `SessionState`.',
  }),
] as const;

export const cookieSummary = message({
  ja: 'Cookieに置く状態を定義します。ブラウザが書き、リクエストのたびにサーバーへ届きます。',
  en: 'Defines state in a cookie, which the browser writes and every request carries to the server.',
});

export const cookieKeyParam = message({
  ja: '状態の名前。Cookieの名前は`k8ordo-state.<key>`になります。英数字と、HTTPのtokenに入る記号だけが使えます。',
  en: 'The state’s name. The cookie is named `k8ordo-state.<key>`, so the key may hold only letters, digits and the symbols an HTTP token allows.',
});

export const cookieReturns = message({
  ja: 'Cookieの状態の定義。',
  en: 'The cookie state’s definition.',
});

export const cookieName = message({
  ja: '値を保存するCookieの名前。`k8ordo-state.<key>`です。',
  en: 'The name of the cookie the values are written under: `k8ordo-state.<key>`.',
});

export const cookieParse = message({
  ja: 'リクエストのCookieから値を読みます。値をパーセントデコードした`Map`を渡し、`@k8ordo/server`なら`request.cookies`をそのまま渡せます。古い版の値は移行して読みますが、書き戻しません。',
  en: 'Reads the values out of a request’s cookies, given as a `Map` of percent-decoded values, which `request.cookies` under `@k8ordo/server` already is. An older row is migrated as it is read, but never written back.',
});

export const cookieValue = message({
  ja: 'サーバーが同じCookieを書くときの値。スキーマに通してから、エンコードしていないJSONを返します。指定しなかったフィールドは既定値です。',
  en: 'The value for a server writing the same cookie: the JSON of the values after the schema, unencoded. A field left out means its default.',
});

export const cookieCaveats = [
  message({
    ja: 'ブラウザはCookie Store APIで、`Path=/`と`SameSite=Lax`、400日の`Max-Age`を付けて書きます。APIが`Secure`も付けます。',
    en: 'The browser writes it with the Cookie Store API, as `Path=/`, `SameSite=Lax` and a `Max-Age` of 400 days; the API adds `Secure`.',
  }),
  message({
    ja: '`HttpOnly`にはできないので、秘密は置かないでください。',
    en: 'It can never be `HttpOnly`, so never put a secret in it.',
  }),
  message({
    ja: '名前と値を合わせて4KBを超えると、書き込みのハンドルがrejectします。',
    en: 'Over 4 KB, name and value together, the write’s handle rejects.',
  }),
  message({
    ja: '戻り値の型は`CookieState`としてexportしています。',
    en: 'The return type is exported as `CookieState`.',
  }),
] as const;

export const memorySummary = message({
  ja: 'JavaScriptの実行環境に置く、型の付いた共有の箱を定義します。再読み込みで初期値に戻ります。',
  en: 'Defines a typed shared box in the JavaScript runtime, which goes back to its initial values on reload.',
});

export const memoryKeyParam = message({
  ja: '状態の名前。ストアの登録に使います。',
  en: 'The state’s name, used as the store’s registry slot.',
});

export const memoryInitial = message({
  ja: '初期値。型とキーの集まりもここから決まり、サーバーの描画にも使います。',
  en: 'The initial values. They fix the type and the set of keys, and are what the server renders.',
});

export const memoryReturns = message({
  ja: 'メモリの状態の定義。',
  en: 'The memory state’s definition.',
});

export const memoryInitialField = message({
  ja: '渡した初期値の写し。',
  en: 'A copy of the initial values.',
});

export const memoryCaveats = [
  message({
    ja: 'スキーマはありません。値が実行環境の外へ出ないからです。',
    en: 'There is no schema, because the values never leave the runtime.',
  }),
  message({
    ja: '値は書き換えずに、`update()`で置き換えます。`update()`はまとめず、呼ぶたびにその場で反映します。',
    en: 'Replace values through `update()`; never mutate them. Each `update()` applies on the spot, unbatched.',
  }),
  message({
    ja: '戻り値の型は`MemoryState`としてexportしています。',
    en: 'The return type is exported as `MemoryState`.',
  }),
] as const;

export const appStateSummary = message({
  ja: '定義の今の値と、値を変える`update`を返します。どの種類の定義にも使える、Client Componentのフックです。',
  en: 'Returns a definition’s current values and the `update` that changes them. One Client Component hook for every kind of definition.',
});

export const appStateDef = message({
  ja: '読み書きする定義。',
  en: 'The definition to read and update.',
});

export const appStateKeys = message({
  ja: '購読するキー。そのキーが変わったときだけ再描画します。`[]`なら何も購読しません。',
  en: 'The keys to subscribe to; only their changes re-render. `[]` subscribes to nothing.',
});

export const appStateOptions = message({
  ja: 'サーバーで読んだ値。`initialUrl`は`url`を持つページの状態にだけ、`initialCookie`はCookieの状態にだけ渡せます。',
  en: 'What the server read: `initialUrl` only for a page state with a url slot, `initialCookie` only for a cookie state.',
});

export const appStateReturns = message({
  ja: '今の値と、値を変える関数。',
  en: 'The current values, and the function that changes them.',
});

export const appStateCaveats = [
  message({
    ja: 'ページの状態の値は、`url`と`entry`を平らにまとめたものです。',
    en: 'A page state’s values are its `url` and `entry` merged flat.',
  }),
  message({
    ja: 'サーバーの描画とハイドレーションの描画は、既定値で行います。`initialUrl`や`initialCookie`を渡せばその値で、メモリなら初期値で描きます。',
    en: 'The server render and the hydration render show the defaults, or the values in `initialUrl` or `initialCookie` when given, or a memory state’s initial values.',
  }),
  message({
    ja: '`update(patch, options?)`は、その場で値を反映して`UpdateHandle`を返します。同じハンドラの中の呼び出しは、1回の書き込みにまとめます。`options`はページの状態にだけあります。',
    en: '`update(patch, options?)` applies on the spot and returns an `UpdateHandle`, with the calls of one handler going out as one write. `options` exists only on page state.',
  }),
  message({
    ja: 'Providerは要りません。ストアは、最初に呼ばれたときに作られます。',
    en: 'No Provider is needed: the store is created on first use.',
  }),
] as const;

export const handleSummary = message({
  ja: '`update()`が返す、2つのPromiseを持つオブジェクトです。`navigation.navigate()`が返すものと同じ形です。',
  en: 'What `update()` returns: an object holding two promises, the same shape as `navigation.navigate()`’s.',
});

export const handleCommitted = message({
  ja: '書き込みが置き場所に入ったときに解決します。',
  en: 'Settles once the write is in its place.',
});

export const handleFinished = message({
  ja: '書き込みのあとでルーターがする処理まで、すべて終わったときに解決します。',
  en: 'Settles once whatever the router does after the write is done too.',
});

export const handleCaveats = [
  message({
    ja: '無視してもlintに掛からず、rejectも表に出ません。',
    en: 'Ignoring it trips no lint, and its rejections stay quiet.',
  }),
  message({
    ja: '追い越された遷移は`AbortError`で、保存に失敗した書き込みはそのエラーでrejectします。',
    en: 'An overtaken navigation rejects with an `AbortError`, and a failed write with its error.',
  }),
] as const;

export const optionsSummary = message({
  ja: 'ページの状態の`update()`が取る、2つ目の引数の型です。',
  en: 'The second argument of a page state’s `update()`.',
});

export const optionsHistory = message({
  ja: '既定は`\'replace\'`です。`\'push\'`は、`url`の値が変わるときだけ新しい履歴エントリを積みます。',
  en: '`\'replace\'` by default. `\'push\'` adds a history entry, and only when a `url` value changes.',
});

export const optionsCaveats = [
  message({
    ja: 'ページの状態以外の`update()`には、この引数がありません。',
    en: 'No other kind’s `update()` takes this argument.',
  }),
] as const;

export const versioningSummary = message({
  ja: '`defineLocalState`と`defineCookieState`が取る、3つ目の引数の型です。',
  en: 'The third argument of `defineLocalState` and `defineCookieState`.',
});

export const versioningVersion = message({
  ja: '今の版。1以上の整数です。',
  en: 'The current version, a positive integer.',
});

export const versioningMigrate = message({
  ja: '古い版の値を、今の形に読み替えます。`fromVersion`は行を書いたときの版で、版の無い行は`0`です。',
  en: 'Turns an older version’s values into the current shape. `fromVersion` is the version the row was written with, `0` for a row with none.',
});

export const versioningCaveats = [
  message({
    ja: '返した値は、スキーマでフィールドごとに拾われます。',
    en: 'What it returns passes the schema field by field.',
  }),
  message({
    ja: '`migrate`が投げると、何も保存されていないものとして読み、行には触りません。',
    en: 'A throwing `migrate` reads as nothing stored, and leaves the row alone.',
  }),
] as const;

export const registerSummary = message({
  ja: '`href`に渡すパスを型で確かめるために、アプリが拡張するインターフェースです。',
  en: 'The interface an application augments so that the paths `href` takes are checked by type.',
});

export const registerRoutes = message({
  ja: '`@k8ordo/router`のルート表の型。パスを、表のパターンと区切りごとに照らし合わせます。',
  en: 'The type of `@k8ordo/router`’s route table; paths are matched against its patterns segment by segment.',
});

export const registerPath = message({
  ja: '表を持たないルーターのパスのunion。`routes`があれば、そちらが優先されます。',
  en: 'The path union of a router with no table. `routes` wins when both are present.',
});

export const registerCaveats = [
  message({
    ja: '`@k8ordo/static`と`@k8ordo/server`では、`.k8ordo/register.gen.ts`に生成されます。',
    en: 'Under `@k8ordo/static` and `@k8ordo/server`, it is generated into `.k8ordo/register.gen.ts`.',
  }),
  message({
    ja: '拡張はアプリケーションの中でだけ行います。',
    en: 'Augment it only in an application.',
  }),
  message({
    ja: '検査は`RegisteredPath<Path>`としてもexportしています。受け付けるパスなら`Path`に、拒むなら`never`になります。',
    en: 'The check is exported as `RegisteredPath<Path>`: `Path` when accepted, `never` when refused.',
  }),
] as const;

export const resetSummary = message({
  ja: 'ブラウザのストアの登録表を空にします。テストの間で、状態を持ち越さないためのものです。',
  en: 'Empties the registry of browser stores, so that state does not carry from one test into the next.',
});

export const resetCaveats = [
  message({
    ja: '先にコンポーネントをアンマウントしてください。',
    en: 'Unmount components first.',
  }),
  message({
    ja: '保存した行は消えません。`storageKey`や`cookieName`で消します。',
    en: 'Stored rows stay; delete them by `storageKey` or `cookieName`.',
  }),
] as const;

export const outputOfSummary = message({
  ja: 'スキーマの出力の型です。`initialUrl`や`initialCookie`を受け取るpropsの型を書くときに使います。',
  en: 'A schema’s output type, for typing the props that carry `initialUrl` or `initialCookie`.',
});

export const outputOfCaveats = [
  message({
    ja: '`OutputOf<typeof listState.url>`のように、定義のスキーマを渡します。スキーマが無い`undefined`のときは、空のオブジェクトの型です。',
    en: 'Hand it a definition’s schema, as in `OutputOf<typeof listState.url>`. For an absent slot (`undefined`) it is an empty object type.',
  }),
] as const;

export const stateSchemaSummary = message({
  ja: '定義が受け取るスキーマの型です。`zod`と`zod/mini`の`z.object()`に共通する部分なので、どちらで書いたスキーマも渡せます。',
  en: 'The schema type definitions take: the common ground of `zod`’s and `zod/mini`’s `z.object()`, so a schema written with either fits.',
});

export const urlInputSummary = message({
  ja: '`parseUrl`と、`urlReader`が返す関数が受け取るクエリの型です。`URLSearchParams`か、フレームワークがページに渡す形のオブジェクトです。',
  en: 'The query `parseUrl` and the function from `urlReader` take: a `URLSearchParams`, or the object shape frameworks hand a page.',
});

export const anyStateSummary = message({
  ja: 'すべての種類の定義のunionです。どの定義でも受け取る関数を型付けするときに使います。',
  en: 'The union of every kind of definition, for typing a helper that takes any of them.',
});
