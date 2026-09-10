---
'@k8ordo/i18n': minor
---

`@k8ordo/i18n` を追加。アプリケーションのロケール軸を持つパッケージ。

- `defineLocales(['ja', 'en'])` がロケール集合。`all` / `default` / `is` に加え、`negotiate`（要求の順に完全一致→同じ言語→既定値。`navigator.languages` にも `parseAcceptLanguage(header)` の結果にも同じ関数）、URL の先頭区間を付け外しする `localize` / `delocalize`、`[locale]` ルートに `export const paramsSchema = locales.paramsSchema` と書くための Standard Schema を持つ。スキーマライブラリへの依存は無い。
- `defineDictionary(locales, { ja, en })` が辞書。既定ロケールの文言が形を決め、他のロケールは `Translations<typeof ja>` で同じキー・同じ引数に縛られる。文言は文字列か、値を受け取る関数（補間はテンプレートリテラル、複数形は `Intl.PluralRules`）。`translator(locale)` がサーバー用の `t` で、同じロケールには同じ関数を返す。
- `LocaleProvider` はロケール文字列だけを受け取るので Server Component のレイアウトから直接描ける。`useTranslation(dictionary)` はクライアントモジュールが辞書を import して呼ぶ形で、`{ t, locale }` を返す。`useLocale(locales)` は検査済みの型付きロケール。
- 型: `LocaleOf` / `MessageKeyOf` / `TextKeyOf`（引数なしで引けるキーだけ）/ `Translations` / `Translator` ほか。
