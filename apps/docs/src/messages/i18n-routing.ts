import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ロケールはURLの先頭区間にあります。サーバーはリクエストが受理した区間から、ブラウザは今のURLから読むので、ロケールを同期させる状態はどこにもありません。このページでは、その両側の仕組みと、言語切替、`/`の振り分け、`<html lang>`、静的化、型付きリンクの書き方を扱います。',
  en: 'The locale lives in the first segment of the URL. The server reads it from the segment the request accepted and the browser from the URL it is on, so no state anywhere has to keep the locale in sync. This page covers both sides, then the language switcher, the `/` page, `<html lang>`, static builds and typed links.',
});

export const sources = {
  title: message({
    ja: 'ロケールの出どころ',
    en: 'Where the locale comes from',
  }),
  description: message({
    ja: '文言と`getLocale()`は、呼ばれた環境に応じて次のところからロケールを読みます。',
    en: 'Messages and `getLocale()` read the locale from these places, depending on where they are called.',
  }),
  sideColumn: message({
    ja: '環境',
    en: 'Where',
  }),
  sourceColumn: message({
    ja: 'ロケール',
    en: 'The locale',
  }),
  noneColumn: message({
    ja: '何も指名していないとき',
    en: 'When nothing names one',
  }),
  server: message({
    ja: 'サーバー（Server Componentと、HTMLを作るためにサーバーで走るClient Component）',
    en: 'Server (Server Components, and Client Components running on the server for the HTML)',
  }),
  serverSource: message({
    ja: '`paramsSchema`がこのリクエストで受理したロケール。`run(locale, fn)`の中では`locale`。',
    en: 'The locale `paramsSchema` accepted for this request; inside `run(locale, fn)`, `locale`.',
  }),
  browser: message({
    ja: 'ブラウザ',
    en: 'Browser',
  }),
  browserSource: message({
    ja: '`location.pathname`の先頭区間。呼ばれるたびに読みます。',
    en: 'The first segment of `location.pathname`, read at every call.',
  }),
  default: message({
    ja: '既定のロケール',
    en: 'The default locale',
  }),
  browserDefault: message({
    ja: '既定のロケール（集合に無い区間も、指名なしと同じ）',
    en: 'The default locale (a segment outside the set counts as none)',
  }),
  concurrent: message({
    ja: 'サーバーではロケールを`AsyncLocalStorage`に載せるので、同時に走る複数のリクエストの描画が混ざりません。RSCの環境と、Client Componentをサーバーで描くSSRの環境は同じプロセスの中の別のモジュールグラフなので、ストレージと登録された集合は`globalThis`に置かれています。',
    en: 'On the server the locale rides on `AsyncLocalStorage`, so concurrent renders of different requests stay apart. The RSC environment and the SSR environment (where Client Components render on the server) are separate module graphs in one process, which is why the storage and the registered set live on `globalThis`.',
  }),
  detect: message({
    ja: 'どちらの経路を通るかは、モジュールを読み込んだ時点で`document`が定義されているかどうかで1度だけ決まります。',
    en: 'Which path is taken is decided once, when the module loads, by whether `document` is defined.',
  }),
  beforeSet: message({
    ja: 'ブラウザで、集合を定義するモジュールがまだ評価されていない間は、区間がロケールかどうかを判定できません。その間は、その文言が文を持たない区間をロケールではないとみなし、最初に書いた文を返します。`/fr/…`の404ページがthrowしないのはこのためです。',
    en: 'Before the module that defines the set has been evaluated in the browser, there is no way to tell whether a segment is a locale. Until then, a segment the message has no text for is read as no locale, and the first text written is used. That is why a 404 page on `/fr/…` does not throw.',
  }),
};

export const schema = {
  title: message({
    ja: 'サーバー: `paramsSchema`',
    en: 'On the server: `paramsSchema`',
  }),
  description: message({
    ja: '`[locale]`区間のレイアウトが`export const { paramsSchema } = locales`と書くと、フレームワークは描画の前にこのスキーマを走らせます。ジェネレーターはファイルをパースしてexportを探すので、分割代入の書き方でも認識されます。',
    en: "When the `[locale]` segment's layout writes `export const { paramsSchema } = locales`, the framework runs that schema before anything renders. The generator parses the file for the export, so the destructuring spelling counts too.",
  }),
  shape: message({
    ja: 'Standard Schema v1の形（vendorは`@k8ordo/i18n`）で、スキーマライブラリに依存しません。検証は同期的です。',
    en: 'It has the Standard Schema v1 shape (vendor `@k8ordo/i18n`) and depends on no schema library. Validation is synchronous.',
  }),
  refuses: message({
    ja: "一覧に無いロケールには`path: ['locale']`のissueを返します。パターンは答えず、表の次の候補へ進み、最後は`not-found.tsx`が404で答えます。",
    en: "A locale outside the list gets an issue at `path: ['locale']`. The pattern does not answer, the walk moves on through the table, and in the end `not-found.tsx` answers with a 404.",
  }),
  value: message({
    ja: '受理した値は`{ locale }`だけです。ほかのparamは、後に続くスキーマのために文字列のまま残ります。',
    en: 'The accepted value is `{ locale }` alone; other params keep their strings for the schemas that follow.',
  }),
  current: message({
    ja: '受理は、そのページの描画の始まりでもあります。受理したロケールは、それ以降のServer Component、それをHTMLにする処理、サーバーで走るClient Componentに届き、ほかのページや404には届きません。同じスタックの後続のスキーマが弾いたとき（`/en/blog/nope`）は、パターンと一緒に受理も捨てられ、404は`/en/nothing`と同じく既定のロケールで描かれます。`AsyncLocalStorage`を取り出せないランタイムでは、受理の時点でthrowします。',
    en: "Accepting is also where that page's render begins: the accepted locale reaches the Server Components after it, the step that turns them into HTML, and the Client Components that run on the server, and no other page or 404. When a later schema in the same stack refuses (`/en/blog/nope`), the acceptance is dropped with the pattern, and the 404 renders in the default, as `/en/nothing` does. In a runtime with no `AsyncLocalStorage` to offer, accepting throws.",
  }),
  serverFile: message({
    ja: 'スキーマをexportするファイルはServer Componentでなければなりません。フックを使う枠は`_parts/`のClient Componentに分けます。',
    en: 'The file that exports the schema must be a Server Component; a frame that uses hooks goes into a Client Component under `_parts/`.',
  }),
  params: message({
    ja: 'レイアウトが受け取る`params.locale`は、スキーマをexportしていても`string`型です。`/:locale/*`の`not-found.tsx`の下ではスキーマが走らず、未検証の値が届くからです。',
    en: 'The layout still receives `params.locale` as a `string`, even though it exports the schema: under the `/:locale/*` `not-found.tsx` no schema runs, and the value arrives unvalidated.',
  }),
};

export const run = {
  title: message({
    ja: 'サーバー: `run(locale, fn)`',
    en: 'On the server: `run(locale, fn)`',
  }),
  description: message({
    ja: '`[locale]`の描画の外で、ロケールを決めて何かを実行するときに使います。バッチ処理、メール本文の生成、テストです（`[locale]`のページから送られたServer Actionは、`@k8ordo/server`の下ではすでにそのページのロケールで走ります）。`fn`の戻り値をそのまま返し、`fn`がasyncでも`await`をまたいでロケールが保たれます。',
    en: 'Use it to run something under a chosen locale outside a `[locale]` render: a batch job, building an email, a test (a Server Action posted from a `[locale]` page already runs in that page’s locale under `@k8ordo/server`). It returns what `fn` returns, and when `fn` is async the locale is kept across its awaits.',
  }),
  throws: message({
    ja: 'ブラウザで呼ぶとthrowします。ブラウザではURLがロケールなので、変えたいときはナビゲーションします。`AsyncLocalStorage`を取り出せないランタイムでもthrowします。',
    en: 'It throws in the browser, where the URL is the locale and changing it means navigating. It also throws in a runtime that has no `AsyncLocalStorage` to offer.',
  }),
};

export const getLocale = {
  title: message({
    ja: '`getLocale()`はhookではない',
    en: '`getLocale()` is not a hook',
  }),
  description: message({
    ja: '`getLocale()`は、文言と同じ出どころからタグそのものを返します。hookではないので、描画の中でも、イベントハンドラの中でも、文言の関数の中でも、`bindParams`のソースの中でも呼べます。`<html lang>`、集合が引かない`Intl`（`Intl.DisplayNames`など）、言語切替の現在値に使います。日付、数値、複数形は`locales.dateTimeFormat()`などが引きます。',
    en: '`getLocale()` returns the tag itself, from the same source messages read. It is not a hook, so it can be called during render, in an event handler, inside a message, or in a `bindParams` source. Use it for `<html lang>`, an `Intl` API the set does not draw (`Intl.DisplayNames`, …), and the current value of a language switcher. Dates, numbers and plurals are drawn by `locales.dateTimeFormat()` and its siblings.',
  }),
  destructure: message({
    ja: '`this`に依存しないので、このサイトの`src/i18n.ts`のように集合から取り出してexportできます。',
    en: "It does not depend on `this`, so it can be taken out of the set and exported, as this site's `src/i18n.ts` does.",
  }),
  subscribe: message({
    ja: '購読はしません。Client Componentの中で呼ぶと、その瞬間のURLを読むだけです。ロケールが変わるのはナビゲーションなので、ページの再描画で新しい値が読まれます。URLの変化で自分から描き直す必要があるコンポーネントは、`@k8ordo/router`の`usePathname()`を読みます。',
    en: 'It does not subscribe. Called in a Client Component, it reads the URL at that moment. A locale changes by navigating, so the re-render of the page reads the new value; a component that must re-render on its own when the URL changes reads `usePathname()` from `@k8ordo/router`.',
  }),
  moduleScope: message({
    ja: 'モジュールの先頭で呼んだ値は、読み込んだ時点のロケールで固定されます。',
    en: 'A value computed at the top of a module stays fixed to the locale at load time.',
  }),
};

export const switcher = {
  title: message({
    ja: '言語切替: `localize`と`delocalize`',
    en: 'A language switcher: `localize` and `delocalize`',
  }),
  description: message({
    ja: '言語を変えることは、同じpathnameを別のロケールの区間の下へ移動することです。今のpathnameから区間を外し（`delocalize`）、別のロケールで付け直します（`localize`）。',
    en: "Changing language is navigating to the same pathname under another locale's segment: take the segment off the current pathname (`delocalize`) and put another one on (`localize`).",
  }),
  bySegment: message({
    ja: '`delocalize`は区間単位で見ます。`/english`の先頭区間は`english`なので`locale: null`です。`/en`と`/en/`の残りは`/`です。',
    en: '`delocalize` works by segment: the first segment of `/english` is `english`, so it gives `locale: null`. What remains of `/en` and `/en/` is `/`.',
  }),
  noGuess: message({
    ja: '先頭区間がロケールでないとき、`delocalize`は既定値を推測せず`locale: null`を返します。何に落とすかは、呼ぶ側が見える形で決めます。',
    en: 'When the first segment is not a locale, `delocalize` returns `locale: null` rather than guessing the default, so the caller chooses the fallback where it can be seen.',
  }),
  noCheck: message({
    ja: "`localize`は、区間がすでに付いているかを確かめません。`localize('/en/ui', 'ja')`は`/ja/en/ui`です。必ず`delocalize`したpathnameを渡してください。`/`で始まらない値には`TypeError`を投げます。",
    en: "`localize` does not check for a segment already there: `localize('/en/ui', 'ja')` is `/ja/en/ui`. Always hand it a pathname that went through `delocalize`. It throws a `TypeError` on a value that does not start with `/`.",
  }),
  pathnameOnly: message({
    ja: 'どちらもpathnameだけを扱います。searchに状態を持つページで、切り替えの後も残したいなら、`location.search`を自分で足します。',
    en: 'Both deal in pathnames only. If a page keeps state in the search and it should survive the switch, append `location.search` yourself.',
  }),
  why: message({
    ja: '`usePathname()`を使うのは、サーバーの描画には`location`が無く、ハイドレーションではサーバーと同じ値で描く必要があり、ナビゲーションのたびにリンクを描き直す必要もあるからです。パターンから作る`href`を使わないのは、切り替えが手にしているのが今いるページの具体的なpathnameで、パターンではないからです。素の`<a>`でも、ルーターがNavigation APIで遷移を横取りするので、クライアント遷移になります。',
    en: '`usePathname()` is used because the server render has no `location`, hydration has to render the value the server used, and the links have to be redrawn after every navigation. `href` from a pattern is not used because what the switcher holds is the concrete pathname of the page it is on, not a pattern. A plain `<a>` is still a client navigation, because the router intercepts it through the Navigation API.',
  }),
};

export const root = {
  title: message({
    ja: '`/`の振り分け',
    en: 'The `/` page',
  }),
  description: message({
    ja: '`/`はロケールを持たない唯一のURLです。何も描かず、effectの中で交渉して、ロケールの付いたURLへ移ります。',
    en: '`/` is the one URL without a locale. It renders nothing, and negotiates and moves to a localized URL from an effect.',
  }),
  effect: message({
    ja: '描画中ではなくeffectで移動します。サーバーでの描画（静的サイトならビルド時）はブラウザの外で走るので、そこにはNavigation APIが無く、`navigator.languages`があっても訪問者のものではなく描画しているマシンのものです。',
    en: 'It navigates from an effect, not during render: the server render (at build time for a static site) runs outside a browser, where there is no Navigation API, and where `navigator.languages`, if present, belongs to the machine rendering the page rather than the visitor.',
  }),
  replace: message({
    ja: "`history: 'replace'`にするのは、戻るボタンで`/`に戻り、また振り分けられるのを防ぐためです。",
    en: "`history: 'replace'` keeps the back button from returning to `/` only to be redirected again.",
  }),
  withoutRouter: message({
    ja: "`@k8ordo/router`を使わないアプリケーションなら、`location.replace(locales.localize('/', locale))`が同じ働きをします。",
    en: "Without `@k8ordo/router`, `location.replace(locales.localize('/', locale))` does the same job.",
  }),
  server: message({
    ja: '`@k8ordo/server`ではeffectは要りません。`/`の`guard.ts`が、何かを描く前に`locales.negotiateRequest`でロケールを選び（Cookie、次に`Accept-Language`）、`307`で答えます。',
    en: 'Under `@k8ordo/server` no effect is needed: the `guard.ts` for `/` chooses with `locales.negotiateRequest` (the cookie, then `Accept-Language`) and answers with a `307` before anything renders.',
  }),
  serverLink: message({
    ja: '`@k8ordo/server`での書き方を読む',
    en: 'Read how it is written under `@k8ordo/server`',
  }),
};

export const htmlLang = {
  title: message({
    ja: '`<html lang>`',
    en: '`<html lang>`',
  }),
  description: message({
    ja: '`lang`は、サーバーが書いたHTMLの時点で正しくなければなりません。クローラーも読み上げも、ハイドレーションを待たずに読むからです。ルートレイアウトは`[locale]`より上にありますが、`pathname`を受け取ります。',
    en: '`lang` has to be right in the HTML the server writes, because crawlers and screen readers read it without waiting for hydration. The root layout sits above `[locale]`, but it receives `pathname`.',
  }),
  same: message({
    ja: 'スキーマはどの描画よりも先に走るので、スキーマが受理したページでは`locales.getLocale()`も同じ値を返します。`delocalize`を使う書き方は、URLだけから決まることが読んで分かります。404でも両者は一致します。`not-found.tsx`の上のスキーマがcatch-allのparamにも走るので、`getLocale()`はURLがロケールを名指せばそのロケール、そうでなければ既定になります。',
    en: "Schemas run before anything renders, so on a page whose schema accepted, `locales.getLocale()` returns the same value. The `delocalize` form reads as depending on the URL alone. On a 404 the two agree as well: the schema above `not-found.tsx` runs over the catch-all's params, so `getLocale()` is the URL's locale where it names one and the default where it does not.",
  }),
};

export const staticBuild = {
  title: message({
    ja: '静的化: `locales.paths`',
    en: 'Static builds: `locales.paths`',
  }),
  description: message({
    ja: '`@k8ordo/static`は、paramを持つパターンに具体的なpathnameを求めます。ロケールの区間はどのページでも同じ値を取るので、集合が自分で展開します。',
    en: '`@k8ordo/static` asks for concrete pathnames for every pattern with a parameter. The locale segment takes the same values on every page, so the set expands it itself.',
  }),
  expands: message({
    ja: '`/:locale`区間を持つパターンは、ロケールの数だけのpathnameになります。区間単位で置き換えるので、`/:localeCode`のような別のparamには触れません。',
    en: 'A pattern with a `/:locale` segment becomes one pathname per locale. Replacement is by segment, so a different param such as `/:localeCode` is left alone.',
  }),
  passes: message({
    ja: '`/:locale`を持たないパターンは、そのまま返ります。静的ビルドが`paths`に渡すのはpathnameをまだ必要とするパターンだけなので、そのまま返したパターンは展開されないまま残り、ビルドが止まります。そのparamも同じ関数の中で展開してください。',
    en: 'A pattern without `/:locale` comes back as it is. The static build hands `paths` only the patterns that still need pathnames, so a pattern returned unchanged stays unexpanded and stops the build; expand its parameters in the same function.',
  }),
  perRequest: message({
    ja: '各pathnameはそれぞれ1つのリクエストとして描かれるので、ページごとにスキーマがロケールを受理し、文言はそのロケールで出力されます。ビルドは複数のページを同時に描きますが、あるページのロケールがほかのページに漏れることはありません。',
    en: 'Each pathname is rendered as its own request, so the schema accepts the locale for each page and the messages come out in it. The build renders several pages at once, and none lends its locale to another.',
  }),
  secondTitle: message({
    ja: 'ほかのparamもあるとき',
    en: 'When there is another parameter',
  }),
  secondDescription: message({
    ja: '`/:locale/blog/:slug`のように別のparamも持つパターンは、`locales.paths`を通しても`/ja/blog/:slug`のように`:slug`が残ります。静的ビルドはparamの残ったpathnameを使わないので、そのパターンは展開されていないものとして扱われ、`static build needs pathnames for /:locale/blog/:slug — supply them with the "paths" option`でビルドが止まります。残りのparamは同じ関数の中で展開してください。',
    en: 'A pattern with another parameter, such as `/:locale/blog/:slug`, still has `:slug` after `locales.paths` (`/ja/blog/:slug`). The static build does not use a pathname that still holds a parameter, so the pattern counts as unexpanded and the build stops with `static build needs pathnames for /:locale/blog/:slug — supply them with the "paths" option`. Expand the remaining parameters in the same function.',
  }),
  notFound: message({
    ja: '静的ホストが知らないURLすべてに返す`404.html`は、ビルドの番兵の区間で1回だけ描かれます。その区間を受理するスキーマは無いので文言は既定のロケールで描かれ、訪問者のロケールに合わせることはできません。ブラウザはこれをハイドレーションせず（別のURL用に描かれたものなので、ハイドレーション中に読んだ文言と食い違います）、訪問者のURLで描き直します。そこでClient Componentは訪問者のロケールで描かれます。このサイトの`not-found.tsx`がClient Componentなのはそのためです。',
    en: "The `404.html` a static host serves for every URL it does not have is rendered once, under the build's sentinel segment. No schema accepts that segment, so its text is in the default locale and cannot follow the visitor's. The browser does not hydrate it — it was rendered for another URL, and a message read while hydrating would disagree with it — but renders it afresh at the visitor's URL, where Client Components come out in their locale. That is why this site's `not-found.tsx` is a Client Component.",
  }),
};

export const links = {
  title: message({
    ja: '型付きリンク: `bindParams`',
    en: 'Typed links: `bindParams`',
  }),
  description: message({
    ja: 'ロケールは、すべてのパターンのparam（`/:locale/products/:id`）です。`@k8ordo/router`の`bindParams`にロケールのソースを1回渡せば、リンクはパターンの綴りのまま型で検査され、呼ぶたびにロケールを書く必要がありません。',
    en: "The locale is a parameter of every pattern (`/:locale/products/:id`). Hand `@k8ordo/router`'s `bindParams` the locale source once, and links keep the pattern's spelling, stay checked against the route table, and never spell the locale.",
  }),
  source: message({
    ja: 'ソースは呼ぶたびに読まれます。サーバーではそのリクエストのロケール、ブラウザでは今のURLのロケールが入ります。',
    en: "The source is read at every call: the request's locale on the server, the current URL's locale in the browser.",
  }),
  override: message({
    ja: "ロケールを明示すれば、ソースを上書きできます。`navigateTo('/:locale', { locale: 'en' }, { history: 'replace' })`は英語のトップページへ移ります。",
    en: "Giving the locale explicitly overrides the source: `navigateTo('/:locale', { locale: 'en' }, { history: 'replace' })` goes to the English top page.",
  }),
  independent: message({
    ja: '2つのパッケージは互いをimportしません。結んでいるのは、アプリケーションのこの1行です。',
    en: 'Neither package imports the other; this one line in the application is what ties them.',
  }),
  remaining: message({
    ja: '`localize` / `delocalize`が残るのは、手にしているのがパターンではなく具体的なpathnameのとき、つまり言語切替です。',
    en: '`localize` / `delocalize` remain for when what you hold is a concrete pathname rather than a pattern: the language switcher.',
  }),
  routerLink: message({
    ja: '`@k8ordo/router`のリンクのページを読む',
    en: "Read `@k8ordo/router`'s page on links",
  }),
};
