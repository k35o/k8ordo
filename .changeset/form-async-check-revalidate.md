---
"@k8ordo/form": major
---

`useAsyncCheck`は、2つ目の引数に`useForm`が返す`revalidate`を受け取るようにしました。

```tsx
const taken = useAsyncCheck(checkSlugAvailable, form.revalidate);
```

これまでは、結果を受け取ると入力欄から`focusout`を発火させ、`useForm`に検証をやり直させていました。この`focusout`は実際には起きていないblurなので、フォームや入力欄に書いた`onBlur`も呼ばれていました。

- `useForm`の返り値に`revalidate(control)`が加わりました。入力欄の検証の結果を読み直し、入力欄から離れたときと同じように文言を表示します。
- `check`が失敗したときは、これまでどおり何も判定しません。失敗したときのエラーは、握りつぶさずに`reportError`でブラウザに報告します。
