---
"@k8ordo/ui": major
---

色のトークンを`light-dark()`で書くようにしました。ダークの値は`.dark`の規則ではなく、`:root`の`--color-fg-base: light-dark(var(--gray-900), var(--gray-50));`のような1つの宣言に入ります。どちらの値になるかは、そのトークンを使う要素の`color-scheme`で決まります。`dark`クラスで切り替える既定は同じで、見た目も変わりません。

CSSの変数の値は、配色によらず`light-dark()`の式のままです。JavaScriptで`getPropertyValue('--color-fg-base')`のように色を読んでいた場合は、`color`などのプロパティに使った値を`getComputedStyle()`で読んでください。`.dark`でトークンを上書きしているCSSは、そのまま動きます。

OSの配色に従わせたいページは、自分のCSSで`:root`に`color-scheme: light dark`を書きます。

`@k8ordo/ui/tokens`のmodifierの名前が変わりました。

- `.dark`は`:root color-scheme: dark`になりました。
- `@media (prefers-contrast: more) :root:where(:not(.dark))`は`@media (prefers-contrast: more) :root`に、`@media (prefers-contrast: more) .dark`は`@media (prefers-contrast: more) :root color-scheme: dark`になりました。
- 印刷の2つのmodifierは無くなりました。印刷ではライトの値を使います。

ダークの値を読むコードは、探す名前を`:root color-scheme: dark`に変えてください。ダークでコントラストを上げたときの値は、`:root color-scheme: dark`、`@media (prefers-contrast: more) :root`、`@media (prefers-contrast: more) :root color-scheme: dark`の3つをこの順に適用した値です。
