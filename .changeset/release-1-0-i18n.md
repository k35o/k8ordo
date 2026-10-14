---
"@k8ordo/i18n": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。`@k8ordo/*` のうち form・state・router・i18n・color-scheme・framework の 6 つはそろって 1.0.0 になり、以後も同じ版で出す。どれか 1 つが版を上げれば、変更のないものも同じ版で出る（`@k8ordo/ui` は別の版で続く）。互いの peer は `^1.0.0` で結ぶ。

0.1.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

- `defineLocales` は、タグの配列ではなく、タグごとに `{ timeZone, dir }` を書いたオブジェクトを受け取る。
- `default` を省いたとき、`locales.default` の型は先頭のタグではなく全ロケールの和集合になる。
- `process.getBuiltinModule` から `AsyncLocalStorage` を得られないサーバー側のランタイムでは、`paramsSchema` がロケールを受け付けたときに throw する。

この版で足した主なもの: `locales.paths`、`negotiateRequest`、`Intl` の 5 つの補助（`dateTimeFormat` など）、`currentLocale()`。
