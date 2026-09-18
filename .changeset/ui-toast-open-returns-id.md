---
'@k8ordo/ui': minor
---

`useToast()` の `open` が、開いたトーストの id を返すようになりました。

これまで `open` は何も返さなかったので、`close(id)` に渡す id を呼び出し側が得る手段がなく、`close` は公開されていても使えませんでした。`duration: Number.POSITIVE_INFINITY` で出したトーストをコードから閉じるには `closeAll()` しかなく、関係のない他のトーストまで閉じていました。

```tsx
const { open, close } = useToast();

const syncingId = open('info', '同期しています', {
  duration: Number.POSITIVE_INFINITY,
});
// 同期が終わったら、そのトーストだけを閉じる
close(syncingId);
```

戻り値を使わない既存の呼び出しはそのまま動きます。
