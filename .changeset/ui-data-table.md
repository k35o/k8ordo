---
"@k8ordo/ui": minor
---

`DataTable` を追加しました。並べ替え・行の選択・列の表示切り替えができる表で、状態はすべて呼び出し側が持つ制御型です（`sort` / `onSortChange`、`selectedIds` / `onSelectedIdsChange`、`hiddenColumnIds` / `onHiddenColumnIdsChange`）。

- 並べ替えの状態を受けても自分では並べ替えず、`rows` を渡された順に描きます。サーバーで並べ替えるときも同じ部品で済み、`@k8ordo/state` の url スロットに置けば並べ替えとページをリンクで共有できます。
- 機能は、その変化を受け取る関数を渡したときだけ現れます。並べ替えられる列の見出しは 昇順 → 降順 → なし と巡り、`aria-sort` を持ちます。
- 見出しのチェックボックスは表示中の行をまとめて選び、一部だけのときは途中の状態を示します。最初の列を行の見出しにし、各行のチェックボックスはその見出しで名前が付きます。
- `rows` が空のときは `emptyState` を列をまたぐ行に描きます。
- 生成 UI のカタログ（json-render と OpenUI）に、並べ替えと選択を中で持つ自己完結の `DataTable` を加えました。
- 文言辞書に `dataTableColumns` / `dataTableSelectAll` / `dataTableSelectRow` を加えました。
