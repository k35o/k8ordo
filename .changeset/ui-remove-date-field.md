---
'@k8ordo/ui': major
---

`DateField`をなくしました。`DateField`は`type="date"`に固定した`<input>`で、`TextField`に`type="date"`を渡したものと同じでした。違いは数字の幅をそろえる`font-variant-numeric: tabular-nums`だけだったので、`TextField`の日付と時刻の`type`（`date`、`time`、`datetime-local`、`month`、`week`）で数字の幅をそろえるようにしました。WebKitでフォーカスの輪を出す扱いも、これまでどおり`TextField`の日付と時刻の欄に効きます。

移行するときは、`<DateField />`を`<TextField type="date" />`に書き換えます。`@k8ordo/form`の`z.iso.date()`から作った`input`は`type: 'date'`を持つので、`<TextField {...props} {...eventDate.input} />`と展開すればそのまま日付の入力欄になります。
