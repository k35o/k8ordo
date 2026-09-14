---
'@k8ordo/i18n': minor
---

`@k8ordo/i18n` を追加。アプリケーションのロケール軸を持つパッケージ。

- `defineLocales(['ja', 'en'])` がロケール集合。`all` / `default` / `is` に加え、`negotiate`（要求の順に完全一致→同じ言語→既定値。`navigator.languages` にも `parseAcceptLanguage(header)` の結果にも同じ関数）、URL の先頭区間を付け外しする `localize` / `delocalize`、`[locale]` ルートに `export const { paramsSchema } = locales` と書くための Standard Schema、描画中のロケールを返す `getLocale()`（hook ではない）、サーバーでロケールを指定して走らせる `run(locale, fn)` を持つ。スキーマライブラリへの依存も React への依存も無い。
- `message({ ja, en })` が 1 つの文言。`Register` にロケール集合を載せると、ロケールが 1 つでも欠けた文言はコンパイルが通らない。文言は全ロケールで文字列か、全ロケールで同じ引数の関数（補間はテンプレートリテラル、複数形は `Intl.PluralRules`）。返るのは `Message<Args>`、つまり呼ばれた場所のロケールで文字列を返す関数。
- ロケールは運ばず、読む。サーバーでは `paramsSchema` が受理したロケールがそのリクエストの描画（RSC、その HTML 化、その中で走る client component）のロケールになる（`AsyncLocalStorage`）。ブラウザでは URL の先頭区間。だから Provider も hook も無く、Server Component でも Client Component でも同じ `nav.home()` で描ける。
- `message()` は宣言時に副作用を持たないので、バンドラはクライアントモジュールが名前で参照した文言だけを残す。Server Component が引いた文言はクライアントに運ばれない。
- 型: `Message` / `Variants` / `Register` / `RegisteredLocale` / `LocaleOf` / `Locales` / `Delocalized` / `LocaleParamsSchema`。
