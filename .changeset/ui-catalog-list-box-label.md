---
'@k8ordo/ui': major
---

生成UIのカタログの`ListBox`で、`label`を必須にしました。`ListBox`はリストを開くボタンで、`label`はそのボタンの名前として、選んだ値の前に読み上げられます。これまでは任意だったので、`label`を省いたボタンは選んだ値だけが名前になり、何を選ぶボタンなのかが伝わりませんでした。ほかの入力欄の`label`も必須です。

ほかの入力欄と同じく、`label`は`name`の直後に移しました。必須にした時点で`label`の無い保存済みの文字列は通らないので、OpenUI Langの位置引数の並びもここで決め直しました。今の並びは`ListBox(name, label, options, defaultValue)`です。

移行するときは、保存したspecやプロンプトの`ListBox`に`label`を書き足します。OpenUI Langでは、`ListBox("sort", [{value: "new", label: "新しい順"}], "new", "並び順")`のように4番目に書いていた`label`も、`ListBox("sort", "並び順", [{value: "new", label: "新しい順"}], "new")`と2番目に移します。
