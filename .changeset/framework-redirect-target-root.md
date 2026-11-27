---
'@k8ordo/framework': major
---

`redirect.ts`のdefault exportの型`RedirectTarget`を、`@k8ordo/framework/server`から`@k8ordo/framework`に移しました。`redirect.ts`はstaticモードでも使うファイルなのに、その型がstaticモードの断る`/server`から出ていて、`import type`で書いたときだけ通り、`import { type RedirectTarget }`と書くとビルドが止まっていました。同じくどちらのモードでも使う`paths.ts`の型`Paths`はルートから出ているので、置き場をそろえました。`/server`からは消えます。

移行: `import type { RedirectTarget } from '@k8ordo/framework/server'`を`import type { RedirectTarget } from '@k8ordo/framework'`に書き換えてください。
