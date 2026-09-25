---
"@k8ordo/ui": major
"docs": patch
---

組み込みの文言を `@k8ordo/i18n` の今のロケールから読むようにした（破壊的変更）。

- `@k8ordo/i18n` を peer dependency にした。コンポーネントは `currentLocale()` を読み、アプリが `defineLocales` で集合を定義していれば文言と同じロケール（URL が名指すもの、無ければ集合の既定）で描く。集合が無いアプリでは **英語** で描く（これまでの既定は日本語）。URL が `/ja/…` で始まっていても変わらないので、サーバーとブラウザで食い違わない。
- `ja` と `en` の辞書はライブラリが持つ。それ以外のロケールや差し替えは、`@k8ordo/ui/i18n` の `registerMessages(locale, messages)` で登録する。登録した辞書は組み込みより優先され、`en-US` のような地域つきのタグは言語（`en`）の辞書を読む。登録も組み込みも無いロケールで描くと、登録を促すエラーを投げる。
- `UIProvider` の `messages`、`MessagesProvider`、`useMessages`、`dictionaries`、ルートからの `Messages` 型の export を削除した。`UIProvider` は Toast のために残る。`useMessages()` の代わりに、hook ではない `getMessages()` を `@k8ordo/ui/i18n` から使う。
- 文言のためだけに Client Component だった `Spinner`・`Breadcrumb`・`Code`・`Alert`・`Reasoning`・`ToolInvocation` から `'use client'` を外し、Server Component から描けるようにした。

移行: `UIProvider` から `messages` を外す。日本語で描いていたアプリは `@k8ordo/i18n` でロケール集合（日本語だけなら `ja` 1 つ）を定義し、そのモジュールをサーバーの描画とブラウザの両方で読み込まれる場所から import する。`messages` に渡していた辞書や差し替えは `registerMessages` で登録し、`useMessages()` は `getMessages()` に置き換える。

サイトの `LocaleShell` は `UIProvider` に辞書を渡さなくなった（文言はサイトのロケールに自分で従う）。`/ui/i18n` と `/i18n/integrations` を新しい仕組みで書き直し、3.x からの移行手順を足した。
