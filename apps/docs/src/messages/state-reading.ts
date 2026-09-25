import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページに search を渡すルーターの下では、サーバーが `url` スロットを `parseUrl` で読みます。リクエストの Cookie を受け取るページでは、Cookie に置いた状態を `parseCookies` で読みます。リンクは定義から組み立てます。Web Storage の値も、ハイドレーションより前に読めます。',
  en: 'Under a router that hands a page its search, the server reads the `url` slot with `parseUrl`; where a page receives the request’s cookies, it reads cookie state with `parseCookies`. Links are built from the definition, and Web Storage values can be read before hydration, too.',
});

export const parseTitle = message({
  ja: '`parseUrl`',
  en: '`parseUrl`',
});

export const parseDescription = message({
  ja: '`parseUrl(input)` は `url` スロットを読み、スキーマの出力型の値を返します。`input` は `URLSearchParams` か、フレームワークがページに渡すオブジェクトの形（`Record<string, string | string[] | undefined>`、型は `UrlInput`）です。宣言していないパラメータは無視されます。',
  en: '`parseUrl(input)` reads the `url` slot and returns a value of the schema’s output type. `input` is a `URLSearchParams` or the object shape frameworks hand a page (`Record<string, string | string[] | undefined>`, typed as `UrlInput`). Params the schema does not declare are ignored.',
});

export const parseTableIntro = message({
  ja: '上の定義で、クエリ文字列は次のように読まれます。',
  en: 'With the definition above, query strings read like this:',
});

export const parseTable = {
  query: message({ ja: 'クエリ', en: 'Query' }),
  result: message({ ja: '`parseUrl` の結果', en: '`parseUrl` returns' }),
  why: message({ ja: '理由', en: 'Why' }),
  empty: message({ ja: '（なし）', en: '(none)' }),
  emptyWhy: message({
    ja: 'すべてのフィールドが既定値',
    en: 'Every field at its default',
  }),
  coerceWhy: message({
    ja: '`"3"` は `z.coerce.number()` で `3` になる',
    en: '`"3"` is coerced to `3`',
  }),
  unreadableWhy: message({
    ja: '読めない `page` だけが既定値に戻る',
    en: 'Only the unreadable `page` falls back',
  }),
  constraintWhy: message({
    ja: '制約（`z.gte(1)`）の違反も同じ扱い',
    en: 'A constraint violation (`z.gte(1)`) is treated the same',
  }),
  intWhy: message({
    ja: '`z.int()` の違反',
    en: 'Fails `z.int()`',
  }),
  arrayWhy: message({
    ja: '繰り返したパラメータが配列に集まる',
    en: 'Repeated params collect into the array',
  }),
  firstWhy: message({
    ja: '配列でないフィールドは最初の値',
    en: 'A non-array field takes the first value',
  }),
  enumWhy: message({
    ja: '列挙に無い値は既定値に戻る',
    en: 'A value outside the enum falls back',
  }),
  undeclaredWhy: message({
    ja: '宣言していないパラメータは無視',
    en: 'Undeclared params are ignored',
  }),
};

export const parseRecord = message({
  ja: "オブジェクトの形でも同じです。`parseUrl({ q: 'shoes', tags: ['sale', 'new'] })` は `{ q: 'shoes', page: 1, tags: ['sale', 'new'], sort: 'new' }` を返します。戻り値の型は `{ q: string; page: number; tags: string[]; sort: 'new' | 'price' }` です。",
  en: "The object shape reads the same way: `parseUrl({ q: 'shoes', tags: ['sale', 'new'] })` returns `{ q: 'shoes', page: 1, tags: ['sale', 'new'], sort: 'new' }`, typed as `{ q: string; page: number; tags: string[]; sort: 'new' | 'price' }`.",
});

export const salvageTitle = message({
  ja: 'フィールド単位のサルベージ',
  en: 'Salvage, field by field',
});

export const salvageDescription = message({
  ja: 'まずスキーマ全体で解析し、失敗したときだけフィールドごとに解析し直します。受け付けられないフィールドは自分の既定値に戻り、ほかのフィールドは読めた値を保ちます。1 つの壊れた値がほかを巻き込むことはなく、読み取りが throw することもありません。',
  en: 'The whole schema parses first; only when that fails does each field parse on its own. A field the schema rejects falls back to its own default and the others keep what they read, so one broken value does not take the rest down, and reading never throws.',
});

export const salvageArray = message({
  ja: '配列は 1 つのフィールドです。要素が 1 つでも受け付けられなければ、配列全体が既定値の `[]` に戻ります。',
  en: 'An array is one field: if any element is rejected, the whole array falls back to its default `[]`.',
});

export const salvageRefine = message({
  ja: 'フィールドごとの解析には、オブジェクト全体への `refine` が見えません。そこでサルベージした組み合わせを最後にスキーマ全体で確かめ、`refine` が拒むなら全体を既定値に戻します。',
  en: 'Per-field parsing cannot see an object-level `refine`. So the salvaged combination is checked against the whole schema at the end, and if the `refine` rejects it, everything falls back to the defaults.',
});

export const salvageTable = {
  asWritten: message({ ja: '書かれたとおり', en: 'As written' }),
  maxAlone: message({
    ja: '`max` だけが既定値に戻り、組み合わせも成り立つ',
    en: '`max` falls back alone, and the combination still holds',
  }),
  maxBreaks: message({
    ja: '`max` を既定値に戻すと `min <= max` が崩れるので、全体が既定値',
    en: 'With `max` back at its default, `min <= max` fails, so everything falls back',
  }),
  combination: message({
    ja: 'どちらのフィールドも正しいが、組み合わせが `refine` に反する',
    en: 'Each field is valid; the combination is not',
  }),
  minAlone: message({
    ja: '`min` だけが既定値に戻る',
    en: 'Only `min` falls back',
  }),
};

export const salvageSame = message({
  ja: '同じサルベージは、エントリ状態・Web Storage の行・Cookie・`definePageState`・`defineLocalState`・`defineSessionState`・`defineCookieState` の `update()` に渡した値にも適用されます。',
  en: 'The same salvage applies to entry state, to Web Storage rows, to cookies, and to the values passed to `update()` on `definePageState`, `defineLocalState`, `defineSessionState` and `defineCookieState`.',
});

export const frameworkTitle = message({
  ja: '`@k8ordo/static`・`@k8ordo/server` のページ',
  en: 'Pages under `@k8ordo/static` and `@k8ordo/server`',
});

export const frameworkDescription = message({
  ja: 'このフレームワークのページは search params を受け取りません。受け取るのは `params` と `pathname`（`@k8ordo/server` ではさらに、ヘッダーと Cookie を持つ `request`。Cookie の状態はここから読めます）です。pathname はルーターのもので、search は `useAppState` がブラウザで読みます。',
  en: 'Pages under the framework never see the search. They receive `params` and `pathname` — plus a `request` with headers and cookies under `@k8ordo/server`, which is where cookie state is read. The pathname is the router’s, and the search is read in the browser by `useAppState`.',
});

export const frameworkWhy = message({
  ja: 'サーバーの描画は `url` スロットの既定値で行われ、ハイドレーションの次の描画から実際の URL が使われます。これは回避すべき欠落ではありません。ルーターは pathname が変わらない遷移を何も読み込まずに intercept するので、search に依存したサーバーの描画は、最初の読み込みでは正しくても、最初の `update()` の後には古くなります。',
  en: 'The server render uses the `url` slot’s defaults, and the live URL takes over one render after hydration. That is not a gap to work around: the router intercepts a navigation that keeps the pathname without loading anything, so a server render keyed on the search would be right on the first load and stale after the first `update()`.',
});

export const frameworkLinks = message({
  ja: '`href` と `search` は純粋な関数なので、この制約を受けず、Server Component でもそのまま使えます。',
  en: '`href` and `search` are pure functions, so none of this affects them; they run in a Server Component as they are.',
});

export const cookieTitle = message({
  ja: '`parseCookies` と `initialCookie`',
  en: '`parseCookies` and `initialCookie`',
});

export const cookieDescription = message({
  ja: '`defineCookieState` の値は Cookie に入っていて、リクエストごとにサーバーへ届きます。`@k8ordo/server` のページとレイアウトが受け取る `request.cookies` を `parseCookies` に渡すと、スキーマの出力型の値が返ります。それをクライアントコンポーネントに渡して `useAppState` の `initialCookie` にすると、サーバーの描画とハイドレーションの描画が実際の値で行われ、既定値がちらつきません。',
  en: 'A `defineCookieState` keeps its values in a cookie, which every request carries to the server. Hand `parseCookies` the `request.cookies` that `@k8ordo/server` gives a page or a layout and it returns a value of the schema’s output type. Pass that down to a client component as `useAppState`’s `initialCookie`, and the server render and the hydration render show the real values instead of flashing the defaults.',
});

export const cookieInput = message({
  ja: '`parseCookies` が受け取るのは、値がパーセントデコード済みの `ReadonlyMap<string, string>` で、`request.cookies` がそのまま渡せます。Cookie が無い・JSON が壊れている・スキーマが受け付けない値は、フィールドごとに既定値に戻ります。',
  en: '`parseCookies` takes a `ReadonlyMap<string, string>` of percent-decoded values, which is exactly what `request.cookies` is. A missing cookie, corrupt JSON, or a value the schema rejects falls back to the defaults, field by field.',
});

export const cookieSeedEach = message({
  ja: '`initialCookie` が効くのは、渡した `useAppState` だけです。サーバーで描かれるのに受け取っていないコンポーネントは、サーバーでは既定値を描きます。レイアウトのような上の方で一度読み、下へ渡してください。',
  en: '`initialCookie` seeds only the `useAppState` call it is passed to; a component that renders on the server without it shows the defaults there. Read the cookie once, high up — in a layout, say — and pass it down.',
});

export const cookieStatic = message({
  ja: '`@k8ordo/static` ではページがリクエストを受け取らないので、サーバーの描画は既定値で行われ、ハイドレーションの後に Cookie の値に置き換わります。localStorage と同じ振る舞いです。',
  en: 'Under `@k8ordo/static` a page receives no request, so the server render shows the defaults and the cookie takes over after hydration — the same as localStorage.',
});

export const cookieWriteTitle = message({
  ja: 'サーバーから書く Cookie との関係',
  en: 'Cookies the server writes',
});

export const cookieWriteSecret = message({
  ja: '`defineCookieState` はブラウザが書く Cookie なので、`HttpOnly` にはできません。セッションのような秘密の Cookie は、リクエストに答える場所（`@k8ordo/server` の `guard.ts`・`route.ts`・Server Action）でフレームワークの `cookies()` を使って `HttpOnly` で書きます。ページは描画なので、応答に Cookie を書くことはできません。',
  en: 'A `defineCookieState` is a cookie the browser writes, so it can never be `HttpOnly`. A secret cookie such as a session is written `HttpOnly` with the framework’s `cookies()`, from the places that answer a request — `guard.ts`, `route.ts` and Server Actions under `@k8ordo/server`. A page is a render and never writes cookies onto the response.',
});

export const cookieWriteSame = message({
  ja: '同じ `cookies()` で Cookie の状態を書くこともできます（JavaScript 無しで好みを変えるフォームなど）。名前は `cookieName`、値は `cookieValue(values)` が返すもので、属性は `Path=/`・`SameSite=Lax`・`Max-Age=34560000` にそろえ、`HttpOnly` は付けません。付けるとブラウザのストアから見えなくなります。開いているタブには `change` イベントで届きます。',
  en: 'The same `cookies()` can write a cookie state as well — for a form that changes a preference without JavaScript, say. The name is `cookieName`, the value is what `cookieValue(values)` returns, and the attributes match the browser’s: `Path=/`, `SameSite=Lax`, `Max-Age=34560000`, and never `HttpOnly`, which would hide it from the browser store. Open tabs take it in through the `change` event.',
});

export const initialTitle = message({
  ja: '読んだ値を最初の描画に渡す',
  en: 'Seeding the first render',
});

export const initialDescription = message({
  ja: 'ページに search を渡すルーター（Next.js の App Router など）では、`parseUrl` の結果をクライアントコンポーネントに渡し、`useAppState` の `initialUrl` にします。サーバーの描画とハイドレーションの描画が実際の URL の値で行われ、既定値からのちらつきが出ません。',
  en: 'Under a router that hands a page its search — the Next.js App Router, for example — pass what `parseUrl` returned down to the client component and give it to `useAppState` as `initialUrl`. The server render and the hydration render then show the real URL values instead of flashing the defaults.',
});

export const initialType = message({
  ja: '`initialUrl` を受け取れるのは `url` スロットを持つ `definePageState` だけです。エントリの値はサーバーに存在しないので、常に既定値から始まります。props の型は `OutputOf<typeof catalogState.url>` で書けます。',
  en: 'Only a `definePageState` with a `url` slot accepts `initialUrl`. The entry slot has no server-side source and always starts from its defaults. The prop’s type is `OutputOf<typeof catalogState.url>`.',
});

export const initialRouter = message({
  ja: 'Navigation API を intercept しないルーターでは、URL を書き換える `update()` はドキュメントの読み込みになります。そこでの URL の変更は、リンクと GET フォームで行うのが向いています。',
  en: 'On a router that does not intercept the Navigation API, an `update()` that changes the URL is a full document load; there, links and GET forms are the better way to change the URL.',
});

export const initialRouterLink = message({
  ja: 'ルーターとの組み合わせ',
  en: 'Working with routers',
});

export const hrefTitle = message({
  ja: '`href` と `search`',
  en: '`href` and `search`',
});

export const hrefDescription = message({
  ja: '`href(base, values?)` はリンクを組み立てます。指定しなかったフィールドは既定値として扱われ、既定値のフィールドはクエリから省かれます。同じ状態からはいつも同じ最短の URL ができるので、リンク・ブックマーク・キャッシュが一致します。',
  en: '`href(base, values?)` builds a link. A field you leave out means its default, and fields at their default are left out of the query, so the same state always yields the same, shortest URL — links, bookmarks and caches agree.',
});

export const hrefTable = {
  call: message({ ja: '呼び出し', en: 'Call' }),
  result: message({ ja: '結果', en: 'Returns' }),
  emptyString: message({ ja: '空文字列', en: 'An empty string' }),
};

export const hrefOrder = message({
  ja: 'パラメータはスキーマで宣言した順に並び、値は `URLSearchParams` の規則でエンコードされます（空白は `+`）。',
  en: 'Params follow the order the schema declares them in and are encoded by `URLSearchParams` rules (a space becomes `+`).',
});

export const hrefSpread = message({
  ja: "指定しないフィールドは既定値になるので、`href('/catalog', { page: 2 })` は今の検索語を落とします。一部だけを変えて残りを保つリンクは、今の状態を展開してから上書きします。",
  en: "Because a field you leave out means its default, `href('/catalog', { page: 2 })` drops the current search term. A link that changes one field and keeps the rest spreads the current state first.",
});

export const hrefPager = message({
  ja: '`@k8ordo/router` の下では素の `<a>` がクライアント遷移なので、このリンクも pathname の変わらない状態の変更として処理されます。リンクのクリックは `push` です。',
  en: 'Under `@k8ordo/router` a plain `<a>` is a client navigation, so this link too is handled as a state change that keeps the pathname. A link click pushes.',
});

export const hrefThrows = message({
  ja: 'URL に書けない値（`Date` など）を渡すと、`href` と `search` は throw します。',
  en: 'Given a value a URL cannot hold, such as a `Date`, `href` and `search` throw.',
});

export const hrefType = message({
  ja: '戻り値の型にはパスのリテラルが残るので、型付きルートの検査がクエリを取り除いてパスを確かめられます。',
  en: 'The return type keeps the path literal, which is what lets a typed-route check strip the query and verify the path.',
});

export const searchDescription = message({
  ja: '`search(values?)` はクエリ文字列だけ（`?` なし）を返します。パスを自分で組み立てるとき、たとえばルート表に無いファイルのダウンロードに同じ条件を付けるときに使います。',
  en: '`search(values?)` returns the query string alone, with no `?`. Use it when the path is yours to compose — a file download outside the route table, for instance.',
});

export const entryOnlyLinks = message({
  ja: '`entry` だけの定義では、`href` は `base` をそのまま返し、`search` は空文字列を返します。',
  en: 'For an entry-only definition, `href` returns `base` unchanged and `search` returns an empty string.',
});

export const typedTitle = message({
  ja: '型付きルート',
  en: 'Typed routes',
});

export const typedDescription = message({
  ja: '`Register` を一度だけ拡張すると、アプリの中のすべての `href` が、ルーターの知らないパスを拒むようになります。`@k8ordo/router` の拡張と同じ 1 行です。',
  en: 'Augment `Register` once and every `href` in the app rejects a path its router does not know. It is the same line as the `@k8ordo/router` augmentation.',
});

export const typedParam = message({
  ja: '`:param` の区間には任意の文字列が入るので、`/products/:id` には `/products/42` を渡せます。',
  en: 'A `:param` segment takes any string, so `/products/:id` accepts `/products/42`.',
});

export const typedWildcard = message({
  ja: '`*` のワイルドカードは照合には使われますが、リンク先にはなりません。',
  en: 'A `*` wildcard is matched, never linked.',
});

export const typedRuntime = message({
  ja: 'パスの型は `@k8ordo/router` の `RouteOf` から型だけで導かれるので、ルーターは任意の peer のままで、実行時には読み込まれません。',
  en: 'The path union comes from `RouteOf` in `@k8ordo/router` as a type only, so the router stays an optional peer and is never loaded at runtime.',
});

export const typedFramework = message({
  ja: '`@k8ordo/static` と `@k8ordo/server` では、アプリ自身の `package.json` の `dependencies` か `devDependencies` に `@k8ordo/state` があれば、この拡張が `routes/` から `.k8ordo/register.gen.ts` に生成されます（推移的な依存は数えません）。生成された宣言と重なるので、そこでは手書きしないでください。',
  en: 'Under `@k8ordo/static` and `@k8ordo/server` this augmentation is generated into `.k8ordo/register.gen.ts` from `routes/` when the application’s own `package.json` lists `@k8ordo/state` in `dependencies` or `devDependencies` — a transitive dependency does not count. Do not hand-write it there: it would duplicate the generated declaration.',
});

export const typedPath = message({
  ja: '表を持たないルーターでは、そのルーターのパスの union を `path` に登録します。Next.js なら `next` の `Route` です。',
  en: 'A router without a table registers its own path union under `path` — `Route` from `next`, for instance.',
});

export const typedRules = message({
  ja: '両方があれば `routes` が優先され、どちらも無ければ `/` で始まる任意の文字列が通ります。解決されたパスの型は `RegisteredPath` として export されています。拡張はアプリケーションでだけ行ってください。共有ライブラリが拡張すると、その制約がすべての利用者に漏れます。',
  en: 'When both are present, `routes` wins; with neither, any `/`-prefixed string is accepted. The resolved path type is exported as `RegisteredPath`. Augment only in an application — a shared library that augments `Register` leaks its constraint to every consumer.',
});

export const beforeTitle = message({
  ja: 'ハイドレーション前に読む',
  en: 'Reading before hydration',
});

export const beforeDescription = message({
  ja: '最初の描画より前に要る値があります。`<html>` に付ける表示密度の属性や、既定値で一瞬表示されてはいけないカラースキームです。`useAppState` はハイドレーションの後に動くので間に合わず、かといってインラインスクリプトにキーと JSON の形を文字列で手書きすると、どちらかが変わった時点でずれます。',
  en: 'Some values are needed before the first paint: a density attribute on `<html>`, say, or a colour scheme that must not flash its default. `useAppState` runs after hydration, which is too late, and an inline script with the storage key and the JSON shape hand-written into a string drifts the moment either changes.',
});

export const beforeApi = message({
  ja: '`defineLocalState` と `defineSessionState` の定義はその両方を持っています。`storageKey` はストアが書き込むキーで、`inlineRead()` はインラインの `<script>` に埋め込む JavaScript の式を返します。この式は、ブラウザでその定義の置き場所（localStorage か sessionStorage）に保存されたオブジェクトに評価されます。',
  en: 'A `defineLocalState` or `defineSessionState` definition carries both halves. `storageKey` is the key the store writes under, and `inlineRead()` returns a JavaScript expression for an inline `<script>` that evaluates, in the browser, to the object stored in the definition’s own area — localStorage or sessionStorage.',
});

export const beforeNull = message({
  ja: '次のときは throw せず、`null` になります。',
  en: 'It evaluates to `null`, without throwing, when:',
});

export const beforeNullNothing = message({
  ja: '何も保存されていない',
  en: 'nothing is stored',
});

export const beforeNullCorrupt = message({
  ja: 'JSON が壊れている',
  en: 'the JSON is corrupt',
});

export const beforeNullNotObject = message({
  ja: '値がオブジェクトではない（数値・文字列・配列・`null`）',
  en: 'the value is not an object (a number, a string, an array, `null`)',
});

export const beforeNullBlocked = message({
  ja: 'ストレージ自体が読めない',
  en: 'storage itself cannot be read',
});

export const beforeUntrusted = message({
  ja: 'そこではまだどのモジュールも読み込まれていないので、スキーマは走りません。返るのはサルベージ済みの状態ではなく、保存された生の行です。信頼せず、必要なフィールドだけを、それぞれフォールバック付きで読んでください。上の例が `density` が `"compact"` かどうかだけを確かめているのはそのためです。',
  en: 'No module has loaded yet, so the schema does not run: what comes back is the raw stored row, not the salvaged state `useAppState` will show. Treat it as untrusted and read only the fields you need, each with its own fallback — which is why the example checks nothing but whether `density` is `"compact"`.',
});

export const beforeEscape = message({
  ja: 'キーは `<` も含めてスクリプトの文脈向けにエスケープされるので、どんなキーでも安全に埋め込めます。式は即時実行関数なので、代入の右辺・引数・三項演算子など、どの位置にも置けます。',
  en: 'The key is escaped for a script context, `<` included, so any key is safe to emit. The expression is a self-invoking function, so it fits any position: the right-hand side of an assignment, an argument, a ternary.',
});

export const beforeAfter = message({
  ja: 'ハイドレーションの後は、ストアを正とします。スクリプトは React より先に `<html>` の属性を変えるので、`<html>` には `suppressHydrationWarning` を付けます。その属性をハイドレーションの描画で消さずに保ち続ける書き方は、`@k8ordo/color-scheme` の実装がそのまま例になります。',
  en: 'After hydration the store is the source of truth. The script changes an attribute on `<html>` before React sees it, so `<html>` carries `suppressHydrationWarning`. `@k8ordo/color-scheme` is a worked example of keeping the attribute in step without the hydration render undoing what the script did.',
});

export const beforeAfterLink = message({
  ja: '@k8ordo/color-scheme の仕組み',
  en: 'How @k8ordo/color-scheme works',
});
