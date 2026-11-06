---
"@k8ordo/ui": patch
---

`Textarea`で、キー入力の伝わりを止めないようにしました。これまでは`keydown`をすべて止めていたので、`Popover`の中の`Textarea`ではEscapeで`Popover`が閉じませんでした（`TextField`なら閉じます）。祖先の`onKeyDown`や`window`のリスナーにもキー入力が届きます。
