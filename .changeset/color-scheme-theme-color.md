---
'@k8ordo/color-scheme': major
---

`ColorSchemeScript`に`themeColor`でライトとダークの色を渡すと、手で選んだ配色を`<meta name="theme-color">`にも反映するようにしました。`media`で`prefers-color-scheme`を指定した`theme-color`はOSの設定に従います。そのため、OSがライトで訪問者がダークを選んでいると、アドレスバーなどのブラウザのUIはライトの色のままでした。

```tsx
<ColorSchemeScript themeColor={{ light: '#ffffff', dark: '#18181b' }} />
```

- スクリプトは`<html>`にクラスを付けるのと同時に、配色ごとの`theme-color`の`meta`を書きます。Reactは`<meta>`をスタイルシートの後ろに書き、スクリプトはその前で動くので、`meta`はスクリプトが作ります。
- 配色を選んでいるか、既定値が`'light'`か`'dark'`なら、その配色の色になります。既定値が`'system'`で何も選んでいない間は、配色ごとの`meta`がOSの設定に従います。
- `ColorSchemeProvider`は、ハイドレーションのあとも選択に合わせて`meta`を書き換えます。`setPreference('system')`でOSの設定に従う形に戻ります。
- ページで`theme-color`の`meta`を書いているなら、消します。スクリプトが書いた`meta`より後ろになり、使われません。
- `colorSchemeScriptHash()`は、`ColorSchemeScript`に渡す値（`nonce`を除く）をオブジェクトで受け取ります。`colorSchemeScriptHash('dark')`は`colorSchemeScriptHash({ defaultPreference: 'dark' })`に書き換えます。`themeColor`を渡しているなら、同じ値を渡します。
