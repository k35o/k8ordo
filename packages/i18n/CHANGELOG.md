# @k8ordo/i18n

## 1.0.0

### Major Changes

- ロケールの定義に `timeZone` と `dir` を必須で持たせる（破壊的変更）。

  - `defineLocales` はタグの配列ではなく、タグをキーにしたオブジェクトを受け取るようになった。各ロケールは、日付を表示する IANA のタイムゾーン（`timeZone`）と文字の向き（`dir`: `'ltr' | 'rtl'`）を必ず書く。実行環境のタイムゾーンはサーバーと訪問者のブラウザで違うので、それに任せて書いた日付は HTML と hydrate で食い違う。`Intl.Locale#getTextInfo` はまだ全ブラウザに無いので、向きも宣言する。
  - 集合に `definitions` を足した（`locales.definitions[locale].dir` を `<html dir>` に書く）。型 `LocaleDefinition` を公開した。
  - 空の集合、実行環境が知らないタイムゾーン、欠けたタイムゾーン、`ltr` / `rtl` 以外の `dir` は `defineLocales` で `TypeError` を投げる。キーは重複できないので「タグが 2 回ある」検査は無くなった。
  - `default` を省いたとき、`locales.default` の型は先頭のタグではなく一覧の和集合になる（オブジェクトのキーの順は型に残らないため）。実行時の既定値は従来どおり先頭に書いたタグ。

  移行: `defineLocales(['ja', 'en'])` を `defineLocales({ ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' }, en: { timeZone: 'UTC', dir: 'ltr' } })` のように書き換える。

  サイトは `src/i18n.ts` を新しい形にし（`ja` は `Asia/Tokyo`、`en` は `UTC`）、ルートレイアウトが `<html dir>` を書くようにした。`/i18n/locales` に `timeZone` と `dir` の節を足した。

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・static・server・i18n・color-scheme）はそろって 1.0.0 になり、互いの peer は `^1.0.0` で結ぶ。

  0.1.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

  - `defineLocales` は、タグの配列ではなく、タグごとに `{ timeZone, dir }` を書いたオブジェクトを受け取る。
  - `default` を省いたとき、`locales.default` の型は先頭のタグではなく全ロケールの和集合になる。
  - `process.getBuiltinModule` から `AsyncLocalStorage` を得られないサーバー側のランタイムでは、`paramsSchema` がロケールを受け付けたときに throw する。

  この版で足した主なもの: `locales.paths`、`negotiateRequest`、`Intl` の 5 つの補助（`dateTimeFormat` など）、`currentLocale()`。

### Minor Changes

- ロケール集合に、今のロケールで `Intl` を引く補助を足した: `dateTimeFormat` / `numberFormat` / `relativeTimeFormat` / `pluralRules` / `listFormat`。

  - どれも `Intl` のオブジェクトそのものを返す（`format`・`formatToParts`・`select` などは `Intl` のまま）。独自の書式の記法は無い。
  - ロケールとオプションの組ごとに 1 つ作ってキャッシュし、次からは同じものを返す。
  - `dateTimeFormat` は、そのロケールの `timeZone` でしか日付を書かない。オプションの型は `timeZone` を受け付けず（`LocaleDateTimeFormatOptions`）、`as` で押し通してもロケールのものが勝つ。サーバーとブラウザでタイムゾーンがずれて hydrate が食い違う失敗を、型で起きなくするため。
  - hook ではないので、Server Component・Client Component・文言の関数の中のどこでも呼べる。型 `IntlFormats` と `LocaleDateTimeFormatOptions` を公開した。

  サイトに `/i18n/formatting`（日付と数値）のページを足し、`/i18n/messages` と `/i18n/routing` のコード例を補助を使う形に直した。

- - `locales.paths` を追加。`@k8ordo/static` の `paths` オプションにそのまま渡せる関数で、`/:locale` を持つパターンをロケールの数だけ展開する。ほかの param は展開しない。`/:locale/blog/:slug` は `/ja/blog/:slug` のように param を残して返り、ビルドはそれを描かずに `static build needs pathnames for /:locale/blog/:slug` で止まるので、2 つ目の param を持つサイトは同じ関数の中で残りを展開する（`(patterns) => locales.paths(patterns).flatMap(expandSlug)`）。
  - ガイドの「router との組み合わせ」を、router の `bindParams` にロケールを供給する形に書き換えた。i18n は router に依存しない（結ぶのはアプリの 1 行）。`[locale]` の `paramsSchema` は `export const { paramsSchema } = locales` と分割代入で書いてよい（`@k8ordo/static` / `@k8ordo/server` が `paramsSchema` の export を構文木から読むようになった）。

- `currentLocale()` を公開した。アプリケーションの集合が決める今のロケール（名指されたロケール、無ければ集合の既定）を返し、その環境で集合が定義されていなければ `null` を返す。

  知らないアプリケーションの中で描くライブラリ向けの読み口で、`@k8ordo/ui` の組み込みの文言がこれを読む。集合を定義していないアプリでは URL が `/ja/…` で始まっていても `null` なので、サーバーとブラウザで答えが揃う。GUIDE の `@k8ordo/ui` との組み合わせも、`UIProvider` に辞書を渡す書き方から、集合を定義すれば ui の組み込みの文言が従う書き方に改めた。集合を定義するモジュールはブラウザでも読み込み、`ja` / `en` 以外のロケールは `@k8ordo/ui/i18n` の `registerMessages` で登録する。

- ロケール集合に `negotiateRequest(request, { cookie? })` を足した。Request から、定義したロケールのどれかを選ぶ。

  - `cookie` で名前を渡すと、その Cookie（訪問者が前に選んだロケール）を先に、次に `Accept-Language` を希望の順に試す。どちらも `negotiate` と同じ規則（完全一致 → 同じ言語 → 既定値）を通るので、集合にもう無いロケールが Cookie に残っていてもヘッダーに落ちる。
  - Cookie の名前はアプリケーションが決める。`cookie` を省くとヘッダーだけを読む。
  - ページより前に走り redirect を返せるファイルから、`/` をロケールへ振り分けるのに使う。型 `NegotiateRequestOptions` を公開した。
  - GUIDE に、言語の切り替えでロケールの Cookie を書く例を足した。Cookie Store API の既定のままではブラウザを閉じると消えるセッション Cookie になり、`SameSite=Strict` なのでほかのサイトのリンクから来た最初のリクエストには付かないので、`sameSite: 'lax'` と遠い `expires` を付けて書く（`maxAge` は TypeScript の `lib.dom` の `CookieInit` にまだ無いので、`expires` で書く）。

  サイトの `/i18n/locales` に `negotiateRequest` を足し、サーバーで `/` を振り分ける例（`/i18n/integrations`）をこれに書き換えた。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `localize` は、渡されたパスが既にロケールを持つかを検査しない（`localize('/en/ui', 'ja')` は `'/ja/en/ui'`）と書きました。
  - `parseAcceptLanguage` は数でない `q` を無視し、0 以下の重み（空の `q=` を含む）を捨てる、と書きました。関数の文言では、全ロケールの変種に同じ引数を宣言する（使わないものは `_count` のように）と書きました。
  - Testing に、最後に呼んだ `defineLocales` が文言の読む集合になること、ブラウザ環境では `run` が throw すること、`document` を定義する jsdom・happy-dom もブラウザ環境に数えられることを書きました。
  - README に、サーバーのロケールは `process.getBuiltinModule` から得る `AsyncLocalStorage` に載るので、サーバー側のランタイムがその API を持つ必要がある、と書きました。

- 404 がどのロケールで描かれるかの説明を実装に合わせた。

  - GUIDE は「`404.html` の Client Component は hydration の後に訪問者のロケールで描き直される」と書いていたが、実際には hydration の最中に URL を読んで失敗していた。`404.html` は hydrate されずに訪問者の URL で描き直されること、`/en/…` の 404 はサーバーでも `en` で描かれること、`getLocale()` と `delocalize` が 404 でも一致することに直した。
  - ドキュメントサイトの framework・i18n・router の各ページと、同じ思い込みで書かれていたコメントも直した。

- `/` の振り分けの説明を、`@k8ordo/server` では `guard.ts` が `307` で答える書き方に改めた。

  - GUIDE の「The `/` page」は、`parseAcceptLanguage` と redirect でサーバーでも同じ判断ができる、と書くだけで、どこで redirect を返すかを示していなかった。`(home)/guard.ts` が `locales.negotiateRequest(request, { cookie: 'locale' })` で選び、`withBase(locales.localize('/', locale))` へ `307` を返す形にした。guard を `/` だけに効かせるためにルートグループに入れること、`null` を返すページが要ること、`308` にしない理由も書いた。`guard.ts` を拒む `@k8ordo/static` では、これまでどおり effect で移る。
  - llms.txt の GUIDE の要約に、`/` の振り分けがモードで違うことを足した。
  - ドキュメントサイトの `/i18n/integrations` の `@k8ordo/server` の節（コード例をページ＋クライアントの `RedirectTo` から guard＋`null` のページに）と、`/i18n/routing` の `/` の節も同じ内容に直した。

- - `[locale]` の `paramsSchema` が受け付けたロケールが、そのページの描画より長く残っていたのを直した。フレームワークはパターンごとにスキーマを専用の非同期コンテキストで走らせ、答えたパターンのコンテキストで描画を始める。
    - 同じスタックの後続スキーマが弾いたパターン（`/en/blog/nope` で slug のスキーマが拒否）の受理は捨てられ、404 は `/en/nothing` と同じ道筋で描かれる（`not-found.tsx` の上のレイアウトのスキーマがロケールを受け付ければ、その URL のロケールで）。これまでは受理したロケールが残り、404 の言語が URL の形で変わっていた。
    - 静的ビルドはページを並行に描くが、あるページのロケールが別のページや `404.html` に漏れなくなった。これまで `404.html` は、直前に同期的に描き始めたページのロケールで書かれていた。今は常に既定ロケールで書かれる。
    - スキーマが非同期コンテキストに書いた値は、ハンドラを呼んだ側に残らない。
  - `AsyncLocalStorage` を `process.getBuiltinModule` から得られないサーバー側のランタイムでは、`paramsSchema` がロケールを受け付けたときに throw するようにした。これまでは受理したのに `getLocale()` が既定ロケールを返していた（`locales.run` は元から throw していた）。ブラウザでは従来どおり受理するだけで、何も書かない。

- README の「AI Agent Documentation」節を他のパッケージに揃えました。エージェントの `CLAUDE.md` / `AGENTS.md` に貼るスニペットと、同梱ドキュメント・サイトの `llms.txt`・web 上の markdown twin の表を足し、License 節に LICENSE へのリンクを書いています。

- ブラウザでロケールを読むとき、Vite の `base` を外した pathname の先頭の区間を読むようにした。`base: '/docs/'` のもとで `/docs/en/ui` は `en` になる（これまでは `docs` を読んで既定のロケールになっていた）。Vite の外では base は無いものとして読む。

- `[locale]` のページから送られた Server Action が、`@k8ordo/server` の下ではそのページのロケールで走るようになったことに合わせ、`locales.run` とフォームの説明を書き直した。

- 同梱ドキュメントの `@k8ordo/form` との組み合わせを、ルールの文言に関数を渡せるようになったことに合わせました。`defineForm` のルールにも文言の関数をそのまま渡し、定義はモジュールの先頭に置いたままにできます（これまでは文言を「制約を宣言する場所で呼ぶ」と書いていたので、宣言したときのロケールの文言に固定されていました）。
