---
'@k8ordo/ui': minor
---

`Anchor`が新しいタブで開くリンクに、読み上げ専用の「新しいタブで開きます」（英語は「opens in a new tab」）を添えるようにしました。新しいタブで開くことはアイコンでしか示しておらず、アイコンは`aria-hidden`なので、スクリーンリーダーには伝わっていませんでした。文言は辞書の`opensInNewTab`で、`registerMessages`で差し替えられます。

`openInNewTab`を渡した`Card`のリンクも、同じ文言を名前の終わりに含めて読み上げます。カードのリンクは中身を持たず、名前を`aria-labelledby`でカードの中の文字から取るので、画面に出さない文言の要素も`aria-labelledby`で指します。`renderAnchor`に渡す`aria-labelledby`にも、その要素のidが入ります。

外部のリンクを`inline-flex`で描くのもやめ、本文の行の流れに乗せました。長い外部のリンクが1つの箱として折り返していました。アイコンは文字の高さの中ほどにそろえます。

移行するときは、`registerMessages`で独自の言語の辞書を登録しているアプリが、その辞書に`opensInNewTab`を足します。
