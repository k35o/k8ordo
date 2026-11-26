---
'@k8ordo/ui': major
---

`Button`と`IconButton`の`onAction`を`action`に改めました。`Message.Action`と`Message.Regenerate`も同じです。transitionの中で呼び、終わるまで保留を表示する動きは変わりません。名前を`<form action>`と同じ「transitionで走る関数」にそろえ、項目を選んだときに素のまま呼ぶ`DropdownMenu.Item`などの`onAction`と分けました。この版で足す`Card`の、カード全体をボタンにするpropも、同じ動きなので`action`です。

保留のあいだは押しても`action`が走らないので、続けて押す同期の更新（数を増やす、スライドを送るなど）は`onClick`に書いてください。

移行するときは、`onAction`を`action`にします。押すたびに走る同期の処理は`onClick`にします。
