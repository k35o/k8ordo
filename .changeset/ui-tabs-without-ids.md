---
'@k8ordo/ui': major
---

`Tabs.Root`から`ids`をなくしました。矢印キーと`Home`、`End`の行き先は、画面に並んだタブの順で決まります。これまでは同じidを`ids`、`Tabs.Tab`、`Tabs.Panel`の3か所に書き、`ids`に無いタブでは矢印キーが黙って別のタブへ移っていました。選択を制御しないときは`defaultSelectedId`が必須になり、`null`で先頭を選ぶ書き方はなくなりました。

パネルは選択の遅延値（`useDeferredValue`）で入れ替わるようになりました。タブの印はすぐに切り替わり、パネルのクロスフェードとsuspend中に前のパネルを残す動きは、選択を`useState`で持っても`@k8ordo/state`のような同期で更新するストアで持っても効きます。これまでは選択を`startTransition`で包んでいたので、同期の更新で制御すると、どちらも効きませんでした。

```tsx
// これまで
<Tabs.Root ids={['overview', 'settings']}>…</Tabs.Root>
// これから
<Tabs.Root defaultSelectedId="overview">…</Tabs.Root>
```

移行するときは、`ids`を消し、制御していなければ`defaultSelectedId`に最初に選ぶタブのidを渡します。`ids={list as [string, ...string[]]}`のような型の黙らせも要らなくなります。パネルを手で`useDeferredValue`に通していたら、その処理は消してください。1枚の`Tabs.Panel`の`id`を選択に合わせて付け替えていたところは、パネルが遅れて描かれる間に空になるので、タブごとの`Tabs.Panel`を並べる形にします。
