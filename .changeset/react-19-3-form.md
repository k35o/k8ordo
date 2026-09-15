---
'@k8ordo/form': minor
---

- `form.props` がフォームの reset を聞くようになりました（`onReset`）。reset ボタン、`form.reset()`、そして React 19.3 が action の成功後に自動で行うリセットのいずれでも、クライアント側のメッセージ・編集済みの集合・追加した行・`isDirty` を描画時の状態に戻します。これまでは action が前と同じ内容の state を返すと、DOM は戻っているのに `isDirty` が `true` のまま、古いメッセージも残っていました。
- `useForm(fields)` と第 2 引数を省けるようになりました。action の無い GET フォームで空の state を作って使い回す必要はありません。
- peer を `react` / `react-dom` / `@types/react` とも `>=19.3.0` にしました。
