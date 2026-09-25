---
"@k8ordo/ui": major
---

`Table.EmptyState` を `EmptyState` の上に作り直しました。`children` を受け取らなくなり、`colSpan` に加えて `EmptyState` と同じ `title`（必須）・`description`・`icon`・`action` を受け取ります。空の表の見た目は `EmptyState` と同じになります。

```tsx
// Before
<Table.EmptyState colSpan={3}>まだ登録がありません</Table.EmptyState>
// After
<Table.EmptyState colSpan={3} title="まだ登録がありません" />
```
