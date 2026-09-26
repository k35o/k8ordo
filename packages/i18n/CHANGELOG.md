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

### Minor Changes

- ロケール集合に、今のロケールで `Intl` を引く補助を足した: `dateTimeFormat` / `numberFormat` / `relativeTimeFormat` / `pluralRules` / `listFormat`。

  - どれも `Intl` のオブジェクトそのものを返す（`format`・`formatToParts`・`select` などは `Intl` のまま）。独自の書式の記法は無い。
  - ロケールとオプションの組ごとに 1 つ作ってキャッシュし、次からは同じものを返す。
  - `dateTimeFormat` は、そのロケールの `timeZone` でしか日付を書かない。オプションの型は `timeZone` を受け付けず（`LocaleDateTimeFormatOptions`）、`as` で押し通してもロケールのものが勝つ。サーバーとブラウザでタイムゾーンがずれて hydrate が食い違う失敗を、型で起きなくするため。
  - hook ではないので、Server Component・Client Component・文言の関数の中のどこでも呼べる。型 `IntlFormats` と `LocaleDateTimeFormatOptions` を公開した。

  サイトに `/i18n/formatting`（日付と数値）のページを足し、`/i18n/messages` と `/i18n/routing` のコード例を補助を使う形に直した。

- `@k8ordo/i18n` を追加。アプリケーションのロケール軸を持つパッケージ。

  - `defineLocales(['ja', 'en'])` がロケール集合。`all` / `default` / `is` に加え、`negotiate`（要求の順に完全一致→同じ言語→既定値。`navigator.languages` にも `parseAcceptLanguage(header)` の結果にも同じ関数）、URL の先頭区間を付け外しする `localize` / `delocalize`、`[locale]` ルートに `export const paramsSchema = locales.paramsSchema` と書くための Standard Schema、描画中のロケールを返す `getLocale()`（hook ではない）、サーバーでロケールを指定して走らせる `run(locale, fn)` を持つ。スキーマライブラリへの依存も React への依存も無い。
  - `message({ ja, en })` が 1 つの文言。`Register` にロケール集合を載せると、ロケールが 1 つでも欠けた文言はコンパイルが通らない。文言は全ロケールで文字列か、全ロケールで同じ引数の関数（補間はテンプレートリテラル、複数形は `Intl.PluralRules`）。返るのは `Message<Args>`、つまり呼ばれた場所のロケールで文字列を返す関数。
  - ロケールは運ばず、読む。サーバーでは `paramsSchema` が受理したロケールがそのリクエストの描画（RSC、その HTML 化、その中で走る client component）のロケールになる（`AsyncLocalStorage`）。ブラウザでは URL の先頭区間。だから Provider も hook も無く、Server Component でも Client Component でも同じ `nav.home()` で描ける。
  - `message()` は宣言時に副作用を持たないので、バンドラはクライアントモジュールが名前で参照した文言だけを残す。Server Component が引いた文言はクライアントに運ばれない。
  - 型: `Message` / `Variants` / `Register` / `RegisteredLocale` / `LocaleOf` / `Locales` / `Delocalized` / `LocaleParamsSchema`。

- - `locales.paths` を追加。`@k8ordo/static` の `paths` オプションにそのまま渡せる関数で、`/:locale` を持つパターンをロケールの数だけ展開する。他の param を持つパターンはそのまま返し、ビルドがその名前で値を求める。
  - ガイドの「router との組み合わせ」を、router の `bindParams` にロケールを供給する形に書き換えた。i18n は router に依存しない（結ぶのはアプリの 1 行）。`[locale]` の `paramsSchema` は `export const { paramsSchema } = locales` と分割代入で書いてよい（生成器がファイルをパースして export を読むようになった）。

- `currentLocale()` を公開した。アプリケーションの集合が決める今のロケール（名指されたロケール、無ければ集合の既定）を返し、その環境で集合が定義されていなければ `null` を返す。

  知らないアプリケーションの中で描くライブラリ向けの読み口で、`@k8ordo/ui` の組み込みの文言がこれを読む。集合を定義していないアプリでは URL が `/ja/…` で始まっていても `null` なので、サーバーとブラウザで答えが揃う。

- ロケール集合に `negotiateRequest(request, { cookie? })` を足した。Request から、定義したロケールのどれかを選ぶ。

  - `cookie` で名前を渡すと、その Cookie（訪問者が前に選んだロケール）を先に、次に `Accept-Language` を希望の順に試す。どちらも `negotiate` と同じ規則（完全一致 → 同じ言語 → 既定値）を通るので、集合にもう無いロケールが Cookie に残っていてもヘッダーに落ちる。
  - Cookie の名前はアプリケーションが決める。`cookie` を省くとヘッダーだけを読む。
  - ページより前に走り redirect を返せるファイルから、`/` をロケールへ振り分けるのに使う。型 `NegotiateRequestOptions` を公開した。

  サイトの `/i18n/locales` に `negotiateRequest` を足し、サーバーで `/` を振り分ける例（`/i18n/integrations`）をこれに書き換えた。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `@k8ordo/server` でもページの描画中にはリダイレクトできないので、`/` の振り分けをサーバーでするには手前のプロキシかホストが要る、と直しました。
  - `@k8ordo/ui` との組み合わせを `dictionaries[locale]` で書くようにしました。`@k8ordo/form` の文言は `{ error: m.x }` で渡し、`formFields` は描画中に、`parseForm` は `locales.run` の中で呼ぶ、と書いています。
  - `locales.paths` が `:locale` 以外の param を持つパターンをどう扱うか、`localize` が既にロケールを持つパスを検査しないこと、テストでの注意（最後の `defineLocales` が勝つ、など）を実装どおりに書きました。

- 404 がどのロケールで描かれるかの説明を実装に合わせた。

  - GUIDE は「`404.html` の Client Component は hydration の後に訪問者のロケールで描き直される」と書いていたが、実際には hydration の最中に URL を読んで失敗していた。`404.html` は hydrate されずに訪問者の URL で描き直されること、`/en/…` の 404 はサーバーでも `en` で描かれること、`getLocale()` と `delocalize` が 404 でも一致することに直した。
  - ドキュメントサイトの framework・i18n・router の各ページと、同じ思い込みで書かれていたコメントも直した。

- `/` の振り分けの説明を、`@k8ordo/server` では `guard.ts` が `307` で答える書き方に改めた。

  - GUIDE の「The `/` page」は、ページは応答を書けず `serve` にもフックが無いので、サーバーでの redirect はアプリケーションの外（`serve` の前のプロキシか、ハンドラを包む自前のホスト）で行う、と書いていた。`guard.ts` が入ったので、`(home)/guard.ts` が `locales.negotiateRequest(request, { cookie: 'locale' })` で選び、`withBase(locales.localize('/', locale))` へ `307` を返す形にした。guard を `/` だけに効かせるためにルートグループに入れること、`null` を返すページが要ること、`308` にしない理由も書いた。`guard.ts` を拒む `@k8ordo/static` では、これまでどおり effect で移る。
  - llms.txt の GUIDE の要約に、`/` の振り分けがモードで違うことを足した。
  - ドキュメントサイトの `/i18n/integrations` の `@k8ordo/server` の節（コード例をページ＋クライアントの `RedirectTo` から guard＋`null` のページに）と、`/i18n/routing` の `/` の節も同じ内容に直した。

- 公開する tarball に `LICENSE`（MIT の本文）を同梱しました。これまでは `package.json` の `license` フィールドだけで、ライセンス本文が入っていませんでした。

- - `[locale]` の `paramsSchema` が受け付けたロケールが、そのページの描画より長く残っていたのを直した。フレームワークはパターンごとにスキーマを専用の非同期コンテキストで走らせ、答えたパターンのコンテキストで描画を始める。
    - 同じスタックの後続スキーマが弾いたパターン（`/en/blog/nope` で slug のスキーマが拒否）の受理は捨てられ、404 は `/en/nothing` と同じく既定ロケールで描かれる。これまでは受理したロケールが残り、404 の言語が URL の形で変わっていた。
    - 静的ビルドはページを並行に描くが、あるページのロケールが別のページや `404.html` に漏れなくなった。これまで `404.html` は、直前に同期的に描き始めたページのロケールで書かれていた。今は常に既定ロケールで書かれる。
    - スキーマが非同期コンテキストに書いた値は、ハンドラを呼んだ側に残らない。
  - `AsyncLocalStorage` を `process.getBuiltinModule` から得られないサーバー側のランタイムでは、`paramsSchema` がロケールを受け付けたときに throw するようにした。これまでは受理したのに `getLocale()` が既定ロケールを返していた（`locales.run` は元から throw していた）。ブラウザでは従来どおり受理するだけで、何も書かない。

- README の「AI Agent Documentation」節を他のパッケージに揃えました。エージェントの `CLAUDE.md` / `AGENTS.md` に貼るスニペットと、同梱ドキュメント・サイトの `llms.txt`・web 上の markdown twin の表を足し、License 節に LICENSE へのリンクを書いています。

- ブラウザでロケールを読むとき、Vite の `base` を外した pathname の先頭の区間を読むようにした。`base: '/docs/'` のもとで `/docs/en/ui` は `en` になる（これまでは `docs` を読んで既定のロケールになっていた）。Vite の外では base は無いものとして読む。

- 同梱ドキュメントの `@k8ordo/form` との組み合わせを、ルールの文言に関数を渡せるようになったことに合わせました。`defineForm` のルールにも文言の関数をそのまま渡し、定義はモジュールの先頭に置いたままにできます（これまでは「ルールは文字列を取るので、定義をリクエストの中で作る」と書いていました）。
