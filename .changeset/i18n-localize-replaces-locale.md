---
'@k8ordo/i18n': major
---

`localize(pathname, locale)`が、先頭の区間が集合のロケールならそれを置き換えるようにしました。`localize('/ja/ui', 'en')`は`/en/ui`です。先頭がロケールでなければ、これまでどおり区間を付けます（`/ui`は`/en/ui`、`/fr/ui`は`/en/fr/ui`）。

これまでは区間がすでにあるかを確かめず、`localize('/ja/ui', 'en')`は`/ja/en/ui`というどのページにも当たらないURLになっていました。言語の切り替えでは、`usePathname()`の値を`delocalize`に通してから渡す必要がありました。いまは`withBase(locales.localize(usePathname(), locale))`で、今のページの別の言語へのURLになります。

移行するには、`locales.localize(locales.delocalize(pathname).pathname, locale)`を`locales.localize(pathname, locale)`にします。前の書き方も同じ結果になるので、そのままでも動きます。ロケールの区間が2つ並ぶURLを意図して作っていたコードは、文字列を自分で組み立ててください。
