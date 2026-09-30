---
'@k8ordo/i18n': patch
---

同梱ドキュメントを実装に追従させました。

- `localize` は、渡されたパスが既にロケールを持つかを検査しない（`localize('/en/ui', 'ja')` は `'/ja/en/ui'`）と書きました。
- `parseAcceptLanguage` は数でない `q` を無視し、0 以下の重み（空の `q=` を含む）を捨てる、と書きました。関数の文言では、全ロケールの変種に同じ引数を宣言する（使わないものは `_count` のように）と書きました。
- Testing に、最後に呼んだ `defineLocales` が文言の読む集合になること、ブラウザ環境では `run` が throw すること、`document` を定義する jsdom・happy-dom もブラウザ環境に数えられることを書きました。
- README に、サーバーのロケールは `process.getBuiltinModule` から得る `AsyncLocalStorage` に載るので、サーバー側のランタイムがその API を持つ必要がある、と書きました。
