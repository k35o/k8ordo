---
'@k8ordo/color-scheme': major
---

最初の描画の前に`<html>`へ`dark`クラスを付けるインラインスクリプトを`ColorSchemeProvider`から外し、`<head>`に置く`ColorSchemeScript`にしました。`<body>`の先頭にあったスクリプトは`<head>`のスタイルシートが届くまで動かず、その間にブラウザが背景だけのライトの画面を描くことがありました。k8o.meをChromiumで計ると、ダークで終わる読み込み32回のうち12回で、最初の画面がライトでした。

```tsx
<html suppressHydrationWarning>
  <head>
    <ColorSchemeScript />
  </head>
  <body>
    <ColorSchemeProvider>{children}</ColorSchemeProvider>
  </body>
</html>
```

- ルートレイアウトの`<head>`に`<ColorSchemeScript />`を置きます。`@k8ordo/framework`は、`<head>`に書いたインラインスクリプトをどのスタイルシートよりも前に移します。
- `ColorSchemeProvider`の`nonce`はなくなりました。nonceは`<ColorSchemeScript nonce={nonce()} />`に渡します。
- `defaultPreference`を渡しているときは、`ColorSchemeScript`と`ColorSchemeProvider`に同じ値を渡します。`colorSchemeScriptHash()`に渡す値も同じです。
