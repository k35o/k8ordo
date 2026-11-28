---
'@k8ordo/i18n': patch
'@k8ordo/form': patch
---

文言を書いていない検証に出るzodの既定の文言を、リクエストのロケールに合わせる書き方を、`@k8ordo/i18n`のガイドの`@k8ordo/form`の項に足しました。zodの設定はプロセスに1つなので、`z.config(z.locales.en())`のように固定すると、二言語のアプリでもどのリクエストにも同じ言語の文言が出ていました。`src/lib/zod-locale.ts`に、`satisfies Variants<…>`で型を付けたロケールごとの表と、`locales.getLocale()`で引く`z.config({ localeError })`を書き、スキーマを書くモジュールの先頭でimportします。ロケールを足して表に書き忘れると型エラーになります。`src/i18n.ts`はブラウザでも読み込まれるので、そこには置きません。

`@k8ordo/form`のガイドからは、この項へ1文で案内します。
