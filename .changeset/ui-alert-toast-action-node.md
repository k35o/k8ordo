---
'@k8ordo/ui': major
---

`Alert`の`action`と`useToast`の`open`に渡す`ToastOptions`の`action`を、`ReactNode`にしました。描くリンクやボタンをそのまま渡します。`AlertAction`と`ToastAction`の型はなくなりました。これまでは`{ label, renderItem }`の形で、`renderItem`は渡した`label`を`children`として受け取って返すだけでした。関数なので、毎回作るとlintの入れ子の部品の規則に触れ、`useCallback`で包む必要がありました。置き場所（1行の文なら文の後ろ、一覧なら一覧の下）は今までどおり`Alert`が決めます。

```tsx
// これまで
<Alert
  action={{ label: 'もう一度読み込む', renderItem: ({ children }) => <Button onClick={retry}>{children}</Button> }}
  message="読み込めませんでした"
  tone="error"
/>
// これから
<Alert action={<Button onClick={retry}>もう一度読み込む</Button>} message="読み込めませんでした" tone="error" />
```

移行するときは、`renderItem`が返していた要素の`children`に`label`の文を入れ、その要素を`action`に渡します。`renderItem`を`useCallback`で包んでいたら、その処理も消せます。`AlertAction`、`ToastAction`の型をimportしていたら消してください。
