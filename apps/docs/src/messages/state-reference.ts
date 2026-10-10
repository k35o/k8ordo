import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/state`がexportする関数と型の一覧です。`useAppState`だけはClient Componentのフックで、ほかはサーバーでもクライアントでも呼べます。',
  en: 'The functions and types `@k8ordo/state` exports. `useAppState` is a Client Component hook; everything else runs on the server and in the browser.',
});

export const fieldKind = message({
  ja: '定義の種類。`useAppState`はこれを見てストアを選びます。',
  en: 'The kind of definition. `useAppState` picks the store by it.',
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
  ja: '保存する値のスキーマ。フィールドの書き方は`definePageState`の注意と同じです。',
  en: 'The schema of the stored values. Its fields follow the same rules as `definePageState`’s caveats.',
});

export const versioningParam = message({
  ja: '保存した形を変えたときの`version`と`migrate`。省くと、値のオブジェクトをそのまま保存します。',
  en: 'The `version` and `migrate` for a stored shape that has changed. Without it, the stored value is the bare values object.',
});

export const pageSummary = message({
  ja: 'ページの状態を定義します。`url`の値はURLのクエリに、`entry`の値は履歴エントリの状態に保存します。',
  en: 'Defines page state. `url` values go in the URL query, `entry` values in the history entry’s state.',
});

export const pageKeyParam = message({
  ja: '状態の名前。`entry`の値を置く名前空間と、ストアの登録に使います。',
  en: 'The state’s name. It is the namespace of the `entry` values and the store’s registry key.',
});

export const pageConfig = message({
  ja: '`url`と`entry`のスキーマ。少なくともどちらか1つを渡します。',
  en: 'The `url` and `entry` schemas. Pass at least one.',
});

export const pageReturns = message({
  ja: 'サーバーからもクライアントからもimportできる定義。',
  en: 'A definition that both server and client code can import.',
});

export const pageUrl = message({
  ja: '渡した`url`のスキーマ。`@k8ordo/framework`のserverモードでページがexportする`search`や、`@k8ordo/form`の`formFields`に渡します。',
  en: 'The `url` schema as passed. Hand it to a page’s `search` export in `@k8ordo/framework`’s server mode, or to `@k8ordo/form`’s `formFields`.',
});

export const pageEntry = message({
  ja: '渡した`entry`のスキーマ。',
  en: 'The `entry` schema as passed.',
});

export const pageParseUrl = message({
  ja: '`url`の値を読みます。欠けたパラメータは既定値になります。スキーマに合わない値は、フィールドごとに既定値に戻ります。読むときにエラーにはなりません。',
  en: 'Reads the `url` values. A missing parameter gets its default, and a value the schema rejects falls back to its default field by field. Reading never throws.',
});

export const pageHref = message({
  ja: 'リンクを作ります。省いたフィールドは既定値として扱い、既定値と同じフィールドはクエリに出しません。先頭にViteの`base`を付けます。',
  en: 'Builds a link. A field left out means its default, fields at their default are left out of the query, and Vite’s `base` is prepended.',
});

export const pageSearch = message({
  ja: 'クエリ文字列だけを、`?`を付けずに返します。',
  en: 'Returns the query string alone, without the `?`.',
});

export const pageCaveats = [
  message({
    ja: 'どのフィールドにも`.default()`か`.optional()`が要ります。無いと、モジュールの読み込みで`fields must tolerate absence`を含むエラーになります。',
    en: 'Every field needs `.default()` or `.optional()`. Without one, the module throws `fields must tolerate absence` as it loads.',
  }),
  message({
    ja: '`url`の真偽値は`z.stringbool()`で、配列は`.default([])`で書きます。ほかの書き方は、モジュールの読み込みでエラーになります。',
    en: 'A `url` boolean is `z.stringbool()` and a `url` array defaults to `[]`. Any other spelling throws as the module loads.',
  }),
  message({
    ja: '同じフィールドを`url`と`entry`の両方に書くと型エラーになります。実行時にも`declares in both url and entry`を含むエラーになります。どちらも渡さないときは`declares neither url nor entry`を含むエラーになります。',
    en: 'A field declared in both `url` and `entry` is a type error, and throws `declares in both url and entry` at runtime. Passing neither throws `declares neither url nor entry`.',
  }),
] as const;

export const readerSummary = message({
  ja: '`url`のスキーマだけから、`parseUrl`と同じ手順でクエリを読む関数を作ります。定義を持たず、スキーマだけを渡されたコードで使います。',
  en: 'Builds, from a `url` schema alone, a function that reads a query the way `parseUrl` does. For code that is handed the schema without its definition.',
});

export const readerSchema = message({
  ja: '`url`のスキーマ。',
  en: 'A `url` schema.',
});

export const readerReturns = message({
  ja: 'クエリを読む関数。読む手順は`urlReader`を呼んだときに1回だけ組み立てます。',
  en: 'A function that reads a query. The reader is built once, when `urlReader` is called.',
});

export const readerCaveats = [
  message({
    ja: '`@k8ordo/framework`のserverモードは、`search`をexportしたページのクエリをこれで読みます。',
    en: '`@k8ordo/framework`’s server mode reads the query of a page that exports `search` through it.',
  }),
] as const;

export const localSummary = message({
  ja: 'localStorageに置く状態を定義します。消すまで残り、同じ端末のすべてのタブで共有されます。',
  en: 'Defines state in localStorage. It stays until deleted and is shared by every tab on the device.',
});

export const localKeyParam = message({
  ja: '状態の名前。',
  en: 'The state’s name.',
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
  ja: 'インラインの`<script>`に埋め込むJavaScriptの式。ブラウザで評価すると、保存したオブジェクトか`null`になります。スキーマも`migrate`も通りません。',
  en: 'A JavaScript expression for an inline `<script>`. In the browser it evaluates to the stored object or `null`. Neither the schema nor `migrate` runs.',
});

export const localCaveats = [
  message({
    ja: '値はJSONで保存するので、フィールドはJSONで表せる型にします。スキーマは自分の出力を受け付ける必要があります。',
    en: 'Values are stored as JSON, so keep fields to what JSON can hold. The schema must accept its own output.',
  }),
  message({
    ja: 'ほかのタブの書き込みは、`storage`イベントで受け取ります。',
    en: 'Writes from other tabs arrive through the `storage` event.',
  }),
] as const;

export const sessionSummary = message({
  ja: 'sessionStorageに置く状態を定義します。再読み込みでは残り、タブを閉じると消えます。',
  en: 'Defines state in sessionStorage. It survives a reload and goes with the tab.',
});

export const sessionKeyParam = message({
  ja: '状態の名前。',
  en: 'The state’s name.',
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
  ja: 'インラインの`<script>`に埋め込むJavaScriptの式。ブラウザで評価すると、保存したオブジェクトか`null`になります。スキーマは通りません。',
  en: 'A JavaScript expression for an inline `<script>`. In the browser it evaluates to the stored object or `null`. The schema does not run.',
});

export const sessionCaveats = [
  message({
    ja: '`version`と`migrate`は取りません。',
    en: 'It takes no `version` or `migrate`.',
  }),
  message({
    ja: '同じキーの`defineLocalState`とは別の状態です。',
    en: 'A `defineLocalState` with the same key is a different state.',
  }),
] as const;

export const cookieSummary = message({
  ja: 'Cookieに置く状態を定義します。ブラウザが書き、リクエストのたびにサーバーへ送られます。',
  en: 'Defines state in a cookie. The browser writes it, and every request carries it to the server.',
});

export const cookieKeyParam = message({
  ja: '状態の名前。使える文字は英数字と、HTTPのtokenに入る記号だけです。ほかの文字があると、モジュールの読み込みで`cannot name a cookie`を含むエラーになります。',
  en: 'The state’s name. It may hold only letters, digits and the symbols an HTTP token allows. Anything else throws `cannot name a cookie` as the module loads.',
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
  ja: 'リクエストのCookieから値を読みます。パーセントデコード済みの値の`Map`を渡します。`@k8ordo/framework`のserverモードなら`request.cookies`をそのまま渡せます。古いバージョンの値は移行して読みますが、書き戻しません。',
  en: 'Reads the values out of a request’s cookies, given as a `Map` of percent-decoded values. In `@k8ordo/framework`’s server mode, pass `request.cookies` as it is. An older version is migrated as it is read, but never written back.',
});

export const cookieValue = message({
  ja: 'サーバーが同じCookieを書くときの値。スキーマに通した値を、エンコードしていないJSONで返します。省いたフィールドは既定値になります。',
  en: 'The value for a server writing the same cookie: the values after the schema, as unencoded JSON. A field left out means its default.',
});

export const cookieCaveats = [
  message({
    ja: 'ブラウザはCookie Store APIで書きます。属性は`Path=/`と`SameSite=Lax`、400日の`Max-Age`です。`Secure`はAPIが必ず付けます。',
    en: 'The browser writes it with the Cookie Store API, as `Path=/`, `SameSite=Lax` and a `Max-Age` of 400 days. The API always adds `Secure`.',
  }),
  message({
    ja: '`HttpOnly`にはできません。秘密は置かないでください。',
    en: 'It can never be `HttpOnly`. Never put a secret in it.',
  }),
  message({
    ja: '名前と値を合わせて4KBを超えると、`update()`が返すハンドルがrejectします。',
    en: 'Over 4 KB, name and value together, the handle `update()` returns rejects.',
  }),
] as const;

export const memorySummary = message({
  ja: 'JavaScriptの実行環境に置く、スキーマを持たない状態を定義します。再読み込みで初期値に戻ります。',
  en: 'Defines state in the JavaScript runtime, with no schema. A reload resets it to the initial values.',
});

export const memoryKeyParam = message({
  ja: '状態の名前。ストアの登録に使います。',
  en: 'The state’s name, used as the store’s registry key.',
});

export const memoryInitial = message({
  ja: '初期値。値の型とキーの集まりを、この初期値から決めます。サーバーの描画にも使います。',
  en: 'The initial values. The type and the set of keys are taken from them, and the server renders them.',
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
    ja: 'スキーマはありません。値は実行環境の外に出ません。',
    en: 'There is no schema. The values never leave the runtime.',
  }),
  message({
    ja: '値は書き換えずに`update()`で置き換えます。`update()`はまとめず、呼ぶたびにその場で反映します。',
    en: 'Replace values through `update()`, never by mutating them. Each `update()` applies on the spot, unbatched.',
  }),
] as const;

export const appStateSummary = message({
  ja: '定義の今の値と、値を変える`update`を返します。Client Componentのフックで、どの種類の定義にも使えます。',
  en: 'Returns a definition’s current values and the `update` that changes them. One Client Component hook for every kind of definition.',
});

export const appStateDef = message({
  ja: '読み書きする定義。',
  en: 'The definition to read and update.',
});

export const appStateKeys = message({
  ja: '購読するキー。そのキーが変わったときだけ再描画します。`[]`なら何も購読しません。',
  en: 'The keys to subscribe to. Only a change to one of them re-renders. `[]` subscribes to nothing.',
});

export const appStateOptions = message({
  ja: 'サーバーで読んだ値。`initialUrl`は`url`を持つページの状態にだけ、`initialCookie`はCookieの状態にだけ渡せます。',
  en: 'What the server read. `initialUrl` is accepted only by a page state with `url`, `initialCookie` only by a cookie state.',
});

export const appStateReturns = message({
  ja: '今の値と、値を変える関数。',
  en: 'The current values, and the function that changes them.',
});

export const appStateCaveats = [
  message({
    ja: 'ページの状態の値は、`url`と`entry`をまとめた1つのオブジェクトです。',
    en: 'A page state’s values are its `url` and `entry` merged into one object.',
  }),
  message({
    ja: 'サーバーの描画とハイドレーションの描画は既定値で行います。`initialUrl`か`initialCookie`を渡すとその値で、メモリの状態なら初期値で描画します。',
    en: 'The server render and the hydration render show the defaults. With `initialUrl` or `initialCookie` they show those values, and a memory state shows its initial values.',
  }),
  message({
    ja: '`update(patch, options?)`はその場で値を反映し、`UpdateHandle`を返します。メモリの状態を除き、同じハンドラの中の呼び出しは1回の書き込みにまとめます。`options`はページの状態にだけあります。',
    en: '`update(patch, options?)` applies on the spot and returns an `UpdateHandle`. Except for memory state, the calls made in one handler go out as one write. `options` exists only on page state.',
  }),
  message({
    ja: 'Providerは要りません。ストアは最初に呼ばれたときに作られます。',
    en: 'No Provider is needed. The store is created on first use.',
  }),
] as const;

export const handleSummary = message({
  ja: '`update()`が返すオブジェクトで、2つのPromiseを持ちます。`navigation.navigate()`の戻り値と同じ形です。',
  en: 'What `update()` returns: an object holding two promises, the same shape as `navigation.navigate()` returns.',
});

export const handleCommitted = message({
  ja: '書き込みが終わったときに解決します。URLなら遷移の確定、ストレージとCookieなら保存の完了です。',
  en: 'Resolves once the write has landed: the navigation is committed, or the storage or cookie write has completed.',
});

export const handleFinished = message({
  ja: '書き込みのあとにルーターが行う処理まで、すべて終わったときに解決します。',
  en: 'Resolves once the router has also finished whatever it does after the write.',
});

export const handleCaveats = [
  message({
    ja: 'ハンドルを待たなくてもlintの警告にはなりません。rejectしても未処理のエラーにはなりません。',
    en: 'Leaving the handle unawaited trips no lint rule, and a rejection never surfaces as an unhandled error.',
  }),
  message({
    ja: '後から始まった遷移に取り消された遷移は`AbortError`でrejectします。保存に失敗した書き込みは、そのエラーでrejectします。',
    en: 'A navigation cancelled by a later one rejects with an `AbortError`. A write that fails rejects with its error.',
  }),
] as const;

export const optionsSummary = message({
  ja: 'ページの状態の`update()`が取る、2つ目の引数の型です。',
  en: 'The second argument of a page state’s `update()`.',
});

export const optionsHistory = message({
  ja: "既定は`'replace'`です。`'push'`は、`url`の値が変わるときだけ新しい履歴エントリを追加します。",
  en: "`'replace'` by default. `'push'` adds a history entry, and only when a `url` value changes.",
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
  ja: '今のバージョン。1以上の整数です。',
  en: 'The current version, a positive integer.',
});

export const versioningMigrate = message({
  ja: '古いバージョンの値を今の形に読み替えます。`fromVersion`は値を書いたときのバージョンで、バージョンを付けずに保存した値は`0`です。',
  en: 'Turns an older version’s values into the current shape. `fromVersion` is the version the value was written with, `0` for a value stored without one.',
});

export const versioningCaveats = [
  message({
    ja: '返した値は、スキーマでフィールドごとに読みます。合わないフィールドは既定値に戻ります。',
    en: 'What it returns passes the schema field by field. A field the schema rejects falls back to its default.',
  }),
  message({
    ja: '`migrate`の中で例外が起きると、何も保存されていないものとして読みます。保存した値には触りません。',
    en: 'A `migrate` that throws reads as nothing stored. The stored value is left as it is.',
  }),
] as const;

export const registerSummary = message({
  ja: '`href`に渡すパスを型で検査するために、アプリケーションが拡張するインターフェースです。',
  en: 'The interface an application augments so that the paths `href` takes are checked by type.',
});

export const registerRoutes = message({
  ja: '`@k8ordo/router`のルート表の型。パスは表のパターンと、セグメントごとに比べます。',
  en: 'The type of `@k8ordo/router`’s route table. A path is matched against its patterns segment by segment.',
});

export const registerPath = message({
  ja: '表を持たないルーターのパスのunion。`routes`があればそちらを優先します。',
  en: 'The path union of a router with no table. `routes` wins when both are present.',
});

export const registerCaveats = [
  message({
    ja: '`@k8ordo/framework`では、`.k8ordo/register.gen.ts`に生成されます。',
    en: 'Under `@k8ordo/framework`, it is generated into `.k8ordo/register.gen.ts`.',
  }),
  message({
    ja: '拡張はアプリケーションの中でだけ行います。',
    en: 'Augment it only in an application.',
  }),
  message({
    ja: '検査は`RegisteredPath<Path>`としてもexportしています。受け付けるパスなら`Path`に、拒むなら`never`になります。',
    en: 'The check is also exported as `RegisteredPath<Path>`: `Path` when accepted, `never` when refused.',
  }),
] as const;

export const resetSummary = message({
  ja: 'ブラウザのストアの登録表を空にします。テストの間で状態を持ち越さないために使います。',
  en: 'Empties the registry of browser stores. Use it so that state does not carry from one test into the next.',
});

export const resetCaveats = [
  message({
    ja: '先にコンポーネントをアンマウントしてください。',
    en: 'Unmount components first.',
  }),
  message({
    ja: '保存した値は消えません。`storageKey`や`cookieName`を使って消します。',
    en: 'Stored values stay. Delete them by `storageKey` or `cookieName`.',
  }),
] as const;

export const outputOfSummary = message({
  ja: 'スキーマの出力の型です。`initialUrl`や`initialCookie`を受け取るpropsの型を書くときに使います。',
  en: 'A schema’s output type. Use it to type the props that carry `initialUrl` or `initialCookie`.',
});

export const outputOfCaveats = [
  message({
    ja: '`OutputOf<typeof listState.url>`のように、定義のスキーマを渡します。スキーマが`undefined`なら、空のオブジェクトの型になります。',
    en: 'Hand it a definition’s schema, as in `OutputOf<typeof listState.url>`. When the schema is `undefined`, it is an empty object type.',
  }),
] as const;

export const stateSchemaSummary = message({
  ja: '定義が受け取るスキーマの型です。`zod`と`zod/mini`の`z.object()`に共通する部分なので、どちらで書いたスキーマも渡せます。',
  en: 'The schema type definitions take. It is what `zod`’s and `zod/mini`’s `z.object()` have in common, so a schema written with either fits.',
});

export const urlInputSummary = message({
  ja: '`parseUrl`と、`urlReader`が返す関数が受け取るクエリの型です。`URLSearchParams`か、フレームワークがページに渡す形のオブジェクトです。',
  en: 'The query `parseUrl` and the function from `urlReader` take: a `URLSearchParams`, or an object in the shape frameworks hand a page.',
});

export const anyStateSummary = message({
  ja: 'すべての種類の定義のunionです。どの定義でも受け取る関数を型付けするときに使います。`PageState`などの各種類の型も、同じ入口からexportしています。',
  en: 'The union of every kind of definition. Use it to type a function that takes any of them. Each kind’s own type, `PageState` and the rest, is exported from the same entry point.',
});
