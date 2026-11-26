---
'@k8ordo/ui': minor
---

`DropdownMenu.Item`と`ContextMenu.Item`に、リンクの形を足しました。`onAction`の代わりに`href`を渡すと`<a role="menuitem">`を描き、選ぶとメニューを閉じて、遷移はブラウザに任せます。ルーターの横取りも、中クリックや新しいタブで開くことも、そのまま効きます。ボタンの項目と同じく、Spaceでも選べます。これまではリンクの項目を作れず、`onAction`の中で`navigation.navigate`を呼ぶしかありませんでした。Next.jsの`Link`のようなリンク部品は`renderAnchor`で描きます。

```tsx
<DropdownMenu.Item href="/settings" label="設定" />
```

`DropdownMenu.Trigger`は`Button`の`color`を、`DropdownMenu.IconTrigger`は`IconButton`の`size`と`variant`と`color`を受け取るようになりました。これまで`IconTrigger`は大きさを変えられず、小さいアイコンのメニューを作るには`Popover.Trigger`を流用するしかありませんでした。既定の見た目は変わりません。
