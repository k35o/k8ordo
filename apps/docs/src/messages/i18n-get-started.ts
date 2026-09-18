import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/i18n` はアプリケーションのロケール軸を持つパッケージです。このページでは、ロケール集合を 1 か所で定義して `[locale]` 区間に結び、最初の文言を Server Component と Client Component の両方で描くまでを順に進めます。',
  en: '`@k8ordo/i18n` owns the locale axis of an application. This page defines the locale set in one place, ties it to the `[locale]` segment, and renders a first message from a Server Component and from a Client Component.',
});

export const scope = {
  title: message({
    ja: '担当する範囲',
    en: 'What it owns',
  }),
  description: message({
    ja: 'どのロケールがあり、どれが既定か。この一覧に依存するものを、`defineLocales` が返す 1 つの値から導きます。',
    en: 'Which locales exist, and which one is the default. Everything that depends on that list comes from the one value `defineLocales` returns.',
  }),
  set: message({
    ja: 'ロケール集合と既定のロケール。所属判定と BCP 47 の検査も含みます。',
    en: 'The locale set and its default, including membership and the BCP 47 check.',
  }),
  segment: message({
    ja: 'URL の先頭区間（`/ja/…`）。区間を付け外しする `localize` / `delocalize` と、`[locale]` ルートの `paramsSchema` を出します。',
    en: 'The first URL segment (`/ja/…`): `localize` / `delocalize` to put it on and take it off, and the `paramsSchema` of the `[locale]` route.',
  }),
  negotiation: message({
    ja: '`navigator.languages` や `Accept-Language` からの交渉。',
    en: 'Negotiation from `navigator.languages` or `Accept-Language`.',
  }),
  current: message({
    ja: '描画中のロケール。サーバーではリクエストが受理した区間、ブラウザでは URL です。',
    en: 'The locale of the render in progress: the segment the request accepted on the server, the URL in the browser.',
  }),
  messages: message({
    ja: '文言。`message()` で 1 つずつ宣言する関数で、呼ばれた場所のロケールで文字列を返します。',
    en: 'Messages: functions declared one at a time with `message()`, each returning its text in the locale where it is called.',
  }),
  notOwnedTitle: message({
    ja: '持たないもの',
    en: 'What it does not own',
  }),
  notPathname: message({
    ja: 'pathname。ロケール区間より後ろは `@k8ordo/router` のものです。',
    en: 'The pathname. Everything after the locale segment belongs to `@k8ordo/router`.',
  }),
  notGrammar: message({
    ja: '文言の文法。プレースホルダ記法も ICU もありません。値の埋め込みはテンプレートリテラル、複数形は `Intl.PluralRules`、日付と数値は `Intl` の書式化で書きます。',
    en: 'A message grammar. There is no placeholder syntax and no ICU: interpolation is a template literal, plurals are `Intl.PluralRules`, and dates and numbers are `Intl` formatters.',
  }),
  notLoading: message({
    ja: '読み込み。文言は普通の export なので、どの文言がブラウザに届くかは、各 Client Component が何を import したかからバンドラが決めます。ローダーも名前空間の一覧もありません。',
    en: 'Loading. Messages are ordinary exports, so which of them reach the browser is decided by the bundler from what each Client Component imports. There is no loader and no namespace list.',
  }),
  why: message({
    ja: 'ロケールを URL に置くので、ブラウザ側に同期すべき状態がありません。言語を変えることは、同じ pathname を別の区間の下へ移動することです。文言を関数にするので、引数は TypeScript が検査し、呼ばれない文言はバンドラが落とします。',
    en: 'Because the locale lives in the URL, the browser holds no state to keep in sync: changing language is navigating to the same pathname under another segment. Because a message is a function, TypeScript checks its arguments and the bundler drops the ones nobody calls.',
  }),
};

export const install = {
  title: message({
    ja: 'インストール',
    en: 'Installation',
  }),
  description: message({
    ja: 'ランタイムの依存はありません。React もスキーマライブラリも import しないので、peer dependency は同梱の型定義を読む TypeScript だけです。',
    en: 'It has no runtime dependencies. It imports neither React nor a schema library, so the only peer dependency is TypeScript, for the shipped type declarations.',
  }),
  packageColumn: message({
    ja: 'パッケージ',
    en: 'Package',
  }),
  versionColumn: message({
    ja: 'バージョン',
    en: 'Version',
  }),
  neededForColumn: message({
    ja: '用途',
    en: 'Needed for',
  }),
  typescript: message({
    ja: '同梱の型定義（省略可）',
    en: 'The shipped type declarations (optional)',
  }),
  runtime: message({
    ja: 'サーバーでは、描画中のロケールを `node:async_hooks` の `AsyncLocalStorage` に載せます。import ではなく `process.getBuiltinModule` で取り出すので、同じビルドがブラウザでもそのまま動きます（フレームワークの 2 つのモードは Node 24 以降を求めます）。`process.getBuiltinModule` の無いランタイムでは、`paramsSchema` はロケールを受理しても描画に結び付けられません。サーバーの描画は既定のロケールになり、`run` は throw します。',
    en: 'On a server the current locale rides on `AsyncLocalStorage` from `node:async_hooks`. It is reached through `process.getBuiltinModule` rather than an import, so the same build runs unchanged in the browser (the framework modes require Node 24). In a runtime without `process.getBuiltinModule`, `paramsSchema` still accepts the locale but cannot scope it to the render: server renders fall back to the default, and `run` throws.',
  }),
};

export const defineSet = {
  title: message({
    ja: 'ロケール集合を 1 か所で定義する',
    en: 'Define the locale set once',
  }),
  description: message({
    ja: 'ロケールの一覧を書くのはこのモジュールだけです。`[locale]` のスキーマ、静的化のパス展開、言語切替、`/` の振り分け、全文言の型は、どれもここから読みます。',
    en: 'This module is the only place the list is spelled. The `[locale]` schema, the static path expansion, the language switcher, the `/` redirect and the type of every message all read from it.',
  }),
  default: message({
    ja: "先頭のロケールが既定値です。別のロケールを既定にするときは `defineLocales(['en', 'ja'], { default: 'ja' })` と書きます。既定値は、交渉で何も一致しなかったときと、何もロケールを指名していないときに使われます。",
    en: "The first locale is the default. To make another one the default, write `defineLocales(['en', 'ja'], { default: 'ja' })`. The default is used when negotiation finds nothing and when nothing names a locale.",
  }),
  register: message({
    ja: '`Register` にロケールを載せるのは 1 回だけです。載せた後は、すべての `message()` がこのロケールの和集合に照らして検査されます。`Register` はマージされるための型なので、`type` ではなく `interface` で書きます。',
    en: '`Register` is merged once. From then on every `message()` is checked against this union of locales. It is an `interface` rather than a `type` because it exists to be merged.',
  }),
  more: message({
    ja: 'ロケール集合が返すものと、交渉の規則を読む',
    en: 'Read what the set returns, and how negotiation works',
  }),
};

export const segment = {
  title: message({
    ja: '`[locale]` 区間に結ぶ',
    en: 'Tie it to the `[locale]` segment',
  }),
  description: message({
    ja: 'すべてのページを `src/routes/[locale]/` の下に置き、その区間のレイアウトから集合の `paramsSchema` を export します。ルートの `paramsSchema` を走らせるのは `@k8ordo/static` と `@k8ordo/server` です。スキーマライブラリは要りません。集合自身が Standard Schema の形でスキーマを出します。',
    en: "Put every page under `src/routes/[locale]/` and export the set's `paramsSchema` from that segment's layout; `@k8ordo/static` and `@k8ordo/server` are what run a route's `paramsSchema`. No schema library is needed: the set produces a Standard Schema itself.",
  }),
  refuses: message({
    ja: '一覧に無いロケールは受理されません。`/fr/…` はこのパターンが答えない pathname になり、最後は `not-found.tsx` が本物の 404 で答えます。',
    en: 'A locale outside the list is refused. `/fr/…` becomes a pathname this pattern does not answer, and in the end `not-found.tsx` answers it under a real 404.',
  }),
  accepts: message({
    ja: '受理したロケールは、そのリクエストの描画の間ずっと現在のロケールになります。Server Component も、HTML を作るためにサーバーで走る Client Component も、同じロケールで文言を読みます。',
    en: "The accepted locale becomes the current one for the rest of that request's render: Server Components, and the Client Components that run on the server to produce the HTML, read their messages in it.",
  }),
  serverFile: message({
    ja: "このファイルに `'use client'` を付けてはいけません。Client モジュールから export した値は、スキーマとしてではなく client reference としてハンドラに届くからです。フックを使う枠が必要なら、`_parts/` の Client Component に分けてレイアウトから描きます。",
    en: "This file must not be `'use client'`: a value exported from a client module reaches the handler as a client reference, not as a schema. If the frame needs hooks, move it into a Client Component under `_parts/` and render that from the layout.",
  }),
  more: message({
    ja: 'サーバーとブラウザでロケールがどこから来るかを読む',
    en: 'Read where the locale comes from on each side',
  }),
};

export const firstMessage = {
  title: message({
    ja: '最初の文言',
    en: 'A first message',
  }),
  description: message({
    ja: '文言は 1 つずつ export します。値を取る文言は、そのロケールの文を返す関数です。',
    en: 'Each message is its own export. A message that takes values is a function returning the text for its locale.',
  }),
  args: message({
    ja: '引数の型は `ja` に注釈した関数から決まり、`en` もその型に縛られます。どちらかのロケールを書き忘れると、宣言の時点でコンパイルが通りません。',
    en: 'The argument type comes from the function annotated for `ja`, and `en` is held to that type. Leave out either locale and the declaration does not compile.',
  }),
  serverTitle: message({
    ja: 'Server Component から描く',
    en: 'From a Server Component',
  }),
  serverDescription: message({
    ja: '呼ぶだけです。サーバーでは、`[locale]` のスキーマがこのリクエストで受理したロケールの文が返ります。',
    en: 'Call it. On the server it returns the text for the locale the `[locale]` schema accepted for this request.',
  }),
  clientTitle: message({
    ja: 'Client Component から描く',
    en: 'From a Client Component',
  }),
  clientDescription: message({
    ja: '書き方は同じです。Provider も hook もありません。ブラウザでは URL の先頭区間がロケールなので、`/en/…` を開いていれば英語の文が返ります。',
    en: 'The same line. There is no provider and no hook. In the browser the first segment of the URL is the locale, so on `/en/…` it returns the English text.',
  }),
  boundary: message({
    ja: 'Server Component から Client Component へ文言を props で渡すときは、呼んだ結果の文字列を渡します。関数は Server Component の境界を越えられません。',
    en: 'When a Server Component hands text to a Client Component as a prop, it passes the string it got by calling the message: a function does not cross the Server Component boundary.',
  }),
  more: message({
    ja: '境界の越え方と、バンドルに残るものを読む',
    en: 'Read how text crosses the boundary, and what reaches the bundle',
  }),
};

export const guarantees = {
  title: message({
    ja: '保証されること',
    en: 'What is guaranteed',
  }),
  schema: message({
    ja: '一覧に無いロケールはページに届きません。スキーマが拒みます。',
    en: 'A locale outside the list never reaches a page: the schema refuses it.',
  }),
  compile: message({
    ja: '`Register` にロケールを載せた後は、ロケールが欠けた文言はコンパイルが通りません。JavaScript から呼んだ場合や `as` で型を通した場合は、読まれた時点で欠けたロケールと存在するロケールを示して throw し、`undefined` を返すことはありません。',
    en: 'Once `Register` is merged, a message missing a locale does not compile. From JavaScript, or through `as`, it throws where it is read, naming the missing locale and the ones present, and never returns `undefined`.',
  }),
  args: message({
    ja: '値を取る文言の引数は、関数の型で検査されます。',
    en: "The arguments of a message that takes values are checked by the function's type.",
  }),
  locale: message({
    ja: '`[locale]` の下のページは、URL が示すロケールで描かれます。サーバーではスキーマが受理したロケール、ブラウザでは URL そのものを読みます。',
    en: 'A page under `[locale]` renders in the locale its URL spells: the one its schema accepted on the server, the URL itself in the browser.',
  }),
};

export const nextSteps = {
  title: message({
    ja: '次に読む',
    en: 'Next steps',
  }),
  locales: message({
    ja: 'ロケール: 集合が返すもの、BCP 47、交渉の規則',
    en: 'Locales: what the set returns, BCP 47, negotiation',
  }),
  messages: message({
    ja: 'メッセージ: 値を取る文言、型、置き場所、境界、バンドル',
    en: 'Messages: values, types, where they live, the boundary, the bundle',
  }),
  routing: message({
    ja: 'URL とロケール: 言語切替、`/` の振り分け、`<html lang>`、静的化、型付きリンク',
    en: 'URLs & locale: the language switcher, the `/` page, `<html lang>`, static builds, typed links',
  }),
  integrations: message({
    ja: '組み合わせ: UI、フォーム、フレームワーク、テスト',
    en: 'Integrations: UI, forms, the framework, testing',
  }),
};
