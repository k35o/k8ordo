---
'@k8ordo/state': patch
---

同梱ドキュメントを実装に追従させました。

- `defineMemoryState` はスキーマを取らない型付きの箱で、スキーマを持つのは url / entry / local だけ、とどの面でもそろえました。
- 更新のハンドルは、ナビゲーションを伴わない種類でも書き込みが済んでから settle し、local は保存に失敗すると reject します。
- 非同期アクション（`startTransition(async …)`・`useTransition`・`Button` の `onAction`）の中で `finished` を待つ例を消しました。別のページの読み込み中にそうすると止まるためで、待つのはイベントハンドラで行います。
- スキーマが自分の出力を入力として受け付けない欄（`z.stringbool()` など）があると、1 つの欄が弾かれただけで全体が default に戻る、という今の版の制約を書きました。
