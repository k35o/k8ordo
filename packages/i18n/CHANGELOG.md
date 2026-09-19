# @k8ordo/i18n

## 0.2.0

### Minor Changes

- `@k8ordo/i18n` を追加。アプリケーションのロケール軸を持つパッケージ。

  - `defineLocales(['ja', 'en'])` がロケール集合。`all` / `default` / `is` に加え、`negotiate`（要求の順に完全一致→同じ言語→既定値。`navigator.languages` にも `parseAcceptLanguage(header)` の結果にも同じ関数）、URL の先頭区間を付け外しする `localize` / `delocalize`、`[locale]` ルートに `export const paramsSchema = locales.paramsSchema` と書くための Standard Schema、描画中のロケールを返す `getLocale()`（hook ではない）、サーバーでロケールを指定して走らせる `run(locale, fn)` を持つ。スキーマライブラリへの依存も React への依存も無い。
  - `message({ ja, en })` が 1 つの文言。`Register` にロケール集合を載せると、ロケールが 1 つでも欠けた文言はコンパイルが通らない。文言は全ロケールで文字列か、全ロケールで同じ引数の関数（補間はテンプレートリテラル、複数形は `Intl.PluralRules`）。返るのは `Message<Args>`、つまり呼ばれた場所のロケールで文字列を返す関数。
  - ロケールは運ばず、読む。サーバーでは `paramsSchema` が受理したロケールがそのリクエストの描画（RSC、その HTML 化、その中で走る client component）のロケールになる（`AsyncLocalStorage`）。ブラウザでは URL の先頭区間。だから Provider も hook も無く、Server Component でも Client Component でも同じ `nav.home()` で描ける。
  - `message()` は宣言時に副作用を持たないので、バンドラはクライアントモジュールが名前で参照した文言だけを残す。Server Component が引いた文言はクライアントに運ばれない。
  - 型: `Message` / `Variants` / `Register` / `RegisteredLocale` / `LocaleOf` / `Locales` / `Delocalized` / `LocaleParamsSchema`。

- - `locales.paths` を追加。`@k8ordo/static` の `paths` オプションにそのまま渡せる関数で、`/:locale` を持つパターンをロケールの数だけ展開する。他の param を持つパターンはそのまま返し、ビルドがその名前で値を求める。
  - ガイドの「router との組み合わせ」を、router の `bindParams` にロケールを供給する形に書き換えた。i18n は router に依存しない（結ぶのはアプリの 1 行）。`[locale]` の `paramsSchema` は `export const { paramsSchema } = locales` と分割代入で書いてよい（生成器がファイルをパースして export を読むようになった）。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `@k8ordo/server` でもページの描画中にはリダイレクトできないので、`/` の振り分けをサーバーでするには手前のプロキシかホストが要る、と直しました。
  - `@k8ordo/ui` との組み合わせを `dictionaries[locale]` で書くようにしました。`@k8ordo/form` の文言は `{ error: m.x }` で渡し、`formFields` は描画中に、`parseForm` は `locales.run` の中で呼ぶ、と書いています。
  - `locales.paths` が `:locale` 以外の param を持つパターンをどう扱うか、`localize` が既にロケールを持つパスを検査しないこと、テストでの注意（最後の `defineLocales` が勝つ、など）を実装どおりに書きました。

- - `[locale]` の `paramsSchema` が受け付けたロケールが、そのページの描画より長く残っていたのを直した。フレームワークはパターンごとにスキーマを専用の非同期コンテキストで走らせ、答えたパターンのコンテキストで描画を始める。
    - 同じスタックの後続スキーマが弾いたパターン（`/en/blog/nope` で slug のスキーマが拒否）の受理は捨てられ、404 は `/en/nothing` と同じく既定ロケールで描かれる。これまでは受理したロケールが残り、404 の言語が URL の形で変わっていた。
    - 静的ビルドはページを並行に描くが、あるページのロケールが別のページや `404.html` に漏れなくなった。これまで `404.html` は、直前に同期的に描き始めたページのロケールで書かれていた。今は常に既定ロケールで書かれる。
    - スキーマが非同期コンテキストに書いた値は、ハンドラを呼んだ側に残らない。
  - `AsyncLocalStorage` を `process.getBuiltinModule` から得られないサーバー側のランタイムでは、`paramsSchema` がロケールを受け付けたときに throw するようにした。これまでは受理したのに `getLocale()` が既定ロケールを返していた（`locales.run` は元から throw していた）。ブラウザでは従来どおり受理するだけで、何も書かない。
