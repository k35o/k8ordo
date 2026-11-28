---
'@k8ordo/ui': major
---

`ListBox`を1つのコンポーネントにしました。`ListBox.Root`、`ListBox.Trigger`、`ListBox.IconTrigger`、`ListBox.Content`はなくなり、`<ListBox options value defaultValue onChange label size icon helpContent placement />`と書きます。`icon`を渡すと、今の値を文字で出すボタンの代わりにアイコンのボタンを描きます。これまでは`Content`が子を取らず、いつも同じ3つを並べて書くしかなかったので、compoundにしておく意味がありませんでした。

```tsx
// これまで
<ListBox.Root onChange={onChange} options={options} value={value}>
  <ListBox.Trigger label="件数" size="sm" />
  <ListBox.Content helpContent={help} />
</ListBox.Root>
// これから
<ListBox helpContent={help} label="件数" onChange={onChange} options={options} size="sm" value={value} />
```

移行するときは、`Root`のpropsはそのまま、`Trigger`か`IconTrigger`の`label`、`size`、`icon`と、`Content`の`helpContent`を`ListBox`に移します。
