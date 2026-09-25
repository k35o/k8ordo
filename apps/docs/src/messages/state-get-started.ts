import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/state` は、状態を「どこに住むか」で宣言します。このページでは URL に置く状態を 1 つ定義し、インストールから、コンポーネントでの利用、サーバーでの読み取りまでを通して書きます。',
  en: '`@k8ordo/state` declares state by where it lives. This page defines one piece of URL state and follows it all the way through: installed, defined once, used from a component, read on the server.',
});

export const ideaTitle = message({
  ja: '考え方',
  en: 'The idea',
});

export const ideaDescription = message({
  ja: '状態を持つとき、ふつうは先にストアを選び、永続化や URL との同期はあとから足します。ここでは順番が逆で、最初に置き場所を決めます。置き場所が決まれば、寿命（いつ消えるか）と共有範囲（誰に見えるか）が決まります。境界を越えて値が戻ってくる置き場所（URL・履歴エントリ・localStorage・Cookie）はスキーマを 1 つずつ持ち、そこからサーバーでの読み取り・正規化されたリンク・古いデータのサルベージ・キー単位の購読が導かれます。メモリは境界を越えないので、スキーマを持たない型付きの箱です。',
  en: 'Usually you pick a store first and bolt persistence or URL syncing on later. Here the order is reversed: you name the place first. The place fixes the lifetime (when the values go away) and the reach (who sees them). Each place where values come back across a boundary — the URL, the history entry, localStorage, a cookie — has one schema, and from it derive the server-side read, canonical links, salvage of stale data and a per-key subscription. Memory never crosses a boundary, so it is a typed box with no schema.',
});

export const placeUrl = message({
  ja: '`definePageState` の `url` — URL の search params。リンクで共有でき、search を渡すルーターならサーバーで読めます。',
  en: 'The `url` slot of `definePageState` — the URL’s search params. Shareable as a link, and readable on the server under a router that hands it the search.',
});

export const placeEntry = message({
  ja: '`definePageState` の `entry` — 履歴エントリの隠れた状態。戻る・進むで復元されますが、URL には出ません。',
  en: 'The `entry` slot of `definePageState` — hidden history-entry state. Restored by back and forward, never in the URL.',
});

export const placeLocal = message({
  ja: '`defineLocalState` — localStorage。同じブラウザで開いたサイトのすべてのタブで共有され、消すまで残ります。',
  en: '`defineLocalState` — localStorage. Shared by every tab of the site in the same browser, kept until deleted.',
});

export const placeCookie = message({
  ja: '`defineCookieState` — Cookie。localStorage と同じくタブ間で共有され、リクエストごとにサーバーへ届くので、サーバーが実際の値で描けます。',
  en: '`defineCookieState` — a cookie. Shared across tabs like localStorage, and sent with every request, so the server renders the real value.',
});

export const placeMemory = message({
  ja: '`defineMemoryState` — JavaScript の実行環境。型付きの共有の箱で、リロードで初期値に戻ります。',
  en: '`defineMemoryState` — the JavaScript runtime. A typed shared box that resets on reload.',
});

export const ideaNoProvider = message({
  ja: 'Provider はありません。URL・履歴エントリ・localStorage・Cookie はもともとブラウザに 1 つずつしかなく、ストアはそれをそのまま映すので、区切る範囲がありません。',
  en: 'There is no Provider. The URL, the history entry, localStorage and the cookie jar each exist only once in the browser, and the stores mirror them one to one, so there is nothing to scope.',
});

export const ideaMore = message({
  ja: '置き場所の違いと選び方',
  en: 'How the places differ, and how to choose',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Installation',
});

export const installDescription = message({
  ja: 'zod と一緒にインストールします。スキーマはブラウザにも届くので、アプリがすでに classic の `zod` を読み込んでいるのでなければ、軽い `zod/mini` を使ってください。',
  en: 'Install it together with zod. The schema reaches the browser too, so reach for the lighter `zod/mini` unless the app already pays for classic `zod`.',
});

export const peersTitle = message({
  ja: 'peer dependencies',
  en: 'Peer dependencies',
});

export const peersPackage = message({
  ja: 'パッケージ',
  en: 'Package',
});

export const peersVersion = message({
  ja: 'バージョン',
  en: 'Version',
});

export const peersNeededFor = message({
  ja: '用途',
  en: 'Needed for',
});

export const peerReact = message({
  ja: '`useAppState`',
  en: '`useAppState`',
});

export const peerZod = message({
  ja: 'スキーマ。`zod` と `zod/mini` のどちらでも動きます',
  en: 'The schemas. Both `zod` and `zod/mini` work',
});

export const peerRouter = message({
  ja: '任意。`href` のパスをルート表で型付けするとき。型だけの依存で、実行時には読み込まれません',
  en: 'Optional. Typed `href` paths from the route table. Types only; never loaded at runtime',
});

export const peerTypes = message({
  ja: '任意。同梱の型定義',
  en: 'Optional. The shipped type declarations',
});

export const baselineNote = message({
  ja: 'ブラウザでは Navigation API を前提にします。Baseline の newly available に達している機能なので、polyfill もフォールバックもありません。',
  en: 'In the browser the Navigation API is assumed. It has reached Baseline newly available, so there is no polyfill and no fallback.',
});

export const defineTitle = message({
  ja: '定義を 1 か所に書く',
  en: 'Define it once',
});

export const defineDescription = message({
  ja: '定義は `use client` を付けないモジュールに置き、Server Component とクライアントコンポーネントの両方から import します。定義はスキーマと純粋な関数だけのデータでストアを持たないので、サーバーで import しても状態は生まれません。',
  en: 'Put the definition in a module without the `use client` directive and import it from Server Components and client components alike. A definition is plain data — schemas and pure functions — and holds no store, so importing it on the server creates no server-side state.',
});

export const defineWhyNoDirective = message({
  ja: '`use client` のファイルから export すると、Server Component には値ではなく client reference が届き、`parseUrl` も `href` も呼べません。',
  en: 'Exported from a `use client` file, it would reach a Server Component as a client reference instead of the value, and neither `parseUrl` nor `href` could be called.',
});

export const defineKey = message({
  ja: "第 1 引数の `'product-list'` は状態の識別子で、ストアの登録先や保存先の名前になります。同じ種類の定義どうしでキーが重なると 1 つのストアを黙って共有するので、アプリ全体のグローバル名として扱ってください。",
  en: "The first argument, `'product-list'`, is the state’s identity: it names the store and where the values are kept. Two definitions of the same kind sharing a key silently share one store, so treat it as an app-wide global name.",
});

export const defineAbsence = message({
  ja: 'URL のパラメータはいつでも欠けうるので、どのフィールドも欠けたまま読めなければなりません。`z._default()`（classic の zod では `.default()`）か `z.optional()` を付けます。付け忘れたフィールドは、モジュールの読み込み時にフィールド名付きのエラーになります。URL は文字列しか運ばないので、数値は `z.coerce.number()` で受けます。',
  en: 'A URL param can always be missing, so every field must parse from nothing: give it `z._default()` (`.default()` in classic zod) or `z.optional()`. A field without one throws when the module loads, naming the field. A URL carries only strings, so a number is read with `z.coerce.number()`.',
});

export const componentTitle = message({
  ja: 'コンポーネントで使う',
  en: 'Use it in a component',
});

export const componentDescription = message({
  ja: '`useAppState(definition)` はどの置き場所でも同じフックで、`[state, update]` を返します。`update()` の値は次の描画にすぐ反映され、URL への書き込みは同じハンドラの中の呼び出しをまとめて 1 回の遷移になります。',
  en: '`useAppState(definition)` is the same hook for every place and returns `[state, update]`. What `update()` writes shows in the very next render, and the URL write collapses every call in the same handler into one navigation.',
});

export const componentHistory = message({
  ja: "並び替えは既定の `replace` で現在のエントリを書き換え、ページ送りは戻るボタンで 1 ページずつ戻れるように `{ history: 'push' }` を渡しています。",
  en: "Sorting refines the current entry with the default `replace`; paging passes `{ history: 'push' }` so the back button walks back one page at a time.",
});

export const pageTitle = message({
  ja: 'ページに置く',
  en: 'Put it on a page',
});

export const pageDescription = message({
  ja: '`@k8ordo/static` や `@k8ordo/server` のページは Server Component です。リンクは `href` で組み立てます。指定しなかったフィールドは既定値として扱われ、既定値のフィールドはクエリから省かれるので、同じ状態はいつも同じ最短の URL になります。',
  en: 'A page under `@k8ordo/static` or `@k8ordo/server` is a Server Component. Build links with `href`: a field you leave out means its default, and fields at their default are left out of the query, so the same state always makes the same, shortest URL.',
});

export const pageSearch = message({
  ja: 'このフレームワークのページは search params を受け取りません（受け取るのは `params` と `pathname`、`@k8ordo/server` ではさらに `request`）。サーバーの描画は `url` スロットの既定値で行われ、ハイドレーションの次の描画から実際の URL の値に切り替わります。上の例で一覧の絞り込みをクライアントコンポーネントの中で行っているのはそのためです。',
  en: 'Pages under the framework never receive the search — they get `params` and `pathname`, plus `request` under `@k8ordo/server`. The server render uses the `url` slot’s defaults, and the live URL takes over one render after hydration, which is why the filtering above happens inside the client component.',
});

export const serverTitle = message({
  ja: 'サーバーで読む',
  en: 'Read it on the server',
});

export const serverDescription = message({
  ja: 'ページに search params を渡すルーター（たとえば Next.js の App Router）の下では、`parseUrl` で型付きに読めます。欠けたパラメータには既定値が入り、スキーマが受け付けない値はそのフィールドだけが既定値に戻ります。読み取りが throw することはありません。',
  en: 'Under a router that hands a page its search params — the Next.js App Router, for example — `parseUrl` reads them typed. Missing params get their defaults, a value the schema rejects falls back to that field’s own default, and reading never throws.',
});

export const serverExample = message({
  ja: "たとえば `?q=shoes&page=0` は `{ q: 'shoes', page: 1, sort: 'new' }` として読まれます。",
  en: "For example, `?q=shoes&page=0` reads as `{ q: 'shoes', page: 1, sort: 'new' }`.",
});

export const serverInitialUrl = message({
  ja: '読んだ値を `initialUrl` として渡し、下のように `ProductList` の中で `useAppState(productListState, { initialUrl })` に渡すと、サーバーの描画とハイドレーションの描画も実際の値で行われ、既定値からのちらつきが出ません。',
  en: 'Pass what you read down as `initialUrl` and on to `useAppState(productListState, { initialUrl })` inside `ProductList`, as below, and the server render and the hydration render show the real values instead of flashing the defaults.',
});

export const serverMore = message({
  ja: 'サルベージの規則、`initialUrl`、型付きのリンク',
  en: 'Salvage rules, `initialUrl`, typed links',
});

export const routerTitle = message({
  ja: 'ルーターに求めること',
  en: 'What the router must do',
});

export const routerDescription = message({
  ja: 'URL を書き換える `update()` は `navigation.navigate()` を呼びます。これをページの読み込みではなく状態の変更として扱うには、Navigation API の `navigate` イベントを intercept するルーターが要ります。`@k8ordo/router` はそういうルーターで、`@k8ordo/static` と `@k8ordo/server` のページもその上で動きます。pathname が変わらない遷移はページの切り替えではなく状態の変更として処理され、何も再マウントされず、スクロールもフォーカスも動きません。',
  en: 'An `update()` that changes the URL calls `navigation.navigate()`. For that to be a state change rather than a page load, a router has to intercept the Navigation API’s `navigate` event. `@k8ordo/router` is one, and pages under `@k8ordo/static` and `@k8ordo/server` run on it: a navigation that keeps the pathname is handled as a state change, not a page change — nothing remounts, and neither scroll nor focus moves.',
});

export const routerElse = message({
  ja: 'クライアントでのそれ以外の操作はルーターを問いません。`href` のリンク、GET フォーム、`entry` のフィールドだけを変える更新、localStorage とメモリの更新は、どのルーターの下でも動きます。',
  en: 'Everything else on the client works under any router: `href` links, GET forms, and updates that change only `entry` fields, localStorage or memory.',
});

export const routerLinkRouter = message({
  ja: '@k8ordo/router',
  en: '@k8ordo/router',
});

export const routerLinkIntegrations = message({
  ja: 'ほかのルーターとの組み合わせ',
  en: 'Working with other routers',
});

export const nextTitle = message({
  ja: '次に読む',
  en: 'Next steps',
});

export const nextPlaces = message({
  ja: '置き場所 — それぞれの置き場所と、スキーマの規則',
  en: 'Places — each place, and the schema rules',
});

export const nextReading = message({
  ja: '読み取りとリンク — `parseUrl`・`parseCookies`・`href`・型付きルート・ハイドレーション前の読み取り',
  en: 'Reading & links — `parseUrl`, `parseCookies`, `href`, typed routes, reading before hydration',
});

export const nextUpdates = message({
  ja: '更新 — `update()` のまとめ方・ハンドル・購読の粒度',
  en: 'Updates — batching, handles and subscription granularity',
});

export const nextIntegrations = message({
  ja: '組み合わせ — ルーター・GET フォーム・`@k8ordo/color-scheme`・テスト',
  en: 'Integrations — routers, GET forms, `@k8ordo/color-scheme`, testing',
});
