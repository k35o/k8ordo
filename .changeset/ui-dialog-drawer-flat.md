---
'@k8ordo/ui': major
---

`Dialog`を1つのコンポーネントにし、`Modal`の公開をやめました。`Dialog`は`title`を受け取ると閉じるボタンの付いた`h2`の見出しを描き、その見出しがダイアログの名前になります。見出しを描かないときは`label`で名前を付けます。`side`は`'center'`（既定）と`'bottom'`、`role`は`'dialog'`と`'alertdialog'`で、`role`は`<dialog>`自身に付きます。これまでは`Modal`の中に`Dialog.Root`、`Dialog.Header`、`Dialog.Content`を重ね、同じ`onClose`を2回渡していました。名前は中の`Dialog.Root`がeffectで外の`Modal`に渡していたので、最初の描画では名前がなく、`role="alertdialog"`を渡すと外の`<dialog>`は名前を失っていました。`Dialog.Root`、`Dialog.Header`、`Dialog.Content`はなくなりました。

```tsx
// これまで
<Modal isOpen={isOpen} onClose={close}>
  <Dialog.Root>
    <Dialog.Header onClose={close} title="確認" />
    <Dialog.Content>…</Dialog.Content>
  </Dialog.Root>
</Modal>
// これから
<Dialog isOpen={isOpen} onClose={close} title="確認">
  …
</Dialog>
```

`Dialog`と`Drawer`の説明は`description`だけになりました。`description`は子の上に描かれ、`aria-describedby`はこの文だけを指します。これまでは本文全体を説明に結んでいたので、フォームを入れたダイアログではフォームの中身が丸ごと説明として読み上げられていました。`Drawer`の見出しも`h3`から`h2`になりました。`Dialog`と`Drawer`は`ref`で`<dialog>`を渡します。

`onClose`は、開いているはずのダイアログが閉じたときだけ呼ばれるようになりました。Escape、枠外のクリック、閉じるボタン、`<form method="dialog">`、`<Activity>`で隠れたときです。`isOpen`を`false`にして自分で閉じたときは呼ばれません。これまでは自分で閉じたときにも呼ばれていたので、`onClose`で前のページへ戻すダイアログはブラウザの戻るで閉じると2回戻っていました。開くeffectには後始末を足し、`<Activity>`で隠れたときにも`<dialog>`を閉じます。これまでは隠れても開いたまま残り、ページがinertのままになっていました。閉じている間も子は外さないので、外したいときは`isOpen`を条件にして描いてください。

移行するときは、次のように書き換えます。

- `<Modal><Dialog.Root><Dialog.Header title onClose /><Dialog.Content>…`は`<Dialog title isOpen onClose>…</Dialog>`にする。`Modal`の`side`が`'center'`か`'bottom'`なら`Dialog`の`side`に、`'left'`か`'right'`なら`Drawer`にする
- `<Modal aria-label="…">`で中身を直接置いていたところは`<Dialog label="…">`にする
- `<Dialog.Root role="alertdialog">`は`<Dialog role="alertdialog">`にする
- `Modal`や`Drawer`に`aria-describedby`で説明の段落を渡していたところは、その文を`description`に渡す
- `onClose`の中で、自分で閉じたときにも呼ばれることを前提にした処理があれば見直す
- 型の`ModalSide`は`DialogSide`（`'center' | 'bottom'`）か`DrawerSide`にする
