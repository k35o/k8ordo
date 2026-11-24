---
"@k8ordo/ui": minor
---

`@k8ordo/ui/tokens.css`を足しました。`styles.css`のうち、トークン（`:root`の変数と、`prefers-contrast: more`での上書き）と、`color-scheme`を決める3つの規則だけのスタイルシートです。リセットとページの既定は入っていないので、部品を使わないページがトークンだけを読めます。

色のトークンは`light-dark()`で書いてあり、`color-scheme`が無いと暗い側になりません。そこで`color-scheme`の規則（`:root`は`light`、`.dark`は`dark`、印刷では`light`に戻す）も同じファイルに入れました。このファイルだけを読んだページでも、`dark`クラスで暗くなります。

規則は`styles.css`と同じく`base`レイヤーの中にあります。OSの配色に従わせたいページは、レイヤーの外に`:root { color-scheme: light dark; }`を書きます。

`styles.css`の働きは変わりません。`color-scheme`の規則が、`base`レイヤーの中で先頭に移りました。
