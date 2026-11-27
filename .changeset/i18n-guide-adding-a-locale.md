---
'@k8ordo/i18n': patch
---

ガイドに「Adding a locale」の節を足し、ロケールを足すときに書き足す場所を1か所にまとめました。`src/i18n.ts`の集合に足す、そのロケールの文を持たない`message()`が型エラーになる、`@k8ordo/ui`が同梱しないロケールなら`registerMessages`に`Messages`型の辞書を渡す（`en`を展開すれば、訳していないキーは英語のまま）、zodの既定の文言の表があればそれも足す、の4つです。`[locale]`のスキーマ、言語の選択、`localize`、静的ビルドの`paths.ts`、`<html lang dir>`は集合から読むので、書き足すものはありません。docsサイトの`/i18n/locales`にも同じ節を足しました。
