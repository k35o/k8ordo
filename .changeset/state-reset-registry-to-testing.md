---
'@k8ordo/state': major
---

`resetStateRegistry`を、本体の`@k8ordo/state`からテスト用の入り口`@k8ordo/state/testing`に移しました。テストでしか使わない関数が、アプリがimportする本体から出ていて、同じテスト用の`mountPageUrl`とは別の入り口に分かれていました。`mountPageUrl`の後始末も`resetStateRegistry`を呼ぶので、2つを同じ入り口にそろえました。

移行するには、`import { resetStateRegistry } from '@k8ordo/state'`を`import { resetStateRegistry } from '@k8ordo/state/testing'`に書き換えます。Storybookの`preview`で呼んでいる場合も同じです。
