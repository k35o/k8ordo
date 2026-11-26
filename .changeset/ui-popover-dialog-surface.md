---
'@k8ordo/ui': major
---

公開の`Popover`を、いつもダイアログとして開くパネルにしました。`Popover.Root`から`role`、`trapFocus`、`closeOnClickAway`をなくし、開くと中へフォーカスを移し、外側のクリックとEscapeと中からのTabで閉じます。これまでの`role`の既定は`'menu'`で、例のとおりに書くと文章の入った`role="menu"`になっていました。メニュー、リストボックス、ツールチップは、それぞれ`DropdownMenu`、`ListBox`、`Tooltip`を使います。

`Popover.Content`は`renderItem`をやめ、`label`と`children`を受け取ります。`role="dialog"`の要素を描き、`label`がその名前になります。地（`--color-bg-raised`）と角丸と影、高コントラストのときの線は`Popover.Content`が描き、余白は持ちません。これまでは使う側が面の見た目を毎回書いていて、場所ごとに値が違っていました。`PopoverContentProps`の公開もやめました。

```tsx
// これまで
<Popover.Content renderItem={(props) => <div {...props} aria-label="絞り込み" className={styles.panel}>…</div>} />
// これから
<Popover.Content label="絞り込み">
  <Stack gap="sm" padding="md">…</Stack>
</Popover.Content>
```

移行するときは、`renderItem`で描いていた要素の中身を`children`に移し、名前を`label`に渡します。面の背景、角丸、影のCSSは消し、余白だけを中の要素に残します。`role`や`trapFocus`、`closeOnClickAway`を渡していたら消してください。

`DataTable`の列の切り替えと`DatePicker`のカレンダーも、この`Popover.Content`の面で描くようになりました。`DatePicker`のパネルは角丸が少し小さくなり、枠線の代わりに影で縁取ります。
