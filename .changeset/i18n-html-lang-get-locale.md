---
'@k8ordo/i18n': patch
---

ガイドで、ルートレイアウトの`<html lang dir>`を`locales.getLocale()`から書く1通りにしました。これまでは`locales.delocalize(pathname).locale ?? locales.default`で書き、`getLocale()`も同じ結果になると説明していました。`not-found.tsx`を`[locale]`より上に置いたアプリの404では、`delocalize`はURLのロケールを、文言は既定のロケールを読むので、`<html lang>`と本文の言語が食い違っていました。`getLocale()`は文言と同じロケールを返します。

静的なホストの`404.html`については、`not-found.tsx`が描くClient Componentのeffectで、`lang`と`dir`を`getLocale()`から書き直す例を足しました。ルートレイアウトはServer Componentなので、ブラウザでは描き直されません。

`delocalize(pathname)`で`<html lang>`を書いているアプリは、`const locale = locales.getLocale();`に置き換えられます。ルートレイアウトが`pathname`をほかに使わなければ、受け取らなくてかまいません。
