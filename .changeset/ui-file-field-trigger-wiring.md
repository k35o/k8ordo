---
'@k8ordo/ui': major
---

`FileField`の見えない`<input type="file">`がTabで止まらないようにし、欄の名前と説明を`FileField.Trigger`のボタンに渡すようにしました。これまでは見た目を消しただけの入力欄がTabの止まり先になり、フォーカスの印も出ませんでした。`FormControl`のラベルやエラーの文もこの見えない入力欄に結ばれ、実際に押すボタンには届いていませんでした。

送信する入力欄は`aria-hidden`と`tabIndex={-1}`になり、フォーカスを受けるとボタンへ移します。フォームが送信に失敗した欄へフォーカスを移すときも、ボタンにフォーカスが移ります。`FileField.Trigger`の`renderItem`は、これまでの`onClick`と`disabled`に加えて、`id`、`aria-labelledby`（欄のラベルとボタン自身の文字）、`aria-describedby`、`ref`を受け取ります。`FileField.Dropzone`の組み込みのボタンにも同じものを付けます。

`renderItem`は`invalid`を受け取らなくなりました。`Button`には不正な値の見た目が無いので、受け取ったものをそのまま`Button`に展開できる形にしました。不正な値は`FormControl`のエラーの文と`FileField.Dropzone`の枠が示します。

ボタンに欄の名前を付けるには、受け取ったものを展開します。展開しないボタンの名前は、ボタン自身の文字だけになります。

```tsx
// これまで
<FileField.Trigger
  renderItem={({ disabled, onClick }) => (
    <Button disabled={disabled} onClick={onClick}>ファイルを選択</Button>
  )}
/>
// これから
<FileField.Trigger
  renderItem={(wiring) => <Button {...wiring}>ファイルを選択</Button>}
/>
```

`FormControl`で包むときは`labelAs="group"`を付けます。ボタンは`required`を持てず、`required`の付いた見えない入力欄は読み上げられません。`'group'`では必須の印が見出しの名前に入り、ボタンはその見出しを名前として読むので、「添付ファイル 必須 ファイルを選択」のように必須が伝わります。
