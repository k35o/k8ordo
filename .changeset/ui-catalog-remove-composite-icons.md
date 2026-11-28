---
'@k8ordo/ui': major
---

生成UIのカタログから`ChevronIcon`と`StatusIcon`をなくしました。2つが描く絵は、どれも`Icon`の`name`で選べる絵と同じでした。同じ絵に2通りの書き方があり、モデルに渡す部品も2つ多くなっていました。

移行するときは、保存したspecやプロンプトの2つを`Icon`に書き換えます。`size`はそのまま渡せます。

- `ChevronIcon`は、`direction`の向きを付けた`name`の`Icon`にする（`direction: 'down'`なら`name: 'chevron-down'`）
- `StatusIcon`は、`status`に合う`name`の`Icon`にする（`success`は`circle-check`、`info`は`info`、`warning`は`triangle-alert`、`error`は`circle-alert`）
