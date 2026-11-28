---
'@k8ordo/ui': patch
---

`Popover`、`Tooltip`、`DropdownMenu`、`ContextMenu`、`ListBox`が、triggerの要素に`anchor-name`を書き込まなくなりました。中身は`showPopover({ source })`でtriggerを暗黙のアンカーにして開き、`position-anchor: auto`で並びます。これまでは同じ要素を2つのtriggerにすると、後から書いた`anchor-name`が先の名前を上書きしていました。`IconButton`を`Popover.Trigger`にすると、内蔵のツールチップの名前が残ってポップオーバーが正しい位置に出ず、`tooltipDisabled`で避けるしかありませんでした。triggerに自分で付けた`anchor-name`も、上書きされずに残ります。
