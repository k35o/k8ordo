---
"@k8ordo/ui": major
---

組み込みの文言を `@k8ordo/i18n` の今のロケールから読むようにした（破壊的変更）。

- `@k8ordo/i18n` を peer dependency にした。コンポーネントは `currentLocale()` を読み、アプリが `defineLocales` で集合を定義していれば文言と同じロケール（URL が名指すもの、無ければ集合の既定）で描く。集合が無いアプリでは **英語** で描く（これまでの既定は日本語）。URL が `/ja/…` で始まっていても変わらないので、サーバーとブラウザで食い違わない。
- `ja` と `en` の辞書はライブラリが持つ。それ以外のロケールや差し替えは、`@k8ordo/ui/i18n` の `registerMessages(locale, messages)` で登録する。登録する辞書は `Messages` のキーをすべて持つ（`UIProvider` の `messages` と違い、足りないキーを組み込みの辞書で補わない）。登録した辞書は組み込みより優先され、`en-US` のような地域つきのタグは言語（`en`）の辞書を読む。登録も組み込みも無いロケールで描くと、登録を促すエラーを投げる。
- `UIProvider` の `messages`、`@k8ordo/ui/i18n` の `useMessages`、ルートからの `Messages` 型の export を削除した。`Messages` 型は `@k8ordo/ui/i18n` から import する。`UIProvider` は Toast のために残る。`useMessages()` の代わりに、hook ではない `getMessages()` を `@k8ordo/ui/i18n` から使う。
- 文言のためだけに Client Component だった `Spinner`・`Breadcrumb`・`Code`・`Alert`・`Reasoning`・`ToolInvocation` から `'use client'` を外し、Server Component から描けるようにした。

移行: `UIProvider` から `messages` を外す。日本語で描いていたアプリは `@k8ordo/i18n` でロケール集合（日本語だけなら `ja` 1 つ）を定義し、そのモジュールをサーバーの描画とブラウザの両方で読み込まれる場所から import する。`messages` に渡していた辞書は `registerMessages` で登録する。一部のキーだけを渡していた場合は、組み込みの辞書に重ねて `registerMessages('ja', { ...ja, close: '閉じる（Esc）' })` のように登録する。`useMessages()` は `getMessages()` に置き換え、ルートから import していた `Messages` 型は `@k8ordo/ui/i18n` から import する。
